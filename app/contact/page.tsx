import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact & Organizing Committee — EUROXPRO'27",
  description: "Direct communications with the EUROXPRO'27 Organizing Committee leadership, delegate relations, partnerships, and logistics.",
};

export default function ContactPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">
              Secretariat &amp; Entity Support
            </span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white">
            Contact the Committee
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Have questions regarding entity delegations, visas, partner sponsorships, or congress logistics? Our team is dedicated to supporting your participation.
          </p>
        </div>
      </section>

      <ContactSection config={siteConfig} />
    </div>
  );
}
