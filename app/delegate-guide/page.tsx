import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble, ChevronRight, CloudSun, ExternalLink, Phone, Plane, ShieldPlus, Smartphone, Ticket, Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DelegateChecklist } from "@/components/delegate/DelegateChecklist";

export const metadata: Metadata = {
  title: "Delegate Travel Guide",
  description: "Everything EUROXPRO'27 delegates need before travelling to Antalya: visa, airport, hotel, weather, money, phone, health and a packing list.",
  alternates: { canonical: "/delegate-guide" },
};

// ============================================================
// The travel guide, kept to the essentials: one card per topic,
// three short lines each. Longer answers live on /faq.
// ============================================================

type Topic = {
  id: string;
  icon: LucideIcon;
  title: string;
  points: string[];
  link?: { href: string; label: string; external?: boolean };
};

const topics: Topic[] = [
  {
    id: "registration-info",
    icon: Ticket,
    title: "Who can come",
    points: [
      "AIESEC leaders from across Europe.",
      "You apply through your national team (MC).",
      "Fees and places will be announced soon.",
    ],
  },
  {
    id: "travel-visa",
    icon: Plane,
    title: "Passport and visa",
    points: [
      "Your passport must be valid for 6 more months.",
      "Some countries need an e-Visa. It takes a few minutes online.",
      "Need a visa letter? Write to us 10 days before.",
    ],
    link: { href: "https://www.evisa.gov.tr/en/", label: "Official e-Visa site", external: true },
  },
  {
    id: "airports-transit",
    icon: Plane,
    title: "Airport",
    points: [
      "Fly to Antalya Airport (AYT).",
      "We meet you at arrivals on 31 March.",
      "Shuttles take you to the hotel.",
    ],
  },
  {
    id: "accommodation",
    icon: BedDouble,
    title: "Hotel",
    points: [
      "Still being confirmed.",
      "We will email the details to every delegate.",
      "Check-in 14:00, check-out 12:00.",
    ],
  },
  {
    id: "weather-seasons",
    icon: CloudSun,
    title: "Weather",
    points: [
      "Sunny, about 18–23°C.",
      "Bring a light jacket for the evening.",
      "Don't forget sunglasses and sunscreen.",
    ],
  },
  {
    id: "money-banking",
    icon: Wallet,
    title: "Money",
    points: [
      "Turkish Lira (₺).",
      "Cards work almost everywhere.",
      "Always choose “pay in TRY”.",
    ],
  },
  {
    id: "connectivity",
    icon: Smartphone,
    title: "Phone and plugs",
    points: [
      "Get an eSIM before you fly. EU roaming doesn't apply.",
      "European two-pin plugs, 220V.",
      "Bring a power bank.",
    ],
  },
  {
    id: "health-safety",
    icon: ShieldPlus,
    title: "Health and safety",
    points: [
      "Emergency number: 112.",
      "Pharmacies have a red “E” sign.",
      "Tell us about allergies when you register.",
    ],
  },
];

export default function DelegateGuidePage() {
  return (
    <div>
      <PageHero eyebrow="Before you travel" title="Travel guide" intro="Everything you need before you fly." />

      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-20">
        <ul data-stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {topics.map(({ id, icon: Icon, title, points, link }) => (
            <li key={id} id={id} className="reveal scroll-mt-24">
              <div className="spot glass h-full rounded-[28px] p-6 flex flex-col">
                <span className="w-12 h-12 rounded-[14px] bg-[#7D1A30] flex items-center justify-center">
                  <Icon size={24} className="text-white" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl">{title}</h2>
                <ul className="mt-3 space-y-2 text-[15px] text-[#D6C8BC]">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#E0647D] flex-shrink-0" aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {link && (
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E0647D] hover:text-white"
                  >
                    {link.label} {link.external && <ExternalLink size={14} aria-hidden="true" />}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="checklist" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 scroll-mt-24">
        <h2 className="reveal text-4xl sm:text-5xl">Packing list</h2>
        <p className="reveal mt-2 text-lg text-[#B8A69C]">Tick things off as you pack.</p>
        <div className="mt-8">
          <DelegateChecklist />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="reveal grid sm:grid-cols-2 gap-3 sm:gap-4">
          <Link href="/faq" className="spot glass rounded-[24px] px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors">
            <span className="text-xl font-semibold">More questions?</span>
            <ChevronRight size={20} className="text-white/50" aria-hidden="true" />
          </Link>
          <Link href="/contact" className="spot glass rounded-[24px] px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors">
            <span className="inline-flex items-center gap-3 text-xl font-semibold">
              <Phone size={20} className="text-[#E0647D]" aria-hidden="true" /> Write to us
            </span>
            <ChevronRight size={20} className="text-white/50" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
