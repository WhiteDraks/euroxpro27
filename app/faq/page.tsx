import type { Metadata } from "next";
import { FAQPage } from "@/components/faq/FAQPage";
import { faqCategories } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Delegate Assistance",
  description: "Official FAQ for EUROXPRO'27 delegates: registration process, visas, accommodation, schedule, merch pre-orders, and emergency assistance.",
};

export default function FAQ() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">
              Delegate Knowledge Base
            </span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Instant answers to common queries regarding registration, travel formalities, logistics, schedules, and event participation.
          </p>
        </div>
      </section>
      <FAQPage categories={faqCategories} />
    </div>
  );
}
