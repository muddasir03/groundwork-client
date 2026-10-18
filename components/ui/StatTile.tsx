import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatTileProps = {
  label: string;
  children: ReactNode;
  /** `inset`: grey, inside a card ("Founded 2018"). `card`: white, on the canvas (admin stats). */
  variant?: "inset" | "card";
  /** Render as a <dt>/<dd> pair; use inside a <dl>. */
  definition?: boolean;
  className?: string;
};

/** A labelled value in a box. */
export function StatTile({ label, children, variant = "inset", definition = false, className }: StatTileProps) {
  const Label = definition ? "dt" : "p";
  const Value = definition ? "dd" : "div";
  return (
    <div className={cn(variant === "inset" ? "rounded-lg bg-fill p-3" : "rounded-2xl border border-line bg-surface p-4 md:p-5", className)}>
      <Label className={cn("text-ink-subtle", variant === "inset" ? "text-xs" : "text-sm")}>{label}</Label>
      <Value className={cn("mt-1 font-semibold text-ink", variant === "inset" ? "text-sm" : "font-display text-3xl font-extrabold")}>{children}</Value>
    </div>
  );
}
