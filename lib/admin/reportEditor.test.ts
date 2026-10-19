import { describe, expect, it } from "vitest";
import { describePath, fromCompany, removeSource, toPayload } from "@/lib/admin/reportEditor";
import { sanitizeReportPayload } from "@/lib/admin/reportPayload";
import type { AdminCompany } from "@/lib/admin/types";
import { toApiCompany } from "@/lib/api/fakeApi";
import { sampleCompanies } from "@/lib/api/sampleData";

const brisa = sampleCompanies.find((c) => c.slug === "brisa-people")!;
const company: AdminCompany = { ...toApiCompany(brisa), status: "published", publishedAt: "2026-09-30T10:00:00Z", updatedAt: "2026-10-01T10:00:00Z" };

describe("fromCompany / toPayload", () => {
  it("round-trips a report into the API's request shape", () => {
    const payload = toPayload(fromCompany(company));
    expect(payload.sources).toHaveLength(brisa.sources.length);
    expect(payload.sources[0]).toEqual({ ref: brisa.sources[0].id, title: brisa.sources[0].title, url: brisa.sources[0].url, dateKind: "published", date: "2026-06-12" });
    expect(payload.summary).toEqual({ text: brisa.report.summary.text, sourceRefs: brisa.report.summary.sourceIds });
    expect(payload.technologies).toEqual(brisa.report.productEngineering.stack.map((t) => t.name));
    expect(payload.people.find((p) => p.role === "Chief Technology Officer")).toEqual({ name: null, role: "Chief Technology Officer", profileUrl: null });
  });

  it("never sends a value or sources for an unknown fact", () => {
    const state = fromCompany(company);
    state.teamHiring = [{ key: "x", label: "Pay", status: "not_public", value: "a guess", sourceRefs: [brisa.sources[0].id] }];
    expect(toPayload(state).teamHiring).toEqual([{ label: "Pay", status: "not_public", value: null, sourceRefs: [] }]);
  });

  it("leaves out untouched empty rows", () => {
    const state = fromCompany(company);
    state.clients = [...state.clients, { key: "new", text: "  ", sourceRefs: [] }];
    state.people = [...state.people, { key: "new", name: "", role: "", profileUrl: "" }];
    const payload = toPayload(state);
    expect(payload.clients).toHaveLength(brisa.report.clients.length);
    expect(payload.people).toHaveLength(brisa.people.length);
  });

  it("de-duplicates technologies and ignores blank lines", () => {
    const state = { ...fromCompany(company), technologies: "Rails\n\n React \nRails" };
    expect(toPayload(state).technologies).toEqual(["Rails", "React"]);
  });
});

describe("removeSource", () => {
  it("removes the source and every citation of it", () => {
    const ref = brisa.sources[0].id;
    const payload = toPayload(removeSource(fromCompany(company), ref));
    expect(payload.sources.map((s) => s.ref)).not.toContain(ref);
    const cited = [payload.summary, payload.problemsCore, ...payload.clients, ...payload.goals, ...payload.keyFacts, ...payload.problems]
      .flatMap((item) => item?.sourceRefs ?? []);
    expect(cited).not.toContain(ref);
  });
});

describe("describePath", () => {
  it("turns API error paths into words", () => {
    expect(describePath("report.clients[1]")).toBe("Clients, item 2");
    expect(describePath("report.goals[0].sourceRefs")).toBe("Goals and momentum, item 1: sources");
    expect(describePath("sources[2]")).toBe("Sources, item 3");
    expect(describePath("researchedAt")).toBe("researchedAt");
  });
});

describe("sanitizeReportPayload", () => {
  it("keeps only known fields with the right types", () => {
    const clean = sanitizeReportPayload({
      sources: [{ ref: "s1", title: "T", url: "https://example.com", dateKind: "weird", date: "2026-09-30T00:00:00Z", extra: "x" }],
      summary: { text: "Hi", sourceRefs: ["s1", 5, null], admin: true },
      keyFacts: [{ label: "Pay", status: "hacked", value: 3 }],
      technologies: ["Rails", 7],
      people: [{ name: 1, role: "CEO", profileUrl: "https://example.com" }],
      status: "published",
    })!;
    expect(clean.sources[0]).toEqual({ ref: "s1", title: "T", url: "https://example.com", dateKind: "accessed", date: "2026-09-30" });
    expect(clean.summary).toEqual({ text: "Hi", sourceRefs: ["s1"] });
    expect(clean.keyFacts[0]).toEqual({ label: "Pay", status: "unconfirmed", value: null, sourceRefs: [] });
    expect(clean.technologies).toEqual(["Rails"]);
    expect(clean.people[0].name).toBeNull();
    expect(clean).not.toHaveProperty("status");
  });

  it("rejects input that isn't a report and caps huge lists", () => {
    expect(sanitizeReportPayload("nope")).toBeNull();
    expect(sanitizeReportPayload([1, 2])).toBeNull();
    const huge = sanitizeReportPayload({ clients: Array.from({ length: 10_000 }, () => ({ text: "x", sourceRefs: [] })) })!;
    expect(huge.clients.length).toBe(200);
  });
});
