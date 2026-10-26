import { NextResponse } from "next/server";
import {
  checkPassword, clearFailures, clientIp, isAdminConfigured, isLockedOut, isSameOrigin, recordFailure, startSession,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set on the server." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password.slice(0, 256) : "";
  // Check the lock only after the body is read, with no await between the
  // check and recording a failure, so a burst of parallel guesses cannot
  // all pass the check before the first failure is counted.
  const ip = clientIp(request);
  if (isLockedOut(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  if (!checkPassword(password)) {
    recordFailure(ip);
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  clearFailures(ip);
  await startSession();
  return NextResponse.json({ ok: true });
}
