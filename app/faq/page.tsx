import type { Metadata } from "next";
import { FAQPage } from "@/components/faq/FAQPage";
import { faqCategories } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about EUROXPRO'27 — registration, travel, accommodation, schedule, and more.",
};

export default function FAQ() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Help Centre</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">FAQ</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl">
            Find answers to the most common questions about EUROXPRO&apos;27.
          </p>
        </div>
      </section>
      <FAQPage categories={faqCategories} />
    </div>
  );
}
