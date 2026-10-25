import type { Metadata } from "next";
import { connection } from "next/server";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/auth";
import { readContent, storageMode } from "@/lib/admin/store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Content Editor",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Always render per request: the page depends on the session cookie and env.
  await connection();

  if (!isAdminConfigured()) {
    return (
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto bg-white border border-[#E5E1DA] rounded-sm p-8 space-y-3 text-sm text-[#374151]">
          <h1 className="font-serif-title text-2xl text-[#101B35]">İçerik editörü henüz kurulmadı</h1>
          <p>
            Editörü açmak için sunucuda <code className="font-mono">ADMIN_PASSWORD</code> ortam değişkenini
            ayarlayın (Vercel → Project → Settings → Environment Variables). Kurulum adımları README dosyasında.
          </p>
        </div>
      </div>
    );
  }

  if (!(await isAuthenticated())) {
    return <AdminLogin />;
  }

  const content = await readContent().catch((error) => {
    console.error("[admin] could not load content", error);
    return null;
  });
  if (content) {
    return <ContentEditor initialContent={content} mode={storageMode()} />;
  }

  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-sm p-8 space-y-3 text-sm text-[#374151]">
        <h1 className="font-serif-title text-2xl text-[#101B35]">İçerik yüklenemedi</h1>
        <p>
          GitHub&apos;dan içerik okunamadı. <code className="font-mono">GITHUB_TOKEN</code>,{" "}
          <code className="font-mono">GITHUB_REPO</code> ve <code className="font-mono">GITHUB_BRANCH</code> ayarlarını
          kontrol edin.
        </p>
      </div>
    </div>
  );
}
