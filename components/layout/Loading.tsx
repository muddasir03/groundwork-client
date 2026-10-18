import { Container, PageHeader } from "@/components/layout/Page";

/** Skeleton for list pages while their data loads. The title shows straight away. */
export function ListLoading({ label, title }: { label: string; title: string }) {
  return (
    <Container>
      <PageHeader title={title} />
      <div role="status" aria-label={label} className="grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-2xl border border-line bg-surface" />
        ))}
      </div>
    </Container>
  );
}
