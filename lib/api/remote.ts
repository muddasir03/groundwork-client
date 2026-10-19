// Cached reads from groundwork-api. Published research changes rarely, so results are reused for
// a few minutes instead of waking the free-tier API on every visit.
//
// Call these only during request-time rendering (after `connection()`, inside a Suspense boundary
// such as loading.tsx), never at build time: builds must not depend on the API being up.

import { cacheLife, cacheTag } from "next/cache";
import { apiGet, segment } from "@/lib/api/http";
import type { ApiCompany, ApiCompanySummary, ApiItem, ApiList } from "@/lib/api/types";

/** Slugs are lowercase words joined by hyphens, as enforced by the API. */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Every cached research read carries this tag; admin changes expire it (updateTag). */
export const COMPANIES_TAG = "companies";

/** Published companies. The MVP has about 30, within the API's 50-per-page cap. */
export async function fetchCompanies(): Promise<ApiCompanySummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(COMPANIES_TAG);
  const body = await apiGet<ApiList<ApiCompanySummary>>("/companies?per_page=50");
  return body?.data ?? [];
}

/** One published company's report, or null if it doesn't exist or isn't published. */
export async function fetchCompany(slug: string): Promise<ApiCompany | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(COMPANIES_TAG);
  if (!SLUG.test(slug)) return null;
  const body = await apiGet<ApiItem<ApiCompany>>(`/companies/${segment(slug)}`);
  return body?.data ?? null;
}
