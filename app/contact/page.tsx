import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { siteConfig } from "@/lib/config";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Contact & Organizing Committee",
  description: "Direct communications with the EUROXPRO'27 Organizing Committee leadership, delegate relations, partnerships, and logistics.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <PageHero
        eyebrow="Get in touch"
        title="Contact the Committee"
        intro="Questions about delegations, visas, partnerships or logistics? Write to us and someone from the Organizing Committee will get back to you."
      />

      <ContactSection config={siteConfig} />
    </div>
  );
}
