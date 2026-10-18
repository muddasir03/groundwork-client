import { useId } from "react";
import { cn } from "@/lib/cn";

type FitReasonsProps = {
  matches: string[];
  gaps: string[];
  matchesLabel?: string;
  gapsLabel?: string;
  className?: string;
};

/** Why a person fits or doesn't: the reasons that must accompany every fit score. */
export function FitReasons({ matches, gaps, matchesLabel = "Matches", gapsLabel = "Gaps", className }: FitReasonsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <ReasonList label={matchesLabel} items={matches} labelClass="text-success" />
      <ReasonList label={gapsLabel} items={gaps} labelClass="text-warning" />
    </div>
  );
}

function ReasonList({ label, items, labelClass }: { label: string; items: string[]; labelClass: string }) {
  const id = useId();
  if (items.length === 0) return null;
  return (
    <div>
      <p id={id} className={cn("text-xs font-semibold tracking-wide uppercase", labelClass)}>
        {label}
      </p>
      <ul aria-labelledby={id} className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
