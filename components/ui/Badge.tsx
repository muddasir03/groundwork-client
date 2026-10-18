import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "primary" | "success" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-neutral-soft text-ink-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

/**
 * A small status label. Pick the tone by meaning, the same way everywhere:
 * success = published / interviewing, warning = in review / applied,
 * primary = in progress / contacted, neutral = draft / researching.
 * For fit, use `FitBadge` instead.
 */
export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  );
}

/** A neutral rectangular tag for facts such as "Barcelona, Spain" or a technology. */
export function Tag({ highlighted, className, children }: { highlighted?: boolean; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        highlighted ? "bg-success-soft text-success" : "bg-fill text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
