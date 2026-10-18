import { Container, PageHeader } from "@/components/layout/Page";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { Table, TableFrame, Td, Th } from "@/components/ui/Table";
import type { AdminCompanyRow, AdminStats } from "@/lib/api/types";
import { formatResearchDate } from "@/lib/format";
import { adminStatusLabel, adminStatusTone } from "@/lib/status";

const primaryAction: Record<AdminCompanyRow["status"], string> = {
  published: "Edit",
  in_review: "Review",
  researching: "View",
  draft: "Run research",
};

/**
 * The research pipeline: what's published, waiting for review, being researched or still a draft.
 * Actions are disabled until the admin API exists.
 */
export function AdminCompaniesView({ companies, stats }: { companies: AdminCompanyRow[]; stats: AdminStats }) {
  return (
    <Container>
      <PageHeader
        title={`Companies · ${stats.country}`}
        description="Research, review and publish. Nothing goes live without your review."
        actions={<Button disabled>+ Add company</Button>}
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

      <TableFrame className="mt-6">
        <Table className="min-w-[48rem]">
          <thead>
            <tr>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Last researched</Th>
              <Th>Sources</Th>
              <Th>Contacts verified</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {companies.map((row, index) => {
              const last = index === companies.length - 1;
              return (
                <tr key={row.slug}>
                  <Td last={last} className="font-semibold">
                    {row.name}
                  </Td>
                  <Td last={last}>
                    <Badge tone={adminStatusTone[row.status]}>{adminStatusLabel[row.status]}</Badge>
                  </Td>
                  <Td last={last}>
                    {row.lastResearchedAt ? (
                      <time dateTime={row.lastResearchedAt}>{formatResearchDate(row.lastResearchedAt)}</time>
                    ) : (
                      <span className="text-ink-subtle">{row.status === "researching" ? "Running now" : "Not yet"}</span>
                    )}
                  </Td>
                  <Td last={last}>{row.sourceCount ?? <Dash />}</Td>
                  <Td last={last}>{row.contactsTotal === null ? <Dash /> : `${row.contactsVerified} of ${row.contactsTotal}`}</Td>
                  <Td last={last}>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" disabled>
                        {primaryAction[row.status]}
                      </Button>
                      {row.status !== "draft" && (
                        <Button size="sm" variant="secondary" disabled>
                          Re-research
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableFrame>
      <p className="mt-3 text-xs text-ink-subtle">Actions become available when the admin API is built.</p>
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
