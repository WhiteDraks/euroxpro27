import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// ============================================================
// Admin authentication: a single shared password (ADMIN_PASSWORD).
// The session cookie holds its issue time signed with a key derived from
// the password, so sessions expire after SESSION_MAX_AGE and changing the
// password in the environment logs every open session out.
// ============================================================

export const ADMIN_COOKIE = "euroxpro_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function signingKey(password: string) {
  return createHmac("sha256", password).update("euroxpro-admin-session-v2").digest();
}

function sign(issuedAt: string, password: string) {
  return createHmac("sha256", signingKey(password)).update(issuedAt).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compare fixed-length digests so the check takes the same time for any input.
  const digest = (value: string) => createHmac("sha256", "euroxpro-admin-check").update(value).digest("hex");
  return safeEqual(digest(candidate), digest(password));
}

export async function isAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d{10}$/.test(issuedAt)) return false;
  const age = Math.floor(Date.now() / 1000) - Number(issuedAt);
  if (age < -60 || age > SESSION_MAX_AGE) return false;
  return safeEqual(signature, sign(issuedAt, password));
}

export async function startSession() {
  const password = process.env.ADMIN_PASSWORD!;
  const issuedAt = String(Math.floor(Date.now() / 1000));
  (await cookies()).set(ADMIN_COOKIE, `${issuedAt}.${sign(issuedAt, password)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

// Rejects state-changing requests sent from another site. The strict
// SameSite cookie already blocks most of these; this is a second lock.
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Best-effort brake on password guessing. Serverless instances do not share
// memory, so this limits each instance; a long password is the real defence.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; since: number }>();

export function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function isLockedOut(ip: string) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.since > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(ip: string) {
  const now = Date.now();
  const entry = failures.get(ip);
  if (!entry || now - entry.since > WINDOW_MS) failures.set(ip, { count: 1, since: now });
  else entry.count += 1;
  if (failures.size > 5000) failures.clear();
}

export function clearFailures(ip: string) {
  failures.delete(ip);
}
