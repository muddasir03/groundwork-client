import "server-only";
import { cookies } from "next/headers";

// The admin session cookie holds the API session token. It never reaches browser JavaScript:
// - HttpOnly: scripts can't read it (an XSS bug can't steal it);
// - Secure: HTTPS only (in production);
// - SameSite=Strict: never sent on requests started by another site (with Next's Origin check on
//   server actions, this blocks CSRF);
// - __Host- prefix (production): the browser enforces Secure, Path=/ and no Domain, so no other
//   (sub)domain can set or overwrite it.
// See docs/SECURITY.md in groundwork-api.

const PRODUCTION = process.env.NODE_ENV === "production";
export const ADMIN_COOKIE = PRODUCTION ? "__Host-gw_admin" : "gw_admin";

export function adminCookieOptions(expiresAt: Date) {
  return { httpOnly: true, secure: PRODUCTION, sameSite: "strict" as const, path: "/", expires: expiresAt };
}

/** The session token, if any. Presence doesn't mean it's valid; verifyAdmin() checks with the API. */
export async function readAdminToken(): Promise<string | undefined> {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  // Tokens are base64url, 43 characters; anything else is ignored rather than sent to the API.
  return value && /^[A-Za-z0-9_-]{20,100}$/.test(value) ? value : undefined;
}

/** Server actions and route handlers only (Server Components can't set cookies). */
export async function writeAdminSession(token: string, expiresAt: Date) {
  (await cookies()).set(ADMIN_COOKIE, token, adminCookieOptions(expiresAt));
}

/** Server actions and route handlers only. */
export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
