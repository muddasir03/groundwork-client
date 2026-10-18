// The only way screens get data.
// - Company research (listCompanies, getCompany) comes from groundwork-api. Call these only at
//   request time: the page must `await connection()` inside a Suspense boundary (loading.tsx).
// - Everything personal (profile, shortlist, compare, fit) is still fictional sample data until
//   accounts exist in the API; see personal.ts.

import { byFit, personalize, withFitSummary } from "@/lib/api/personal";
import { fetchCompanies, fetchCompany } from "@/lib/api/remote";
import {
  sampleAdminCompanies,
  sampleAdminStats,
  sampleCompanies,
  sampleCountryOptions,
  sampleProfile,
  sampleSectorOptions,
  sampleShortlist,
} from "@/lib/api/sampleData";
import type {
  AdminCompanyRow,
  AdminStats,
  Company,
  CompanyComparison,
  CompanySummary,
  Profile,
  ShortlistEntry,
} from "@/lib/api/types";

export function toSummary(company: Company): CompanySummary {
  const fit = company.fit;
  return {
    slug: company.slug,
    name: company.name,
    description: company.description,
    city: company.city,
    country: company.country,
    sector: company.sector,
    size: company.size,
    stage: company.stage,
    researchedAt: company.researchedAt,
    sourceCount: company.sourceCount,
    fit: fit && { band: fit.band, score: fit.score, topMatch: fit.topMatch, topGap: fit.topGap },
  };
}

export function toComparison(company: Company): CompanyComparison {
  const workPolicy = company.report.keyFacts.find((fact) => fact.label === "Work policy") ?? {
    label: "Work policy",
    value: null,
    status: "unconfirmed" as const,
    sourceIds: [],
  };
  return {
    slug: company.slug,
    name: company.name,
    fit: toSummary(company).fit,
    sector: company.sector,
    headquarters: company.city,
    stage: company.stage,
    techStack: company.report.productEngineering.stack.map((item) => item.name),
    workPolicy,
    mainProduct: company.description,
  };
}

/** Published companies from the API, best fit first. Request time only. */
export async function listCompanies(): Promise<CompanySummary[]> {
  return (await fetchCompanies()).map(withFitSummary).sort(byFit);
}

/** A published company's report from the API, or null. Request time only. */
export async function getCompany(slug: string): Promise<Company | null> {
  const company = await fetchCompany(slug);
  return company && personalize(company);
}

/** The fictional sample report, from local data, for the landing page preview (no API call). */
export function getSampleReport(): Company {
  return sampleCompanies.find((company) => company.slug === SAMPLE_REPORT_SLUG)!;
}

export async function listComparisons(): Promise<CompanyComparison[]> {
  return sampleCompanies.map(toComparison);
}

export async function getProfile(): Promise<Profile> {
  return sampleProfile;
}

export async function getProfileOptions(): Promise<{ countries: string[]; sectors: string[] }> {
  return { countries: sampleCountryOptions, sectors: sampleSectorOptions };
}

/** The shortlist a visitor starts with. Saved changes live in the browser until accounts exist. */
export async function getInitialShortlist(): Promise<ShortlistEntry[]> {
  return sampleShortlist;
}

export async function listAdminCompanies(): Promise<AdminCompanyRow[]> {
  return sampleAdminCompanies;
}

export async function getAdminStats(): Promise<AdminStats> {
  return sampleAdminStats;
}

/** The fictional company used for the landing page preview and the public sample report.
 *  Also seeded on the staging API, so /sample-report resolves there. */
export const SAMPLE_REPORT_SLUG = "brisa-people";
