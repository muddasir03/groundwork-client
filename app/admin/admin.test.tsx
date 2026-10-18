import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sampleAdminCompanies, sampleAdminStats } from "@/lib/api/sampleData";
import { AdminCompaniesView } from "./AdminCompaniesView";

describe("Admin companies", () => {
  it("shows the pipeline stats, saying when data doesn't exist yet instead of inventing it", () => {
    render(<AdminCompaniesView companies={sampleAdminCompanies} stats={sampleAdminStats} />);
    expect(screen.getByText("Published", { selector: "dt" }).nextElementSibling).toHaveTextContent(`${sampleAdminStats.published} of ${sampleAdminStats.total}`);
    expect(screen.getByText("Not enough ratings yet")).toBeInTheDocument();
    expect(screen.getByText("Not tracked yet")).toBeInTheDocument();
  });

  it("colours each status the same way as everywhere else", () => {
    render(<AdminCompaniesView companies={sampleAdminCompanies} stats={sampleAdminStats} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Published")[0]).toHaveClass("bg-success-soft");
    expect(within(table).getByText("In review")).toHaveClass("bg-warning-soft");
    expect(within(table).getByText("Researching")).toHaveClass("bg-primary-soft");
    expect(within(table).getByText("Draft")).toHaveClass("bg-neutral-soft");
  });

  it("offers the right next action per status", () => {
    render(<AdminCompaniesView companies={sampleAdminCompanies} stats={sampleAdminStats} />);
    const row = (name: string) => screen.getByRole("row", { name: new RegExp(name) });
    expect(within(row("Faro Robotics")).getByRole("button", { name: "Review" })).toBeDisabled();
    expect(within(row("Ola Travel")).getByRole("button", { name: "Run research" })).toBeInTheDocument();
  });
});
