import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  createSessionToken,
  getSessionSecret,
  safeEqualSecret,
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
  Brute-force throttle: per-IP failed-attempt counter. In-memory, so on
  serverless it is per-instance and resets on cold start — not a hard
  guarantee, but it turns "guess thousands of passwords per minute" into a
  crawl at near-zero cost. Kept on globalThis to survive dev hot reloads.
*/
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type Attempts = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __ameenLoginAttempts: Map<string, Attempts> | undefined;
}

function attemptsFor(ip: string): Attempts {
  globalThis.__ameenLoginAttempts ??= new Map();
  const map = globalThis.__ameenLoginAttempts;
  const now = Date.now();
  const existing = map.get(ip);
  if (existing && existing.resetAt > now) return existing;
  const fresh: Attempts = { count: 0, resetAt: now + WINDOW_MS };
  map.set(ip, fresh);
  return fresh;
}

function clientIp(request: Request): string {
  // Vercel/most proxies set the real client IP first in x-forwarded-for.
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = getSessionSecret();
  if (!password || !secret) {
    return NextResponse.json(
      { error: "Admin password is not configured (ADMIN_PASSWORD)." },
      { status: 503 },
    );
  }

  const attempts = attemptsFor(clientIp(request));
  if (attempts.count >= MAX_FAILURES) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supplied = typeof body.password === "string" ? body.password : "";
  if (!supplied || !(await safeEqualSecret(supplied, password))) {
    attempts.count += 1;
    await sleep(400); // flat cost per failure; also masks compare timing
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.count = 0;
  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

// Logout.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
