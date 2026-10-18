import type { Metadata } from "next";
import { getAdminStats, listAdminCompanies } from "@/lib/api";
import { AdminCompaniesView } from "./AdminCompaniesView";

export const metadata: Metadata = { title: "Companies" };

export default async function AdminCompaniesPage() {
  const [companies, stats] = await Promise.all([listAdminCompanies(), getAdminStats()]);
  return <AdminCompaniesView companies={companies} stats={stats} />;
}
