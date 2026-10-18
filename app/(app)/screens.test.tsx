import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { toComparison, toSummary } from "@/lib/api";
import { sampleCompanies, sampleCountryOptions, sampleProfile, sampleSectorOptions, sampleShortlist } from "@/lib/api/sampleData";
import { CompareView } from "./compare/CompareView";
import { ProfileView } from "./profile/ProfileView";
import { SearchView, filterCompanies } from "./search/SearchView";
import { ShortlistView } from "./shortlist/ShortlistView";

const summaries = sampleCompanies.map(toSummary).sort((a, b) => b.fit.score - a.fit.score);
const anyFilters = { country: "", sector: "", city: "", size: "", fit: "" };

describe("Search", () => {
  it("filters by fit band, city and sector, keeping the best fit first", () => {
    const strong = filterCompanies(summaries, { ...anyFilters, fit: "strong" });
    expect(strong.length).toBeGreaterThan(0);
    expect(strong.every((c) => c.fit.band === "strong")).toBe(true);
    expect(filterCompanies(summaries, { ...anyFilters, city: "Barcelona" }).every((c) => c.city === "Barcelona")).toBe(true);
    expect(filterCompanies(summaries, { ...anyFilters, sector: "No such sector" })).toEqual([]);
  });

  it("updates the result count as filters change", async () => {
    render(<SearchView companies={summaries} initialShortlist={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent(`${summaries.length} companies in Spain · sorted by your fit`);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Your fit" }), "weak");
    expect(screen.getByRole("status")).toHaveTextContent("1 company in Spain");
  });

  it("shows an empty state when nothing matches", async () => {
    render(<SearchView companies={summaries} initialShortlist={[]} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Company size" }), "1000+");
    expect(screen.getByText("No companies match these filters")).toBeInTheDocument();
  });

  it("lets you pick at most three companies to compare", async () => {
    render(<SearchView companies={summaries} initialShortlist={[]} />);
    const compareButtons = summaries.map((company) => screen.getByRole("button", { name: `Compare ${company.name}` }));
    for (const button of compareButtons.slice(0, 3)) await userEvent.click(button);
    expect(compareButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(compareButtons[3]).toBeDisabled();
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Compare selected" })).toHaveAttribute("href", "/compare");
  });

  it("saves a company to the shortlist", async () => {
    render(<SearchView companies={summaries} initialShortlist={[]} />);
    const save = screen.getByRole("button", { name: `Save ${summaries[0].name}` });
    await userEvent.click(save);
    expect(save).toHaveAttribute("aria-pressed", "true");
  });

  it("links every result to its company page and shows its fit with the top match and gap", () => {
    render(<SearchView companies={summaries} initialShortlist={[]} />);
    const first = screen.getAllByRole("article")[0];
    expect(within(first).getByRole("link", { name: summaries[0].name })).toHaveAttribute("href", `/companies/${summaries[0].slug}`);
    expect(first).toHaveTextContent(summaries[0].fit.topMatch);
    expect(first).toHaveTextContent(summaries[0].fit.topGap);
  });
});

describe("Compare", () => {
  const comparisons = sampleCompanies.map(toComparison);

  it("asks you to pick companies when none are selected", () => {
    render(<CompareView companies={comparisons} />);
    expect(screen.getByText("Nothing to compare yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find companies" })).toHaveAttribute("href", "/search");
  });

  it("compares the selected companies side by side and removes one", async () => {
    localStorage.setItem("groundwork:compare", JSON.stringify([comparisons[0].slug, comparisons[1].slug]));
    render(<CompareView companies={comparisons} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(table).getByRole("rowheader", { name: "Tech stack" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: `Remove ${comparisons[0].name} from comparison` }));
    expect(within(screen.getByRole("table")).getAllByRole("columnheader")).toHaveLength(1);
  });
});

describe("Shortlist", () => {
  it("filters by status and shows counts", async () => {
    render(<ShortlistView companies={summaries} initialShortlist={sampleShortlist} />);
    const filters = screen.getByRole("group", { name: "Filter by status" });
    expect(within(filters).getByRole("button", { name: `All · ${sampleShortlist.length}` })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(within(filters).getByRole("button", { name: "Applied · 1" }));
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(2); // header + one company
  });

  it("explains an empty shortlist", () => {
    render(<ShortlistView companies={summaries} initialShortlist={[]} />);
    expect(screen.getByText("Your shortlist is empty")).toBeInTheDocument();
  });
});

describe("Profile", () => {
  it("toggles target countries and confirms to search", async () => {
    render(<ProfileView profile={sampleProfile} options={{ countries: sampleCountryOptions, sectors: sampleSectorOptions }} />);
    const countries = screen.getByRole("group", { name: "Target countries" });
    const netherlands = within(countries).getByRole("button", { name: "Netherlands" });
    expect(netherlands).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(netherlands);
    expect(netherlands).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Confirm and see companies" })).toHaveAttribute("href", "/search");
  });

  it("labels every link field", () => {
    render(<ProfileView profile={sampleProfile} options={{ countries: [], sectors: [] }} />);
    for (const name of ["GitHub", "GitLab", "LinkedIn", "Portfolio"]) expect(screen.getByRole("textbox", { name })).toBeInTheDocument();
  });
});
