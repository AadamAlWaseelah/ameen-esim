/*
  Lightweight admin session for the single-admin /admin area.

  No third-party auth: the operator sets ADMIN_PASSWORD, logs in once, and we
  issue a signed, expiring cookie. The cookie holds `{exp}` signed with an HMAC
  keyed by ADMIN_PASSWORD — so it can't be forged without the password, and it
  is not the password itself. Uses Web Crypto only, so the same code runs in the
  edge middleware and in Node route handlers.
*/

export const ADMIN_COOKIE = "ameen_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 ? 4 - (padded.length % 4) : 0;
  const binary = atob(padded + "=".repeat(pad));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Constant-time string compare to avoid leaking via timing.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64url(new Uint8Array(signature));
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = base64url(
    encoder.encode(JSON.stringify({ exp: Date.now() + TTL_MS })),
  );
  const signature = await hmac(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !secret) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload, secret);
  if (!safeEqual(signature, expected)) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64url(payload)));
    return typeof data?.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
