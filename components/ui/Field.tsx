import { type ComponentProps, useId } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

// Shared look for inputs and selects. Horizontal padding is set per control (not here) so the
// select's extra right padding for its arrow never fights a shared `px-*`.
const control = "min-h-11 w-full rounded-lg border border-line-strong bg-surface text-sm text-ink placeholder:text-ink-subtle";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
      {children}
    </label>
  );
}

/** A labelled text input. Every input in Groundwork has a visible label. */
export function TextField({ label, className, id, ...props }: ComponentProps<"input"> & { label: string }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      <input id={inputId} className={`${control} px-3`} {...props} />
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
