// Server-side input check for the report a browser sends to the saveReport server action. Server
// actions are public endpoints, so their input can't be trusted: this rebuilds the payload from known
// fields only, with type checks and size caps, before anything is sent to the API. The API then
// validates the content itself (sources cited, http(s) links, lengths).

import type { ReportPayload } from "@/lib/admin/reportEditor";

const MAX_ITEMS = 200;
const MAX_TEXT = 5000;

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === "string" ? v.slice(0, MAX_TEXT) : "");
const optStr = (v: unknown): string | null => (typeof v === "string" ? v.slice(0, MAX_TEXT) : null);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v.slice(0, MAX_ITEMS) : []);
const refs = (v: unknown): string[] => list(v).filter((r): r is string => typeof r === "string").map((r) => r.slice(0, 100));

const claim = (v: unknown) => (isObj(v) ? { text: str(v.text), sourceRefs: refs(v.sourceRefs) } : null);
const claims = (v: unknown) => list(v).map(claim).filter((c) => c !== null);
const STATUSES = new Set(["verified", "unconfirmed", "not_public"]);
const facts = (v: unknown) =>
  list(v)
    .filter(isObj)
    .map((f) => ({ label: str(f.label), status: STATUSES.has(f.status as string) ? (f.status as string) : "unconfirmed", value: optStr(f.value), sourceRefs: refs(f.sourceRefs) }));

/** Returns a clean payload, or null if the input isn't a report object at all. */
export function sanitizeReportPayload(input: unknown): ReportPayload | null {
  if (!isObj(input)) return null;
  return {
    sources: list(input.sources)
      .filter(isObj)
      .map((s) => ({ ref: str(s.ref).slice(0, 100), title: str(s.title), url: str(s.url), dateKind: s.dateKind === "published" ? "published" : "accessed", date: str(s.date).slice(0, 10) })),
    summary: claim(input.summary),
    problemsCore: claim(input.problemsCore),
    clients: claims(input.clients),
    competitors: claims(input.competitors),
    goals: claims(input.goals),
    productEngineering: claims(input.productEngineering),
    marketRisks: claims(input.marketRisks),
    keyFacts: facts(input.keyFacts),
    teamHiring: facts(input.teamHiring),
    problems: list(input.problems)
      .filter(isObj)
      .map((p) => ({ who: str(p.who), problem: str(p.problem), solution: str(p.solution), sourceRefs: refs(p.sourceRefs) })),
    technologies: list(input.technologies).filter((t): t is string => typeof t === "string").map((t) => t.slice(0, 100)),
    people: list(input.people)
      .filter(isObj)
      .map((p) => ({ name: optStr(p.name), role: str(p.role), profileUrl: optStr(p.profileUrl) })),
  } as ReportPayload;
}
