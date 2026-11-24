import site from "@/content/site.json";
import type { FAQCategory, GalleryItem, HistoricalEdition, ScheduleDay, UsefulLocation } from "./types";

// ============================================================
// EUROXPRO'27 — Editable Site Content
// All texts and photos for the Home, Congress and Explore Antalya
// pages live in content/site.json and are edited from /admin.
// The types are written out (not inferred from the JSON) so that
// edits such as emptying a list can never break the build.
// ============================================================

type TitledText = { title: string; desc: string };

// An empty name or photo shows a placeholder until the editor fills it in.
export type TeamMember = {
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  // Contact details are optional; empty ones are not shown.
  email: string;
  phone: string;
  linkedin: string;
  instagram: string;
};

export type SiteContent = {
  home: {
    hero: { image: string; imageAlt: string; title: string; text: string; themeNote: string; button: string };
    countdown: {
      label: string;
      daysLabel: string;
      hoursLabel: string;
      minutesLabel: string;
      secondsLabel: string;
      liveText: string;
      endedText: string;
    };
    tiles: { title: string; items: { title: string; text: string; link: string }[] };
    city: { title: string; text: string; button: string; items: { image: string; imageAlt: string; title: string }[] };
    news: { title: string; linkText: string };
  };
  congress: {
    hero: {
      image: string;
      imageAlt: string;
      eyebrow: string;
      title: string;
      intro: string;
      datesLabel: string;
      cityLabel: string;
      venueLabel: string;
    };
    about: {
      eyebrow: string;
      title: string;
      description: string;
      paragraphs: string[];
      objectivesTitle: string;
      objectives: TitledText[];
    };
    schedule: {
      eyebrow: string;
      title: string;
      description: string;
      published: boolean;
      comingSoonBadge: string;
      comingSoonTitle: string;
      comingSoonText: string;
      comingSoonButton: string;
      showDraftNotice: boolean;
      draftNotice: string;
      days: ScheduleDay[];
    };
    evenings: {
      eyebrow: string;
      title: string;
      description: string;
      dressCodeLabel: string;
      items: { title: string; tag: string; dress: string; image: string; desc: string }[];
    };
  };
  exploreAntalya: {
    hero: { image: string; imageAlt: string; eyebrow: string; title: string; intro: string };
    tabs: { attractions: string; food: string; phrases: string; map: string; weather: string };
    attractions: {
      eyebrow: string;
      title: string;
      description: string;
      notice: string;
      tipLabel: string;
      items: {
        name: string;
        category: string;
        period: string;
        image: string;
        description: string;
        tips: string;
        area: string;
      }[];
    };
    food: {
      eyebrow: string;
      title: string;
      description: string;
      items: { name: string; desc: string; category: string }[];
      etiquetteTitle: string;
      etiquette: string[];
    };
    phrases: {
      eyebrow: string;
      title: string;
      description: string;
      pronunciationLabel: string;
      items: { tr: string; en: string; pronunciation: string }[];
    };
    map: {
      eyebrow: string;
      title: string;
      description: string;
      locations: UsefulLocation[];
      routingTitle: string;
      routingText: string;
      overviewTitle: string;
      overviewText: string;
    };
    weather: {
      eyebrow: string;
      title: string;
      description: string;
      notice: string;
      items: { season: string; temp: string; notes: string }[];
    };
  };
  gallery: {
    eyebrow: string;
    title: string;
    intro: string;
    notice: string;
    filterAll: string;
    filterConferences: string;
    filterAntalya: string;
    showMoreButton: string;
    items: GalleryItem[];
  };
  previousEditions: {
    eyebrow: string;
    title: string;
    intro: string;
    disclaimer: string;
    items: HistoricalEdition[];
  };
  partners: {
    eyebrow: string;
    title: string;
    intro: string;
    statusBadge: string;
    statusTitle: string;
    statusText: string;
    buttonText: string;
    items: TitledText[];
  };
  team: {
    hero: { eyebrow: string; title: string; intro: string };
    notice: string;
    comingSoonLabel: string;
    members: TeamMember[];
    contactTitle: string;
    contactText: string;
    contactButton: string;
  };
  faq: {
    hero: { eyebrow: string; title: string; intro: string };
    travel: {
      eyebrow: string;
      title: string;
      intro: string;
      items: { title: string; text: string; linkText: string; link: string }[];
    };
    categories: FAQCategory[];
    searchPlaceholder: string;
    allLabel: string;
    emptyTitle: string;
    emptyText: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
  };
};

export const content = site as unknown as SiteContent;
