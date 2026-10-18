"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { companyPath } from "@/components/company/paths";
import { Container, PageHeader } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FactValue } from "@/components/ui/FactValue";
import { FitBadge } from "@/components/ui/FitBadge";
import { CompanyMark } from "@/components/ui/Identity";
import { Table, TableFrame, Td, Th } from "@/components/ui/Table";
import type { CompanyComparison } from "@/lib/api/types";
import { useCompare } from "@/lib/store/hooks";

const rows: Array<{ label: string; value: (company: CompanyComparison) => ReactNode }> = [
  { label: "Sector", value: (c) => c.sector },
  { label: "Headquarters", value: (c) => c.headquarters },
  { label: "Stage", value: (c) => c.stage ?? <FactValue fact={{ label: "Stage", value: null, status: "unconfirmed", sourceIds: [] }} /> },
  { label: "Tech stack", value: (c) => c.techStack.join(", ") },
  { label: "Work policy", value: (c) => <FactValue fact={c.workPolicy} /> },
  { label: "Main product", value: (c) => c.mainProduct },
  { label: "Your top match", value: (c) => c.fit?.topMatch ?? <NoVerdict /> },
  { label: "Your top gap", value: (c) => c.fit?.topGap ?? <NoVerdict /> },
];

function NoVerdict() {
  return <span className="text-ink-subtle">No verdict yet</span>;
}

export function CompareView({ companies }: { companies: CompanyComparison[] }) {
  const compare = useCompare();
  // Keep the order the user picked them in.
  const selected = compare.slugs.map((slug) => companies.find((company) => company.slug === slug)).filter((c): c is CompanyComparison => !!c);

  return (
    <Container>
      <PageHeader title="Compare companies" description="Up to three companies, side by side." />

      {selected.length === 0 ? (
        <EmptyState title="Nothing to compare yet" action={<ButtonLink href="/search">Find companies</ButtonLink>}>
          Pick up to three companies with their Compare button in Search or on a company page.
        </EmptyState>
      ) : (
        <TableFrame>
          <Table className="min-w-[40rem] table-fixed">
            <caption className="sr-only">Comparison of {selected.map((c) => c.name).join(", ")}</caption>
            <thead>
              <tr>
                <td className="w-40 border-b border-line" />
                {selected.map((company) => (
                  <th key={company.slug} scope="col" className="border-b border-line px-4 py-4 text-left align-top">
                    <div className="flex items-center gap-3">
                      <CompanyMark name={company.name} size="sm" />
                      <Link href={companyPath(company.slug)} className="text-base font-semibold text-ink hover:underline">
                        {company.name}
                      </Link>
                    </div>
                    {company.fit && <FitBadge className="mt-2" band={company.fit.band} score={company.fit.score} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <Th scope="row">{row.label}</Th>
                  {selected.map((company) => (
                    <Td key={company.slug}>{row.value(company)}</Td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {selected.map((company) => (
                  <Td key={company.slug} last>
                    <Button size="sm" variant="secondary" onClick={() => compare.remove(company.slug)} aria-label={`Remove ${company.name} from comparison`}>
                      Remove
                    </Button>
                  </Td>
                ))}
              </tr>
            </tbody>
          </Table>
        </TableFrame>
      )}

      {selected.length > 0 && selected.length < 3 && (
        <p className="mt-4 text-sm text-ink-muted">
          You can add {3 - selected.length} more from{" "}
          <Link href="/search" className="font-medium text-primary hover:underline">
            Search
          </Link>
          .
        </p>
      )}
    </Container>
  );
}
