"use client";

import { usePathname } from "next/navigation";
import { NavLinks, activeNavHref, adminNavItems } from "@/components/layout/NavLinks";

// These read the pathname to highlight the current section. With Cache Components on,
// usePathname suspends on routes with unknown dynamic params (e.g. /companies/[slug]), so the
// shells render them inside Suspense with a server-rendered NavLinks fallback.
// Nav items are imported here, not passed as props: icon components can't cross from a Server
// Component to a Client Component.

export function AppNav({ layout }: { layout: "top" | "bottom" }) {
  const pathname = usePathname();
  return <NavLinks layout={layout} activeHref={activeNavHref(pathname)} />;
}

export function AdminNav() {
  const pathname = usePathname();
  return <NavLinks layout="top" items={adminNavItems} activeHref={activeNavHref(pathname, adminNavItems)} onDark />;
}
