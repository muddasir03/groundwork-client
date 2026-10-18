import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ChipProps = Omit<ComponentProps<"button">, "type"> & {
  /** Selected chips are announced as pressed to screen readers. */
  selected?: boolean;
  /** `add` is the dashed "+ Add country" style. */
  variant?: "toggle" | "add";
};

/** A pill-shaped toggle for choosing countries, sectors, quick filters and shortlist stages. */
export function Chip({ selected = false, variant = "toggle", className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={variant === "toggle" ? selected : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors",
        variant === "add" && "border border-dashed border-line-strong text-ink-muted hover:bg-fill",
        variant === "toggle" &&
          (selected
            ? "border border-primary bg-primary-soft font-semibold text-primary"
            : "border border-line-strong bg-surface text-ink hover:bg-fill"),
        className,
      )}
      {...props}
    />
  );
}
