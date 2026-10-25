import site from "@/content/site.json";
import type { GalleryItem, HistoricalEdition, ScheduleDay, UsefulLocation } from "./types";

// ============================================================
// EUROXPRO'27 — Editable Site Content
// All texts and photos for the Home, Congress and Explore Antalya
// pages live in content/site.json and are edited from /admin.
// The types are written out (not inferred from the JSON) so that
// edits such as emptying a list can never break the build.
// ============================================================

type TitledText = { title: string; desc: string };

export type SiteContent = {
  home: {
    hero: {
      image: string;
      imageAlt: string;
      eyebrow: string;
      kicker: string;
      titleLine1: string;
      titleLine2: string;
      supportingLine: string;
      themeNote: string;
      primaryButton: string;
      secondaryButton: string;
      tertiaryButton: string;
    };
    bulletin: { label: string; linkText: string };
    dimensions: {
      eyebrow: string;
      title: string;
      intro: string;
      items: { label: string; title: string; text: string; focus: string }[];
    };
    pillars: { eyebrow: string; title: string; intro: string; cardFooter: string; items: TitledText[] };
    destination: {
      eyebrow: string;
      title: string;
      intro: string;
      buttonText: string;
      items: { image: string; imageAlt: string; label: string; title: string; text: string }[];
    };
    delegatePrep: { eyebrow: string; title: string; text: string; primaryButton: string; secondaryButton: string };
    merch: { eyebrow: string; title: string; linkText: string; badge: string; itemLinkText: string };
    closing: { eyebrow: string; title: string; text: string; primaryButton: string; secondaryButton: string };
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
    disclaimerTitle: string;
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
};

export const content = site as unknown as SiteContent;
