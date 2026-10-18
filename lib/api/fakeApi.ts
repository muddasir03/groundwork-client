// For tests: what groundwork-api would return for the sample companies, i.e. the sample data
// without the personal parts (fit, approach, onProfile). Mirrors the API's serializers.

import type { ApiCompany, ApiCompanySummary, Company } from "@/lib/api/types";

export function toApiCompany(company: Company): ApiCompany {
  // Fields listed explicitly, like the API's serializers, so nothing personal slips through.
  return {
    ...toApiSummary(company),
    peopleVerifiedAt: company.peopleVerifiedAt,
    sources: company.sources,
    people: company.people,
    report: {
      ...company.report,
      productEngineering: {
        ...company.report.productEngineering,
        stack: company.report.productEngineering.stack.map(({ name }) => ({ name })),
      },
    },
  };
}

export function toApiSummary(company: Company): ApiCompanySummary {
  const { slug, name, description, city, country, sector, size, stage, researchedAt, sourceCount } = company;
  return { slug, name, description, city, country, sector, size, stage, researchedAt, sourceCount };
}
