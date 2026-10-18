import Link from "next/link";
import { ApproachCard } from "@/components/company/ApproachCard";
import { CompanyActions } from "@/components/company/CompanyActions";
import { FitCard } from "@/components/company/FitCard";
import { PeopleCard } from "@/components/company/PeopleCard";
import { ReportView } from "@/components/company/ReportView";
import { companySizeLabel } from "@/components/company/labels";
import { Container } from "@/components/layout/Page";
import { Tag } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FitBadge } from "@/components/ui/FitBadge";
import { CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";
import { Tabs } from "@/components/ui/Tabs";
import type { Company, ShortlistEntry } from "@/lib/api/types";

/**
 * A company's page. Desktop: the report on the left, fit and people on the right. Mobile: three
 * tabs, Report / Your fit / People (product brief, section 8).
 */
export function CompanyView({ company, initialShortlist }: { company: Company; initialShortlist: ShortlistEntry[] }) {
  return (
    <Container className="pt-4 md:pt-8">
      <Link href="/search" className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline">
        <span aria-hidden="true">←&nbsp;</span>Back to {company.country} results
      </Link>

      <Card padding="lg" className="mt-2">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <CompanyMark name={company.name} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{company.name}</h1>
                <FitBadge band={company.fit.band} score={company.fit.score} format="score" className="md:hidden" />
              </div>
              <p className="mt-1 text-sm text-ink-muted md:text-base">{company.description}</p>
              <ul aria-label="Key details" className="mt-3 flex flex-wrap gap-2">
                <li><Tag>{company.city}, {company.country}</Tag></li>
                <li><Tag>{company.sector}</Tag></li>
                {company.stage && <li><Tag>{company.stage}</Tag></li>}
                <li><Tag>{companySizeLabel[company.size]}</Tag></li>
              </ul>
              <ResearchMeta className="mt-3" variant="highlight" researchedAt={company.researchedAt} sourceCount={company.sourceCount} />
            </div>
          </div>
          <CompanyActions slug={company.slug} name={company.name} initialShortlist={initialShortlist} />
        </div>
      </Card>

      <div className="mt-4">
        <Tabs
          label={`${company.name} sections`}
          mode="mobile"
          // Desktop: report spans both rows on the left; fit, then people, on the right. The second
          // row takes the extra height so people sit right under the fit card.
          panelsClassName="mt-4 md:mt-0 md:grid md:grid-cols-[minmax(0,1fr)_22rem] md:grid-rows-[auto_1fr] md:items-start md:gap-6"
          panelClassNames={{ report: "md:row-span-2", fit: "md:col-start-2", people: "md:col-start-2" }}
          items={[
            { id: "report", label: "Report", content: <ReportView company={company} /> },
            { id: "fit", label: "Your fit", content: <FitCard fit={company.fit} /> },
            {
              id: "people",
              label: "People",
              content: (
                <div className="space-y-4">
                  <PeopleCard people={company.people} verifiedAt={company.peopleVerifiedAt} />
                  <ApproachCard approach={company.approach} people={company.people} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </Container>
  );
}
