// Fixed abbreviations instead of Intl: ICU versions disagree ("Sep" vs "Sept"), and the server
// and browser must render identical text to avoid hydration mismatches.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date ("2026-09-30") the way research dates appear in the product: "30 Sep 2026". */
export function formatResearchDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "1 source", "18 sources". */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
