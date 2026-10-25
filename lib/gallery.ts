import type { GalleryItem } from "./types";

// ============================================================
// EUROXPRO Gallery Dataset
// Highlights from previous conference editions and Antalya destination captures.
// Every item is clearly attributed with its exact year, location, and context.
// ============================================================

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-hist-1",
    title: "Plenary Assembly & Regional Alignment",
    category: "conferences",
    yearOrArea: "EUROXPRO 2026",
    location: "Greece",
    caption:
      "Plenary hall during the 2026 edition in Greece, convening over 500 young leaders under 'United in Exchanges'.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-ayt-1",
    title: "Historic Kaleiçi & Ancient Roman Marina",
    category: "antalya",
    yearOrArea: "Antalya Destination",
    location: "Kaleiçi, Antalya",
    caption:
      "The historic clifftop old town of Antalya with restored Ottoman architecture overlooking the ancient Roman harbor.",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-hist-2",
    title: "Cross-Cultural Collaboration & Networking",
    category: "conferences",
    yearOrArea: "EUROXPRO 2025",
    location: "Rimini, Italy",
    caption:
      "Delegates from across 50+ countries collaborating during parallel breakout tracks in Rimini, Italy.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-ayt-2",
    title: "Lower Düden Cascades into the Mediterranean",
    category: "antalya",
    yearOrArea: "Antalya Destination",
    location: "Lara Cliffs, Antalya",
    caption:
      "Spectacular 40-meter natural waterfall pouring directly over coastal cliffs into the turquoise Mediterranean sea.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-hist-3",
    title: "Global Leadership Development & Teamwork",
    category: "conferences",
    yearOrArea: "EUROXPRO 2024",
    location: "Alanya, Türkiye",
    caption:
      "Participants engaged in intensive leadership simulation exercises on the Turkish Mediterranean coast in 2024.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-ayt-3",
    title: "Konyaaltı Beach & Snow-Capped Taurus Peaks",
    category: "antalya",
    yearOrArea: "Antalya Destination",
    location: "Konyaaltı, Antalya",
    caption:
      "The sweeping Mediterranean shoreline of Konyaaltı set against the dramatic silhouette of the Beydağları (Taurus) mountain range.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
];
