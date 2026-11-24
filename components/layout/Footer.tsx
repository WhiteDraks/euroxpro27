import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { isSchedulePublished } from "@/lib/schedule";

const footerLinks = [
  {
    title: "Congress",
    links: [
      { href: "/congress", label: "The Congress" },
      { href: "/congress#schedule", label: isSchedulePublished ? "Schedule" : "Agenda (coming soon)" },
      { href: "/team", label: "Organizing Team" },
      { href: "/announcements", label: "Announcements" },
      { href: "/approvals", label: "Approvals League" },
      { href: "/contact", label: "Contact OC" },
    ],
  },
  {
    title: "Delegates",
    links: [
      { href: "/delegate-guide", label: "Delegate Guide" },
      { href: "/delegate-guide#checklist", label: "Packing Checklist" },
      { href: "/explore-antalya", label: "Explore Antalya" },
      { href: "/faq#travel", label: "Airport, Hotel & Visa" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Store",
    links: [
      { href: "/merch", label: "Merch Store" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0E0909] text-[#F4EDE2] border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5 group" aria-label="EUROXPRO'27 Home">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/euroxpro-logo-light.png"
                  alt="EUROXPRO Türkiye Official Logo"
                  width={160}
                  height={50}
                  className="h-10 sm:h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
                />
              </div>
            </Link>
            <p className="font-serif-title text-2xl text-[#F4EDE2] mb-5">{siteConfig.datesLabel}</p>
            <div className="flex items-center gap-2 text-[#B8A69C] text-sm mb-3">
              <MapPin size={14} className="text-[#E0647D] flex-shrink-0" />
              <span>Antalya, Türkiye</span>
            </div>
            <div className="flex items-center gap-2 text-[#B8A69C] text-sm">
              <Mail size={14} className="text-[#E0647D] flex-shrink-0" />
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
                  className="w-9 h-9 bg-[#1F1415] hover:bg-[#7D1A30] rounded-md flex items-center justify-center transition-colors text-white"
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
              <h3 className="text-white font-sans-body text-sm font-semibold tracking-normal mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#B8A69C] hover:text-white text-sm transition-colors"
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
      <div className="border-t border-[#3A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#B8A69C] text-xs">
            &copy; {new Date().getFullYear()} EUROXPRO&apos;27, AIESEC. All rights reserved.
          </p>
          <p className="text-[#B8A69C] text-xs">
            Organised by AIESEC in Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
