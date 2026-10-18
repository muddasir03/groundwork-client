import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centres page content at the product's max width, with the standard side padding. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>{children}</div>;
}

/** The title block at the top of every page: display-font title, optional description and actions. */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pt-8 pb-6 md:flex-row md:items-end md:justify-between md:pt-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-base text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}

/** A section heading inside a card ("At a glance", "Senior people"). */
export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-xl font-semibold text-ink", className)}>{children}</h2>;
}
