import type { ClaimStatus, Fact, Source } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** The words shown for facts that couldn't be verified. Use exactly these everywhere. */
export const claimStatusLabel: Record<Exclude<ClaimStatus, "verified">, string> = {
  unconfirmed: "Unconfirmed",
  not_public: "Not public",
};

/** A fact's value, or "Unconfirmed" / "Not public" in muted italics. Never a guess. */
export function FactValue({ fact, className }: { fact: Fact; className?: string }) {
  if (fact.status !== "verified" || fact.value === null) {
    const label = fact.status === "verified" ? claimStatusLabel.unconfirmed : claimStatusLabel[fact.status];
    return <span className={cn("font-normal text-ink-subtle italic", className)}>{label}</span>;
  }
  return <span className={className}>{fact.value}</span>;
}

/**
 * Numbered links to a claim's sources ("[1][3]"), pointing at the Sources list on the same page
 * (`#source-<id>`). `sources` is the page's full, ordered source list, which sets the numbers.
 */
export function Citations({ sourceIds, sources }: { sourceIds: string[]; sources: Source[] }) {
  if (sourceIds.length === 0) return null;
  return (
    <sup className="ml-0.5 space-x-0.5 text-xs">
      {sourceIds.map((id) => {
        const index = sources.findIndex((source) => source.id === id);
        if (index === -1) return null;
        return (
          <a key={id} href={`#source-${id}`} className="font-medium text-primary hover:underline" aria-label={`Source ${index + 1}: ${sources[index].title}`}>
            [{index + 1}]
          </a>
        );
      })}
    </sup>
  );
}
