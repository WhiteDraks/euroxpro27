import { NextResponse } from "next/server";
import { endSession } from "@/lib/admin/auth";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
