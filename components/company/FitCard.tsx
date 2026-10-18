import { NO_FIT_YET } from "@/components/company/CompanyCard";
import { SectionTitle } from "@/components/layout/Page";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FitReasons } from "@/components/ui/FitReasons";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import { ScoreBreakdown } from "@/components/ui/ScoreBreakdown";
import { VerdictFeedback } from "@/components/company/VerdictFeedback";
import type { FitVerdict } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { fitBandLabel, fitBandText } from "@/lib/fit";

/** The full fit verdict: score, breakdown, reasons and explanation. Never shown without reasons. */
export function FitCard({ fit }: { fit: FitVerdict }) {
  return (
    <Card as="section" highlight={fit.band}>
      <div className="flex items-center gap-4">
        <FitScoreRing score={fit.score} band={fit.band} size="lg" />
        <div>
          <p className="text-xs text-ink-subtle">Your fit</p>
          <h2 className={cn("font-display text-2xl font-extrabold", fitBandText[fit.band])}>{fitBandLabel[fit.band]} fit</h2>
          <p className="mt-1 text-sm text-ink-muted md:hidden">{fit.headline}</p>
        </div>
      </div>
      <ScoreBreakdown className="mt-5" band={fit.band} items={fit.breakdown} showBars="mobile" />
      <FitReasons className="mt-5" matches={fit.matches} gaps={fit.gaps} />
      <p className="mt-4 text-sm text-ink">{fit.explanation}</p>
      <VerdictFeedback />
    </Card>
  );
}

/** The fit panel when there's no verdict yet: explains why, and never shows a made-up score. */
export function NoFitCard() {
  return (
    <Card as="section">
      <SectionTitle>Your fit</SectionTitle>
      <p className="mt-2 text-sm text-ink-muted">{NO_FIT_YET} Fit verdicts compare this research with your skills, experience and goals.</p>
      <ButtonLink href="/profile" variant="secondary" className="mt-4">
        Go to your profile
      </ButtonLink>
    </Card>
  );
}
