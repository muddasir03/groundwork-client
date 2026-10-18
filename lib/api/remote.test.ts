import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// cacheLife only works inside Next's "use cache" runtime; outside it, the directive is a plain string.
vi.mock("next/cache", () => ({ cacheLife: () => undefined }));

const { fetchCompany } = await import("@/lib/api/remote");

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test");
});
afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("fetchCompany", () => {
  it("never sends a malformed slug to the API", async () => {
    for (const slug of ["../admin", "Brisa People", "a/b", "", "x?y=1"]) {
      expect(await fetchCompany(slug)).toBeNull();
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches a valid slug and unwraps the data", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { slug: "brisa-people" } }), { status: 200 }));
    expect(await fetchCompany("brisa-people")).toEqual({ slug: "brisa-people" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/companies/brisa-people");
  });
});
