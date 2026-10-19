"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/admin/FormMessage";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/lib/admin/types";
import type { AdminCompanyStatus } from "@/lib/api/types";

type Action = (previous: ActionResult | null, form: FormData) => Promise<ActionResult>;

// The moves the API allows from each status (Research::ChangeStatus). Shown here for convenience;
// the API enforces them.
const moves: Record<AdminCompanyStatus, Array<{ to: AdminCompanyStatus; label: string; primary?: boolean }>> = {
  draft: [{ to: "researching", label: "Start research", primary: true }],
  researching: [
    { to: "in_review", label: "Send for review", primary: true },
    { to: "draft", label: "Back to draft" },
  ],
  in_review: [
    { to: "published", label: "Publish", primary: true },
    { to: "researching", label: "Send back to research" },
  ],
  published: [{ to: "in_review", label: "Unpublish" }],
};

/** Moves a company through the research pipeline. Publishing makes the report public. */
export function StatusActions({ status, action }: { status: AdminCompanyStatus; action: Action }) {
  const [result, formAction, pending] = useActionState(action, null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {moves[status].map((move) => (
          <form key={move.to} action={formAction}>
            <input type="hidden" name="status" value={move.to} />
            <Button type="submit" variant={move.primary ? "primary" : "secondary"} disabled={pending}>
              {move.label}
            </Button>
          </form>
        ))}
      </div>
      <FormMessage result={result} />
    </div>
  );
}
