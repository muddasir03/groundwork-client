import { cn } from "@/lib/cn";
import { type FitBand, type ScoreItem, fitBandBar } from "@/lib/fit";

/**
 * How a fit score is made up ("Technical stack 36 / 40"). `showBars`: true for bars at every size,
 * "mobile" for bars below `md` only (the company page design).
 */
export function ScoreBreakdown({ items, band, showBars = false, className }: { items: ScoreItem[]; band: FitBand; showBars?: boolean | "mobile"; className?: string }) {
  return (
    <dl className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <dt className="text-ink-muted">{item.label}</dt>
            <dd className="font-semibold text-ink tabular-nums">
              {item.value} / {item.max}
            </dd>
          </div>
          {showBars && (
            <div className={cn("mt-1.5 h-2 rounded-full bg-line", showBars === "mobile" && "md:hidden")} aria-hidden="true">
              <div
                className={cn("h-2 rounded-full", fitBandBar[band])}
                style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </dl>
  );
}
