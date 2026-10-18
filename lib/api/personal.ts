// The personal layer on top of public research: the visitor's fit verdict, a suggested approach and
// which technologies are also on their profile. Until accounts and fit scoring exist in the API,
// these come from the fictional sample profile and sample verdicts (sampleData.ts).

import { sampleCompanies, sampleProfile } from "@/lib/api/sampleData";
import type { ApiCompany, ApiCompanySummary, Company, CompanySummary, FitVerdict } from "@/lib/api/types";

function sampleFit(slug: string): FitVerdict | null {
  return sampleCompanies.find((company) => company.slug === slug)?.fit ?? null;
}

export function withFitSummary(company: ApiCompanySummary): CompanySummary {
  const fit = sampleFit(company.slug);
  return { ...company, fit: fit && { band: fit.band, score: fit.score, topMatch: fit.topMatch, topGap: fit.topGap } };
}

const profileSkills = new Set(sampleProfile.extracted.skills.map((skill) => skill.name.toLowerCase()));

export function personalize(company: ApiCompany): Company {
  const sample = sampleCompanies.find((c) => c.slug === company.slug);

  // The sample approach names its contact by sample id; point it at the same person in the API data.
  let approach = sample?.approach ?? null;
  if (approach && sample) {
    const contactName = sample.people.find((p) => p.id === approach!.sendToPersonId)?.name;
    const contact = company.people.find((p) => p.name !== null && p.name === contactName);
    approach = contact ? { ...approach, sendToPersonId: contact.id } : null;
  }

  return {
    ...company,
    report: {
      ...company.report,
      productEngineering: {
        ...company.report.productEngineering,
        stack: company.report.productEngineering.stack.map((item) => ({ name: item.name, onProfile: profileSkills.has(item.name.toLowerCase()) })),
      },
    },
    fit: sampleFit(company.slug),
    approach,
  };
}

/** Best fit first; companies without a verdict after those with one, then by name. */
export function byFit(a: CompanySummary, b: CompanySummary): number {
  return (b.fit?.score ?? -1) - (a.fit?.score ?? -1) || a.name.localeCompare(b.name);
}
