import type { Metadata } from "next";
import { getInitialShortlist, listCompanies } from "@/lib/api";
import { SearchView } from "./SearchView";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  const [companies, initialShortlist] = await Promise.all([listCompanies(), getInitialShortlist()]);
  return <SearchView companies={companies} initialShortlist={initialShortlist} />;
}
