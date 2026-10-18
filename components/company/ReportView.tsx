import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Disclosure } from "@/components/ui/Disclosure";
import { Citations, FactValue } from "@/components/ui/FactValue";
import { Tag } from "@/components/ui/Badge";
import { StatTile } from "@/components/ui/StatTile";
import { SectionTitle } from "@/components/layout/Page";
import type { Claim, Company, Fact, Source } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatResearchDate } from "@/lib/format";

/** Section anchors, in report order. Sections with no research are left out. */
function sectionsFor(company: Company) {
  const { report } = company;
  return [
    { id: "at-a-glance", label: "At a glance", show: true },
    { id: "problems", label: "Problems", show: true },
    { id: "clients", label: "Clients", show: report.clients.length > 0 },
    { id: "competitors", label: "Competitors", show: report.competitors.length > 0 },
    { id: "goals", label: "Goals", show: report.goals.length > 0 },
    { id: "product-engineering", label: "Product and engineering", show: true },
    { id: "team-hiring", label: "Team and hiring", show: true },
    { id: "market-risks", label: "Market and risks", show: report.marketRisks.length > 0 },
    { id: "sources", label: "Sources", show: true },
  ].filter((section) => section.show);
}

/**
 * The research report. Desktop: a section index and every section in full. Mobile: the summary
 * and problems in full, the rest collapsed into rows (as in the designs).
 */
export function ReportView({ company }: { company: Company }) {
  const { report, sources } = company;
  const sections = sectionsFor(company);
  const has = (id: string) => sections.some((section) => section.id === id);

  return (
    <div className="space-y-4">
      <nav aria-label="Report sections" className="hidden rounded-2xl border border-line bg-surface p-2 md:block">
        <ul className="flex flex-wrap gap-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="inline-flex min-h-9 items-center rounded-lg px-3 text-sm text-ink-muted hover:bg-fill hover:text-ink">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Card as="section" padding="lg">
        <SectionTitle>
          <span id="at-a-glance">
            <span className="md:hidden">In 30 seconds</span>
            <span className="hidden md:inline">At a glance</span>
          </span>
        </SectionTitle>
        <p className="mt-3 text-base text-ink">
          <ClaimText claim={report.summary} sources={sources} />
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {report.keyFacts.map((fact) => (
            <FactTile key={fact.label} fact={fact} sources={sources} />
          ))}
        </dl>
      </Card>

      <Card as="section" padding="lg">
        <SectionTitle>
          <span id="problems">Problems they solve</span>
        </SectionTitle>
        <p className="mt-3 text-sm text-ink">
          <strong className="font-semibold">Core business:</strong> <ClaimText claim={report.problems.core} sources={sources} />
        </p>
        {report.problems.rows.length > 0 && (
          <>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink md:hidden">
              {report.problems.rows.map((row) => (
                <li key={row.who}>{row.problem}</li>
              ))}
            </ul>
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs tracking-wide text-ink-subtle uppercase">
                    <th scope="col" className="border-b border-line py-2 pr-4 font-semibold">Who</th>
                    <th scope="col" className="border-b border-line py-2 pr-4 font-semibold">Problem</th>
                    <th scope="col" className="border-b border-line py-2 font-semibold">Their solution</th>
                  </tr>
                </thead>
                <tbody>
                  {report.problems.rows.map((row) => (
                    <tr key={row.who}>
                      <th scope="row" className="border-b border-line py-3 pr-4 font-semibold text-ink">{row.who}</th>
                      <td className="border-b border-line py-3 pr-4 text-ink">{row.problem}</td>
                      <td className="border-b border-line py-3 text-ink">
                        {row.solution}
                        <Citations sourceIds={row.sourceIds} sources={sources} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {has("clients") && <ClaimSection id="clients" title="Clients" claims={report.clients} sources={sources} />}
      {has("competitors") && <ClaimSection id="competitors" title="Competitors" claims={report.competitors} sources={sources} />}
      {has("goals") && <ClaimSection id="goals" title="Goals and momentum" claims={report.goals} sources={sources} />}

      <ReportSection id="product-engineering" title="Product and engineering">
        <ul aria-label="Technology" className="flex flex-wrap gap-2">
          {report.productEngineering.stack.map((item) => (
            <li key={item.name}>
              <Tag highlighted={item.onProfile}>
                {item.name}
                {item.onProfile && (
                  <>
                    <span aria-hidden="true"> ✓</span>
                    <span className="sr-only"> (also on your profile)</span>
                  </>
                )}
              </Tag>
            </li>
          ))}
        </ul>
        {report.productEngineering.stack.some((item) => item.onProfile) && <p className="mt-2 text-xs text-ink-subtle">✓ also on your profile</p>}
        <ClaimList claims={report.productEngineering.points} sources={sources} className="mt-3" />
      </ReportSection>

      <ReportSection id="team-hiring" title="Team and hiring">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.teamHiring.map((fact) => (
            <FactTile key={fact.label} fact={fact} sources={sources} />
          ))}
        </dl>
      </ReportSection>

      {has("market-risks") && <ClaimSection id="market-risks" title="Market and risks" claims={report.marketRisks} sources={sources} />}

      <ReportSection id="sources" title="Sources">
        <SourceList sources={sources} />
      </ReportSection>
    </div>
  );
}

function ReportSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-4">
      <Disclosure title={title}>{children}</Disclosure>
    </div>
  );
}

function ClaimSection({ id, title, claims, sources }: { id: string; title: string; claims: Claim[]; sources: Source[] }) {
  return (
    <ReportSection id={id} title={title}>
      <ClaimList claims={claims} sources={sources} />
    </ReportSection>
  );
}

function ClaimText({ claim, sources }: { claim: Claim; sources: Source[] }) {
  return (
    <>
      {claim.text}
      <Citations sourceIds={claim.sourceIds} sources={sources} />
    </>
  );
}

function ClaimList({ claims, sources, className }: { claims: Claim[]; sources: Source[]; className?: string }) {
  return (
    <ul className={cn("list-disc space-y-1.5 pl-5 text-sm text-ink", className)}>
      {claims.map((claim) => (
        <li key={claim.text}>
          <ClaimText claim={claim} sources={sources} />
        </li>
      ))}
    </ul>
  );
}

function FactTile({ fact, sources }: { fact: Fact; sources: Source[] }) {
  return (
    <StatTile label={fact.label} definition>
      <FactValue fact={fact} />
      <Citations sourceIds={fact.sourceIds} sources={sources} />
    </StatTile>
  );
}

/** The numbered source list that citations link to. */
export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink">
      {sources.map((source) => (
        <li key={source.id} id={`source-${source.id}`} className="scroll-mt-4">
          <a href={source.url} className="text-primary underline" rel="noopener noreferrer" target="_blank">
            {source.title}
          </a>{" "}
          <span className="text-ink-subtle">
            · {source.dateKind === "accessed" ? "accessed " : ""}
            {formatResearchDate(source.date)}
          </span>
        </li>
      ))}
    </ol>
  );
}
