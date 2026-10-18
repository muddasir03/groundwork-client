import { cn } from "@/lib/cn";
import { type FitBand, fitBandLabel, fitBandSoft, fitBandText } from "@/lib/fit";

type FitBadgeProps = {
  band: FitBand;
  score: number;
  /** full: "Strong fit · 82" (cards, headers) · short: "Strong · 82" (tables) · score: "82" (tight mobile layouts). */
  format?: "full" | "short" | "score";
  className?: string;
};

export function fitBadgeText(band: FitBand, score: number, format: FitBadgeProps["format"] = "full"): string {
  if (format === "score") return String(score);
  return `${fitBandLabel[band]}${format === "full" ? " fit" : ""} · ${score}`;
}

/** The fit verdict as a pill. Always pair it with the reasons somewhere on the page. */
export function FitBadge({ band, score, format = "full", className }: FitBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        fitBandSoft[band],
        fitBandText[band],
        className,
      )}
    >
      <span aria-hidden="true">{fitBadgeText(band, score, format)}</span>
      <span className="sr-only">{`${fitBandLabel[band]} fit, score ${score} out of 100`}</span>
    </span>
  );
}
