import type { Metadata } from "next";
import { getInitialShortlist, listCompanies } from "@/lib/api";
import { ShortlistView } from "./ShortlistView";

export const metadata: Metadata = { title: "Shortlist" };

export default async function ShortlistPage() {
  const [companies, initialShortlist] = await Promise.all([listCompanies(), getInitialShortlist()]);
  return <ShortlistView companies={companies} initialShortlist={initialShortlist} />;
}
