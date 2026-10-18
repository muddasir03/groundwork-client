import { cn } from "@/lib/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

const markSizes = {
  sm: "size-10 rounded-lg text-sm",
  md: "size-12 rounded-xl text-base",
  lg: "size-14 rounded-xl text-xl",
} as const;

/** A company's dark letter tile. Decorative: the company name is always shown next to it. */
export function CompanyMark({ name, size = "md", className }: { name: string; size?: keyof typeof markSizes; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center bg-ink font-bold text-white", markSizes[size], className)}
    >
      {name.trim()[0]?.toUpperCase()}
    </span>
  );
}

const avatarSizes = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
} as const;

/** A person's initials in a circle: `soft` for people at a company, `ink` for the signed-in user. */
export function Avatar({ name, tone = "soft", size = "md", className }: { name: string; tone?: "soft" | "ink"; size?: keyof typeof avatarSizes; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        tone === "soft" ? "bg-primary-soft text-primary" : "bg-ink text-white",
        avatarSizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
