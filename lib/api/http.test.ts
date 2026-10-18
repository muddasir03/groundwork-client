import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet, segment } from "@/lib/api/http";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test/");
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("apiGet", () => {
  it("calls /api/v1 on the configured base URL and parses JSON", async () => {
    fetchMock.mockResolvedValue(json({ data: [1] }));
    expect(await apiGet("/companies")).toEqual({ data: [1] });
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/companies", expect.objectContaining({ headers: { Accept: "application/json" } }));
  });

  it("returns null for 404 (missing or unpublished)", async () => {
    fetchMock.mockResolvedValue(json({ error: { code: "not_found" } }, 404));
    expect(await apiGet("/companies/nope")).toBeNull();
  });

  it("throws an ApiError for other failures, including network errors", async () => {
    fetchMock.mockResolvedValue(json({}, 500));
    await expect(apiGet("/companies")).rejects.toMatchObject({ name: "ApiError", status: 500 });

    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(apiGet("/companies")).rejects.toBeInstanceOf(ApiError);
  });

  it("refuses to run without a configured API URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    await expect(apiGet("/companies")).rejects.toThrow("NEXT_PUBLIC_API_URL is not set");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("segment", () => {
  it("encodes values so they can't change which endpoint is called", () => {
    expect(segment("../admin")).toBe("..%2Fadmin");
    expect(segment("a?b=c#d")).toBe("a%3Fb%3Dc%23d");
    expect(segment("brisa-people")).toBe("brisa-people");
  });
});
