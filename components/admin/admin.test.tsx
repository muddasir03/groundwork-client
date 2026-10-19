import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const saveReport = vi.fn();
vi.mock("@/app/admin/actions", () => ({ saveReport: (...args: unknown[]) => saveReport(...args), login: vi.fn() }));

const { ReportEditor } = await import("@/components/admin/ReportEditor");
const { FormMessage } = await import("@/components/admin/FormMessage");
const { fromCompany } = await import("@/lib/admin/reportEditor");
const { toApiCompany } = await import("@/lib/api/fakeApi");
const { sampleCompanies } = await import("@/lib/api/sampleData");

const brisa = sampleCompanies.find((c) => c.slug === "brisa-people")!;
const initial = fromCompany({ ...toApiCompany(brisa), status: "in_review", publishedAt: null, updatedAt: "2026-10-01T10:00:00Z" });

describe("ReportEditor", () => {
  it("adds a client claim, cites a source and saves the whole report", async () => {
    saveReport.mockResolvedValue({ ok: true, message: "Report saved." });
    render(<ReportEditor slug="brisa-people" initial={initial} />);

    expect(screen.getByRole("button", { name: "Save report" })).toBeDisabled(); // nothing changed yet
    await userEvent.click(screen.getByRole("button", { name: "+ Add to clients" }));
    const n = brisa.report.clients.length + 1;
    await userEvent.type(screen.getByRole("textbox", { name: `Clients ${n}` }), "Hotel groups.");
    await userEvent.click(within(screen.getByRole("group", { name: `Sources for Clients ${n}` })).getByRole("button", { name: /^\[1\]/ }));
    await userEvent.click(screen.getByRole("button", { name: "Save report" }));

    expect(saveReport).toHaveBeenCalledOnce();
    const [slug, payload] = saveReport.mock.calls[0];
    expect(slug).toBe("brisa-people");
    expect(payload.clients.at(-1)).toEqual({ text: "Hotel groups.", sourceRefs: [brisa.sources[0].id] });
    expect(await screen.findByText("Report saved.")).toBeInTheDocument();
  });

  it("removing a source removes its citations", async () => {
    render(<ReportEditor slug="brisa-people" initial={initial} />);
    const summarySources = () => within(screen.getByRole("group", { name: "Sources for Summary" }));
    expect(summarySources().getByRole("button", { name: /^\[1\]/ })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "Remove source 1" }));
    expect(summarySources().queryByRole("button", { pressed: true, name: new RegExp(brisa.sources[0].title) })).not.toBeInTheDocument();
  });

  it("only lets verified facts hold a value", async () => {
    render(<ReportEditor slug="brisa-people" initial={initial} />);
    const pay = screen.getAllByRole("combobox", { name: "Status" }).find((select) => (select as HTMLSelectElement).value === "not_public")!;
    const row = pay.closest("li")!;
    expect(within(row).getByRole("textbox", { name: "Value" })).toBeDisabled();
    expect(within(row).getByText("Shown as “Not public”")).toBeInTheDocument();

    await userEvent.selectOptions(pay, "verified");
    expect(within(row).getByRole("textbox", { name: "Value" })).toBeEnabled();
  });

  it("shows every problem the API reported", async () => {
    saveReport.mockResolvedValue({
      ok: false,
      message: "Please fix the highlighted problems.",
      errors: [{ path: "report.clients[0]", message: "Must cite at least one source" }],
    });
    render(<ReportEditor slug="brisa-people" initial={initial} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Summary" }), "!");
    await userEvent.click(screen.getByRole("button", { name: "Save report" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Clients, item 1: Must cite at least one source");
  });
});

describe("FormMessage", () => {
  it("renders nothing before a submit", () => {
    const { container } = render(<FormMessage result={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
