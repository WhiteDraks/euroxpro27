import type { Metadata } from "next";
import { AnnouncementsPage } from "@/components/announcements/AnnouncementsPage";
import { announcements, categories } from "@/lib/announcements";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Official Announcements & Communiqués",
  description: "Official dispatches, press releases, and delegate advisories from the EUROXPRO'27 Organizing Committee.",
  alternates: { canonical: "/announcements" },
};

export default function Announcements() {
  return (
    <div className="pt-16 lg:pt-20">
      <PageHero
        eyebrow="News from the committee"
        title="Announcements"
        intro="Travel advisories, registration news and updates from the EUROXPRO'27 Organizing Committee, newest first."
      />
      <AnnouncementsPage announcements={announcements} categories={categories} />
    </div>
  );
}
