import { type ComponentProps, useId } from "react";
import { cn } from "@/lib/cn";

const control =
  "min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle";

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
      <input id={inputId} className={control} {...props} />
    </div>
  );
}

export type SelectOption = { value: string; label: string };

/** A labelled native select, used for filters. */
export function SelectField({ label, options, className, id, ...props }: ComponentProps<"select"> & { label: string; options: SelectOption[] }) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={className}>
      <Label htmlFor={selectId}>{label}</Label>
      <select id={selectId} className={cn(control, "pr-8")} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
