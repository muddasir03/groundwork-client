import { Container } from "@/components/layout/Page";

// Shown instantly while a company page loads. It also gives the page's `params` access a
// Suspense boundary, which Next.js needs for instant navigation with Cache Components.
export default function LoadingCompany() {
  return (
    <Container className="pt-4 md:pt-8">
      <div role="status" aria-label="Loading company" className="animate-pulse">
        <div className="h-11 w-48 rounded-lg bg-line" />
        <div className="mt-2 h-40 rounded-2xl border border-line bg-surface" />
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="h-96 rounded-2xl border border-line bg-surface" />
          <div className="hidden h-96 rounded-2xl border border-line bg-surface md:block" />
        </div>
      </div>
    </Container>
  );
}
