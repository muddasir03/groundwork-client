"use client";

import Link from "next/link";
import { useState } from "react";
import { companyPath } from "@/components/company/paths";
import { Container, PageHeader } from "@/components/layout/Page";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { FitBadge } from "@/components/ui/FitBadge";
import { CompanyMark } from "@/components/ui/Identity";
import { Table, TableFrame, Td, Th } from "@/components/ui/Table";
import type { CompanySummary, ShortlistEntry, ShortlistStatus } from "@/lib/api/types";
import { formatResearchDate } from "@/lib/format";
import { shortlistStatusLabel, shortlistStatusTone, shortlistStatuses } from "@/lib/status";
import { useShortlist } from "@/lib/store/hooks";

type Row = ShortlistEntry & { company: CompanySummary };

export function ShortlistView({ companies, initialShortlist }: { companies: CompanySummary[]; initialShortlist: ShortlistEntry[] }) {
  const { entries } = useShortlist(initialShortlist);
  const [status, setStatus] = useState<ShortlistStatus | "all">("all");

  const rows: Row[] = entries.flatMap((entry) => {
    const company = companies.find((c) => c.slug === entry.slug);
    return company ? [{ ...entry, company }] : [];
  });
  const visible = status === "all" ? rows : rows.filter((row) => row.status === status);
  const count = (s: ShortlistStatus) => rows.filter((row) => row.status === s).length;

  return (
    <Container>
      <PageHeader title="Your shortlist" description="Track every company from research to interview." />

      {rows.length === 0 ? (
        <EmptyState title="Your shortlist is empty" action={<ButtonLink href="/search">Find companies</ButtonLink>}>
          Save companies from Search or a company page to track them here.
        </EmptyState>
      ) : (
        <>
          <div role="group" aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
            <Chip selected={status === "all"} onClick={() => setStatus("all")}>
              All · {rows.length}
            </Chip>
            {shortlistStatuses.map((s) => (
              <Chip key={s} selected={status === s} onClick={() => setStatus(s)}>
                {shortlistStatusLabel[s]} · {count(s)}
              </Chip>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState title={`No companies are at "${shortlistStatusLabel[status as ShortlistStatus]}"`} />
          ) : (
            <>
              <TableFrame className="hidden md:block">
                <Table>
                  <thead>
                    <tr>
                      <Th>Company</Th>
                      <Th>Fit</Th>
                      <Th>Status</Th>
                      <Th>Your notes</Th>
                      <Th>Updated</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row, index) => {
                      const last = index === visible.length - 1;
                      return (
                        <tr key={row.slug}>
                          <Td last={last}>
                            <CompanyCell company={row.company} />
                          </Td>
                          <Td last={last}>
                            <FitBadge band={row.company.fit.band} score={row.company.fit.score} format="short" />
                          </Td>
                          <Td last={last}>
                            <Badge tone={shortlistStatusTone[row.status]}>{shortlistStatusLabel[row.status]}</Badge>
                          </Td>
                          <Td last={last}>{row.notes || <span className="text-ink-subtle">No notes yet</span>}</Td>
                          <Td last={last} className="whitespace-nowrap">
                            <time dateTime={row.updatedAt}>{formatResearchDate(row.updatedAt)}</time>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </TableFrame>

              <ul className="space-y-3 md:hidden">
                {visible.map((row) => (
                  <li key={row.slug}>
                    <Card>
                      <div className="flex items-start justify-between gap-3">
                        <CompanyCell company={row.company} />
                        <FitBadge band={row.company.fit.band} score={row.company.fit.score} format="score" />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Badge tone={shortlistStatusTone[row.status]}>{shortlistStatusLabel[row.status]}</Badge>
                        <time dateTime={row.updatedAt} className="text-xs text-ink-subtle">
                          {formatResearchDate(row.updatedAt)}
                        </time>
                      </div>
                      {row.notes && <p className="mt-3 text-sm text-ink">{row.notes}</p>}
                    </Card>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Container>
  );
}

function CompanyCell({ company }: { company: CompanySummary }) {
  return (
    <div className="flex items-center gap-3">
      <CompanyMark name={company.name} size="sm" />
      <div>
        <Link href={companyPath(company.slug)} className="font-semibold text-ink hover:underline">
          {company.name}
        </Link>
        <p className="text-xs text-ink-subtle">{company.city}</p>
      </div>
    </div>
  );
}
