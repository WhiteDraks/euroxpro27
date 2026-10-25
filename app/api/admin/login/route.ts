import { NextResponse } from "next/server";
import { checkPassword, isAdminConfigured, startSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set on the server." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!checkPassword(password)) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  await startSession();
  return NextResponse.json({ ok: true });
}
