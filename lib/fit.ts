/** The three fit bands from the product brief. Every fit display maps from this. */
export type FitBand = "strong" | "possible" | "weak";

/** One part of a fit score, e.g. Technical stack 36 / 40. */
export type ScoreItem = { label: string; value: number; max: number };

export const fitBandLabel: Record<FitBand, string> = {
  strong: "Strong",
  possible: "Possible",
  weak: "Weak",
};

/** Text colour for each band: strong = green, possible = amber, weak = grey. */
export const fitBandText: Record<FitBand, string> = {
  strong: "text-success",
  possible: "text-warning",
  weak: "text-ink-muted",
};

/** Soft background for badges in each band. */
export const fitBandSoft: Record<FitBand, string> = {
  strong: "bg-success-soft",
  possible: "bg-warning-soft",
  weak: "bg-neutral-soft",
};

/** Solid fill for score bars in each band. */
export const fitBandBar: Record<FitBand, string> = {
  strong: "bg-success",
  possible: "bg-warning",
  weak: "bg-ink-subtle",
};

/** SVG stroke for the score ring in each band. */
export const fitBandStroke: Record<FitBand, string> = {
  strong: "stroke-success",
  possible: "stroke-warning",
  weak: "stroke-ink-subtle",
};
