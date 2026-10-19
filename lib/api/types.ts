// The data contract between groundwork-client and groundwork-api. The API's JSON must match these
// types. The product rules are encoded here: every claim carries its sources, unknown values are
// explicit, and a fit verdict always carries its reasons.

import type { FitBand, ScoreItem } from "@/lib/fit";

/** ISO 8601 date, e.g. "2026-09-30". */
export type IsoDate = string;

/** Whether a fact could be verified. Never guess: unknown values use `unconfirmed` or `not_public`. */
export type ClaimStatus = "verified" | "unconfirmed" | "not_public";

export type Source = {
  id: string;
  title: string;
  url: string;
  /** "published" for dated documents, "accessed" for pages without a publication date. */
  dateKind: "published" | "accessed";
  date: IsoDate;
};

/** A sentence of research, backed by one or more sources. */
export type Claim = { text: string; sourceIds: string[] };

/** A labelled fact. `value` is null unless `status` is "verified". */
export type Fact = { label: string; value: string | null; status: ClaimStatus; sourceIds: string[] };

export type ProblemRow = { who: string; problem: string; solution: string; sourceIds: string[] };

export type StackItem = { name: string; onProfile: boolean };

export type CompanyReport = {
  /** Two or three sentences: what the company does, for whom, and where it is heading. */
  summary: Claim;
  keyFacts: Fact[];
  problems: { core: Claim; rows: ProblemRow[] };
  clients: Claim[];
  competitors: Claim[];
  goals: Claim[];
  productEngineering: { stack: StackItem[]; points: Claim[] };
  teamHiring: Fact[];
  marketRisks: Claim[];
};

export type FitSummary = {
  band: FitBand;
  /** 0–100. */
  score: number;
  topMatch: string;
  topGap: string;
};

export type FitVerdict = FitSummary & {
  /** One line of advice, e.g. "Build one LLM feature first, and plan for relocation." */
  headline: string;
  breakdown: ScoreItem[];
  matches: string[];
  gaps: string[];
  explanation: string;
};

export type Person = {
  id: string;
  /** Null when the name is not public. */
  name: string | null;
  role: string;
  /** Link to a public profile, or null when there is none. */
  profileUrl: string | null;
};

export type Approach = {
  proofOfWork: string;
  /** The person to contact, by id. */
  sendToPersonId: string;
  draftMessage: string;
};

export type CompanySummary = {
  slug: string;
  name: string;
  /** One line: what the company does. */
  description: string;
  city: string;
  country: string;
  sector: string;
  size: CompanySize;
  stage: string | null;
  researchedAt: IsoDate;
  sourceCount: number;
  /** The visitor's fit. Null when there's no verdict yet (no profile, or not computed). */
  fit: FitSummary | null;
};

export type CompanySize = "1-50" | "51-200" | "201-1000" | "1000+";

export type Company = Omit<CompanySummary, "fit"> & {
  report: CompanyReport;
  sources: Source[];
  people: Person[];
  peopleVerifiedAt: IsoDate;
  /** The visitor's full verdict. Null when there's no verdict yet; never shown without reasons. */
  fit: FitVerdict | null;
  /** Generated on request; null until the user asks for one. */
  approach: Approach | null;
};

// ── What groundwork-api returns (docs/API.md in groundwork-api) ─────────────────────────────────
// Public research only. The personal parts (fit, approach, "also on your profile") depend on the
// signed-in user and are added by the client until accounts exist.

export type ApiCompanySummary = Omit<CompanySummary, "fit">;

export type ApiCompany = Omit<Company, "fit" | "approach" | "report"> & {
  report: Omit<CompanyReport, "productEngineering"> & {
    productEngineering: { stack: Array<{ name: string }>; points: Claim[] };
  };
};

export type ApiList<T> = { data: T[]; meta: { page: number; perPage: number; total: number } };
export type ApiItem<T> = { data: T };

/** The comparison rows for one company (Compare page). */
export type CompanyComparison = {
  slug: string;
  name: string;
  fit: FitSummary | null;
  sector: string;
  headquarters: string;
  stage: string | null;
  techStack: string[];
  workPolicy: Fact;
  mainProduct: string;
};

export type ShortlistStatus = "researching" | "contacted" | "applied" | "interviewing";

export type ShortlistEntry = {
  slug: string;
  status: ShortlistStatus;
  notes: string;
  updatedAt: IsoDate;
};

export type Skill = { name: string; years: number | null };

export type Profile = {
  name: string;
  cv: { fileName: string; extractedAt: IsoDate } | null;
  links: { github: string; gitlab: string; linkedin: string; portfolio: string };
  targetCountries: string[];
  targetSectors: string[];
  extracted: {
    role: string;
    experience: string;
    location: string;
    openToRelocation: boolean;
    workMode: string;
    languages: string[];
    skills: Skill[];
    githubSummary: string | null;
  };
};

export type AdminCompanyStatus = "draft" | "researching" | "in_review" | "published";

export type AdminCompanyRow = {
  slug: string;
  name: string;
  status: AdminCompanyStatus;
  lastResearchedAt: IsoDate | null;
  sourceCount: number | null;
  contactsVerified: number | null;
  contactsTotal: number | null;
};

export type AdminStats = {
  published: number;
  total: number;
  waitingForReview: number;
  /** Share of verdicts users rated correct, 0–100, or null when there isn't enough feedback yet. */
  verdictsCorrectPercent: number | null;
  /** AI spend this month in US dollars, or null when cost tracking isn't set up yet. */
  aiCostThisMonthUsd: number | null;
};
