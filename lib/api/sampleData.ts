// FICTIONAL SAMPLE DATA, used until groundwork-api serves real, reviewed research.
// Every company, person and source here is invented. Sources point to example.com (a domain
// reserved for examples) so no link leads to a real site. Never add real companies or people.

import type {
  Company,
  CompanySize,
  Fact,
  Person,
  Profile,
  ShortlistEntry,
  Source,
} from "@/lib/api/types";

const fact = (label: string, value: string, sourceIds: string[]): Fact => ({ label, value, status: "verified", sourceIds });
const notPublic = (label: string): Fact => ({ label, value: null, status: "not_public", sourceIds: [] });
const unconfirmed = (label: string): Fact => ({ label, value: null, status: "unconfirmed", sourceIds: [] });

function source(slug: string, n: number, title: string, dateKind: Source["dateKind"], date: string): Source {
  return { id: `${slug}-s${n}`, title, url: `https://example.com/${slug}/source-${n}`, dateKind, date };
}

function person(slug: string, id: string, name: string | null, role: string): Person {
  return { id: `${slug}-${id}`, name, role, profileUrl: name ? `https://example.com/${slug}/people/${id}` : null };
}

// ── Brisa People: the full sample report (also shown on the landing page) ─────────────────────

const brisaSources: Source[] = [
  source("brisa-people", 1, "Brisa People: Series C announcement", "published", "2026-06-12"),
  source("brisa-people", 2, "Brisa People: pricing and modules", "accessed", "2026-09-30"),
  source("brisa-people", 3, "Brisa People careers: Senior Product Engineer", "published", "2026-08-20"),
  source("brisa-people", 4, "Brisa People engineering blog: Moving payroll rules out of the monolith", "published", "2026-05-02"),
  source("brisa-people", 5, "Brisa People: customer stories", "accessed", "2026-09-30"),
  source("brisa-people", 6, "Regional business press: HR software market in Spain", "published", "2026-07-15"),
];
const s = (n: number) => `brisa-people-s${n}`;

const brisa: Company = {
  slug: "brisa-people",
  name: "Brisa People",
  description: "HR and payroll platform for small and mid-sized businesses.",
  city: "Valencia",
  country: "Spain",
  sector: "HR tech",
  size: "201-1000",
  stage: "Series C",
  researchedAt: "2026-09-30",
  sourceCount: brisaSources.length,
  sources: brisaSources,
  report: {
    summary: {
      text: "Brisa People runs HR, payroll and time tracking for small and mid-sized businesses in one place. It serves around 4,000 companies in Spain and Portugal and is adding AI assistants to its core product. A Series C in June 2026 funded its expansion into payroll.",
      sourceIds: [s(1), s(5)],
    },
    keyFacts: [
      fact("Founded", "2018", [s(1)]),
      fact("Customers", "About 4,000 businesses", [s(5)]),
      fact("Employees", "About 320", [s(1)]),
      fact("Work policy", "Engineering office-first", [s(3)]),
    ],
    problems: {
      core: { text: "Replacing spreadsheets, email and separate tools with one system for every employee record, payslip and approval.", sourceIds: [s(2)] },
      rows: [
        { who: "HR managers", problem: "Employee data scattered across files and inboxes", solution: "Brisa Core: records, documents, e-signature", sourceIds: [s(2)] },
        { who: "Shift-based teams", problem: "Manual time and absence tracking risks labour-law fines", solution: "Time tracking, leave and shift planning", sourceIds: [s(2), s(5)] },
        { who: "Finance teams", problem: "Payroll prepared by hand from several tools", solution: "Integrated payroll with Spanish tax rules", sourceIds: [s(1), s(2)] },
      ],
    },
    clients: [
      { text: "Mostly businesses with 20–500 employees in retail, hospitality and professional services.", sourceIds: [s(5)] },
      { text: "Customer stories feature restaurant groups and regional retail chains.", sourceIds: [s(5)] },
    ],
    competitors: [
      { text: "Competes with other HR suites for small businesses and with local payroll agencies.", sourceIds: [s(6)] },
    ],
    goals: [
      { text: "Expand payroll from Spain into Portugal during 2027.", sourceIds: [s(1)] },
      { text: "Ship AI assistants that answer employees' HR questions inside the product.", sourceIds: [s(1), s(3)] },
    ],
    productEngineering: {
      stack: [
        { name: "Ruby on Rails", onProfile: true },
        { name: "React", onProfile: true },
        { name: "PostgreSQL", onProfile: true },
        { name: "TypeScript", onProfile: false },
        { name: "Sidekiq", onProfile: false },
        { name: "LLM assistants", onProfile: false },
      ],
      points: [
        { text: "About 60 engineers in product teams, each owning a domain such as payroll or time tracking.", sourceIds: [s(3)] },
        { text: "Hardest problems: Spanish labour and tax rules, and splitting payroll out of a large Rails monolith.", sourceIds: [s(4)] },
        { text: "Publishes an engineering blog.", sourceIds: [s(4)] },
      ],
    },
    teamHiring: [
      fact("Offices", "Valencia, Madrid", [s(3)]),
      fact("Interview process", "Recruiter call, technical interview, pairing session, CTO chat", [s(3)]),
      notPublic("Pay"),
      unconfirmed("Relocation support"),
    ],
    marketRisks: [
      { text: "The HR software market in Spain is crowded, and larger competitors are moving down to small businesses.", sourceIds: [s(6)] },
      { text: "Payroll errors carry legal risk, so new payroll features ship slowly.", sourceIds: [s(4)] },
    ],
  },
  people: [
    person("brisa-people", "ceo", "Lucía Ferrer", "CEO and co-founder"),
    person("brisa-people", "cofounder", "Marc Soler", "Co-founder"),
    person("brisa-people", "cto", null, "Chief Technology Officer"),
    person("brisa-people", "em-payroll", "Elena Ruiz", "Engineering Manager, Payroll"),
    person("brisa-people", "talent", "Pablo Martín", "Head of Engineering Talent"),
  ],
  peopleVerifiedAt: "2026-09-30",
  fit: {
    band: "strong",
    score: 82,
    topMatch: "Matches their Rails and React stack",
    topGap: "Office-first, relocation needed",
    headline: "Build one small LLM feature first, and plan for relocation.",
    breakdown: [
      { label: "Technical stack", value: 36, max: 40 },
      { label: "Seniority", value: 14, max: 20 },
      { label: "Location and work mode", value: 12, max: 20 },
      { label: "Languages", value: 10, max: 10 },
      { label: "Sector interest", value: 10, max: 10 },
    ],
    matches: ["Rails and React are their core stack and yours", "They hire product engineers on skills, not years"],
    gaps: ["Office-first: you would need to relocate to Spain", "AI-assistant roadmap; no LLM projects on your profile yet"],
    explanation: "A strong technical match. Build one small LLM feature before reaching out, and be ready to discuss relocation.",
  },
  approach: {
    proofOfWork: "A small \"ask your payroll data\" prototype. Their roadmap is AI assistants, and customer stories mention reporting as a recurring request.",
    sendToPersonId: "brisa-people-em-payroll",
    draftMessage:
      "Hi Elena, I've been studying Brisa People's payroll product, and reporting came up again and again in your customer stories. I built a small prototype that answers payroll questions in plain language, using a Rails backend like yours. Would you be open to a 15-minute look?",
  },
};

// ── The other sample companies: shorter reports ─────────────────────────────────────────────────

type BriefCompany = {
  slug: string;
  name: string;
  description: string;
  city: string;
  sector: string;
  size: CompanySize;
  stage: string | null;
  researchedAt: string;
  summary: string;
  founded: string;
  workPolicy: string;
  core: string;
  stack: Array<[string, boolean]>;
  points: string[];
  people: Array<[string, string | null, string]>;
  fit: Company["fit"];
};

function briefCompany(c: BriefCompany): Company {
  const sources = [
    source(c.slug, 1, `${c.name}: about the company`, "accessed", c.researchedAt),
    source(c.slug, 2, `${c.name} careers page`, "accessed", c.researchedAt),
    source(c.slug, 3, `${c.name}: funding announcement`, "published", "2026-03-10"),
  ];
  const id = (n: number) => `${c.slug}-s${n}`;
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    city: c.city,
    country: "Spain",
    sector: c.sector,
    size: c.size,
    stage: c.stage,
    researchedAt: c.researchedAt,
    sourceCount: sources.length,
    sources,
    report: {
      summary: { text: c.summary, sourceIds: [id(1), id(3)] },
      keyFacts: [fact("Founded", c.founded, [id(1)]), fact("Work policy", c.workPolicy, [id(2)]), unconfirmed("Customers")],
      problems: { core: { text: c.core, sourceIds: [id(1)] }, rows: [] },
      clients: [],
      competitors: [],
      goals: [],
      productEngineering: {
        stack: c.stack.map(([name, onProfile]) => ({ name, onProfile })),
        points: c.points.map((text) => ({ text, sourceIds: [id(2)] })),
      },
      teamHiring: [fact("Offices", c.city, [id(2)]), notPublic("Pay")],
      marketRisks: [],
    },
    people: c.people.map(([pid, name, role]) => person(c.slug, pid, name, role)),
    peopleVerifiedAt: c.researchedAt,
    fit: c.fit,
    approach: null,
  };
}

const tramo = briefCompany({
  slug: "tramo-logistics",
  name: "Tramo Logistics",
  description: "Route planning and fleet software for regional delivery companies.",
  city: "Zaragoza",
  sector: "Logistics software",
  size: "51-200",
  stage: "Series B",
  researchedAt: "2026-09-24",
  summary: "Tramo Logistics builds route planning and fleet tracking software for regional delivery companies. Its customers are mostly mid-sized carriers in Spain.",
  founded: "2019",
  workPolicy: "Hybrid, two office days",
  core: "Planning delivery routes that change during the day, without dispatchers redoing them by hand.",
  stack: [["Ruby on Rails", true], ["React", true], ["PostgreSQL", true], ["Go", false]],
  points: ["Small team of about 25 engineers.", "Route optimisation runs as a separate Go service."],
  people: [["ceo", "Irene Castell", "CEO and co-founder"], ["cto", "Jordi Valls", "CTO and co-founder"], ["em", null, "Engineering Manager"]],
  fit: {
    band: "strong",
    score: 76,
    topMatch: "Rails and React match your stack",
    topGap: "No Go experience on your profile",
    headline: "A good stack match; show some interest in their routing problems.",
    breakdown: [
      { label: "Technical stack", value: 32, max: 40 },
      { label: "Seniority", value: 14, max: 20 },
      { label: "Location and work mode", value: 14, max: 20 },
      { label: "Languages", value: 8, max: 10 },
      { label: "Sector interest", value: 8, max: 10 },
    ],
    matches: ["Rails and React match your stack", "Hybrid work makes relocation easier"],
    gaps: ["No Go experience on your profile"],
    explanation: "Your Rails and React work fits their main product. Their routing service uses Go, which you'd need to learn.",
  },
});

const pulsar = briefCompany({
  slug: "pulsar-health",
  name: "Pulsar Health",
  description: "Appointment and patient messaging software for private clinics.",
  city: "Madrid",
  sector: "Health tech",
  size: "51-200",
  stage: "Series A",
  researchedAt: "2026-09-18",
  summary: "Pulsar Health sells appointment booking and patient messaging to private clinics in Spain. It recently raised a Series A.",
  founded: "2020",
  workPolicy: "Remote within Spain",
  core: "Cutting no-shows and phone calls for small private clinics.",
  stack: [["Node.js", false], ["React", true], ["PostgreSQL", true], ["React Native", false]],
  points: ["About 20 engineers.", "Handles health data, so security reviews are part of every release."],
  people: [["ceo", "Nuria Prats", "CEO"], ["cto", "Álvaro Gil", "CTO"]],
  fit: {
    band: "possible",
    score: 68,
    topMatch: "React and PostgreSQL match",
    topGap: "Backend is Node.js, not Rails",
    headline: "Possible if you're keen on health tech and ready to switch to Node.js.",
    breakdown: [
      { label: "Technical stack", value: 26, max: 40 },
      { label: "Seniority", value: 14, max: 20 },
      { label: "Location and work mode", value: 12, max: 20 },
      { label: "Languages", value: 8, max: 10 },
      { label: "Sector interest", value: 8, max: 10 },
    ],
    matches: ["React and PostgreSQL match", "Remote within Spain once you relocate"],
    gaps: ["Backend is Node.js, not Rails", "Remote only for people living in Spain"],
    explanation: "Half of their stack matches yours. The backend is Node.js, and remote work requires living in Spain.",
  },
});

const vela = briefCompany({
  slug: "vela-pay",
  name: "Vela Pay",
  description: "Invoicing and payments for freelancers.",
  city: "Barcelona",
  sector: "Fintech",
  size: "51-200",
  stage: "Series A",
  researchedAt: "2026-09-12",
  summary: "Vela Pay offers invoicing, tax estimates and payments for freelancers in Spain.",
  founded: "2021",
  workPolicy: "Hybrid, three office days",
  core: "Helping freelancers send invoices and stay on top of quarterly taxes.",
  stack: [["Ruby on Rails", true], ["Vue.js", false], ["PostgreSQL", true], ["Stripe", true]],
  points: ["About 30 engineers.", "Payments run through Stripe."],
  people: [["ceo", "Carla Bosch", "CEO and co-founder"], ["cto", "Óscar Vidal", "CTO"], ["talent", null, "Talent lead"]],
  fit: {
    band: "possible",
    score: 63,
    topMatch: "Rails and Stripe experience",
    topGap: "Spanish required for most roles",
    headline: "Strong backend match, but you'd need professional Spanish.",
    breakdown: [
      { label: "Technical stack", value: 30, max: 40 },
      { label: "Seniority", value: 12, max: 20 },
      { label: "Location and work mode", value: 12, max: 20 },
      { label: "Languages", value: 2, max: 10 },
      { label: "Sector interest", value: 7, max: 10 },
    ],
    matches: ["Rails and Stripe experience", "Fintech is one of your target sectors"],
    gaps: ["Spanish required for most roles", "Frontend is Vue.js, not React"],
    explanation: "Your backend experience fits well. Most roles ask for professional Spanish, which isn't on your profile.",
  },
});

const cosecha = briefCompany({
  slug: "cosecha-data",
  name: "Cosecha Data",
  description: "Crop and weather analytics for farming cooperatives.",
  city: "Seville",
  sector: "Agritech",
  size: "1-50",
  stage: "Seed",
  researchedAt: "2026-09-05",
  summary: "Cosecha Data turns weather and satellite data into planting and irrigation advice for farming cooperatives in Andalusia.",
  founded: "2022",
  workPolicy: "Office-first",
  core: "Helping cooperatives decide when to plant and irrigate.",
  stack: [["Python", false], ["Django", false], ["React", true], ["PostgreSQL", true]],
  points: ["Team of about 8 engineers.", "Most work is data pipelines in Python."],
  people: [["ceo", "Rocío Lozano", "CEO and co-founder"], ["cto", "Manuel Ortega", "CTO and co-founder"]],
  fit: {
    band: "possible",
    score: 57,
    topMatch: "React and PostgreSQL match",
    topGap: "Python data work, not your focus",
    headline: "Only if you want to move towards data engineering.",
    breakdown: [
      { label: "Technical stack", value: 20, max: 40 },
      { label: "Seniority", value: 12, max: 20 },
      { label: "Location and work mode", value: 10, max: 20 },
      { label: "Languages", value: 8, max: 10 },
      { label: "Sector interest", value: 7, max: 10 },
    ],
    matches: ["React and PostgreSQL match"],
    gaps: ["Python data work, not your focus", "Small team, office-first in Seville"],
    explanation: "Their product is mostly Python data pipelines. Your frontend skills fit, but the core work differs.",
  },
});

const rastro = briefCompany({
  slug: "rastro-market",
  name: "Rastro Market",
  description: "Marketplace for buying and selling second-hand furniture.",
  city: "Barcelona",
  sector: "Marketplace",
  size: "201-1000",
  stage: "Series B",
  researchedAt: "2026-08-28",
  summary: "Rastro Market is a marketplace for second-hand furniture with delivery handled by partner carriers.",
  founded: "2017",
  workPolicy: "Office-first",
  core: "Making it easy to sell bulky second-hand furniture, including delivery.",
  stack: [["Java", false], ["Kotlin", false], ["Swift", false], ["React", true]],
  points: ["Mobile-first: most traffic comes through their apps.", "Backend is Java and Kotlin services."],
  people: [["ceo", "Sergi Puig", "CEO"], ["cto", null, "CTO"]],
  fit: {
    band: "weak",
    score: 41,
    topMatch: "Some React work on their web app",
    topGap: "Mobile and JVM stack, not yours",
    headline: "A weak match for your current skills.",
    breakdown: [
      { label: "Technical stack", value: 10, max: 40 },
      { label: "Seniority", value: 12, max: 20 },
      { label: "Location and work mode", value: 8, max: 20 },
      { label: "Languages", value: 6, max: 10 },
      { label: "Sector interest", value: 5, max: 10 },
    ],
    matches: ["Some React work on their web app"],
    gaps: ["Mobile and JVM stack, not yours", "Office-first in Barcelona"],
    explanation: "Their main work is mobile apps and Java services, which don't overlap with your experience.",
  },
});

export const sampleCompanies: Company[] = [brisa, tramo, pulsar, vela, cosecha, rastro];

export const sampleProfile: Profile = {
  name: "Sam Rivera",
  cv: { fileName: "Sam_Rivera_CV.pdf", extractedAt: "2026-10-12" },
  links: {
    github: "github.com/sam-rivera-example",
    gitlab: "",
    linkedin: "linkedin.com/in/sam-rivera-example",
    portfolio: "sam-rivera.example.com",
  },
  targetCountries: ["Spain", "Germany"],
  targetSectors: ["Software and SaaS", "AI applications"],
  extracted: {
    role: "Full-stack engineer",
    experience: "2 years · Mid-level",
    location: "Lahore, Pakistan",
    openToRelocation: true,
    workMode: "Remote, hybrid or office",
    languages: ["English (professional)"],
    skills: [
      { name: "Ruby on Rails", years: 2 },
      { name: "React", years: 2 },
      { name: "Next.js", years: 2 },
      { name: "PostgreSQL", years: 2 },
      { name: "GraphQL", years: null },
      { name: "AWS", years: null },
      { name: "Docker", years: null },
      { name: "Stripe", years: null },
    ],
    githubSummary: "14 public repositories · Most used: Ruby, TypeScript",
  },
};

/** Options offered on the profile page. */
export const sampleCountryOptions = ["Spain", "Germany", "Netherlands", "Portugal"];
export const sampleSectorOptions = ["Software and SaaS", "AI applications", "Fintech", "Health tech"];

/** The shortlist a new visitor starts with, so the screen has something to show. */
export const sampleShortlist: ShortlistEntry[] = [
  { slug: "brisa-people", status: "contacted", notes: "Sent the payroll-reporting prototype to the Payroll engineering manager. Follow up on day 4.", updatedAt: "2026-10-12" },
  { slug: "tramo-logistics", status: "interviewing", notes: "Technical interview booked. Read their routing blog post first.", updatedAt: "2026-10-15" },
  { slug: "pulsar-health", status: "researching", notes: "Check whether they hire outside Spain before deciding.", updatedAt: "2026-10-16" },
  { slug: "vela-pay", status: "applied", notes: "Applied through the careers page.", updatedAt: "2026-10-09" },
];

