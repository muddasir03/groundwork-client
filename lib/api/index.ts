// The only way screens get data. Every function returns fictional sample data for now; each will
// call groundwork-api (process.env.NEXT_PUBLIC_API_URL) once its endpoint exists, without the
// screens changing.

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
  const { band, score, topMatch, topGap } = company.fit;
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
    fit: { band, score, topMatch, topGap },
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

/** Published companies, best fit first. */
export async function listCompanies(): Promise<CompanySummary[]> {
  return sampleCompanies.map(toSummary).sort((a, b) => b.fit.score - a.fit.score);
}

export async function listCompanySlugs(): Promise<string[]> {
  return sampleCompanies.map((company) => company.slug);
}

export async function getCompany(slug: string): Promise<Company | null> {
  return sampleCompanies.find((company) => company.slug === slug) ?? null;
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

/** The fictional company used for the landing page preview and the public sample report. */
export const SAMPLE_REPORT_SLUG = "brisa-people";
