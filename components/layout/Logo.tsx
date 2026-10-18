import Link from "next/link";
import { cn } from "@/lib/cn";

/** The Groundwork mark and wordmark. `onDark` for the admin header. */
export function Logo({ href = "/", onDark = false }: { href?: string; onDark?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-md">
      <span
        aria-hidden="true"
        className={cn("inline-flex size-7 items-center justify-center rounded-md", onDark ? "bg-white" : "bg-primary")}
      >
        <svg viewBox="0 0 16 16" className={cn("size-4", onDark ? "text-ink" : "text-white")}>
          <path d="M3 4h7M3 8h10M3 12h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn("font-display text-lg font-extrabold", onDark ? "text-white" : "text-ink")}>Groundwork</span>
    </Link>
  );
}
