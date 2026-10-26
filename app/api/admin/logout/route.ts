import { NextResponse } from "next/server";
import { endSession, isSameOrigin } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  await endSession();
  return NextResponse.json({ ok: true });
}
