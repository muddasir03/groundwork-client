import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Next's request APIs, replaced with test doubles ("server-only" is aliased in vitest.config.mts).

const cookieJar = new Map<string, { value: string; options?: Record<string, unknown> }>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name)!.value } : undefined),
    set: (name: string, value: string, options: Record<string, unknown>) => cookieJar.set(name, { value, options }),
    delete: (name: string) => cookieJar.delete(name),
  }),
}));

class RedirectError extends Error {
  constructor(readonly url: string) {
    super(`NEXT_REDIRECT ${url}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new RedirectError(url);
  },
}));

const updateTag = vi.fn();
vi.mock("next/cache", () => ({ updateTag: (tag: string) => updateTag(tag), cacheLife: () => undefined, cacheTag: () => undefined }));

const { changeStatus, login, logout, saveReport } = await import("./actions");

const fetchMock = vi.fn();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const form = (fields: Record<string, string>) => {
  const data = new FormData();
  Object.entries(fields).forEach(([k, v]) => data.set(k, v));
  return data;
};
const TOKEN = "a".repeat(43);

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test");
  cookieJar.clear();
});
afterEach(() => {
  fetchMock.mockReset();
  updateTag.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("login", () => {
  it("stores the token in a locked-down cookie, redirects, and never returns it", async () => {
    fetchMock.mockResolvedValue(json({ data: { token: TOKEN, expiresAt: "2026-10-19T20:00:00Z", user: {} } }, 201));
    const error = await login(null, form({ email: "admin@example.com", password: "a long password" })).catch((e) => e);

    expect(error).toBeInstanceOf(RedirectError);
    expect(error.url).toBe("/admin");
    const cookie = cookieJar.get("gw_admin")!;
    expect(cookie.value).toBe(TOKEN);
    expect(cookie.options).toMatchObject({ httpOnly: true, sameSite: "strict", path: "/" });
    expect(cookie.options!.expires).toEqual(new Date("2026-10-19T20:00:00Z"));
  });

  it("gives one generic message for wrong credentials", async () => {
    fetchMock.mockResolvedValue(json({ error: { code: "invalid_credentials" } }, 401));
    const result = await login(null, form({ email: "x@example.com", password: "wrong one here" }));
    expect(result).toEqual({ ok: false, message: "That email and password don't match an admin account." });
    expect(cookieJar.size).toBe(0);
  });

  it("explains rate limiting and an unreachable server", async () => {
    fetchMock.mockResolvedValue(json({}, 429));
    expect((await login(null, form({ email: "a@example.com", password: "whatever long" }))).ok).toBe(false);

    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    const result = await login(null, form({ email: "a@example.com", password: "whatever long" }));
    expect(result).toMatchObject({ ok: false, message: expect.stringContaining("isn't responding") });
  });

  it("rejects empty or oversized input without calling the API", async () => {
    await login(null, form({ email: "", password: "x" }));
    await login(null, form({ email: "a@example.com", password: "x".repeat(201) }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("logout", () => {
  it("revokes the session on the server and clears the cookie", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const error = await logout().catch((e) => e);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/admin/session", expect.objectContaining({ method: "DELETE" }));
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${TOKEN}`);
    expect(cookieJar.has("gw_admin")).toBe(false);
    expect(error.url).toBe("/admin/login");
  });
});

describe("protected actions", () => {
  it("send visitors without a session to the login page, without touching the API", async () => {
    const error = await changeStatus("brisa-people", null, form({ status: "published" })).catch((e) => e);
    expect(error.url).toBe("/admin/login");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-check the session with the API before writing", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    fetchMock.mockResolvedValueOnce(json({ error: { code: "unauthorized" } }, 401)); // session check
    const error = await saveReport("brisa-people", { sources: [] }).catch((e) => e);
    expect(error.url).toBe("/admin/login?expired=1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refuse malformed company slugs, so a value like ../ can't reach another endpoint", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    await expect(saveReport("../session", {})).rejects.toThrow("Invalid company");
    await expect(changeStatus("a/b", null, form({ status: "draft" }))).rejects.toThrow("Invalid company");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("save a report and expire the public cache", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    fetchMock
      .mockResolvedValueOnce(json({ data: { user: { id: "1", emailAddress: "a@example.com", role: "admin" } } })) // session check
      .mockResolvedValueOnce(json({ data: { slug: "brisa-people" } })); // the write
    const result = await saveReport("brisa-people", { sources: [], technologies: ["Rails"] });
    expect(result).toEqual({ ok: true, message: "Report saved." });
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe("https://api.example.test/api/v1/admin/companies/brisa-people/report");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body).report.technologies).toEqual(["Rails"]);
    expect(updateTag).toHaveBeenCalledWith("companies");
  });

  it("pass the API's validation problems back to the form", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    fetchMock
      .mockResolvedValueOnce(json({ data: { user: {} } }))
      .mockResolvedValueOnce(json({ error: { code: "invalid", message: "Please fix the highlighted problems.", details: [{ path: "status", message: "Add a summary" }] } }, 422));
    const result = await changeStatus("brisa-people", null, form({ status: "published" }));
    expect(result).toEqual({ ok: false, message: "Please fix the highlighted problems.", errors: [{ path: "status", message: "Add a summary" }] });
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("reject unknown statuses before calling the API", async () => {
    cookieJar.set("gw_admin", { value: TOKEN });
    expect(await changeStatus("brisa-people", null, form({ status: "deleted" }))).toEqual({ ok: false, message: "Unknown status." });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
