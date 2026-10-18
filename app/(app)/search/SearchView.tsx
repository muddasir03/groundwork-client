"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { CompanyCard } from "@/components/company/CompanyCard";
import { companySizeLabel } from "@/components/company/labels";
import { Container, PageHeader } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SelectField, type SelectOption } from "@/components/ui/Field";
import type { CompanySize, CompanySummary, ShortlistEntry } from "@/lib/api/types";
import { type FitBand, fitBandLabel } from "@/lib/fit";
import { pluralize } from "@/lib/format";
import { useCompare, useShortlist } from "@/lib/store/hooks";

export type SearchFilters = { country: string; sector: string; city: string; size: string; fit: string };

const ANY = "";
const sizes: CompanySize[] = ["1-50", "51-200", "201-1000", "1000+"];
const bands: FitBand[] = ["strong", "possible", "weak"];

const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

/** Applies the filters. Companies arrive sorted by fit, best first, and stay in that order. */
export function filterCompanies(companies: CompanySummary[], filters: SearchFilters): CompanySummary[] {
  return companies.filter(
    (company) =>
      (filters.country === ANY || company.country === filters.country) &&
      (filters.sector === ANY || company.sector === filters.sector) &&
      (filters.city === ANY || company.city === filters.city) &&
      (filters.size === ANY || company.size === filters.size) &&
      (filters.fit === ANY || company.fit?.band === filters.fit),
  );
}

export function SearchView({ companies, initialShortlist }: { companies: CompanySummary[]; initialShortlist: ShortlistEntry[] }) {
  const countries = unique(companies.map((c) => c.country));
  const [filters, setFilters] = useState<SearchFilters>({ country: countries[0] ?? ANY, sector: ANY, city: ANY, size: ANY, fit: ANY });
  const compare = useCompare();
  const shortlist = useShortlist(initialShortlist);

  const results = useMemo(() => filterCompanies(companies, filters), [companies, filters]);

  const options = (anyLabel: string, values: SelectOption[]): SelectOption[] => [{ value: ANY, label: anyLabel }, ...values];
  const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));
  const set = (key: keyof SearchFilters) => (event: ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, [key]: event.target.value });

  const place = filters.country === ANY ? "all countries" : filters.country;

  return (
    <Container>
      <PageHeader title="Find companies worth your time" />

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4 md:grid-cols-5">
        <SelectField className="col-span-2 md:col-span-1" label="Country" value={filters.country} onChange={set("country")} options={options("All countries", toOptions(countries))} />
        <SelectField label="Sector" value={filters.sector} onChange={set("sector")} options={options("All sectors", toOptions(unique(companies.map((c) => c.sector))))} />
        <SelectField label="City" value={filters.city} onChange={set("city")} options={options("All cities", toOptions(unique(companies.map((c) => c.city))))} />
        <SelectField label="Company size" value={filters.size} onChange={set("size")} options={options("Any size", sizes.map((size) => ({ value: size, label: companySizeLabel[size] })))} />
        <SelectField label="Your fit" value={filters.fit} onChange={set("fit")} options={options("Any fit", bands.map((band) => ({ value: band, label: `${fitBandLabel[band]} fit` })))} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-ink-muted">
          <strong className="font-semibold text-ink">{pluralize(results.length, "company", "companies")}</strong> in {place} · sorted by your fit
        </p>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm text-ink-muted">{compare.slugs.length} selected</span>
          {compare.slugs.length >= 2 ? (
            <ButtonLink href="/compare" variant="dark">
              Compare selected
            </ButtonLink>
          ) : (
            <Button variant="dark" disabled>
              Compare selected
            </Button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No companies match these filters">Try a different sector, city or size.</EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((company) => (
            <li key={company.slug}>
              <CompanyCard
                company={company}
                saved={shortlist.isSaved(company.slug)}
                compared={compare.slugs.includes(company.slug)}
                compareFull={compare.isFull}
                onToggleSave={() => shortlist.toggle(company.slug)}
                onToggleCompare={() => compare.toggle(company.slug)}
              />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
