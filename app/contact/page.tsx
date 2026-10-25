import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { organizingCommittee, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact & Organizing Committee",
  description: "Get in touch with the EUROXPRO'27 Organizing Committee. Inquiries, delegate support, and partnerships.",
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Connect</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">Contact &amp; Team</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl leading-relaxed">
            Have a question about the congress or need support with your trip to Istanbul? The Organizing Committee is here to support you.
          </p>
        </div>
      </section>

      <ContactSection committee={organizingCommittee} config={siteConfig} />
    </div>
  );
}
