/** URL of a company's page. Use this instead of building the path by hand. */
export function companyPath(slug: string): string {
  return `/companies/${slug}`;
}
