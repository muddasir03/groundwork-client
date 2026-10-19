import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container, PageHeader, SectionTitle } from "@/components/layout/Page";
import { Badge, Tag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, Inset } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Disclosure } from "@/components/ui/Disclosure";
import { EmptyState } from "@/components/ui/EmptyState";
import { FactValue } from "@/components/ui/FactValue";
import { StatTile } from "@/components/ui/StatTile";
import { Table, TableFrame, Td, Th } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { FitBadge } from "@/components/ui/FitBadge";
import { FitReasons } from "@/components/ui/FitReasons";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import { Avatar, CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";
import { ScoreBreakdown } from "@/components/ui/ScoreBreakdown";

// A living reference of Groundwork's tokens and components (see docs/DESIGN.md).
// Every reusable UI piece appears here; check it before building a screen.
// All content on this page is illustrative and fictional.

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colours = [
  { token: "canvas", className: "bg-canvas", use: "Page background" },
  { token: "surface", className: "bg-surface", use: "Cards" },
  { token: "fill", className: "bg-fill", use: "Insets inside cards" },
  { token: "line", className: "bg-line", use: "Borders, dividers" },
  { token: "ink", className: "bg-ink", use: "Text, dark panels, company marks" },
  { token: "ink-muted", className: "bg-ink-muted", use: "Secondary text" },
  { token: "ink-subtle", className: "bg-ink-subtle", use: "Meta text, weak fit" },
  { token: "primary", className: "bg-primary", use: "Cobalt: main actions, links, active nav" },
  { token: "primary-soft", className: "bg-primary-soft", use: "Selected states" },
  { token: "success", className: "bg-success", use: "Strong fit, published" },
  { token: "success-soft", className: "bg-success-soft", use: "Strong fit badge" },
  { token: "warning", className: "bg-warning", use: "Possible fit, in review" },
  { token: "warning-soft", className: "bg-warning-soft", use: "Possible fit badge" },
  { token: "neutral-soft", className: "bg-neutral-soft", use: "Weak fit, draft" },
];

const sampleBreakdown = [
  { label: "Technical stack", value: 36, max: 40 },
  { label: "Seniority", value: 14, max: 20 },
  { label: "Location and work mode", value: 12, max: 20 },
  { label: "Languages", value: 10, max: 10 },
  { label: "Sector interest", value: 10, max: 10 },
];

export default function DesignSystemPage() {
  return (
    <Container>
      <PageHeader
        title="Design system"
        description="Groundwork's colours, type and components. Build every screen from these."
      />

      <div className="space-y-6">
        <Section title="Colour tokens">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {colours.map((colour) => (
              <li key={colour.token} className="flex items-center gap-3">
                <span className={`size-10 shrink-0 rounded-lg border border-line ${colour.className}`} />
                <span className="text-sm">
                  <code className="font-semibold text-ink">{colour.token}</code>
                  <span className="block text-xs text-ink-subtle">{colour.use}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Typography">
          <div className="space-y-3">
            <p className="font-display text-4xl font-extrabold tracking-tight">Page title · display font</p>
            <p className="text-xl font-semibold">Section title</p>
            <p className="text-base text-ink">Body text in IBM Plex Sans, for reports and descriptions.</p>
            <p className="text-sm text-ink-muted">Secondary text</p>
            <div className="flex flex-wrap gap-4">
              <Eyebrow>Eyebrow · primary</Eyebrow>
              <Eyebrow tone="success">Why you match</Eyebrow>
              <Eyebrow tone="warning">Gaps to plan for</Eyebrow>
              <Eyebrow tone="subtle">Subtle</Eyebrow>
            </div>
            <ResearchMeta researchedAt="2026-09-30" sourceCount={18} />
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="dark">Dark</Button>
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" pressed>
              Pressed (toggle on)
            </Button>
          </div>
          <div className="mt-4 rounded-2xl bg-ink p-5">
            <Eyebrow tone="onDark">Eyebrow on dark</Eyebrow>
            <Button variant="inverse" className="mt-3">
              Inverse, on a dark panel
            </Button>
          </div>
        </Section>

        <Section title="Fit">
          <div className="flex flex-wrap items-center gap-3">
            <FitBadge band="strong" score={82} />
            <FitBadge band="possible" score={64} />
            <FitBadge band="weak" score={44} />
            <FitBadge band="strong" score={82} format="short" />
            <FitBadge band="strong" score={82} format="score" />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card highlight="strong">
              <div className="flex items-center gap-4">
                <FitScoreRing score={82} band="strong" />
                <div>
                  <p className="text-xs text-ink-subtle">Your fit</p>
                  <p className="font-display text-2xl font-extrabold text-success">Strong fit</p>
                </div>
              </div>
              <ScoreBreakdown className="mt-4" band="strong" items={sampleBreakdown} />
              <FitReasons
                className="mt-4"
                matches={["Their core stack matches yours", "They hire on skills, not years"]}
                gaps={["Office-first: relocation needed"]}
              />
            </Card>
            <Card highlight="possible">
              <div className="flex items-center gap-4">
                <FitScoreRing score={64} band="possible" size="lg" />
                <p className="font-display text-2xl font-extrabold text-warning">Possible fit</p>
              </div>
              <ScoreBreakdown className="mt-4" band="possible" showBars items={sampleBreakdown.slice(0, 3)} />
            </Card>
          </div>
        </Section>

        <Section title="Badges, tags and chips">
          <div className="flex flex-wrap gap-2">
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">In review</Badge>
            <Badge tone="primary">Contacted</Badge>
            <Badge>Draft</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>Barcelona, Spain</Tag>
            <Tag>HR tech</Tag>
            <Tag highlighted>Ruby on Rails ✓</Tag>
            <Tag>TypeScript</Tag>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip selected>Spain</Chip>
            <Chip>Netherlands</Chip>
            <Chip variant="add">+ Add country</Chip>
          </div>
        </Section>

        <Section title="Facts and stats">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile definition label="Founded">
              <FactValue fact={{ label: "Founded", value: "2018", status: "verified", sourceIds: [] }} />
            </StatTile>
            <StatTile definition label="Pay">
              <FactValue fact={{ label: "Pay", value: null, status: "not_public", sourceIds: [] }} />
            </StatTile>
            <StatTile definition label="Relocation support">
              <FactValue fact={{ label: "Relocation support", value: null, status: "unconfirmed", sourceIds: [] }} />
            </StatTile>
          </dl>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            <StatTile variant="card" definition label="Published">
              6 <span className="text-base font-semibold text-ink-subtle">of 9</span>
            </StatTile>
            <StatTile variant="card" definition label="Waiting for review">
              1
            </StatTile>
          </dl>
        </Section>

        <Section title="Tabs, disclosure and tables">
          <Tabs
            label="Example tabs"
            items={[
              { id: "report", label: "Report", content: <p className="pt-4 text-sm">Report panel</p> },
              { id: "fit", label: "Your fit", content: <p className="pt-4 text-sm">Fit panel</p> },
              { id: "people", label: "People", content: <p className="pt-4 text-sm">People panel</p> },
            ]}
          />
          <div className="mt-6">
            <Disclosure title="Clients and competitors">
              <p className="text-sm">Collapsed into a row on mobile, always open from md up.</p>
            </Disclosure>
          </div>
          <TableFrame className="mt-6">
            <Table>
              <thead>
                <tr>
                  <Th>Company</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Example Analytics</Td>
                  <Td>
                    <Badge tone="success">Published</Badge>
                  </Td>
                </tr>
                <tr>
                  <Td last>Sample Labs</Td>
                  <Td last>
                    <Badge tone="warning">In review</Badge>
                  </Td>
                </tr>
              </tbody>
            </Table>
          </TableFrame>
          <div className="mt-6">
            <EmptyState title="Your shortlist is empty" action={<Button>Find companies</Button>}>
              Empty lists say what is missing and offer the next step.
            </EmptyState>
          </div>
        </Section>

        <Section title="Identity">
          <div className="flex flex-wrap items-center gap-4">
            <CompanyMark name="Example Analytics" size="sm" />
            <CompanyMark name="Example Analytics" />
            <CompanyMark name="Example Analytics" size="lg" />
            <Avatar name="Alex Rivera" />
            <Avatar name="Sam Example" tone="ink" />
          </div>
        </Section>

        <Section title="Cards and form fields">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="flex items-start gap-3">
                <CompanyMark name="Example Analytics" />
                <div className="flex-1">
                  <p className="font-semibold text-ink">Example Analytics</p>
                  <p className="text-sm text-ink-subtle">Valencia · Data tools</p>
                </div>
                <FitBadge band="strong" score={78} />
              </div>
              <p className="mt-3 text-sm text-ink">A fictional company used to show the company card.</p>
              <Inset className="mt-3">Matches their stack · Relocation needed</Inset>
              <ResearchMeta className="mt-3" researchedAt="2026-09-30" sourceCount={12} />
            </Card>
            <Card highlight="primary">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="GitHub" placeholder="github.com/username" hint="Optional helper text sits under the field." />
                <SelectField
                  label="Country"
                  options={[
                    { value: "es", label: "Spain" },
                    { value: "de", label: "Germany" },
                  ]}
                />
              </div>
              <TextAreaField className="mt-4" label="Summary" placeholder="Two or three sentences…" />
              <TextField className="mt-4" label="Disabled" value="Not editable" disabled readOnly />
              <ResearchMeta className="mt-4" variant="highlight" researchedAt="2026-09-30" sourceCount={18} />
            </Card>
          </div>
        </Section>
      </div>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card as="section" padding="lg">
      <SectionTitle className="mb-4">{title}</SectionTitle>
      {children}
    </Card>
  );
}
