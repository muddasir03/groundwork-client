import { Suspense, type ReactNode } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { SampleDataBanner } from "@/components/layout/SampleDataBanner";

/**
 * Frame for the signed-in product: a top bar with the logo and sections on desktop, and a bottom
 * tab bar on mobile (as in the designs). Page content goes inside `<Container>`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="hidden border-b border-line bg-surface md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav aria-label="Main">
            <Suspense fallback={<NavLinks layout="top" activeHref={null} />}>
              <AppNav layout="top" />
            </Suspense>
          </nav>
        </div>
      </header>

      <SampleDataBanner />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <Suspense fallback={<NavLinks layout="bottom" activeHref={null} />}>
          <AppNav layout="bottom" />
        </Suspense>
      </nav>
    </div>
  );
}
