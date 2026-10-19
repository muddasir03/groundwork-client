import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({}) }));

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
