import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { apiFetch, segment } from "@/lib/api/http";
import { SLUG } from "@/lib/api/remote";
import { readAdminToken } from "@/lib/admin/session";
import type { AdminCompany, AdminCompanyList, AdminUser, FieldError } from "@/lib/admin/types";

// The admin Data Access Layer: the only code that talks to /api/v1/admin. Every read starts with
// verifyAdmin(), so no admin page or server action can fetch admin data without a valid session.
// The API checks the session again on every request; this layer is a second, independent guard.

export const LOGIN_PATH = "/admin/login";

/**
 * The signed-in admin, checked with the API (not just "a cookie exists"). Redirects to the login
 * page when there's no valid session. Memoized per render with React's cache; server actions call
 * it again (actions aren't part of a render, so each call re-checks).
 */
export const verifyAdmin = cache(async (): Promise<{ user: AdminUser; token: string }> => {
  const token = await readAdminToken();
  if (!token) redirect(LOGIN_PATH);

  const response = await apiFetch("/admin/session", { token });
  if (response.status === 401 || response.status === 403) redirect(`${LOGIN_PATH}?expired=1`);
  if (!response.ok) throw new Error(`Couldn't check the admin session (${response.status})`);

  const { data } = (await response.json()) as { data: { user: AdminUser } };
  return { user: data.user, token };
});

export async function getAdminCompanies(): Promise<AdminCompanyList> {
  const { token } = await verifyAdmin();
  const response = await apiFetch("/admin/companies", { token });
  if (!response.ok) throw new Error(`Couldn't load companies (${response.status})`);
  return (await response.json()) as AdminCompanyList;
}

/** A company in any status, or null if it doesn't exist. */
export async function getAdminCompany(slug: string): Promise<AdminCompany | null> {
  const { token } = await verifyAdmin();
  if (!SLUG.test(slug)) return null;
  const response = await apiFetch(`/admin/companies/${segment(slug)}`, { token });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Couldn't load the company (${response.status})`);
  return ((await response.json()) as { data: AdminCompany }).data;
}

type WriteResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string; errors: FieldError[] };

/** Sends an admin write and normalises the API's answer, including its validation errors. */
export async function adminWrite<T>(method: "POST" | "PATCH" | "PUT", path: string, body: unknown): Promise<WriteResult<T>> {
  const { token } = await verifyAdmin();
  const response = await apiFetch(path, { method, body, token });
  if (response.ok) return { ok: true, data: ((await response.json()) as { data: T }).data };
  if (response.status === 401 || response.status === 403) redirect(`${LOGIN_PATH}?expired=1`);

  const error = ((await response.json().catch(() => ({}))) as { error?: { message?: string; details?: FieldError[] } }).error;
  return { ok: false, status: response.status, message: error?.message ?? `Something went wrong (${response.status}).`, errors: error?.details ?? [] };
}
