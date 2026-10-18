import type { Metadata } from "next";
import { connection } from "next/server";
import { getInitialShortlist, listCompanies } from "@/lib/api";
import { SearchView } from "./SearchView";

export const metadata: Metadata = { title: "Search" };

// Companies come from the API at request time, never at build time; loading.tsx shows meanwhile.
export default async function SearchPage() {
  await connection();
  const [companies, initialShortlist] = await Promise.all([listCompanies(), getInitialShortlist()]);
  return <SearchView companies={companies} initialShortlist={initialShortlist} />;
}
