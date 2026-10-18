import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";
import { BookmarkIcon, CompareIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

export type NavItem = { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

/** The signed-in app's sections, in the order shown in the designs. */
export const appNavItems: NavItem[] = [
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/shortlist", label: "Shortlist", icon: BookmarkIcon },
  { href: "/compare", label: "Compare", icon: CompareIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

/** The item for a pathname: an exact match or any page below it (/search/... → Search). */
export function activeNavHref(pathname: string | null, items: NavItem[] = appNavItems): string | null {
  if (!pathname) return null;
  return items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href ?? null;
}

type NavLinksProps = { activeHref: string | null; layout: "top" | "bottom"; items?: NavItem[] };

/** Renders the nav for a known active item. Pure, so it can render on the server as a fallback. */
export function NavLinks({ activeHref, layout, items = appNavItems }: NavLinksProps) {
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
                    active ? "bg-primary-soft font-semibold text-primary" : "text-ink-muted hover:text-ink",
                  ),
                layout === "bottom" &&
                  cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                    active ? "font-semibold text-primary" : "text-ink-subtle",
                  ),
              )}
            >
              {layout === "bottom" && <Icon className="size-6" />}
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
