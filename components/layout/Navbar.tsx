"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/congress", label: "The Congress" },
  { href: "/delegate-guide", label: "Delegate Guide" },
  { href: "/explore-istanbul", label: "Explore Istanbul" },
  { href: "/faq", label: "FAQ" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#101B35]/97 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 group"
              aria-label="EUROXPRO'27 - Go to homepage"
            >
              <div className="w-8 h-8 bg-[#741F3D] rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs tracking-tight">EXP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-white font-bold text-lg leading-none tracking-tight">
                  EUROXPRO
                  <span className="text-[#741F3D]">&apos;27</span>
                </span>
                <span className="text-[#A7AFBF] text-[9px] tracking-[0.2em] uppercase leading-none mt-0.5">
                  Istanbul, Türkiye
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-sm",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-[#A7AFBF] hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                href="/merch"
                onClick={closeMenu}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200",
                  pathname === "/merch"
                    ? "bg-[#51152D] text-white"
                    : "bg-[#741F3D] text-white hover:bg-[#51152D]"
                )}
                aria-label="Visit the Merch Store"
              >
                <ShoppingBag size={15} />
                <span className="hidden sm:inline">Merch</span>
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-[#A7AFBF] hover:text-white transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={closeMenu}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#101B35] shadow-2xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-5 border-b border-[#2A3556]">
            <span className="font-display text-white font-bold text-lg">
              EUROXPRO<span className="text-[#741F3D]">&apos;27</span>
            </span>
            <button
              onClick={closeMenu}
              className="p-1 text-[#A7AFBF] hover:text-white"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="p-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-sm transition-colors duration-200",
                  pathname === link.href
                    ? "text-white bg-[#741F3D]"
                    : "text-[#A7AFBF] hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/merch"
              onClick={closeMenu}
              className="mt-4 flex items-center gap-2 px-4 py-3 bg-[#741F3D] text-white rounded-sm font-medium"
            >
              <ShoppingBag size={16} />
              Merch Store
            </Link>
          </nav>

          <div className="absolute bottom-8 left-5 right-5">
            <p className="text-[#A7AFBF] text-xs">
              {siteConfig.name} · Istanbul, Türkiye
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
