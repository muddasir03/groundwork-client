import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, Inset } from "@/components/ui/Card";
import { FitBadge } from "@/components/ui/FitBadge";
import { CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";
import type { CompanySummary } from "@/lib/api/types";
import { companyPath } from "@/components/company/paths";

type CompanyCardProps = {
  company: CompanySummary;
  saved: boolean;
  compared: boolean;
  /** True when three companies are already picked and this one isn't one of them. */
  compareFull: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
};

/** A search result: who they are, your fit with its top match and gap, and quick actions. */
export function CompanyCard({ company, saved, compared, compareFull, onToggleSave, onToggleCompare }: CompanyCardProps) {
  return (
    <Card as="article" className="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <CompanyMark name={company.name} />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-ink">
            {/* The whole name is the link; the card's buttons stay separately clickable. */}
            <Link href={companyPath(company.slug)} className="hover:underline">
              {company.name}
            </Link>
          </h2>
          <p className="text-sm text-ink-subtle">
            {company.city} · {company.sector}
          </p>
        </div>
        {/* Visibility lives on wrappers: `hidden` on FitBadge itself would fight its own inline-flex. */}
        <span className="hidden sm:block">
          <FitBadge band={company.fit.band} score={company.fit.score} />
        </span>
        <span className="sm:hidden">
          <FitBadge band={company.fit.band} score={company.fit.score} format="score" />
        </span>
      </div>
      <p className="mt-3 text-sm text-ink">{company.description}</p>
      <Inset className="mt-3">
        {company.fit.topMatch} · {company.fit.topGap}
      </Inset>
      {/* Spacer: keeps the footer at the bottom when cards in a row have different heights. */}
      <div className="min-h-4 flex-1" />
      <div className="hidden flex-wrap items-center justify-between gap-3 border-t border-line pt-3 md:flex">
        <ResearchMeta researchedAt={company.researchedAt} sourceCount={company.sourceCount} />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" pressed={saved} onClick={onToggleSave} aria-label={`Save ${company.name}`}>
            Save
          </Button>
          <Button
            size="sm"
            variant="secondary"
            pressed={compared}
            disabled={!compared && compareFull}
            onClick={onToggleCompare}
            aria-label={`Compare ${company.name}`}
          >
            Compare
          </Button>
        </div>
      </div>
    </Card>
  );
}
