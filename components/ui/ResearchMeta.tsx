import { cn } from "@/lib/cn";
import { formatResearchDate, pluralize } from "@/lib/format";

type ResearchMetaProps = {
  /** ISO date the research was done, e.g. "2026-09-30". */
  researchedAt: string;
  sourceCount: number;
  contactCount?: number;
  /** `plain` for card footers; `highlight` for the pill under a company's name. */
  variant?: "plain" | "highlight";
  className?: string;
};

/**
 * "Researched 30 Sep 2026 · 18 sources". Shown wherever research appears, because every claim
 * must carry its source and date.
 */
export function ResearchMeta({ researchedAt, sourceCount, contactCount, variant = "plain", className }: ResearchMetaProps) {
  const parts = [pluralize(sourceCount, "source")];
  if (contactCount !== undefined) parts.push(pluralize(contactCount, "senior contact"));

  return (
    <p
      className={cn(
        "text-xs",
        // inline-block, not inline-flex: flex drops the spaces around <time>.
        variant === "plain" ? "text-ink-subtle" : "inline-block rounded-md bg-primary-soft px-2 py-1 font-semibold text-primary",
        className,
      )}
    >
      Researched <time dateTime={researchedAt}>{formatResearchDate(researchedAt)}</time>
      {parts.map((part) => ` · ${part}`).join("")}
    </p>
  );
}
