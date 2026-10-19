import { type NextRequest, NextResponse } from "next/server";

// Optimistic check only: sends visitors without an admin cookie to the login page before rendering.
// It does NOT prove the session is valid. Real checks happen in every admin page and server action
// (verifyAdmin in lib/admin/dal.ts) and again in the API.

const COOKIES = ["__Host-gw_admin", "gw_admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return NextResponse.next();

  const hasSession = COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
