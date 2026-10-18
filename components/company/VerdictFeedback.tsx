"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";

type Rating = "correct" | "wrong";

/**
 * "Is this verdict right?" Users' ratings improve the fit model (product brief, section 6).
 * Kept in component state until the API can store ratings.
 */
export function VerdictFeedback() {
  const [rating, setRating] = useState<Rating | null>(null);
  const questionId = useId();

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p id={questionId} className="text-sm text-ink-muted">
        Is this verdict right?
      </p>
      <div role="group" aria-labelledby={questionId} className="flex gap-2">
        <Button size="sm" variant="secondary" pressed={rating === "correct"} onClick={() => setRating("correct")}>
          Correct
        </Button>
        <Button size="sm" variant="secondary" pressed={rating === "wrong"} onClick={() => setRating("wrong")}>
          Wrong
        </Button>
      </div>
      <p role="status" className="w-full text-xs text-ink-subtle empty:hidden">
        {rating && "Thanks. Your rating helps us improve fit verdicts."}
      </p>
    </div>
  );
}
