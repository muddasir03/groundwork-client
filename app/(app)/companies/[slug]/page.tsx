import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CompanyView } from "@/components/company/CompanyView";
import { getCompany, getInitialShortlist } from "@/lib/api";

// Research comes from the API at request time (cached for minutes in lib/api/remote.ts), never at
// build time; loading.tsx shows a skeleton meanwhile.

export async function generateMetadata({ params }: PageProps<"/companies/[slug]">): Promise<Metadata> {
  await connection();
  const company = await getCompany((await params).slug);
  return { title: company?.name ?? "Company not found" };
}

export default async function CompanyPage({ params }: PageProps<"/companies/[slug]">) {
  await connection();
  const company = await getCompany((await params).slug);
  if (!company) notFound();
  return <CompanyView company={company} initialShortlist={await getInitialShortlist()} />;
}
