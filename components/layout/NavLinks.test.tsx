import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavLinks, activeNavHref } from "@/components/layout/NavLinks";

describe("activeNavHref", () => {
  it("matches a section and the pages below it", () => {
    expect(activeNavHref("/search")).toBe("/search");
    expect(activeNavHref("/shortlist/some-company")).toBe("/shortlist");
  });

  it("matches nothing outside the app sections", () => {
    expect(activeNavHref("/")).toBeNull();
    expect(activeNavHref("/searching")).toBeNull();
    expect(activeNavHref(null)).toBeNull();
  });
});

describe("NavLinks", () => {
  it("marks only the active section as the current page", () => {
    render(<NavLinks layout="bottom" activeHref="/compare" />);
    expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
  });
});
