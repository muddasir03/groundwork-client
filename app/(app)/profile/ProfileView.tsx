"use client";

import { useState } from "react";
import { Container, PageHeader, SectionTitle } from "@/components/layout/Page";
import { Badge, Tag } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, Inset } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { TextField } from "@/components/ui/Field";
import { DocumentIcon } from "@/components/ui/icons";
import type { Profile } from "@/lib/api/types";

type ProfileViewProps = {
  profile: Profile;
  options: { countries: string[]; sectors: string[] };
};

/**
 * Step 2 of onboarding: review what was extracted from the CV and links, and choose targets.
 * Saving, uploading and editing need accounts and CV storage in the API; until then the targets
 * are local and those actions are disabled.
 */
export function ProfileView({ profile, options }: ProfileViewProps) {
  const [countries, setCountries] = useState(profile.targetCountries);
  const [sectors, setSectors] = useState(profile.targetSectors);
  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  const { extracted } = profile;

  return (
    <Container>
      <PageHeader
        title="Your profile"
        description="Every fit verdict is based on this. Check what we extracted and correct anything wrong."
        actions={<Badge tone="warning">Step 2 of 2 · Confirm</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-6">
        <div className="space-y-4">
          <Card as="section">
            <SectionTitle>CV</SectionTitle>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-line-strong p-4">
              <DocumentIcon className="size-7 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{profile.cv?.fileName ?? "No CV uploaded"}</p>
                <p className="text-xs text-ink-subtle">{profile.cv ? "Uploaded · Profile extracted" : "Upload a PDF to start"}</p>
              </div>
              <Button size="sm" variant="secondary" disabled>
                Replace
              </Button>
            </div>
          </Card>

          <Card as="section">
            <SectionTitle>Links</SectionTitle>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <TextField label="GitHub" defaultValue={profile.links.github} placeholder="github.com/username" />
              <TextField label="GitLab" defaultValue={profile.links.gitlab} placeholder="gitlab.com/username" />
              <TextField label="LinkedIn" defaultValue={profile.links.linkedin} placeholder="linkedin.com/in/username" />
              <TextField label="Portfolio" defaultValue={profile.links.portfolio} placeholder="yoursite.com" />
            </div>
          </Card>

          <Card as="section">
            <SectionTitle>What you are looking for</SectionTitle>
            <ChipGroup label="Target countries" values={options.countries} selected={countries} onToggle={(v) => setCountries(toggle(countries, v))} />
            <ChipGroup label="Target sectors" values={options.sectors} selected={sectors} onToggle={(v) => setSectors(toggle(sectors, v))} />
          </Card>
        </div>

        <Card as="section" highlight="primary">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>Extracted profile</SectionTitle>
            <Button size="sm" variant="secondary" disabled>
              Edit
            </Button>
          </div>
          <p className="mt-1 text-sm text-ink-muted">From your CV and GitHub. Correct anything wrong before confirming.</p>
          <dl className="mt-4 grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2.5 text-sm">
            <dt className="text-ink-muted">Role</dt>
            <dd className="font-semibold text-ink">{extracted.role}</dd>
            <dt className="text-ink-muted">Experience</dt>
            <dd className="font-semibold text-ink">{extracted.experience}</dd>
            <dt className="text-ink-muted">Location</dt>
            <dd className="font-semibold text-ink">{extracted.location}</dd>
            <dt className="text-ink-muted">Open to relocation</dt>
            <dd className="font-semibold text-ink">{extracted.openToRelocation ? "Yes" : "No"}</dd>
            <dt className="text-ink-muted">Work mode</dt>
            <dd className="font-semibold text-ink">{extracted.workMode}</dd>
            <dt className="text-ink-muted">Languages</dt>
            <dd className="font-semibold text-ink">{extracted.languages.join(", ")}</dd>
          </dl>
          <p className="mt-5 text-sm font-semibold text-ink">Skills</p>
          <ul aria-label="Skills" className="mt-2 flex flex-wrap gap-2">
            {extracted.skills.map((skill) => (
              <li key={skill.name}>
                <Tag>
                  {skill.name}
                  {skill.years !== null && ` · ${skill.years} yrs`}
                </Tag>
              </li>
            ))}
          </ul>
          {extracted.githubSummary && <Inset className="mt-4">From GitHub: {extracted.githubSummary}</Inset>}
          <ButtonLink href="/search" size="lg" fullWidth className="mt-5">
            Confirm and see companies
          </ButtonLink>
          <p className="mt-2 text-center text-xs text-ink-subtle">Uploading, editing and saving arrive with accounts.</p>
        </Card>
      </div>
    </Container>
  );
}

function ChipGroup({ label, values, selected, onToggle }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div role="group" aria-label={label} className="mt-4">
      <p className="mb-2 text-sm text-ink-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Chip key={value} selected={selected.includes(value)} onClick={() => onToggle(value)}>
            {value}
          </Chip>
        ))}
      </div>
    </div>
  );
}
