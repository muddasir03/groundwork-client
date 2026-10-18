import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

/** What a list shows when it has nothing in it: what's missing and the next step. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <Card padding="lg" className="text-center">
      <p className="text-base font-semibold text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{children}</div>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}
