// Converts between the API's company report and the report editor's form state, and back into the
// payload for PUT /admin/companies/:slug/report. Pure functions, so they're easy to test.

import type { AdminCompany } from "@/lib/admin/types";
import type { Claim, ClaimStatus, Fact, Source } from "@/lib/api/types";

export type EditorSource = { ref: string; title: string; url: string; dateKind: Source["dateKind"]; date: string };
export type EditorClaim = { key: string; text: string; sourceRefs: string[] };
export type EditorFact = { key: string; label: string; status: ClaimStatus; value: string; sourceRefs: string[] };
export type EditorProblem = { key: string; who: string; problem: string; solution: string; sourceRefs: string[] };
export type EditorPerson = { key: string; name: string; role: string; profileUrl: string };

export const CLAIM_LISTS = ["clients", "competitors", "goals", "productEngineering", "marketRisks"] as const;
export const FACT_LISTS = ["keyFacts", "teamHiring"] as const;
export type ClaimList = (typeof CLAIM_LISTS)[number];
export type FactList = (typeof FACT_LISTS)[number];

export type EditorState = {
  sources: EditorSource[];
  summary: EditorClaim;
  problemsCore: EditorClaim;
  problems: EditorProblem[];
  technologies: string; // one per line
  people: EditorPerson[];
} & Record<ClaimList, EditorClaim[]> &
  Record<FactList, EditorFact[]>;

export const sectionLabel: Record<ClaimList | FactList | "summary" | "problemsCore" | "problems" | "sources" | "technologies" | "people", string> = {
  summary: "Summary",
  problemsCore: "Core problem",
  clients: "Clients",
  competitors: "Competitors",
  goals: "Goals and momentum",
  productEngineering: "Product and engineering",
  marketRisks: "Market and risks",
  keyFacts: "Key facts",
  teamHiring: "Team and hiring",
  problems: "Problems they solve",
  sources: "Sources",
  technologies: "Technologies",
  people: "Senior people",
};

const claim = (key: string, c: Claim | null | undefined): EditorClaim => ({ key, text: c?.text ?? "", sourceRefs: c?.sourceIds ?? [] });
const fact = (key: string, f: Fact): EditorFact => ({ key, label: f.label, status: f.status, value: f.value ?? "", sourceRefs: f.sourceIds });

/** Editor state from the API's company. Keys are derived from positions, so server and browser agree. */
export function fromCompany(company: AdminCompany): EditorState {
  const r = company.report;
  return {
    sources: company.sources.map((s) => ({ ref: s.id, title: s.title, url: s.url, dateKind: s.dateKind, date: s.date })),
    summary: claim("summary", r.summary),
    problemsCore: claim("problemsCore", r.problems.core),
    clients: r.clients.map((c, i) => claim(`clients-${i}`, c)),
    competitors: r.competitors.map((c, i) => claim(`competitors-${i}`, c)),
    goals: r.goals.map((c, i) => claim(`goals-${i}`, c)),
    productEngineering: r.productEngineering.points.map((c, i) => claim(`productEngineering-${i}`, c)),
    marketRisks: r.marketRisks.map((c, i) => claim(`marketRisks-${i}`, c)),
    keyFacts: r.keyFacts.map((f, i) => fact(`keyFacts-${i}`, f)),
    teamHiring: r.teamHiring.map((f, i) => fact(`teamHiring-${i}`, f)),
    problems: r.problems.rows.map((p, i) => ({ key: `problems-${i}`, who: p.who, problem: p.problem, solution: p.solution, sourceRefs: p.sourceIds })),
    technologies: r.productEngineering.stack.map((t) => t.name).join("\n"),
    people: company.people.map((p, i) => ({ key: `people-${i}`, name: p.name ?? "", role: p.role, profileUrl: p.profileUrl ?? "" })),
  };
}

/** Removes a source and every citation of it, so no claim is left pointing at a deleted source. */
export function removeSource(state: EditorState, ref: string): EditorState {
  const strip = <T extends { sourceRefs: string[] }>(item: T): T => ({ ...item, sourceRefs: item.sourceRefs.filter((r) => r !== ref) });
  const next: EditorState = {
    ...state,
    sources: state.sources.filter((s) => s.ref !== ref),
    summary: strip(state.summary),
    problemsCore: strip(state.problemsCore),
    problems: state.problems.map(strip),
  };
  for (const list of CLAIM_LISTS) next[list] = state[list].map(strip);
  for (const list of FACT_LISTS) next[list] = state[list].map(strip);
  return next;
}

const blank = (s: string) => s.trim() === "";
const claimPayload = (c: EditorClaim) => ({ text: c.text.trim(), sourceRefs: c.sourceRefs });

/** The request body for PUT /admin/companies/:slug/report. Untouched empty rows are left out. */
export function toPayload(state: EditorState) {
  const claims = (list: EditorClaim[]) => list.filter((c) => !blank(c.text) || c.sourceRefs.length > 0).map(claimPayload);
  const facts = (list: EditorFact[]) =>
    list
      .filter((f) => !blank(f.label) || !blank(f.value))
      .map((f) => ({ label: f.label.trim(), status: f.status, value: f.status === "verified" ? f.value.trim() : null, sourceRefs: f.status === "verified" ? f.sourceRefs : [] }));

  return {
    sources: state.sources.map((s) => ({ ref: s.ref, title: s.title.trim(), url: s.url.trim(), dateKind: s.dateKind, date: s.date })),
    summary: blank(state.summary.text) ? null : claimPayload(state.summary),
    problemsCore: blank(state.problemsCore.text) ? null : claimPayload(state.problemsCore),
    clients: claims(state.clients),
    competitors: claims(state.competitors),
    goals: claims(state.goals),
    productEngineering: claims(state.productEngineering),
    marketRisks: claims(state.marketRisks),
    keyFacts: facts(state.keyFacts),
    teamHiring: facts(state.teamHiring),
    problems: state.problems
      .filter((p) => !blank(p.who) || !blank(p.problem) || !blank(p.solution))
      .map((p) => ({ who: p.who.trim(), problem: p.problem.trim(), solution: p.solution.trim(), sourceRefs: p.sourceRefs })),
    technologies: [...new Set(state.technologies.split("\n").map((t) => t.trim()).filter(Boolean))],
    people: state.people
      .filter((p) => !blank(p.name) || !blank(p.role))
      .map((p) => ({ name: p.name.trim() || null, role: p.role.trim(), profileUrl: p.profileUrl.trim() || null })),
  };
}

export type ReportPayload = ReturnType<typeof toPayload>;

/** Turns an API error path ("report.clients[1].sourceRefs") into words ("Clients, item 2: sources"). */
export function describePath(path: string): string {
  const match = path.replace(/^report\./, "").match(/^([a-zA-Z]+)(?:\[(\d+)\])?(?:\.(\w+))?$/);
  if (!match) return path;
  const [, section, index, field] = match;
  const label = sectionLabel[section as keyof typeof sectionLabel] ?? section;
  const item = index === undefined ? "" : `, item ${Number(index) + 1}`;
  const detail = field ? `: ${field === "sourceRefs" ? "sources" : field.replace(/([A-Z])/g, " $1").toLowerCase()}` : "";
  return `${label}${item}${detail}`;
}
