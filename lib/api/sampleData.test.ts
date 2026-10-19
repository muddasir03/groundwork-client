import { describe, expect, it, vi } from "vitest";
import { toApiCompany, toApiSummary } from "@/lib/api/fakeApi";

// listCompanies/getCompany read from the API; serve them the sample companies instead.
vi.mock("@/lib/api/remote", async () => {
  const { sampleCompanies } = await import("@/lib/api/sampleData");
  return {
    fetchCompanies: async () => sampleCompanies.map(toApiSummary),
    fetchCompany: async (slug: string) => {
      const company = sampleCompanies.find((c) => c.slug === slug);
      return company ? toApiCompany(company) : null;
    },
  };
});
import { SAMPLE_REPORT_SLUG, getCompany, listCompanies, listComparisons, toSummary } from "@/lib/api";
import { sampleCompanies, sampleShortlist } from "@/lib/api/sampleData";
import type { Claim, Company, Fact } from "@/lib/api/types";

// These tests hold the sample data to the product brief's rules, the same rules the API's data
// must follow: every claim is sourced, unknowns are explicit, verdicts carry reasons.

function allClaims(company: Company): Claim[] {
  const { report } = company;
  return [
    report.summary,
    report.problems.core,
    ...report.problems.rows,
    ...report.clients,
    ...report.competitors,
    ...report.goals,
    ...report.productEngineering.points,
    ...report.marketRisks,
  ] as Claim[];
}

function allFacts(company: Company): Fact[] {
  return [...company.report.keyFacts, ...company.report.teamHiring];
}

describe.each(sampleCompanies.map((company) => [company.name, company] as const))("%s", (_name, company) => {
  const sourceIds = new Set(company.sources.map((source) => source.id));

  it("cites at least one existing source for every claim", () => {
    for (const claim of allClaims(company)) {
      expect(claim.sourceIds.length, claim.text).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(sourceIds, `${claim.text} → ${id}`).toContain(id);
    }
  });

  it("only gives values to verified facts, and sources them", () => {
    for (const fact of allFacts(company)) {
      if (fact.status === "verified") {
        expect(fact.value, fact.label).not.toBeNull();
        expect(fact.sourceIds.length, fact.label).toBeGreaterThan(0);
        for (const id of fact.sourceIds) expect(sourceIds).toContain(id);
      } else {
        expect(fact.value, fact.label).toBeNull();
      }
    }
  });

  it("reports its real source count", () => {
    expect(company.sourceCount).toBe(company.sources.length);
  });

  it("explains its fit verdict", () => {
    const fit = company.fit!;
    expect(company.fit).not.toBeNull();
    expect(fit.matches.length + fit.gaps.length).toBeGreaterThan(0);
    expect(fit.explanation).not.toBe("");
    expect(fit.score).toBeGreaterThanOrEqual(0);
    expect(fit.score).toBeLessThanOrEqual(100);
    expect(fit.breakdown.reduce((sum, item) => sum + item.value, 0)).toBe(fit.score);
  });

  it("only links to example.com, never to real sites or people", () => {
    for (const url of [...company.sources.map((s) => s.url), ...company.people.flatMap((p) => p.profileUrl ?? [])]) {
      expect(new URL(url).hostname).toBe("example.com");
    }
  });

  it("names a real contact in its approach", () => {
    if (company.approach) expect(company.people.map((p) => p.id)).toContain(company.approach.sendToPersonId);
  });
});

describe("sample data", () => {
  it("has unique company slugs", () => {
    const slugs = sampleCompanies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });


  it("starts the shortlist with known companies only", () => {
    const slugs = sampleCompanies.map((c) => c.slug);
    for (const entry of sampleShortlist) expect(slugs).toContain(entry.slug);
  });
});

describe("api functions", () => {
  it("lists companies best fit first", async () => {
    const scores = (await listCompanies()).map((c) => c.fit!.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("returns null for an unknown company", async () => {
    expect(await getCompany("no-such-company")).toBeNull();
  });

  it("returns the API's research with the visitor's fit added", async () => {
    const company = await getCompany("brisa-people");
    expect(company?.report.summary).toEqual(sampleCompanies[0].report.summary);
    expect(company?.fit?.score).toBe(82);
  });

  it("summarises a company without leaking the full verdict", () => {
    const summary = toSummary(sampleCompanies[0]);
    expect(Object.keys(summary.fit!).sort()).toEqual(["band", "score", "topGap", "topMatch"]);
  });

  it("marks a missing work policy as unconfirmed in comparisons", async () => {
    for (const comparison of await listComparisons()) {
      expect(["verified", "unconfirmed", "not_public"]).toContain(comparison.workPolicy.status);
    }
  });
});

describe("sample report link", () => {
  it("redirects /sample-report to the sample company", async () => {
    const { default: nextConfig } = await import("@/next.config");
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual(expect.objectContaining({ source: "/sample-report", destination: `/companies/${SAMPLE_REPORT_SLUG}` }));
  });
});
