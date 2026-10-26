import { NextResponse } from "next/server";
import { isAuthenticated, isSameOrigin } from "@/lib/admin/auth";
import { storageMode, storeImage } from "@/lib/admin/store";

const MAX_BYTES = 4 * 1024 * 1024;

function detectImageType(data: Buffer): "webp" | "jpg" | "png" | null {
  if (data.length > 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpg";
  if (data.length > 8 && data.toString("hex", 0, 8) === "89504e470d0a1a0a") return "png";
  return null;
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (storageMode() === "unconfigured") {
    return NextResponse.json(
      { error: "Uploading is not configured: set GITHUB_TOKEN in the Vercel environment variables." },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "The image is larger than 4 MB." }, { status: 413 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const type = detectImageType(data);
  if (!type) {
    return NextResponse.json({ error: "Only JPG, PNG and WebP images are supported." }, { status: 415 });
  }

  const originalName = file instanceof File ? file.name : "image";
  const fileName = `${slugify(originalName)}-${Date.now().toString(36)}.${type}`;
  try {
    const pending = await storeImage(fileName, data);
    return NextResponse.json({ src: `/uploads/${fileName}`, pending });
  } catch (error) {
    console.error("[admin] upload failed", error);
    return NextResponse.json({ error: "Upload failed. Check the GitHub token and repository settings." }, { status: 502 });
  }
}
