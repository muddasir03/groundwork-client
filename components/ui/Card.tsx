import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { FitBand } from "@/lib/fit";

type CardProps = {
  as?: "div" | "section" | "article";
  /** Highlights the card with a coloured border: `primary` for the item needing attention, a fit band for the fit card. */
  highlight?: "primary" | FitBand;
  padding?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

const highlights: Record<NonNullable<CardProps["highlight"]>, string> = {
  primary: "border-2 border-primary",
  strong: "border-2 border-success",
  possible: "border-2 border-warning",
  weak: "border-2 border-ink-subtle",
};

/** The white card that holds every block of content in Groundwork. */
export function Card({ as: Tag = "div", highlight, padding = "md", className, children }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl bg-surface",
        highlight ? highlights[highlight] : "border border-line",
        padding === "md" ? "p-4 md:p-5" : "p-5 md:p-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** A tinted box inside a card, for summaries and asides. */
export function Inset({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg bg-fill px-3 py-2.5 text-sm text-ink-muted", className)}>{children}</div>;
}
