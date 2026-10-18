import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EyebrowTone = "primary" | "success" | "warning" | "subtle";

const tones: Record<EyebrowTone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  subtle: "text-ink-subtle",
};

/**
 * The small uppercase label above a title or list: "RESEARCH FIRST. APPLY SECOND.", "WHY YOU MATCH".
 * Use `success` for matches and `warning` for gaps, as everywhere else.
 */
export function Eyebrow({ tone = "primary", id, className, children }: { tone?: EyebrowTone; id?: string; className?: string; children: ReactNode }) {
  return (
    <p id={id} className={cn("text-xs font-semibold tracking-wide uppercase", tones[tone], className)}>
      {children}
    </p>
  );
}
