import { Card } from "@/components/ui/Card";
import { FitBadge } from "@/components/ui/FitBadge";
import { FitReasons } from "@/components/ui/FitReasons";
import { CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";

// A fictional company: the landing page must not make claims about real companies (product brief:
// "Never invent facts"). Replace with a real, reviewed report once one is published.
const sample = {
  name: "Brisa People",
  summary: "HR and payroll platform · Valencia",
  band: "strong" as const,
  score: 82,
  matches: ["Their stack is Ruby on Rails and React, your core stack", "They hire product engineers on skills, not years"],
  gaps: ["Engineering is office-first; relocation to Spain needed", "Roadmap is AI-first; no LLM projects on your profile"],
  researchedAt: "2026-09-30",
  sourceCount: 18,
  contactCount: 5,
};

/** The landing page's preview of a fit verdict. */
export function SampleFitCard() {
  return (
    <Card padding="lg" className="shadow-lg shadow-ink/5">
      <div className="flex items-start gap-3">
        <CompanyMark name={sample.name} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{sample.name}</p>
          <p className="text-xs text-ink-subtle">{sample.summary}</p>
        </div>
        <FitBadge band={sample.band} score={sample.score} />
      </div>
      <FitReasons className="mt-5" matches={sample.matches} gaps={sample.gaps} matchesLabel="Why you match" gapsLabel="Gaps to plan for" />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        <ResearchMeta researchedAt={sample.researchedAt} sourceCount={sample.sourceCount} contactCount={sample.contactCount} />
        <span className="text-xs text-ink-subtle">Fictional example</span>
      </div>
    </Card>
  );
}
