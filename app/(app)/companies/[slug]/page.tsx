import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyView } from "@/components/company/CompanyView";
import { getCompany, getInitialShortlist, listCompanySlugs } from "@/lib/api";

export async function generateStaticParams() {
  return (await listCompanySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/companies/[slug]">): Promise<Metadata> {
  const company = await getCompany((await params).slug);
  return { title: company?.name ?? "Company not found" };
}

export default async function CompanyPage({ params }: PageProps<"/companies/[slug]">) {
  const company = await getCompany((await params).slug);
  if (!company) notFound();
  return <CompanyView company={company} initialShortlist={await getInitialShortlist()} />;
}
