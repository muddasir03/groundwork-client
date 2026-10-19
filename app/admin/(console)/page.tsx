import type { Metadata } from "next";
import { getAdminCompanies } from "@/lib/admin/dal";
import { AdminCompaniesView } from "./AdminCompaniesView";

export const metadata: Metadata = { title: "Companies" };

export default async function AdminCompaniesPage() {
  const { data, meta } = await getAdminCompanies(); // verifies the admin session first
  return <AdminCompaniesView companies={data} stats={meta.stats} />;
}
