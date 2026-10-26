import { NextResponse } from "next/server";
import { isAuthenticated, isSameOrigin } from "@/lib/admin/auth";
import { readContent, saveContent, storageMode } from "@/lib/admin/store";
import { validateContent, validateUploads } from "@/lib/admin/validate";
import type { SiteContent } from "@/lib/content";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  return NextResponse.json({ content: await readContent(), mode: storageMode() });
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (storageMode() === "unconfigured") {
    return NextResponse.json(
      { error: "Saving is not configured: set GITHUB_TOKEN in the Vercel environment variables." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const errors = validateContent(body?.content);
  if (errors.length > 0) {
    return NextResponse.json({ error: "The content has problems.", details: errors }, { status: 400 });
  }
  const uploads = validateUploads(body?.uploads ?? []);
  if (!uploads) {
    return NextResponse.json({ error: "Invalid uploaded image list." }, { status: 400 });
  }

  try {
    const result = await saveContent(body.content as SiteContent, uploads);
    return NextResponse.json({ ok: true, mode: storageMode(), ...result });
  } catch (error) {
    console.error("[admin] save failed", error);
    return NextResponse.json({ error: "Saving failed. Check the GitHub token and repository settings." }, { status: 502 });
  }
}
