import { describe, expect, it } from "vitest";
import { toApiCompany, toApiSummary } from "@/lib/api/fakeApi";
import { byFit, personalize, withFitSummary } from "@/lib/api/personal";
import { sampleCompanies } from "@/lib/api/sampleData";

const brisa = sampleCompanies.find((c) => c.slug === "brisa-people")!;

describe("personalize", () => {
  it("adds the visitor's fit and marks technologies that are on their profile", () => {
    const company = personalize(toApiCompany(brisa));
    expect(company.fit).toEqual(brisa.fit);
    const stack = company.report.productEngineering.stack;
    expect(stack.find((t) => t.name === "Ruby on Rails")?.onProfile).toBe(true);
    expect(stack.find((t) => t.name === "Sidekiq")?.onProfile).toBe(false);
  });

  it("points the approach at the same contact in the API's people list", () => {
    const api = toApiCompany(brisa);
    api.people = api.people.map((person, index) => ({ ...person, id: String(100 + index) })); // API ids differ
    const company = personalize(api);
    const contact = company.people.find((p) => p.id === company.approach?.sendToPersonId);
    expect(contact?.name).toBe("Elena Ruiz");
  });

  it("gives a company without a verdict no fit and no approach, instead of inventing one", () => {
    const unknown = { ...toApiCompany(brisa), slug: "new-real-company" };
    const company = personalize(unknown);
    expect(company.fit).toBeNull();
    expect(company.approach).toBeNull();
  });
});

describe("byFit", () => {
  it("sorts best fit first and companies without a verdict last, by name", () => {
    const summaries = [
      withFitSummary({ ...toApiSummary(brisa), slug: "zeta-co", name: "Zeta" }),
      ...sampleCompanies.map((c) => withFitSummary(toApiSummary(c))),
      withFitSummary({ ...toApiSummary(brisa), slug: "alpha-co", name: "Alpha" }),
    ].sort(byFit);
    const scores = summaries.map((s) => s.fit?.score ?? null);
    expect(scores.slice(0, 6)).toEqual([...scores.slice(0, 6)].sort((a, b) => b! - a!));
    expect(summaries.slice(-2).map((s) => s.name)).toEqual(["Alpha", "Zeta"]);
  });
});
