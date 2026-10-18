import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FitBadge, fitBadgeText } from "@/components/ui/FitBadge";
import { FitReasons } from "@/components/ui/FitReasons";
import { FitScoreRing } from "@/components/ui/FitScoreRing";
import { ScoreBreakdown } from "@/components/ui/ScoreBreakdown";

describe("FitBadge", () => {
  it("formats the verdict for each layout", () => {
    expect(fitBadgeText("strong", 82)).toBe("Strong fit · 82");
    expect(fitBadgeText("possible", 64, "short")).toBe("Possible · 64");
    expect(fitBadgeText("weak", 44, "score")).toBe("44");
  });

  it("gives screen readers the band and score, even in the score-only format", () => {
    render(<FitBadge band="weak" score={44} format="score" />);
    expect(screen.getByText("Weak fit, score 44 out of 100")).toBeInTheDocument();
  });

  it("uses the band colour: strong is green, possible amber, weak grey", () => {
    const { container, rerender } = render(<FitBadge band="strong" score={82} />);
    expect(container.firstChild).toHaveClass("bg-success-soft", "text-success");
    rerender(<FitBadge band="possible" score={64} />);
    expect(container.firstChild).toHaveClass("bg-warning-soft", "text-warning");
    rerender(<FitBadge band="weak" score={44} />);
    expect(container.firstChild).toHaveClass("bg-neutral-soft", "text-ink-muted");
  });
});

describe("FitScoreRing", () => {
  it("is labelled with the band and score", () => {
    render(<FitScoreRing score={82} band="strong" />);
    expect(screen.getByRole("img", { name: "Strong fit, score 82 out of 100" })).toBeInTheDocument();
  });

  it("keeps the score between 0 and 100", () => {
    render(<FitScoreRing score={130} band="strong" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Strong fit, score 100 out of 100");
  });
});

describe("FitReasons", () => {
  it("lists matches and gaps under their labels", () => {
    render(<FitReasons matches={["Same stack", "Hires on skills"]} gaps={["Relocation needed"]} />);
    const matches = screen.getByRole("list", { name: "Matches" });
    expect(within(matches).getAllByRole("listitem")).toHaveLength(2);
    expect(within(screen.getByRole("list", { name: "Gaps" })).getByText("Relocation needed")).toBeInTheDocument();
  });

  it("leaves out an empty group instead of showing an empty heading", () => {
    render(<FitReasons matches={["Same stack"]} gaps={[]} />);
    expect(screen.queryByText("Gaps")).not.toBeInTheDocument();
  });
});

describe("ScoreBreakdown", () => {
  it("shows each part of the score as value / max", () => {
    render(<ScoreBreakdown band="strong" items={[{ label: "Technical stack", value: 36, max: 40 }]} />);
    expect(screen.getByText("Technical stack")).toBeInTheDocument();
    expect(screen.getByText("36 / 40")).toBeInTheDocument();
  });
});
