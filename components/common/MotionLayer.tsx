"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ============================================================
// Site-wide motion, kept in one small place:
//  - anything with `.reveal` fades and rises in when it scrolls
//    into view (children of `[data-stagger]` follow one by one);
//  - cards with `.spot` get a soft light that follows the pointer.
// Nothing runs for people who ask their device for less motion,
// and without JavaScript everything is simply visible.
// ============================================================

export function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const watch = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    // Wait a frame so the new page's markup is in place, then keep
    // watching for content that appears later (tabs, filters).
    const id = requestAnimationFrame(watch);
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(id);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".spot") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
