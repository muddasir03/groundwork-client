import { Card } from "@/components/ui/Card";
import { claimStatusLabel } from "@/components/ui/FactValue";
import { Avatar } from "@/components/ui/Identity";
import { SectionTitle } from "@/components/layout/Page";
import type { Person } from "@/lib/api/types";
import { formatResearchDate } from "@/lib/format";

/** Senior people worth contacting. Public profiles only, and never a guessed name. */
export function PeopleCard({ people, verifiedAt }: { people: Person[]; verifiedAt: string }) {
  return (
    <Card as="section">
      <SectionTitle className="hidden md:block">Senior people</SectionTitle>
      <ul className="divide-y divide-line md:mt-3">
        {people.map((person) => (
          <li key={person.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 md:first:pt-3">
            <Avatar name={person.name ?? person.role} />
            <div className="min-w-0 flex-1">
              <p className={person.name ? "text-sm font-semibold text-ink" : "text-sm text-ink-subtle italic"}>
                {person.name ?? `Name ${claimStatusLabel.not_public.toLowerCase()}`}
              </p>
              <p className="text-xs text-ink-subtle">{person.role}</p>
            </div>
            {person.profileUrl && (
              <a
                href={person.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-line-strong px-3 text-xs font-semibold text-ink hover:bg-fill"
              >
                Profile <span aria-hidden="true">&nbsp;↗</span>
                <span className="sr-only">: {person.name}, opens in a new tab</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-subtle">
        Public profiles only. Verified <time dateTime={verifiedAt}>{formatResearchDate(verifiedAt)}</time>.
      </p>
    </Card>
  );
}
