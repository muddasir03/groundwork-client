"use client";

import { Container } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

// Shown when a signed-in page can't load its data, most often because the API (on Render's free
// plan) is waking up after being idle. The technical error stays in the server logs.
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="pt-12">
      <EmptyState
        title="We couldn't load this page"
        action={
          <div className="flex gap-3">
            <Button onClick={() => reset()}>Try again</Button>
            <ButtonLink href="/" variant="secondary">
              Go home
            </ButtonLink>
          </div>
        }
      >
        The research service may be waking up after a quiet period. This usually takes under a minute.
      </EmptyState>
    </Container>
  );
}
