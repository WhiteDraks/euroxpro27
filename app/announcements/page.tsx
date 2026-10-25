import type { Metadata } from "next";
import { AnnouncementsPage } from "@/components/announcements/AnnouncementsPage";
import { announcements, categories } from "@/lib/announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description: "The latest news and announcements from the EUROXPRO'27 Organizing Committee.",
};

export default function Announcements() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Latest News</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">Announcements</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl">
            Stay up to date with the latest news and updates from the Organizing Committee.
          </p>
        </div>
      </section>
      <AnnouncementsPage announcements={announcements} categories={categories} />
    </div>
  );
}
