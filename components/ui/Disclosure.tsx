"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A report section that collapses into a row on mobile ("Clients and competitors ›") and is
 * always open from `md` up, where it shows `title` as a normal section heading.
 */
export function Disclosure({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <section className={cn("rounded-2xl border border-line bg-surface", className)}>
      <h2 className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen(!open)}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left text-base font-semibold text-ink"
        >
          {title}
          <span aria-hidden="true" className={cn("text-ink-subtle transition-transform", open && "rotate-90")}>
            ›
          </span>
        </button>
      </h2>
      <h2 className="hidden px-5 pt-5 text-xl font-semibold text-ink md:block">{title}</h2>
      <div id={contentId} className={cn("px-4 pb-4 md:block md:px-5 md:pt-3 md:pb-5", open ? "block" : "hidden")}>
        {children}
      </div>
    </section>
  );
}
