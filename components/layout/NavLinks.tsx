import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";
import { BookmarkIcon, CompareIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

/** `icon` is shown in the mobile bottom bar only. `alsoActiveOn` lists other paths that belong to this section. */
export type NavItem = { href: string; label: string; icon?: ComponentType<SVGProps<SVGSVGElement>>; alsoActiveOn?: string[] };

/** The signed-in app's sections, in the order shown in the designs. */
export const appNavItems: NavItem[] = [
  // Company pages are reached from Search, so Search stays highlighted on them.
  { href: "/search", label: "Search", icon: SearchIcon, alsoActiveOn: ["/companies"] },
  { href: "/shortlist", label: "Shortlist", icon: BookmarkIcon },
  { href: "/compare", label: "Compare", icon: CompareIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

/** Sections of the internal admin area. */
export const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Companies" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/verdict-feedback", label: "Verdict feedback" },
  { href: "/admin/ai-usage", label: "AI usage" },
];

/**
 * The item for a pathname: an exact match or any page below it (/search/... → Search). The longest
 * match wins, so /admin/contacts selects Contacts, not Companies (/admin).
 */
export function activeNavHref(pathname: string | null, items: NavItem[] = appNavItems): string | null {
  if (!pathname) return null;
  const within = (base: string) => pathname === base || pathname.startsWith(`${base}/`);
  const matches = items.flatMap((item) =>
    [item.href, ...(item.alsoActiveOn ?? [])].filter(within).map((base) => ({ href: item.href, length: base.length })),
  );
  return matches.sort((a, b) => b.length - a.length)[0]?.href ?? null;
}

type NavLinksProps = { activeHref: string | null; layout: "top" | "bottom"; items?: NavItem[]; onDark?: boolean };

/** Renders the nav for a known active item. Pure, so it can render on the server as a fallback. */
export function NavLinks({ activeHref, layout, items = appNavItems, onDark = false }: NavLinksProps) {
  return (
    <ul className={cn(layout === "top" ? "flex items-center gap-1" : "grid grid-cols-4")}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === activeHref;
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                layout === "top" &&
                  cn(
                    "inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium",
                    onDark
                      ? active ? "bg-white font-semibold text-ink" : "text-line hover:text-white"
                      : active ? "bg-primary-soft font-semibold text-primary" : "text-ink-muted hover:text-ink",
                  ),
                layout === "bottom" &&
                  cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                    active ? "font-semibold text-primary" : "text-ink-subtle",
                  ),
              )}
            >
              {layout === "bottom" && Icon && <Icon className="size-6" />}
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
