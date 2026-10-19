import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/layout/AppNav";
import { Logo } from "@/components/layout/Logo";
import { NavLinks, adminNavItems } from "@/components/layout/NavLinks";
import { Button } from "@/components/ui/Button";

/** Frame for the internal admin area: a dark header so it's never mistaken for the product. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="bg-ink">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 md:px-6">
          <div className="flex items-center gap-2">
            <Logo href="/admin" onDark />
            <span className="rounded-md bg-ink-muted px-2 py-0.5 text-xs font-semibold text-white">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <nav aria-label="Admin" className="overflow-x-auto">
              <Suspense fallback={<NavLinks layout="top" items={adminNavItems} activeHref={null} onDark />}>
                <AdminNav />
              </Suspense>
            </nav>
            {/* Logs out on the server too: the session is revoked, not just the cookie removed. */}
            <form action={logout}>
              <Button type="submit" size="sm" variant="inverse">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-12">{children}</main>
    </div>
  );
}
