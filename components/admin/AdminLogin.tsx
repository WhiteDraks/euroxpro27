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
    }).catch(() => null);
    setBusy(false);
    if (!response) {
      setError("Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.");
      return;
    }
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
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-[#DCCFBE] rounded-sm p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#140D0E] rounded-sm flex items-center justify-center text-white">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="font-serif-title text-xl text-[#140D0E]">İçerik Editörü</h1>
            <p className="text-xs text-[#6B5B55]">Devam etmek için yönetici şifresini girin.</p>
          </div>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          aria-label="Yönetici şifresi"
          maxLength={256}
          className="w-full border border-[#DCCFBE] rounded-sm px-3 py-2.5 text-base sm:text-sm bg-white text-[#140D0E] placeholder:text-[#6B5B55] focus:border-[#7D1A30] outline-none"
          autoFocus
        />
        {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full bg-[#7D1A30] text-white text-sm font-semibold py-2.5 rounded-sm disabled:opacity-50"
        >
          {busy ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
