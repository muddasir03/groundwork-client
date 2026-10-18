"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Approach, Person } from "@/lib/api/types";

/**
 * "How to approach": a proof-of-work idea, who to contact and a draft message. Generation will
 * call the API; for now the sample report has a prepared approach and other companies show that
 * it isn't available yet.
 */
export function ApproachCard({ approach, people }: { approach: Approach | null; people: Person[] }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const contact = approach && people.find((person) => person.id === approach.sendToPersonId);

  async function copyMessage() {
    if (!approach) return;
    try {
      await navigator.clipboard.writeText(approach.draftMessage);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-labelledby="approach-title" className="rounded-2xl bg-ink p-5 text-white">
      <h2 id="approach-title" className="text-lg font-semibold">
        {shown ? "Your approach" : "How to approach"}
      </h2>

      {!shown && (
        <>
          <p className="mt-2 text-sm text-line">
            Get a proof-of-work idea built on their real gaps, the best person to contact and a draft message.
          </p>
          <Button variant="inverse" fullWidth className="mt-4" disabled={!approach} onClick={() => setShown(true)}>
            Generate my approach
          </Button>
          {!approach && <p className="mt-2 text-center text-xs text-line">Not available for this company yet.</p>}
        </>
      )}

      {shown && approach && (
        <div className="mt-3 space-y-4">
          <div>
            <Eyebrow tone="onDark">Proof of work</Eyebrow>
            <p className="mt-1 text-sm">{approach.proofOfWork}</p>
          </div>
          {contact && (
            <div>
              <Eyebrow tone="onDark">Send to</Eyebrow>
              <p className="mt-1 text-sm">
                {contact.name ?? "Name not public"}, {contact.role}
              </p>
            </div>
          )}
          <p className="rounded-lg bg-ink-muted p-3 text-sm">{approach.draftMessage}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="inverse" onClick={copyMessage}>
              Copy message
            </Button>
            <Button variant="dark" className="border border-ink-subtle" onClick={() => setShown(false)}>
              Close
            </Button>
          </div>
          <p role="status" className="text-xs text-line empty:hidden">
            {copied && "Message copied."}
          </p>
        </div>
      )}
    </section>
  );
}
