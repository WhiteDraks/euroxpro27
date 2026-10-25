import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// ============================================================
// Admin authentication: a single shared password (ADMIN_PASSWORD).
// The session cookie holds an HMAC of the password, so changing the
// password in the environment logs every open session out.
// ============================================================

export const ADMIN_COOKIE = "euroxpro_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sessionToken(password: string) {
  return createHmac("sha256", password).update("euroxpro-admin-session-v1").digest("hex");
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
  return safeEqual(sessionToken(candidate), sessionToken(password));
}

export async function isAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(token) && safeEqual(token!, sessionToken(password));
}

export async function startSession() {
  const password = process.env.ADMIN_PASSWORD!;
  (await cookies()).set(ADMIN_COOKIE, sessionToken(password), {
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
