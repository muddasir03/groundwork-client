import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SelectField, TextField } from "@/components/ui/Field";
import { Avatar, CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("renders navigation as a link", () => {
    render(<ButtonLink href="/search">Find companies</ButtonLink>);
    expect(screen.getByRole("link", { name: "Find companies" })).toHaveAttribute("href", "/search");
  });
});

describe("Chip", () => {
  it("announces whether it is selected", async () => {
    const onClick = vi.fn();
    render(
      <Chip selected onClick={onClick}>
        Spain
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Spain", pressed: true });
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("form fields", () => {
  it("labels every input", () => {
    render(
      <>
        <TextField label="GitHub" />
        <SelectField label="Country" options={[{ value: "es", label: "Spain" }]} />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Country" })).toBeInTheDocument();
  });
});

describe("ResearchMeta", () => {
  it("shows the research date and source count", () => {
    render(<ResearchMeta researchedAt="2026-09-30" sourceCount={18} contactCount={5} />);
    expect(screen.getByText(/Researched/)).toHaveTextContent("Researched 30 Sep 2026 · 18 sources · 5 senior contacts");
    expect(screen.getByText("30 Sep 2026")).toHaveAttribute("dateTime", "2026-09-30");
  });

  it("uses the singular for one source", () => {
    render(<ResearchMeta researchedAt="2026-09-30" sourceCount={1} />);
    expect(screen.getByText(/Researched/)).toHaveTextContent("· 1 source");
  });
});

describe("Card", () => {
  it("uses a thin border normally and the band colour when highlighted", () => {
    const { container, rerender } = render(<Card>Body</Card>);
    expect(container.firstChild).toHaveClass("border", "border-line");
    rerender(<Card highlight="strong">Body</Card>);
    expect(container.firstChild).toHaveClass("border-2", "border-success");
  });

  it("can render as a section", () => {
    render(
      <Card as="section">
        <h2>Senior people</h2>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Senior people" }).closest("section")).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("colours a status by its tone", () => {
    render(<Badge tone="warning">In review</Badge>);
    expect(screen.getByText("In review")).toHaveClass("bg-warning-soft", "text-warning");
  });
});

describe("CompanyMark and Avatar", () => {
  it("show initials and stay hidden from screen readers, since the name is shown beside them", () => {
    render(
      <>
        <CompanyMark name="example analytics" />
        <Avatar name="Alex  Rivera Example" />
      </>,
    );
    expect(screen.getByText("E")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("AR")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Eyebrow", () => {
  it("uses the tone colour", () => {
    render(<Eyebrow tone="warning">Gaps to plan for</Eyebrow>);
    expect(screen.getByText("Gaps to plan for")).toHaveClass("uppercase", "text-warning");
  });
});
