import type { Metadata } from "next";
import { AnnouncementsPage } from "@/components/announcements/AnnouncementsPage";
import { announcements, categories } from "@/lib/announcements";

export const metadata: Metadata = {
  title: "Official Announcements & Communiqués",
  description: "Official dispatches, press releases, and delegate advisories from the EUROXPRO'27 Organizing Committee.",
};

export default function Announcements() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">
              Secretariat Bulletins
            </span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white">
            Official Announcements
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Latest news, logistical advisories, and operational releases directly from the EUROXPRO&apos;27 leadership.
          </p>
        </div>
      </section>
      <AnnouncementsPage announcements={announcements} categories={categories} />
    </div>
  );
}
