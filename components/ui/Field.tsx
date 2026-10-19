import { type ComponentProps, useId } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

// Shared look for inputs and selects. Horizontal padding is set per control (not here) so the
// select's extra right padding for its arrow never fights a shared `px-*`.
const control =
  "min-h-11 w-full rounded-lg border border-line-strong bg-surface text-sm text-ink placeholder:text-ink-subtle disabled:bg-fill disabled:text-ink-subtle";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
      {children}
    </label>
  );
}

/** Optional helper text under a field, linked with aria-describedby so screen readers read it. */
function Hint({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p id={id} className="mt-1 text-xs text-ink-subtle">
      {children}
    </p>
  ) : null;
}

type FieldExtras = { label: string; hint?: string };

/** A labelled text input. Every input in Groundwork has a visible label. */
export function TextField({ label, hint, className, id, ...props }: ComponentProps<"input"> & FieldExtras) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      <input id={inputId} aria-describedby={hint ? `${inputId}-hint` : undefined} className={`${control} px-3`} {...props} />
      <Hint id={`${inputId}-hint`}>{hint}</Hint>
    </div>
  );
}

/** A labelled multi-line input, for research text. */
export function TextAreaField({ label, hint, className, id, rows = 3, ...props }: ComponentProps<"textarea"> & FieldExtras) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      <textarea id={inputId} rows={rows} aria-describedby={hint ? `${inputId}-hint` : undefined} className={`${control} px-3 py-2.5`} {...props} />
      <Hint id={`${inputId}-hint`}>{hint}</Hint>
    </div>
  );
}

export type SelectOption = { value: string; label: string };

/** A labelled native select, used for filters. Our own chevron replaces the browser's arrow so it
 *  sits evenly inside the field on every browser. */
export function SelectField({ label, options, className, id, ...props }: ComponentProps<"select"> & { label: string; options: SelectOption[] }) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={className}>
      <Label htmlFor={selectId}>{label}</Label>
      <div className="relative">
        <select id={selectId} className={`${control} appearance-none pr-10 pl-3`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted" />
      </div>
    </div>
  );
}
