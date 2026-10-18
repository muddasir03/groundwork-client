import type { Metadata } from "next";
import { connection } from "next/server";
import { getInitialShortlist, listCompanies } from "@/lib/api";
import { ShortlistView } from "./ShortlistView";

export const metadata: Metadata = { title: "Shortlist" };

// Company details come from the API at request time; loading.tsx shows meanwhile.
export default async function ShortlistPage() {
  await connection();
  const [companies, initialShortlist] = await Promise.all([listCompanies(), getInitialShortlist()]);
  return <ShortlistView companies={companies} initialShortlist={initialShortlist} />;
}
