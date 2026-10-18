"use client";

import { Button } from "@/components/ui/Button";
import type { ShortlistEntry } from "@/lib/api/types";
import { useCompare, useShortlist } from "@/lib/store/hooks";

/** Compare and Save on the company page, backed by the browser-stored selections. */
export function CompanyActions({ slug, name, initialShortlist }: { slug: string; name: string; initialShortlist: ShortlistEntry[] }) {
  const compare = useCompare();
  const shortlist = useShortlist(initialShortlist);
  const compared = compare.slugs.includes(slug);
  const saved = shortlist.isSaved(slug);

  return (
    <div className="flex gap-2">
      <Button variant="secondary" pressed={compared} disabled={!compared && compare.isFull} onClick={() => compare.toggle(slug)} aria-label={`Compare ${name}`}>
        Compare
      </Button>
      <Button pressed={saved} onClick={() => shortlist.toggle(slug)}>
        Save to shortlist
      </Button>
    </div>
  );
}
