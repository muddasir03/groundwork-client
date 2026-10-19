import { Card } from "@/components/ui/Card";

// Suspense boundary for the login pages (they read the URL and cookies at request time).
export default function LoadingLogin() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card padding="lg" className="w-full max-w-sm">
        <div role="status" aria-label="Loading" className="animate-pulse space-y-4">
          <div className="h-7 w-40 rounded-lg bg-line" />
          <div className="h-11 rounded-lg bg-fill" />
          <div className="h-12 rounded-lg bg-line" />
        </div>
      </Card>
    </main>
  );
}
