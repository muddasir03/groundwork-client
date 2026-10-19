"use client";

import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { saveReport } from "@/app/admin/actions";
import { FormMessage } from "@/components/admin/FormMessage";
import { SectionTitle } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import {
  CLAIM_LISTS,
  type ClaimList,
  type EditorClaim,
  type EditorFact,
  type EditorState,
  FACT_LISTS,
  type FactList,
  removeSource,
  sectionLabel,
  toPayload,
} from "@/lib/admin/reportEditor";
import type { ActionResult } from "@/lib/admin/types";

const STATUS_OPTIONS = [
  { value: "verified", label: "Verified (has a source)" },
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "not_public", label: "Not public" },
];

/**
 * Edits a company's whole report and saves it in one go (the API replaces it atomically). Every
 * claim, fact and problem row cites sources with the chips under it.
 */
export function ReportEditor({ slug, initial }: { slug: string; initial: EditorState }) {
  const [state, setState] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [saving, startSaving] = useTransition();
  const nextKey = useRef(0);
  const newKey = (prefix: string) => `${prefix}-new-${(nextKey.current += 1)}`;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(next: EditorState) {
    setState(next);
    setDirty(true);
    setResult(null);
  }

  function save() {
    startSaving(async () => {
      const outcome = await saveReport(slug, toPayload(state));
      setResult(outcome);
      if (outcome.ok) setDirty(false);
    });
  }

  const sourceLabel = (ref: string) => {
    const index = state.sources.findIndex((s) => s.ref === ref);
    return `[${index + 1}] ${state.sources[index]?.title || "Untitled source"}`;
  };

  const picker = (label: string, refs: string[], onChange: (refs: string[]) => void) => (
    <div role="group" aria-label={`Sources for ${label}`} className="mt-2 flex flex-wrap gap-2">
      {state.sources.length === 0 ? (
        <p className="text-xs text-ink-subtle">Add sources below to cite them.</p>
      ) : (
        state.sources.map((source) => (
          <Chip
            key={source.ref}
            selected={refs.includes(source.ref)}
            onClick={() => onChange(refs.includes(source.ref) ? refs.filter((r) => r !== source.ref) : [...refs, source.ref])}
          >
            {sourceLabel(source.ref)}
          </Chip>
        ))
      )}
    </div>
  );

  const claimEditor = (claim: EditorClaim, label: string, onChange: (claim: EditorClaim) => void) => (
    <div>
      <TextAreaField label={label} value={claim.text} maxLength={2000} onChange={(e) => onChange({ ...claim, text: e.target.value })} />
      {picker(label, claim.sourceRefs, (sourceRefs) => onChange({ ...claim, sourceRefs }))}
    </div>
  );

  const setList = <K extends ClaimList | FactList>(key: K, items: EditorState[K]) => update({ ...state, [key]: items });

  return (
    <div className="space-y-4">
      <Card as="section">
        <SectionTitle>{sectionLabel.sources}</SectionTitle>
        <p className="mt-1 text-sm text-ink-muted">Every claim must cite at least one of these. Links must start with http:// or https://.</p>
        <ol className="mt-4 space-y-4">
          {state.sources.map((source, i) => (
            <li key={source.ref} className="rounded-lg border border-line p-3">
              <p className="mb-2 text-sm font-semibold text-ink">Source {i + 1}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <TextField label="Title" value={source.title} maxLength={300} onChange={(e) => update({ ...state, sources: state.sources.map((s) => (s.ref === source.ref ? { ...s, title: e.target.value } : s)) })} />
                <TextField label="Link" type="url" value={source.url} maxLength={2000} onChange={(e) => update({ ...state, sources: state.sources.map((s) => (s.ref === source.ref ? { ...s, url: e.target.value } : s)) })} />
                <SelectField
                  label="Date type"
                  value={source.dateKind}
                  options={[{ value: "published", label: "Published on" }, { value: "accessed", label: "Accessed on" }]}
                  onChange={(e) => update({ ...state, sources: state.sources.map((s) => (s.ref === source.ref ? { ...s, dateKind: e.target.value as typeof s.dateKind } : s)) })}
                />
                <TextField label="Date" type="date" value={source.date} onChange={(e) => update({ ...state, sources: state.sources.map((s) => (s.ref === source.ref ? { ...s, date: e.target.value } : s)) })} />
              </div>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => update(removeSource(state, source.ref))} aria-label={`Remove source ${i + 1}`}>
                Remove source
              </Button>
            </li>
          ))}
        </ol>
        <Button
          size="sm"
          variant="secondary"
          className="mt-4"
          onClick={() => update({ ...state, sources: [...state.sources, { ref: newKey("source"), title: "", url: "", dateKind: "accessed", date: new Date().toISOString().slice(0, 10) }] })}
        >
          + Add source
        </Button>
      </Card>

      <Card as="section" className="space-y-5">
        <SectionTitle>Overview</SectionTitle>
        {claimEditor(state.summary, sectionLabel.summary, (summary) => update({ ...state, summary }))}
        {claimEditor(state.problemsCore, sectionLabel.problemsCore, (problemsCore) => update({ ...state, problemsCore }))}
      </Card>

      <Card as="section">
        <SectionTitle>{sectionLabel.problems}</SectionTitle>
        <ol className="mt-4 space-y-4">
          {state.problems.map((row, i) => (
            <li key={row.key} className="rounded-lg border border-line p-3">
              <div className="grid gap-3 md:grid-cols-3">
                <TextField label="Who" value={row.who} maxLength={500} onChange={(e) => setProblem(i, { ...row, who: e.target.value })} />
                <TextField label="Problem" value={row.problem} maxLength={500} onChange={(e) => setProblem(i, { ...row, problem: e.target.value })} />
                <TextField label="Their solution" value={row.solution} maxLength={500} onChange={(e) => setProblem(i, { ...row, solution: e.target.value })} />
              </div>
              {picker(`problem ${i + 1}`, row.sourceRefs, (sourceRefs) => setProblem(i, { ...row, sourceRefs }))}
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => update({ ...state, problems: state.problems.filter((_, j) => j !== i) })} aria-label={`Remove problem ${i + 1}`}>
                Remove
              </Button>
            </li>
          ))}
        </ol>
        <Button size="sm" variant="secondary" className="mt-4" onClick={() => update({ ...state, problems: [...state.problems, { key: newKey("problem"), who: "", problem: "", solution: "", sourceRefs: [] }] })}>
          + Add problem
        </Button>
      </Card>

      {CLAIM_LISTS.map((list) => (
        <Card as="section" key={list}>
          <SectionTitle>{sectionLabel[list]}</SectionTitle>
          <ol className="mt-4 space-y-4">
            {state[list].map((claim, i) => (
              <li key={claim.key} className="rounded-lg border border-line p-3">
                {claimEditor(claim, `${sectionLabel[list]} ${i + 1}`, (next) => setList(list, state[list].map((c, j) => (j === i ? next : c))))}
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => setList(list, state[list].filter((_, j) => j !== i))} aria-label={`Remove ${sectionLabel[list]} ${i + 1}`}>
                  Remove
                </Button>
              </li>
            ))}
          </ol>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => setList(list, [...state[list], { key: newKey(list), text: "", sourceRefs: [] }])}>
            + Add to {sectionLabel[list].toLowerCase()}
          </Button>
        </Card>
      ))}

      {FACT_LISTS.map((list) => (
        <Card as="section" key={list}>
          <SectionTitle>{sectionLabel[list]}</SectionTitle>
          <p className="mt-1 text-sm text-ink-muted">Only verified facts have a value. Mark anything you can&apos;t confirm as Unconfirmed or Not public.</p>
          <ol className="mt-4 space-y-4">
            {state[list].map((fact, i) => (
              <li key={fact.key} className="rounded-lg border border-line p-3">
                <FactEditor
                  fact={fact}
                  label={`${sectionLabel[list]} ${i + 1}`}
                  onChange={(next) => setList(list, state[list].map((f, j) => (j === i ? next : f)))}
                  picker={picker}
                />
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => setList(list, state[list].filter((_, j) => j !== i))} aria-label={`Remove ${sectionLabel[list]} ${i + 1}`}>
                  Remove
                </Button>
              </li>
            ))}
          </ol>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => setList(list, [...state[list], { key: newKey(list), label: "", status: "verified", value: "", sourceRefs: [] }])}>
            + Add fact
          </Button>
        </Card>
      ))}

      <Card as="section">
        <SectionTitle>{sectionLabel.technologies}</SectionTitle>
        <TextAreaField className="mt-3" label="Technologies, one per line" rows={5} value={state.technologies} onChange={(e) => update({ ...state, technologies: e.target.value })} />
      </Card>

      <Card as="section">
        <SectionTitle>{sectionLabel.people}</SectionTitle>
        <p className="mt-1 text-sm text-ink-muted">Public information only. Never a private email or a guessed name.</p>
        <ol className="mt-4 space-y-4">
          {state.people.map((person, i) => (
            <li key={person.key} className="rounded-lg border border-line p-3">
              <div className="grid gap-3 md:grid-cols-3">
                <TextField label="Name" value={person.name} maxLength={120} hint="Leave empty if the name isn't public." onChange={(e) => setPerson(i, { ...person, name: e.target.value })} />
                <TextField label="Role" value={person.role} maxLength={150} onChange={(e) => setPerson(i, { ...person, role: e.target.value })} />
                <TextField label="Public profile link" type="url" value={person.profileUrl} maxLength={2000} onChange={(e) => setPerson(i, { ...person, profileUrl: e.target.value })} />
              </div>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => update({ ...state, people: state.people.filter((_, j) => j !== i) })} aria-label={`Remove person ${i + 1}`}>
                Remove
              </Button>
            </li>
          ))}
        </ol>
        <Button size="sm" variant="secondary" className="mt-4" onClick={() => update({ ...state, people: [...state.people, { key: newKey("person"), name: "", role: "", profileUrl: "" }] })}>
          + Add person
        </Button>
      </Card>

      {/* Sticky save bar: always reachable on long reports. */}
      <div className="sticky bottom-4 z-10 rounded-2xl border border-line bg-surface p-4 shadow-lg shadow-ink/10">
        <FormMessage result={result} className="mb-3" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{dirty ? "You have unsaved changes." : "All changes saved."}</p>
          <Button onClick={save} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save report"}
          </Button>
        </div>
      </div>
    </div>
  );

  function setProblem(index: number, row: EditorState["problems"][number]) {
    update({ ...state, problems: state.problems.map((p, j) => (j === index ? row : p)) });
  }

  function setPerson(index: number, person: EditorState["people"][number]) {
    update({ ...state, people: state.people.map((p, j) => (j === index ? person : p)) });
  }
}

type Picker = (label: string, refs: string[], onChange: (refs: string[]) => void) => ReactNode;

function FactEditor({ fact, label, onChange, picker }: { fact: EditorFact; label: string; onChange: (fact: EditorFact) => void; picker: Picker }) {
  const verified = fact.status === "verified";
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <TextField label="Label" value={fact.label} maxLength={100} onChange={(e) => onChange({ ...fact, label: e.target.value })} />
        <SelectField
          label="Status"
          value={fact.status}
          options={STATUS_OPTIONS}
          onChange={(e) => {
            const status = e.target.value as EditorFact["status"];
            // An unknown fact never keeps a value or sources.
            onChange(status === "verified" ? { ...fact, status } : { ...fact, status, value: "", sourceRefs: [] });
          }}
        />
        <TextField label="Value" value={fact.value} maxLength={500} disabled={!verified} hint={verified ? undefined : "Shown as “" + (fact.status === "not_public" ? "Not public" : "Unconfirmed") + "”"} onChange={(e) => onChange({ ...fact, value: e.target.value })} />
      </div>
      {verified && picker(label, fact.sourceRefs, (sourceRefs) => onChange({ ...fact, sourceRefs }))}
    </div>
  );
}
