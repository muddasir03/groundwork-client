import { companyPath } from "@/components/company/paths";
import { Card } from "@/components/ui/Card";
import { FitBadge } from "@/components/ui/FitBadge";
import { FitReasons } from "@/components/ui/FitReasons";
import { CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";
import type { Company } from "@/lib/api/types";
import Link from "next/link";

/**
 * The landing page's preview of a fit verdict, taken from the fictional sample report so the
 * numbers match the report it links to. The brief rules out claims about real companies here.
 */
export function SampleFitCard({ company }: { company: Company }) {
  return (
    <Card padding="lg" className="shadow-lg shadow-ink/5">
      <div className="flex items-start gap-3">
        <CompanyMark name={company.name} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">
            <Link href={companyPath(company.slug)} className="hover:underline">
              {company.name}
            </Link>
          </p>
          <p className="text-xs text-ink-subtle">
            {company.description.replace(/\.$/, "")} · {company.city}
          </p>
        </div>
        <FitBadge band={company.fit.band} score={company.fit.score} />
      </div>
      <FitReasons className="mt-5" matches={company.fit.matches} gaps={company.fit.gaps} matchesLabel="Why you match" gapsLabel="Gaps to plan for" />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        <ResearchMeta researchedAt={company.researchedAt} sourceCount={company.sourceCount} contactCount={company.people.length} />
        <span className="text-xs text-ink-subtle">Fictional example</span>
      </div>
    </Card>
  );
}
