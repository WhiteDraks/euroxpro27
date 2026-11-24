"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays, ChevronRight, Home, Landmark, Mail, Megaphone, MessageCircleQuestion, MoreHorizontal, Plane, ShoppingBag, Users, X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Navigation, following Apple's HIG: a translucent bar at the top,
// and on phones a tab bar at the bottom with the four main places
// plus "More", which opens a sheet with the rest.
// ============================================================

type NavItem = { href: string; label: string; icon: LucideIcon };

const desktopLinks: NavItem[] = [
  { href: "/congress", label: "Congress", icon: CalendarDays },
  { href: "/explore-antalya", label: "Antalya", icon: Landmark },
  { href: "/delegate-guide", label: "Travel guide", icon: Plane },
  { href: "/faq", label: "Questions", icon: MessageCircleQuestion },
  { href: "/announcements", label: "News", icon: Megaphone },
  { href: "/team", label: "Team", icon: Users },
];

const tabs: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/congress", label: "Congress", icon: CalendarDays },
  { href: "/explore-antalya", label: "Antalya", icon: Landmark },
  { href: "/delegate-guide", label: "Travel", icon: Plane },
];

const moreLinks: NavItem[] = [
  { href: "/faq", label: "Questions", icon: MessageCircleQuestion },
  { href: "/announcements", label: "News", icon: Megaphone },
  { href: "/team", label: "Team", icon: Users },
  { href: "/merch", label: "Merch", icon: ShoppingBag },
  { href: "/contact", label: "Contact us", icon: Mail },
];

export function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setMoreOpen(false);
  const inMore = moreLinks.some((l) => l.href === pathname);

  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [moreOpen]);

  return (
    <>
      {/* ── Top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-bar border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
            <Link href="/" onClick={close} className="flex items-center py-1" aria-label="EUROXPRO'27 home">
              <Image
                src="/images/euroxpro-logo-light.png"
                alt="EUROXPRO Türkiye"
                width={130}
                height={41}
                loading="eager"
                className="h-8 lg:h-9 w-auto object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    pathname === link.href ? "bg-white/15 text-white" : "text-[#E9DED2]/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/merch"
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full text-[#E9DED2]/80 hover:text-white hover:bg-white/10"
                aria-label="Merch"
                title="Merch"
              >
                <ShoppingBag size={18} />
              </Link>
              <Link
                href="/contact"
                onClick={close}
                className="inline-flex items-center px-4 lg:px-5 h-9 lg:h-10 rounded-full bg-[#7D1A30] text-white text-sm font-semibold hover:bg-[#A3304A] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Phone tab bar ── */}
      <nav
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-bar border-t border-white/10 pb-[env(safe-area-inset-bottom)]",
          // The content editor has its own save bar at the bottom.
          pathname.startsWith("/admin") && "hidden"
        )}
        aria-label="Tabs"
      >
        <ul className="grid grid-cols-5 h-[64px]">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href && !moreOpen;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "h-full flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                    active ? "text-[#E0647D]" : "text-[#B8A69C]"
                  )}
                >
                  <Icon size={24} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
              aria-controls="more-sheet"
              className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-1 text-[11px] font-medium",
                moreOpen || inMore ? "text-[#E0647D]" : "text-[#B8A69C]"
              )}
            >
              {moreOpen ? <X size={24} aria-hidden="true" /> : <MoreHorizontal size={24} aria-hidden="true" />}
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* ── "More" sheet (phones) ── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity duration-200",
          moreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!moreOpen}
      >
        <div className="absolute inset-0 bg-black/60" onClick={close} />
        <div
          id="more-sheet"
          className={cn(
            "absolute left-2 right-2 bottom-[calc(72px+env(safe-area-inset-bottom))] rounded-[28px] bg-[#1C1416] border border-white/10 p-2 transition-transform duration-300",
            moreOpen ? "translate-y-0" : "translate-y-6"
          )}
        >
          <ul className="divide-y divide-white/10">
            {moreLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  tabIndex={moreOpen ? 0 : -1}
                  className="flex items-center gap-4 px-3 py-3.5 text-[17px] text-white"
                >
                  <span className="w-9 h-9 rounded-[10px] bg-[#7D1A30] flex items-center justify-center flex-shrink-0">
                    <Icon size={19} className="text-white" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={18} className="text-white/40" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
