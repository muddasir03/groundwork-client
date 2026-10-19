import { Container } from "@/components/layout/Page";

// Shown while an admin page verifies the session and loads data (every admin page reads the
// session cookie at request time).
export default function LoadingAdmin() {
  return (
    <Container className="pt-10">
      <div role="status" aria-label="Loading" className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded-lg bg-line" />
        <div className="h-64 rounded-2xl border border-line bg-surface" />
      </div>
    </Container>
  );
}
