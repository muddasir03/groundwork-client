import { afterEach, describe, expect, it, vi } from "vitest";

const setCalls: Array<[string, string, Record<string, unknown>]> = [];
vi.mock("next/headers", () => ({ cookies: async () => ({ set: (...args: [string, string, Record<string, unknown>]) => setCalls.push(args) }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("admin session cookie", () => {
  it("is locked down in production: __Host- prefix, Secure, HttpOnly, SameSite=Strict, whole site", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { ADMIN_COOKIE, adminCookieOptions } = await import("@/lib/admin/session");
    const expires = new Date("2026-10-19T20:00:00Z");
    expect(ADMIN_COOKIE).toBe("__Host-gw_admin");
    expect(adminCookieOptions(expires)).toEqual({ httpOnly: true, secure: true, sameSite: "strict", path: "/", expires });
  });

  it("works over plain http in local development, still HttpOnly and Strict", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { ADMIN_COOKIE, adminCookieOptions } = await import("@/lib/admin/session");
    expect(ADMIN_COOKIE).toBe("gw_admin");
    expect(adminCookieOptions(new Date())).toMatchObject({ httpOnly: true, secure: false, sameSite: "strict" });
  });
});

describe("deleting the cookies", () => {
  it("overwrites them expired with the same Secure flags, which browsers require for prefixed cookies", async () => {
    vi.stubEnv("NODE_ENV", "production");
    setCalls.length = 0;
    const { clearAdminSession, clearLoginChallenge } = await import("@/lib/admin/session");
    await clearAdminSession();
    await clearLoginChallenge();
    expect(setCalls[0]).toEqual(["__Host-gw_admin", "", expect.objectContaining({ secure: true, httpOnly: true, path: "/", maxAge: 0 })]);
    expect(setCalls[1]).toEqual(["__Secure-gw_admin_challenge", "", expect.objectContaining({ secure: true, path: "/admin/login", maxAge: 0 })]);
  });
});
