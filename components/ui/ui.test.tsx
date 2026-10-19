import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Disclosure } from "@/components/ui/Disclosure";
import { EmptyState } from "@/components/ui/EmptyState";
import { FactValue } from "@/components/ui/FactValue";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Avatar, CompanyMark } from "@/components/ui/Identity";
import { ResearchMeta } from "@/components/ui/ResearchMeta";
import { StatTile } from "@/components/ui/StatTile";

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

describe("Button pressed state", () => {
  it("is a toggle with the cobalt on-style replacing the variant colours", () => {
    render(
      <Button variant="secondary" pressed>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save", pressed: true });
    expect(button).toHaveClass("bg-primary-soft", "text-primary");
    expect(button).not.toHaveClass("bg-surface");
  });
});

describe("StatTile", () => {
  it("renders a term and definition inside a definition list", () => {
    render(
      <dl>
        <StatTile label="Founded" definition>
          2018
        </StatTile>
      </dl>,
    );
    expect(screen.getByRole("term")).toHaveTextContent("Founded");
    expect(screen.getByRole("definition")).toHaveTextContent("2018");
  });
});

describe("FactValue", () => {
  it("shows verified values, and the exact words for unknowns", () => {
    render(
      <>
        <FactValue fact={{ label: "Founded", value: "2018", status: "verified", sourceIds: [] }} />
        <FactValue fact={{ label: "Pay", value: null, status: "not_public", sourceIds: [] }} />
        <FactValue fact={{ label: "Customers", value: null, status: "unconfirmed", sourceIds: [] }} />
      </>,
    );
    expect(screen.getByText("2018")).toBeInTheDocument();
    expect(screen.getByText("Not public")).toBeInTheDocument();
    expect(screen.getByText("Unconfirmed")).toBeInTheDocument();
  });
});

describe("Disclosure", () => {
  it("expands on mobile and is always open from md up", async () => {
    render(<Disclosure title="Clients">Mostly small businesses.</Disclosure>);
    const toggle = screen.getByRole("button", { name: "Clients" });
    const content = screen.getByText("Mostly small businesses.");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveClass("hidden", "md:block");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveClass("block");
  });
});

describe("EmptyState", () => {
  it("says what is missing and offers the next step", () => {
    render(<EmptyState title="Nothing here" action={<ButtonLink href="/search">Find companies</ButtonLink>} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find companies" })).toBeInTheDocument();
  });
});

describe("TextAreaField and hints", () => {
  it("labels the text area and links its hint for screen readers", () => {
    render(<TextAreaField label="Summary" hint="Two or three sentences." />);
    const box = screen.getByRole("textbox", { name: "Summary" });
    expect(box.tagName).toBe("TEXTAREA");
    expect(box).toHaveAccessibleDescription("Two or three sentences.");
  });
});
