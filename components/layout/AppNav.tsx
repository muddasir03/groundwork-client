"use client";

import { usePathname } from "next/navigation";
import { NavLinks, activeNavHref } from "@/components/layout/NavLinks";

/**
 * Highlights the current section. With Cache Components on, usePathname suspends on routes with
 * unknown dynamic params (e.g. /companies/[slug]), so AppShell renders this inside Suspense with a
 * server-rendered NavLinks fallback.
 */
export function AppNav({ layout }: { layout: "top" | "bottom" }) {
  const pathname = usePathname();
  return <NavLinks layout={layout} activeHref={activeNavHref(pathname)} />;
}
