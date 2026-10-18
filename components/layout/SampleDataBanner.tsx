/**
 * Shown on every product and admin page while screens use fictional sample data
 * (lib/api/sampleData.ts). Remove it once the screens read real, reviewed research from the API.
 */
export function SampleDataBanner() {
  return (
    <p className="bg-warning-soft px-4 py-2 text-center text-xs font-medium text-warning">
      Preview with sample data: every company and person shown is fictional.
    </p>
  );
}
