"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ShortlistEntry } from "@/lib/api/types";
import { type LocalStore, createLocalStore } from "@/lib/store/localStore";

export const MAX_COMPARE = 3;

const compareStore = createLocalStore<string[]>("groundwork:compare");
const shortlistStore = createLocalStore<ShortlistEntry[]>("groundwork:shortlist");

function useLocalStore<T>(store: LocalStore<T>, fallback: T): T {
  const stored = useSyncExternalStore(store.subscribe, store.read, () => null);
  return stored ?? fallback;
}

const noSlugs: string[] = [];

/** The companies picked for comparison (up to three). */
export function useCompare() {
  const slugs = useLocalStore(compareStore, noSlugs);

  const toggle = useCallback(
    (slug: string) => {
      if (slugs.includes(slug)) compareStore.write(slugs.filter((s) => s !== slug));
      else if (slugs.length < MAX_COMPARE) compareStore.write([...slugs, slug]);
    },
    [slugs],
  );

  const remove = useCallback((slug: string) => compareStore.write(slugs.filter((s) => s !== slug)), [slugs]);

  return { slugs, toggle, remove, isFull: slugs.length >= MAX_COMPARE };
}

/** The saved companies. Starts from `initial` until the visitor changes it. */
export function useShortlist(initial: ShortlistEntry[]) {
  const entries = useLocalStore(shortlistStore, initial);

  const isSaved = useCallback((slug: string) => entries.some((entry) => entry.slug === slug), [entries]);

  const toggle = useCallback(
    (slug: string) => {
      if (entries.some((entry) => entry.slug === slug)) {
        shortlistStore.write(entries.filter((entry) => entry.slug !== slug));
      } else {
        // Called from click handlers only, so reading the clock can't cause a hydration mismatch.
        const today = new Date().toISOString().slice(0, 10);
        shortlistStore.write([...entries, { slug, status: "researching", notes: "", updatedAt: today }]);
      }
    },
    [entries],
  );

  return { entries, isSaved, toggle };
}
