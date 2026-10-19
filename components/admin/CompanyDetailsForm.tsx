"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { companySizeLabel } from "@/components/company/labels";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import type { ActionResult } from "@/lib/admin/types";
import type { CompanySize } from "@/lib/api/types";

export type CompanyDetails = {
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  sector: string;
  size: CompanySize;
  stage: string | null;
  researchedAt: string | null;
  peopleVerifiedAt: string | null;
};

type Action = (previous: ActionResult | null, form: FormData) => Promise<ActionResult>;

const sizes = Object.entries(companySizeLabel).map(([value, label]) => ({ value, label }));

/** Create a company (`mode="create"`, slug editable) or edit its details (slug fixed). */
export function CompanyDetailsForm({ action, mode, initial }: { action: Action; mode: "create" | "edit"; initial?: CompanyDetails }) {
  const [result, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage result={result} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={initial?.name} required maxLength={120} />
        {mode === "create" ? (
          <TextField label="URL name (slug)" name="slug" required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Lowercase words joined by hyphens, e.g. brisa-people. Can't be changed later." />
        ) : (
          <TextField label="URL name (slug)" name="slug-display" defaultValue={initial?.slug} disabled hint="Fixed after creation, so links keep working." />
        )}
        <TextField className="sm:col-span-2" label="One-line description" name="description" defaultValue={initial?.description} required maxLength={300} />
        <TextField label="City" name="city" defaultValue={initial?.city} required maxLength={120} />
        <TextField label="Country" name="country" defaultValue={initial?.country ?? "Spain"} required maxLength={120} />
        <TextField label="Sector" name="sector" defaultValue={initial?.sector} required maxLength={120} />
        <SelectField label="Company size" name="size" defaultValue={initial?.size ?? "51-200"} options={sizes} />
        <TextField label="Stage" name="stage" defaultValue={initial?.stage ?? ""} maxLength={120} hint="Optional, e.g. Series B." />
        {mode === "edit" && (
          <>
            <TextField label="Researched on" name="researchedAt" type="date" defaultValue={initial?.researchedAt ?? ""} hint="Required before publishing." />
            <TextField label="People verified on" name="peopleVerifiedAt" type="date" defaultValue={initial?.peopleVerifiedAt ?? ""} />
          </>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : mode === "create" ? "Create draft" : "Save details"}
      </Button>
    </form>
  );
}
