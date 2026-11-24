"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays, Home, Landmark, Mail, Megaphone, Menu, MessageCircleQuestion, Plane, ShoppingBag, Users, X, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Short, plain labels. The mobile menu shows an icon next to each so the
// page is easy to find even without reading.
const navLinks: { href: string; label: string; icon: LucideIcon; desktop: boolean }[] = [
  { href: "/", label: "Home", icon: Home, desktop: false },
  { href: "/congress", label: "Congress", icon: CalendarDays, desktop: true },
  { href: "/explore-antalya", label: "Antalya", icon: Landmark, desktop: true },
  { href: "/delegate-guide", label: "Travel guide", icon: Plane, desktop: true },
  { href: "/faq", label: "Questions", icon: MessageCircleQuestion, desktop: true },
  { href: "/announcements", label: "News", icon: Megaphone, desktop: true },
  { href: "/team", label: "Team", icon: Users, desktop: true },
  { href: "/merch", label: "Merch", icon: ShoppingBag, desktop: false },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#7D1A30]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            <Link href="/" onClick={closeMenu} className="flex items-center py-1" aria-label="EUROXPRO'27 home">
              <Image
                src="/images/euroxpro-logo-light.png"
                alt="EUROXPRO Türkiye"
                width={140}
                height={44}
                loading="eager"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.filter((l) => l.desktop).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors",
                    pathname === link.href ? "bg-[#F4EDE2] text-[#7D1A30]" : "text-[#FBF7F0] hover:bg-white/15"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/merch"
                onClick={closeMenu}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full text-[#FBF7F0] hover:bg-white/15"
                aria-label="Merch"
                title="Merch"
              >
                <ShoppingBag size={19} />
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-[#0E0909] text-[#FBF7F0] text-[15px] font-bold hover:bg-[#140D0E] transition-colors"
              >
                Contact
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F4EDE2] text-[#140D0E] text-[15px] font-bold"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
                {isOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu: full screen, big buttons. */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-[#7D1A30] pt-16 transition-opacity duration-200",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <nav className="h-full overflow-y-auto px-4 pb-8 pt-4" aria-label="Mobile">
          <ul className="grid grid-cols-2 gap-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  tabIndex={isOpen ? 0 : -1}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl p-4 font-serif-title text-2xl transition-colors",
                    pathname === href ? "bg-[#F4EDE2] text-[#7D1A30]" : "bg-[#64142A] text-[#FBF7F0] hover:bg-[#561024]"
                  )}
                >
                  <Icon size={28} aria-hidden="true" className={pathname === href ? "text-[#7D1A30]" : "text-[#E8D5B5]"} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#0E0909] text-[#FBF7F0] font-bold text-lg py-4"
          >
            <Mail size={20} aria-hidden="true" /> Contact us
          </Link>
        </nav>
      </div>
    </>
  );
}
