import { cn } from "@/lib/cn";
import { type FitBand, fitBandLabel, fitBandStroke } from "@/lib/fit";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const sizes = {
  md: "size-16 text-lg",
  lg: "size-20 text-xl",
} as const;

/** The signature fit visual: the score inside a ring that fills by score, coloured by band. */
export function FitScoreRing({ score, band, size = "md", className }: { score: number; band: FitBand; size?: keyof typeof sizes; className?: string }) {
  const clamped = Math.min(100, Math.max(0, score));
  const filled = (clamped / 100) * CIRCUMFERENCE;

  return (
    <div
      role="img"
      aria-label={`${fitBandLabel[band]} fit, score ${clamped} out of 100`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", sizes[size], className)}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={RADIUS} fill="none" strokeWidth="4" className="stroke-line" />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          className={fitBandStroke[band]}
        />
      </svg>
      <span aria-hidden="true" className="font-bold text-ink">
        {clamped}
      </span>
    </div>
  );
}
