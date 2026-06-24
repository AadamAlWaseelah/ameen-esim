import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";

/*
  Gate the /admin area (pages + APIs) behind the ADMIN_PASSWORD session cookie.
  Fails CLOSED: if ADMIN_PASSWORD is unset the admin is locked, never open.
  The login page and login API are intentionally public.
*/
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_PASSWORD;
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
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
