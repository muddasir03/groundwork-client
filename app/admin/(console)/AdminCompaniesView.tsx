import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/Page";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatTile } from "@/components/ui/StatTile";
import { Table, TableFrame, Td, Th } from "@/components/ui/Table";
import type { AdminCompanyRow, AdminStats } from "@/lib/api/types";
import { formatResearchDate } from "@/lib/format";
import { adminStatusLabel, adminStatusTone } from "@/lib/status";

const nextStep: Record<AdminCompanyRow["status"], string> = {
  draft: "Start research",
  researching: "Continue research",
  in_review: "Review",
  published: "Edit",
};

/** The research pipeline: what's published, waiting for review, being researched or still a draft. */
export function AdminCompaniesView({ companies, stats }: { companies: AdminCompanyRow[]; stats: AdminStats }) {
  return (
    <Container>
      <PageHeader
        title="Companies"
        description="Research, review and publish. Nothing goes live without your review."
        actions={<ButtonLink href="/admin/companies/new">+ Add company</ButtonLink>}
      />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile variant="card" definition label="Published">
          {stats.published} <span className="text-base font-semibold text-ink-subtle">of {stats.total}</span>
        </StatTile>
        <StatTile variant="card" definition label="Waiting for review">
          {stats.waitingForReview}
        </StatTile>
        <StatTile variant="card" definition label="Verdicts rated correct">
          {stats.verdictsCorrectPercent === null ? <NoData>Not enough ratings yet</NoData> : `${stats.verdictsCorrectPercent}%`}
        </StatTile>
        <StatTile variant="card" definition label="AI cost this month">
          {stats.aiCostThisMonthUsd === null ? <NoData>Not tracked yet</NoData> : `$${stats.aiCostThisMonthUsd.toFixed(2)}`}
        </StatTile>
      </dl>

      {companies.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No companies yet" action={<ButtonLink href="/admin/companies/new">+ Add company</ButtonLink>}>
            Add the first company to start researching.
          </EmptyState>
        </div>
      ) : (
        <TableFrame className="mt-6">
          <Table className="min-w-[48rem]">
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Status</Th>
                <Th>Last researched</Th>
                <Th>Sources</Th>
                <Th>Contacts named</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {companies.map((row, index) => {
                const last = index === companies.length - 1;
                return (
                  <tr key={row.slug}>
                    <Td last={last} className="font-semibold">
                      <Link href={`/admin/companies/${row.slug}`} className="hover:underline">
                        {row.name}
                      </Link>
                    </Td>
                    <Td last={last}>
                      <Badge tone={adminStatusTone[row.status]}>{adminStatusLabel[row.status]}</Badge>
                    </Td>
                    <Td last={last}>
                      {row.lastResearchedAt ? (
                        <time dateTime={row.lastResearchedAt}>{formatResearchDate(row.lastResearchedAt)}</time>
                      ) : (
                        <span className="text-ink-subtle">Not yet</span>
                      )}
                    </Td>
                    <Td last={last}>{row.sourceCount ?? <Dash />}</Td>
                    <Td last={last}>{row.contactsTotal === null ? <Dash /> : `${row.contactsVerified} of ${row.contactsTotal}`}</Td>
                    <Td last={last}>
                      <ButtonLink href={`/admin/companies/${row.slug}`} size="sm" variant="secondary" aria-label={`${nextStep[row.status]}: ${row.name}`}>
                        {nextStep[row.status]}
                      </ButtonLink>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableFrame>
      )}
    </Container>
  );
}

function NoData({ children }: { children: string }) {
  return <span className="font-sans text-base font-semibold text-ink-subtle">{children}</span>;
}

function Dash() {
  return (
    <span className="text-ink-subtle" aria-label="None yet">
      –
    </span>
  );
}
