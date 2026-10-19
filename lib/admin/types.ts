// What the admin API returns (groundwork-api docs/API.md, "Admin endpoints").

import type { AdminCompanyRow, AdminStats, ApiCompany } from "@/lib/api/types";

export type AdminUser = { id: string; emailAddress: string; role: "admin" };

export type AdminCompany = ApiCompany & {
  status: AdminCompanyRow["status"];
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminCompanyList = { data: AdminCompanyRow[]; meta: { stats: AdminStats } };

/** One validation problem from the API: where it is and what's wrong. */
export type FieldError = { path: string; message: string };

/** What every admin server action returns to its form. */
export type ActionResult = { ok: true; message?: string } | { ok: false; message: string; errors?: FieldError[] };
