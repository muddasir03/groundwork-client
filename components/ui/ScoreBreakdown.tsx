import { cn } from "@/lib/cn";
import { type FitBand, fitBandBar } from "@/lib/fit";

export type ScoreItem = { label: string; value: number; max: number };

/** How a fit score is made up ("Technical stack 36 / 40"), optionally with bars (used on mobile). */
export function ScoreBreakdown({ items, band, showBars = false, className }: { items: ScoreItem[]; band: FitBand; showBars?: boolean; className?: string }) {
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
            <div className="mt-1.5 h-2 rounded-full bg-line" aria-hidden="true">
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
