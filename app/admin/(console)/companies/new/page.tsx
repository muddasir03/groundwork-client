import type { Metadata } from "next";
import Link from "next/link";
import { createCompany } from "@/app/admin/actions";
import { CompanyDetailsForm } from "@/components/admin/CompanyDetailsForm";
import { Container, PageHeader } from "@/components/layout/Page";
import { Card } from "@/components/ui/Card";
import { verifyAdmin } from "@/lib/admin/dal";

export const metadata: Metadata = { title: "Add company" };

export default async function NewCompanyPage() {
  await verifyAdmin();
  return (
    <Container>
      <Link href="/admin" className="inline-flex min-h-11 items-center pt-4 text-sm font-medium text-primary hover:underline">
        <span aria-hidden="true">←&nbsp;</span>All companies
      </Link>
      <PageHeader title="Add company" description="It starts as a draft. Add the research, then send it for review and publish." />
      <Card padding="lg">
        <CompanyDetailsForm mode="create" action={createCompany} />
      </Card>
    </Container>
  );
}
