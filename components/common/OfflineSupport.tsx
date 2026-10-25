"use client";

import { useEffect, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

// ============================================================
// Registers the service worker (public/sw.js) so pages opened once
// keep working without internet, and shows a small notice while the
// visitor is offline.
// ============================================================

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const isOffline = () => !navigator.onLine;
const onlineOnServer = () => false;

export function OfflineSupport() {
  const offline = useSyncExternalStore(subscribe, isOffline, onlineOnServer);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => {
          // The photos on this first page loaded before the worker existed,
          // so pass their addresses along to be saved too (the browser cache
          // usually still has them, so this costs little or nothing).
          const images = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter((name) => /\/_next\/image|\/images\/|\/uploads\//.test(name));
          registration.active?.postMessage({ type: "precache", images });
        })
        .catch(() => {});
    };
    // Wait until the page has finished loading so this never slows it down.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  if (!offline) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md flex items-center gap-3 bg-[#101B35] text-[#F7F3ED] border border-[#2A3556] rounded-sm px-4 py-3 shadow-lg text-sm"
    >
      <WifiOff size={16} className="text-[#e58aa6] flex-shrink-0" />
      <span>You are offline. Showing the version saved on this device.</span>
    </div>
  );
}
