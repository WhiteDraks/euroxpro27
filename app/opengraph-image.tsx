import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { siteConfig } from "@/lib/config";
import { content } from "@/lib/content";

// ============================================================
// Share preview image (WhatsApp, Instagram, LinkedIn, X).
// Built once at deploy time from the home hero photo, so changing the
// hero photo in /admin also updates the preview. Saved as a small JPEG
// because WhatsApp skips previews with large images.
// ============================================================

export const alt = `${siteConfig.name} · ${siteConfig.venueCity} · ${siteConfig.datesLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const publicFile = (src: string) => readFile(path.join(process.cwd(), "public", src));

async function loadPhoto(src: string): Promise<Buffer> {
  if (src.startsWith("/")) return publicFile(src);
  const url = new URL(src);
  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("w", "1400");
    url.searchParams.set("q", "75");
    url.searchParams.set("fm", "jpg");
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`photo ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function heroPhoto(): Promise<string | null> {
  try {
    const photo = await sharp(await loadPhoto(content.home.hero.image))
      .resize(size.width, size.height, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${photo.toString("base64")}`;
  } catch (error) {
    // Without the photo the preview still shows the branded navy card.
    console.warn("[opengraph-image] hero photo unavailable:", error);
    return null;
  }
}

export default async function OpengraphImage() {
  const [photo, logo] = await Promise.all([
    heroPhoto(),
    sharp(await publicFile(siteConfig.logo)).resize({ width: 520 }).png().toBuffer(),
  ]);
  const { hero } = content.home;

  const png = await new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#101B35" }}>
        {photo && (
          <img src={photo} alt="" width={size.width} height={size.height} style={{ position: "absolute", top: 0, left: 0 }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(90deg, rgba(16,27,53,0.96) 0%, rgba(16,27,53,0.82) 48%, rgba(16,27,53,0.25) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            color: "white",
          }}
        >
          <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={340} height={106} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1, display: "flex", flexDirection: "column" }}>
              <span>{hero.titleLine1}</span>
              <span style={{ color: "#F2B8CA" }}>{hero.titleLine2}</span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 36, fontSize: 28 }}>
              <span style={{ background: "#741F3D", padding: "10px 20px", borderRadius: 4 }}>{siteConfig.datesLabel}</span>
              <span style={{ background: "rgba(23,36,67,0.9)", border: "1px solid #233152", padding: "10px 20px", borderRadius: 4 }}>
                {siteConfig.venueCity}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  ).arrayBuffer();

  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": contentType } });
}
