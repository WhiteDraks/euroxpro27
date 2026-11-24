import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FAQPage } from "@/components/faq/FAQPage";
import { RichText } from "@/components/ui/RichText";
import { content } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Travel, Hotel & Visa",
  description: "Official FAQ for EUROXPRO'27 delegates: Antalya Airport (AYT), congress hotel, visas, registration, schedule, merch pre-orders and emergency assistance.",
  alternates: { canonical: "/faq" },
};

export default function FAQ() {
  const { hero, travel, ...faqText } = content.faq;

  return (
    <div>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

      {/* ── THE BASICS: AIRPORT, HOTEL, VISA ── */}
      {travel.items.length > 0 && (
        <section id="travel" className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-12 sm:pt-20 scroll-mt-20">
          <h2 className="reveal px-1 text-4xl sm:text-5xl">{travel.title}</h2>
          <ul data-stagger className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4">
            {travel.items.map((item, i) => {
              const external = /^https?:\/\//.test(item.link);
              const linkClass = "mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E0647D] hover:text-white";
              return (
                <li key={i} className="reveal spot glass rounded-[24px] p-6 flex flex-col">
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="mt-2 text-base text-[#D6C8BC]">
                    <RichText text={item.text} />
                  </p>
                  {item.link && item.linkText && (external ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {item.linkText} <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={item.link} className={linkClass}>
                      {item.linkText} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <FAQPage text={faqText} />
    </div>
  );
}
