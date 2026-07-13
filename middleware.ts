import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE, getSessionSecret, verifySessionToken } from "@/lib/admin/auth";

/*
  Gate the /admin area (pages + APIs) and operator-only APIs (/api/esim/*,
  e.g. the provider health check — it exposes reseller balance and hits the
  provider on every request) behind the admin session cookie.
  Fails CLOSED: if the secret is unset the admin is locked, never open.
  The login page and login API are intentionally public.
*/
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const secret = getSessionSecret();
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = await verifySessionToken(token, secret);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*", "/api/esim/:path*"],
};
