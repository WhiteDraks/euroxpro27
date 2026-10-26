"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (response.ok) {
      router.refresh();
    } else {
      setError(
        response.status === 401
          ? "Şifre yanlış."
          : response.status === 429
            ? "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin."
            : "Giriş yapılamadı, tekrar deneyin."
      );
    }
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-[70vh] flex items-start justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-[#E5E1DA] rounded-sm p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#101B35] rounded-sm flex items-center justify-center text-white">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="font-serif-title text-xl text-[#101B35]">İçerik Editörü</h1>
            <p className="text-xs text-[#5A6478]">Devam etmek için yönetici şifresini girin.</p>
          </div>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="w-full border border-[#E5E1DA] rounded-sm px-3 py-2.5 text-sm focus:border-[#741F3D] outline-none"
          autoFocus
        />
        {error && <p className="text-xs text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full bg-[#741F3D] text-white text-sm font-semibold py-2.5 rounded-sm disabled:opacity-50"
        >
          {busy ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
