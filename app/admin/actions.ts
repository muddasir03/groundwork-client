"use server";

// Admin server actions. Each is a public POST endpoint in practice, so each one:
// - validates its own input (never trusting the form);
// - re-verifies the admin session through the DAL (adminWrite → verifyAdmin), except login;
// - never returns the session token to the browser.
// Next.js also rejects server-action requests whose Origin doesn't match the host (CSRF).

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { LOGIN_PATH, adminWrite } from "@/lib/admin/dal";
import { sanitizeReportPayload } from "@/lib/admin/reportPayload";
import { clearAdminSession, readAdminToken, writeAdminSession } from "@/lib/admin/session";
import type { ActionResult, AdminCompany } from "@/lib/admin/types";
import { ApiError, apiFetch, segment } from "@/lib/api/http";
import { COMPANIES_TAG, SLUG } from "@/lib/api/remote";

const field = (form: FormData, name: string, max: number) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
};

function checkSlug(slug: string) {
  if (!SLUG.test(slug)) throw new Error("Invalid company.");
}

// ── Session ─────────────────────────────────────────────────────────────────────────────────────

export async function login(_previous: ActionResult | null, form: FormData): Promise<ActionResult> {
  const emailAddress = field(form, "email", 254);
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  if (!emailAddress || !password || password.length > 200) {
    return { ok: false, message: "Enter your email and password." };
  }

  let response: Response;
  try {
    response = await apiFetch("/admin/session", { method: "POST", body: { emailAddress, password } });
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: "The server isn't responding. It may be waking up; try again in a minute." };
    throw error;
  }

  if (response.status === 429) return { ok: false, message: "Too many login attempts. Wait a few minutes and try again." };
  if (response.status !== 201) return { ok: false, message: "That email and password don't match an admin account." };

  const { data } = (await response.json()) as { data: { token: string; expiresAt: string } };
  await writeAdminSession(data.token, new Date(data.expiresAt));
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const token = await readAdminToken();
  if (token) {
    // Revoke on the server too, so the token is useless even if it was copied.
    await apiFetch("/admin/session", { method: "DELETE", token }).catch(() => undefined);
  }
  await clearAdminSession();
  redirect(LOGIN_PATH);
}

// ── Companies ───────────────────────────────────────────────────────────────────────────────────

const DETAIL_FIELDS = { name: 120, description: 300, city: 120, country: 120, sector: 120, size: 20, stage: 120, researchedAt: 10, peopleVerifiedAt: 10 };

function details(form: FormData) {
  return Object.fromEntries(
    Object.entries(DETAIL_FIELDS).map(([name, max]) => {
      const value = field(form, name, max);
      // Empty optional fields are sent as null so they can be cleared.
      return [name, value === "" && ["stage", "researchedAt", "peopleVerifiedAt"].includes(name) ? null : value];
    }),
  );
}

export async function createCompany(_previous: ActionResult | null, form: FormData): Promise<ActionResult> {
  const slug = field(form, "slug", 80).toLowerCase();
  const result = await adminWrite<AdminCompany>("POST", "/admin/companies", { company: { slug, ...details(form) } });
  if (!result.ok) return { ok: false, message: result.message, errors: result.errors };
  redirect(`/admin/companies/${segment(result.data.slug)}`);
}

export async function updateDetails(slug: string, _previous: ActionResult | null, form: FormData): Promise<ActionResult> {
  checkSlug(slug);
  const result = await adminWrite<AdminCompany>("PATCH", `/admin/companies/${segment(slug)}`, { company: details(form) });
  if (!result.ok) return { ok: false, message: result.message, errors: result.errors };
  updateTag(COMPANIES_TAG);
  return { ok: true, message: "Details saved." };
}

export async function saveReport(slug: string, input: unknown): Promise<ActionResult> {
  checkSlug(slug);
  const report = sanitizeReportPayload(input);
  if (!report) return { ok: false, message: "The report couldn't be read. Reload the page and try again." };

  const result = await adminWrite<AdminCompany>("PUT", `/admin/companies/${segment(slug)}/report`, { report });
  if (!result.ok) return { ok: false, message: result.message, errors: result.errors };
  updateTag(COMPANIES_TAG); // the public pages show the change straight away
  return { ok: true, message: "Report saved." };
}

const STATUSES = new Set(["draft", "researching", "in_review", "published"]);

export async function changeStatus(slug: string, _previous: ActionResult | null, form: FormData): Promise<ActionResult> {
  checkSlug(slug);
  const status = field(form, "status", 20);
  if (!STATUSES.has(status)) return { ok: false, message: "Unknown status." };

  const result = await adminWrite<AdminCompany>("PATCH", `/admin/companies/${segment(slug)}/status`, { status });
  if (!result.ok) return { ok: false, message: result.message, errors: result.errors };
  updateTag(COMPANIES_TAG);
  return { ok: true, message: "Status updated." };
}
