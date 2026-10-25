import Link from "next/link";
import { Handshake, ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { content } from "@/lib/content";

const cardIcons = [Building2, Sparkles, ShieldCheck];

export function PartnersSection() {
  const text = content.partners;
  return (
    <section className="py-24 bg-white border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-3">
            <Handshake size={14} />
            {text.eyebrow}
          </div>
          <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
            {text.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5A6478] mt-4 leading-relaxed font-light">
            {text.intro}
          </p>
        </div>

        {/* Status Callout Card */}
        <div className="border border-[#E5E1DA] bg-[#F7F3ED] rounded-sm p-8 sm:p-10 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E1DA] rounded-sm text-xs font-mono font-semibold text-[#741F3D]">
                <span className="w-2 h-2 rounded-full bg-[#741F3D] animate-ping" />
                {text.statusBadge}
              </div>
              <h3 className="font-serif-title text-2xl sm:text-3xl text-[#101B35] font-normal">
                {text.statusTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6478] leading-relaxed">
                {text.statusText}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link href="/contact">
                <Button size="lg" variant="primary" className="text-xs font-semibold tracking-wide">
                  {text.buttonText} <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {text.items.map(({ title, desc }, i) => {
            const Icon = cardIcons[i % cardIcons.length];
            return (
            <div
              key={i}
              className="p-6 border border-[#E5E1DA] rounded-sm bg-white hover:border-[#741F3D] transition-colors group"
            >
              <div className="w-10 h-10 bg-[#101B35] rounded-sm flex items-center justify-center text-[#741F3D] mb-4">
                <Icon size={18} />
              </div>
              <h4 className="font-serif-title text-lg text-[#101B35] font-normal mb-2">
                {title}
              </h4>
              <p className="text-xs text-[#5A6478] leading-relaxed font-light">
                {desc}
              </p>
            </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
