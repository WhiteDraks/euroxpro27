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
    <div className="pt-16 lg:pt-20">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

      {/* ── TRAVEL ESSENTIALS: AIRPORT, HOTEL, VISA ── */}
      {travel.items.length > 0 && (
        <section id="travel" className="py-20 bg-white border-b border-[#E5E1DA] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-2xl mb-12">
              <span className="text-xs font-semibold tracking-[0.08em] text-[#741F3D] uppercase block mb-3">
                {travel.eyebrow}
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35] font-normal leading-tight">
                {travel.title}
              </h2>
              <p className="text-sm sm:text-base text-[#5A6478] mt-3 leading-relaxed">{travel.intro}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-x-10 border-t border-[#101B35]">
              {travel.items.map((item, i) => {
                const external = /^https?:\/\//.test(item.link);
                return (
                  <div key={i} className="reveal flex flex-col py-8 border-b border-[#E5E1DA] md:border-b-0">
                    <span className="font-serif-title italic text-2xl text-[#741F3D] leading-none">{i + 1}.</span>
                    <h3 className="font-serif-title text-2xl text-[#101B35] mt-4 mb-3">{item.title}</h3>
                    <p className="text-base text-[#4B5563] leading-relaxed flex-1">
                      <RichText text={item.text} />
                    </p>
                    {item.link && item.linkText && (
                      <div className="pt-5">
                        {external ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#741F3D] link-underline"
                          >
                            {item.linkText} <ExternalLink size={14} />
                          </a>
                        ) : (
                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#741F3D] link-underline"
                          >
                            {item.linkText} <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FAQPage text={faqText} />
    </div>
  );
}
