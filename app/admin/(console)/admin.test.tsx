import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AdminCompanyRow, AdminStats } from "@/lib/api/types";
import { AdminCompaniesView } from "./AdminCompaniesView";

const rows: AdminCompanyRow[] = [
  { slug: "brisa-people", name: "Brisa People", status: "published", lastResearchedAt: "2026-09-30", sourceCount: 6, contactsVerified: 4, contactsTotal: 5 },
  { slug: "faro-robotics", name: "Faro Robotics", status: "in_review", lastResearchedAt: "2026-10-14", sourceCount: 9, contactsVerified: 2, contactsTotal: 4 },
  { slug: "nube-legal", name: "Nube Legal", status: "researching", lastResearchedAt: null, sourceCount: null, contactsVerified: null, contactsTotal: null },
  { slug: "ola-travel", name: "Ola Travel", status: "draft", lastResearchedAt: null, sourceCount: null, contactsVerified: null, contactsTotal: null },
];
const stats: AdminStats = { published: 1, total: 4, waitingForReview: 1, verdictsCorrectPercent: null, aiCostThisMonthUsd: null };

describe("Admin companies", () => {
  it("shows the pipeline stats, saying when data doesn't exist yet instead of inventing it", () => {
    render(<AdminCompaniesView companies={rows} stats={stats} />);
    expect(screen.getByText("Published", { selector: "dt" }).nextElementSibling).toHaveTextContent("1 of 4");
    expect(screen.getByText("Not enough ratings yet")).toBeInTheDocument();
    expect(screen.getByText("Not tracked yet")).toBeInTheDocument();
  });

  it("colours each status the same way as everywhere else", () => {
    render(<AdminCompaniesView companies={rows} stats={stats} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Published")).toHaveClass("bg-success-soft");
    expect(within(table).getByText("In review")).toHaveClass("bg-warning-soft");
    expect(within(table).getByText("Researching")).toHaveClass("bg-primary-soft");
    expect(within(table).getByText("Draft")).toHaveClass("bg-neutral-soft");
  });

  it("links every company to its editor with the right next step", () => {
    render(<AdminCompaniesView companies={rows} stats={stats} />);
    expect(screen.getByRole("link", { name: "Review: Faro Robotics" })).toHaveAttribute("href", "/admin/companies/faro-robotics");
    expect(screen.getByRole("link", { name: "Start research: Ola Travel" })).toHaveAttribute("href", "/admin/companies/ola-travel");
    expect(screen.getAllByRole("link", { name: "+ Add company" })[0]).toHaveAttribute("href", "/admin/companies/new");
  });

  it("offers to add the first company when there are none", () => {
    render(<AdminCompaniesView companies={[]} stats={{ ...stats, published: 0, total: 0, waitingForReview: 0 }} />);
    expect(screen.getByText("No companies yet")).toBeInTheDocument();
  });
});
