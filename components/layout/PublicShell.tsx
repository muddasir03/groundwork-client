import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Page";
import { ButtonLink } from "@/components/ui/Button";

/** Frame for public pages (landing, log in, sample report): header with sign-up, and the footer. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            href={publicLinks.sampleReport}
            className="hidden min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:text-ink sm:inline-flex"
          >
            Sample report
          </Link>
          <Link
            href={publicLinks.logIn}
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:text-ink"
          >
            Log in
          </Link>
          <ButtonLink href={publicLinks.getStarted}>Get started</ButtonLink>
        </nav>
      </Container>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-2 py-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>Groundwork (working name)</p>
        <p>Public information only · You can delete your data at any time</p>
      </Container>
    </footer>
  );
}

/** Where the public calls to action lead. Kept in one place so they change together. */
export const publicLinks = {
  getStarted: "/profile",
  logIn: "/login",
  sampleReport: "/sample-report",
} as const;
