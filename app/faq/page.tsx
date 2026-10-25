import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, Hotel, Info, Plane } from "lucide-react";
import { FAQPage } from "@/components/faq/FAQPage";
import { RichText } from "@/components/ui/RichText";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Travel, Hotel & Visa",
  description: "Official FAQ for EUROXPRO'27 delegates: Antalya Airport (AYT), congress hotel, visas, registration, schedule, merch pre-orders and emergency assistance.",
};

const travelIcons = [Plane, Hotel, FileText];

export default function FAQ() {
  const { hero, travel, ...faqText } = content.faq;

  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">{hero.eyebrow}</span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white">{hero.title}</h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">{hero.intro}</p>
        </div>
      </section>

      {/* ── TRAVEL ESSENTIALS: AIRPORT, HOTEL, VISA ── */}
      {travel.items.length > 0 && (
        <section id="travel" className="py-20 bg-white border-b border-[#E5E1DA] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-2xl mb-12">
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3">
                {travel.eyebrow}
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35] font-normal leading-tight">
                {travel.title}
              </h2>
              <p className="text-sm sm:text-base text-[#5A6478] mt-3 leading-relaxed">{travel.intro}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {travel.items.map((item, i) => {
                const Icon = travelIcons[i] ?? Info;
                const external = /^https?:\/\//.test(item.link);
                return (
                  <div
                    key={i}
                    className="reveal bg-[#F7F3ED] border border-[#E5E1DA] rounded-sm p-6 sm:p-7 flex flex-col"
                  >
                    <div className="w-11 h-11 bg-[#101B35] rounded-sm flex items-center justify-center mb-5">
                      <Icon size={20} className="text-[#741F3D]" />
                    </div>
                    <h3 className="font-serif-title text-xl text-[#101B35] mb-3">{item.title}</h3>
                    <p className="text-sm text-[#5A6478] leading-relaxed flex-1">
                      <RichText text={item.text} />
                    </p>
                    {item.link && item.linkText && (
                      <div className="pt-5 mt-5 border-t border-[#E5E1DA]">
                        {external ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#741F3D] hover:underline"
                          >
                            {item.linkText} <ExternalLink size={14} />
                          </a>
                        ) : (
                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#741F3D] hover:underline"
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
