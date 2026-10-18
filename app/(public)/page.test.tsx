import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicShell, publicLinks } from "@/components/layout/PublicShell";
import LandingPage from "./page";

function renderLanding() {
  return render(
    <PublicShell>
      <LandingPage />
    </PublicShell>,
  );
}

describe("Landing page", () => {
  it("leads with the pitch", () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1, name: "Know the company before you apply." })).toBeInTheDocument();
  });

  it("sends every sign-up call to action to the profile", () => {
    renderLanding();
    const links = [
      screen.getByRole("link", { name: "Get started" }),
      ...screen.getAllByRole("link", { name: "Build your profile" }),
    ];
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute("href", publicLinks.getStarted));
  });

  it("explains the three steps in order", () => {
    renderLanding();
    const steps = within(screen.getByRole("region", { name: "How it works" })).getAllByRole("listitem");
    expect(steps.map((step) => within(step).getByRole("heading").textContent)).toEqual([
      "Upload your profile once",
      "Search by country and sector",
      "See your fit and act on it",
    ]);
  });

  it("lists the four promises without overclaiming", () => {
    renderLanding();
    const promises = screen.getByRole("region", { name: "More than a chatbot answer" });
    expect(within(promises).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(promises).not.toHaveTextContent(/hundreds/i);
  });

  it("shows the sample verdict with its reasons, sources and date, marked as fictional", () => {
    renderLanding();
    expect(screen.getByRole("list", { name: "Why you match" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Gaps to plan for" })).toBeInTheDocument();
    expect(screen.getByText(/Researched/)).toHaveTextContent("Researched 30 Sep 2026 · 18 sources");
    expect(screen.getByText("Fictional example")).toBeInTheDocument();
  });

  it("states the privacy promise in the footer", () => {
    renderLanding();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Public information only · You can delete your data at any time");
  });
});
