"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { id: string; label: string; content: ReactNode };

type TabsProps = {
  label: string;
  items: TabItem[];
  /**
   * `mobile`: tabs on small screens only; from `md` up every panel is shown and the tab bar hidden
   * (the company page). `always`: tabs at every size.
   */
  mode?: "mobile" | "always";
  /** Classes for the wrapper around the panels, e.g. a desktop grid. */
  panelsClassName?: string;
  /** Extra classes per panel id, e.g. desktop grid placement. A plain object, not a function, so
   *  Server Components can pass it. */
  panelClassNames?: Record<string, string>;
};

/** Accessible tabs (arrow keys move between tabs), with the underline style from the designs. */
export function Tabs({ label, items, mode = "always", panelsClassName, panelClassNames }: TabsProps) {
  const [active, setActive] = useState(items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(items[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className={cn("flex border-b border-line bg-surface", mode === "mobile" && "md:hidden")}>
        {items.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "min-h-12 flex-1 border-b-2 px-3 text-sm",
                selected ? "border-primary font-semibold text-primary" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className={panelsClassName}>
        {items.map((item) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            className={cn(item.id === active ? "block" : "hidden", mode === "mobile" && "md:block", panelClassNames?.[item.id])}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
