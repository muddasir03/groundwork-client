import type { ActionResult } from "@/lib/admin/types";
import { describePath } from "@/lib/admin/reportEditor";
import { cn } from "@/lib/cn";

/**
 * The outcome of an admin form: a success line, or the error with every problem the API reported.
 * role="alert" so screen readers announce it as soon as it appears.
 */
export function FormMessage({ result, className }: { result: ActionResult | null; className?: string }) {
  if (!result) return null;
  if (result.ok) {
    return result.message ? (
      <p role="status" className={cn("rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success", className)}>
        {result.message}
      </p>
    ) : null;
  }
  return (
    <div role="alert" className={cn("rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning", className)}>
      <p className="font-semibold">{result.message}</p>
      {result.errors && result.errors.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          {result.errors.map((error) => (
            <li key={`${error.path}-${error.message}`}>
              {/* Whole-record problems ("status", "base") need no location prefix. */}
              {["status", "base"].includes(error.path) ? error.message : `${describePath(error.path)}: ${error.message}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
