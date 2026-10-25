import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteContent } from "@/lib/content";

// ============================================================
// Content storage for the /admin editor.
//
// - With GITHUB_TOKEN set (production on Vercel), every save becomes one
//   commit on GITHUB_BRANCH. Vercel then redeploys the site with the new
//   texts and photos, usually within a minute or two.
// - Without it (local `npm run dev`), files are written straight to disk.
// ============================================================

const CONTENT_PATH = "content/site.json";
const UPLOAD_DIR = "public/uploads";

export type PendingUpload = { path: string; sha: string };

export function storageMode(): "github" | "filesystem" | "unconfigured" {
  if (process.env.GITHUB_TOKEN) return "github";
  if (!process.env.VERCEL) return "filesystem";
  return "unconfigured";
}

function githubRepo() {
  return process.env.GITHUB_REPO || "WhiteDraks/euroxpro27";
}

function githubBranch() {
  return process.env.GITHUB_BRANCH || "main";
}

async function github<T>(endpoint: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${githubRepo()}${endpoint}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API ${response.status} on ${endpoint}: ${detail.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

export async function readContent(): Promise<SiteContent> {
  if (storageMode() === "github") {
    const file = await github<{ content: string }>(
      `/contents/${CONTENT_PATH}?ref=${encodeURIComponent(githubBranch())}`
    );
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  }
  const raw = await fs.readFile(path.join(process.cwd(), CONTENT_PATH), "utf8");
  return JSON.parse(raw);
}

// Stores an uploaded image. In GitHub mode the file becomes a blob that is
// only attached to the repository by the next saveContent commit, so
// uploading alone never triggers a redeploy.
export async function storeImage(fileName: string, data: Buffer): Promise<PendingUpload | null> {
  const repoPath = `${UPLOAD_DIR}/${fileName}`;
  if (storageMode() === "github") {
    const blob = await github<{ sha: string }>("/git/blobs", {
      method: "POST",
      body: { content: data.toString("base64"), encoding: "base64" },
    });
    return { path: repoPath, sha: blob.sha };
  }
  const target = path.join(process.cwd(), repoPath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, data);
  return null;
}

export async function saveContent(next: SiteContent, uploads: PendingUpload[]) {
  const serialized = JSON.stringify(next, null, 2) + "\n";

  if (storageMode() !== "github") {
    await fs.writeFile(path.join(process.cwd(), CONTENT_PATH), serialized, "utf8");
    return { commitUrl: null as string | null };
  }

  const branch = encodeURIComponent(githubBranch());
  const ref = await github<{ object: { sha: string } }>(`/git/ref/heads/${branch}`);
  const parent = await github<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
  const contentBlob = await github<{ sha: string }>("/git/blobs", {
    method: "POST",
    body: { content: serialized, encoding: "utf-8" },
  });
  const tree = await github<{ sha: string }>("/git/trees", {
    method: "POST",
    body: {
      base_tree: parent.tree.sha,
      tree: [
        { path: CONTENT_PATH, mode: "100644", type: "blob", sha: contentBlob.sha },
        ...uploads.map((upload) => ({ path: upload.path, mode: "100644", type: "blob", sha: upload.sha })),
      ],
    },
  });
  const commit = await github<{ sha: string; html_url: string }>("/git/commits", {
    method: "POST",
    body: {
      message: "content: update site texts and photos from /admin",
      tree: tree.sha,
      parents: [ref.object.sha],
    },
  });
  await github(`/git/refs/heads/${branch}`, { method: "PATCH", body: { sha: commit.sha } });
  return { commitUrl: commit.html_url };
}
