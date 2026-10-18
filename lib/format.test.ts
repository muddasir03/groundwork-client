import { describe, expect, it } from "vitest";
import { formatResearchDate, pluralize } from "@/lib/format";

describe("formatResearchDate", () => {
  it("writes dates as '30 Sep 2026' (never 'Sept', which some ICU versions produce)", () => {
    expect(formatResearchDate("2026-09-30")).toBe("30 Sep 2026");
    expect(formatResearchDate("2026-01-05")).toBe("5 Jan 2026");
  });

  it("uses the calendar date regardless of the machine's time zone", () => {
    expect(formatResearchDate("2026-12-31T23:30:00Z")).toBe("31 Dec 2026");
  });
});

describe("pluralize", () => {
  it("picks singular or plural", () => {
    expect(pluralize(1, "source")).toBe("1 source");
    expect(pluralize(0, "source")).toBe("0 sources");
    expect(pluralize(2, "person", "people")).toBe("2 people");
  });
});
