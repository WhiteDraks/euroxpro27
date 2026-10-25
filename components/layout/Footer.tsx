import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Heart, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config";

const footerLinks = [
  {
    title: "Congress",
    links: [
      { href: "/congress", label: "The Congress" },
      { href: "/congress#schedule", label: "Schedule" },
      { href: "/announcements", label: "Announcements" },
      { href: "/contact", label: "Contact OC" },
    ],
  },
  {
    title: "Delegates",
    links: [
      { href: "/delegate-guide", label: "Delegate Guide" },
      { href: "/delegate-guide#checklist", label: "Packing Checklist" },
      { href: "/explore-antalya", label: "Explore Antalya" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Store",
    links: [
      { href: "/merch", label: "Merch Store" },
      { href: "/merch", label: "Browse Collection" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#101B35] text-[#F7F3ED]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5 group" aria-label="EUROXPRO'27 Home">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/euroxpro-logo.png"
                  alt="EUROXPRO Türkiye Official Logo"
                  width={160}
                  height={50}
                  className="h-10 sm:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
                />
              </div>
            </Link>
            <p className="text-[#A7AFBF] text-sm leading-relaxed mb-6 max-w-xs">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-2 text-[#A7AFBF] text-sm mb-3">
              <MapPin size={14} className="text-[#741F3D] flex-shrink-0" />
              <span>Antalya, Türkiye</span>
            </div>
            <div className="flex items-center gap-2 text-[#A7AFBF] text-sm">
              <Mail size={14} className="text-[#741F3D] flex-shrink-0" />
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-white transition-colors"
              >
                {siteConfig.contactEmail}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-[#172443] hover:bg-[#741F3D] rounded-sm flex items-center justify-center transition-colors text-white"
                  aria-label="Follow on Instagram"
                >
                  <Share2 size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Nav Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#A7AFBF] hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2A3556]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A7AFBF] text-xs">
            &copy; {new Date().getFullYear()} EUROXPRO&apos;27 · AIESEC · All rights reserved.
          </p>
          <p className="text-[#A7AFBF] text-xs flex items-center gap-1">
            Made with <Heart size={11} className="text-[#741F3D]" fill="currentColor" /> in Antalya
          </p>
        </div>
      </div>
    </footer>
  );
}
