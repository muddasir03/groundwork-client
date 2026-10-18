import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ApproachCard } from "@/components/company/ApproachCard";
import { CompanyView } from "@/components/company/CompanyView";
import { PeopleCard } from "@/components/company/PeopleCard";
import { sampleCompanies } from "@/lib/api/sampleData";

const brisa = sampleCompanies.find((c) => c.slug === "brisa-people")!;
const briefCompany = sampleCompanies.find((c) => c.approach === null)!;

describe("CompanyView", () => {
  it("shows the report, the fit verdict with its reasons, and the people", () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    expect(screen.getByRole("heading", { level: 1, name: "Brisa People" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Strong fit" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Matches" })).toBeInTheDocument();
    expect(screen.getByText(brisa.fit.explanation)).toBeInTheDocument();
    expect(screen.getByText("Lucía Ferrer")).toBeInTheDocument();
  });

  it("links each citation to its entry in the sources list", () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    const citation = screen.getAllByRole("link", { name: /^Source 1:/ })[0];
    const target = citation.getAttribute("href")!.slice(1);
    expect(document.getElementById(target)).toHaveTextContent(brisa.sources[0].title);
  });

  it('shows "Not public" and "Unconfirmed" instead of guessing', () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    expect(screen.getByText("Not public")).toBeInTheDocument(); // Pay
    expect(screen.getByText("Unconfirmed")).toBeInTheDocument(); // Relocation support
  });

  it("switches between Report, Your fit and People with the keyboard", async () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    const report = screen.getByRole("tab", { name: "Report" });
    expect(report).toHaveAttribute("aria-selected", "true");
    report.focus();
    await userEvent.keyboard("{ArrowRight}");
    const fit = screen.getByRole("tab", { name: "Your fit" });
    expect(fit).toHaveAttribute("aria-selected", "true");
    expect(fit).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Your fit" })).toHaveClass("block");
    expect(screen.getByRole("tabpanel", { name: "Report", hidden: true })).toHaveClass("hidden", "md:block");
  });

  it("records a verdict rating", async () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    const correct = screen.getByRole("button", { name: "Correct" });
    await userEvent.click(correct);
    expect(correct).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Your rating helps us improve/)).toBeInTheDocument();
  });

  it("saves to the shortlist and picks for comparison", async () => {
    render(<CompanyView company={brisa} initialShortlist={[]} />);
    const save = screen.getByRole("button", { name: "Save to shortlist" });
    await userEvent.click(save);
    expect(save).toHaveAttribute("aria-pressed", "true");
    const compare = screen.getByRole("button", { name: "Compare Brisa People" });
    await userEvent.click(compare);
    expect(compare).toHaveAttribute("aria-pressed", "true");
  });
});

describe("PeopleCard", () => {
  it("says a name is not public rather than inventing one, and only links public profiles", () => {
    render(<PeopleCard people={brisa.people} verifiedAt={brisa.peopleVerifiedAt} />);
    expect(screen.getByText("Name not public")).toBeInTheDocument();
    const named = brisa.people.filter((p) => p.name !== null).length;
    expect(screen.getAllByRole("link", { name: /^Profile/ })).toHaveLength(named);
    expect(screen.getByText(/Public profiles only/)).toHaveTextContent("Verified 30 Sep 2026");
  });
});

describe("ApproachCard", () => {
  it("reveals the prepared approach with its proof of work, contact and message", async () => {
    render(<ApproachCard approach={brisa.approach} people={brisa.people} />);
    await userEvent.click(screen.getByRole("button", { name: "Generate my approach" }));
    const card = screen.getByRole("region", { name: "Your approach" });
    expect(within(card).getByText(brisa.approach!.proofOfWork)).toBeInTheDocument();
    expect(within(card).getByText(/Elena Ruiz/)).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: "Copy message" })).toBeInTheDocument();
  });

  it("is disabled, and says so, when no approach is available", () => {
    render(<ApproachCard approach={briefCompany.approach} people={briefCompany.people} />);
    expect(screen.getByRole("button", { name: "Generate my approach" })).toBeDisabled();
    expect(screen.getByText("Not available for this company yet.")).toBeInTheDocument();
  });
});
