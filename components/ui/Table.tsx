import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Shared table styling (shortlist, compare, admin). Wrap in TableFrame so wide tables scroll
// inside their card on small screens instead of widening the page.

export function TableFrame({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("overflow-x-auto rounded-2xl border border-line bg-surface", className)} {...props} />;
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <table className={cn("w-full border-collapse text-left text-sm", className)} {...props} />;
}

/** Heading cell: `col` is a small uppercase column label; `row` labels a row (Compare). */
export function Th({ className, scope = "col", ...props }: ComponentProps<"th">) {
  return (
    <th
      scope={scope}
      className={cn(
        "border-b border-line px-4 py-3 font-semibold",
        scope === "col" ? "text-xs tracking-wide text-ink-subtle uppercase" : "text-sm text-ink-muted",
        className,
      )}
      {...props}
    />
  );
}

/** Body cell. `last` drops the bottom border on a table's final row. */
export function Td({ className, last = false, ...props }: ComponentProps<"td"> & { last?: boolean }) {
  return <td className={cn("px-4 py-3 align-middle text-ink", !last && "border-b border-line", className)} {...props} />;
}
