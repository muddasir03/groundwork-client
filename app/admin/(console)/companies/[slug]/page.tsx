import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { changeStatus, updateDetails } from "@/app/admin/actions";
import { CompanyDetailsForm } from "@/components/admin/CompanyDetailsForm";
import { ReportEditor } from "@/components/admin/ReportEditor";
import { StatusActions } from "@/components/admin/StatusActions";
import { companyPath } from "@/components/company/paths";
import { Container, SectionTitle } from "@/components/layout/Page";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getAdminCompany } from "@/lib/admin/dal";
import { fromCompany } from "@/lib/admin/reportEditor";
import { formatResearchDate } from "@/lib/format";
import { adminStatusLabel, adminStatusTone } from "@/lib/status";

export const metadata: Metadata = { title: "Edit company" };

export default async function EditCompanyPage({ params }: PageProps<"/admin/companies/[slug]">) {
  const { slug } = await params;
  const company = await getAdminCompany(slug); // verifies the admin session first
  if (!company) notFound();

  return (
    <Container>
      <Link href="/admin" className="inline-flex min-h-11 items-center pt-4 text-sm font-medium text-primary hover:underline">
        <span aria-hidden="true">←&nbsp;</span>All companies
      </Link>

      <div className="flex flex-col gap-4 pt-2 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{company.name}</h1>
            <Badge tone={adminStatusTone[company.status]}>{adminStatusLabel[company.status]}</Badge>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Last saved <time dateTime={company.updatedAt}>{formatResearchDate(company.updatedAt)}</time>
            {company.status === "published" && (
              <>
                {" · "}
                <Link href={companyPath(company.slug)} className="font-medium text-primary hover:underline">
                  View the public page
                </Link>
              </>
            )}
          </p>
        </div>
        <StatusActions status={company.status} action={changeStatus.bind(null, company.slug)} />
      </div>

      <div className="space-y-4">
        <Card as="section" padding="lg">
          <SectionTitle className="mb-4">Details</SectionTitle>
          <CompanyDetailsForm
            mode="edit"
            action={updateDetails.bind(null, company.slug)}
            initial={{
              slug: company.slug,
              name: company.name,
              description: company.description,
              city: company.city,
              country: company.country,
              sector: company.sector,
              size: company.size,
              stage: company.stage,
              researchedAt: company.researchedAt,
              peopleVerifiedAt: company.peopleVerifiedAt,
            }}
          />
        </Card>

        <ReportEditor slug={company.slug} initial={fromCompany(company)} />
      </div>
    </Container>
  );
}
