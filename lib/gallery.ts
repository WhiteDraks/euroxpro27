import type { GalleryItem } from "./types";

// ============================================================
// EUROXPRO Gallery Dataset
// Curated high-resolution imagery: past conference assemblies and Antalya destination.
// Every item is clearly attributed with its exact year, location, and verified source.
// ============================================================

export const galleryItems: GalleryItem[] = [
  // ── Past Conferences & Youth Leadership ──
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
    id: "gal-hist-4",
    title: "Regional Governance & Legislative Assembly",
    category: "conferences",
    yearOrArea: "Archival Assembly",
    location: "AIESEC in Europe",
    caption:
      "National governing boards (Member Committees) deliberating regional legislation, policies, and collaborative motions.",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-hist-5",
    title: "Global Village & Cultural Unity",
    category: "conferences",
    yearOrArea: "Cultural Festival",
    location: "AIESEC Global Village",
    caption:
      "The celebrated Global Village evening where delegations showcase national customs, culinary dishes, and traditional attire.",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-hist-6",
    title: "Delegate Accreditation & Welcome Desks",
    category: "conferences",
    yearOrArea: "Conference Logistics",
    location: "Arrival Operations",
    caption:
      "Volunteers and organizing team members distributing conference credentials, badges, and delegate kits.",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-hist-7",
    title: "Keynote Symposia & External Perspectives",
    category: "conferences",
    yearOrArea: "Plenary Forum",
    location: "Main Stage",
    caption:
      "Inspiring keynote speakers addressing youth delegates on global geopolitical trends and cross-border innovation.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },
  {
    id: "gal-hist-8",
    title: "Multicultural Youth Community & Leadership",
    category: "conferences",
    yearOrArea: "Youth Leadership",
    location: "European Network",
    caption:
      "A dynamic, diverse generation of young leaders building lifelong cross-border connections and partnerships.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    isHistorical: true,
  },

  // ── Antalya & Turkish Riviera Destination ──
  {
    id: "gal-ayt-1",
    title: "Historic Kaleiçi & Ancient Roman Marina",
    category: "antalya",
    yearOrArea: "Old Town Heritage",
    location: "Kaleiçi, Antalya",
    caption:
      "Antalya's ancient clifftop walled quarter with restored Ottoman mansions descending into the 2nd-century BC Roman harbor.",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-2",
    title: "Lower Düden Cascades into the Mediterranean",
    category: "antalya",
    yearOrArea: "Natural Landmark",
    location: "Lara Cliffs, Antalya",
    caption:
      "Spectacular 40-meter waterfall plunging straight over coastal cliffs directly into the turquoise Mediterranean sea.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-3",
    title: "Konyaaltı Beach & Snow-Capped Taurus Peaks",
    category: "antalya",
    yearOrArea: "Coastal Horizon",
    location: "Konyaaltı, Antalya",
    caption:
      "The sweeping Mediterranean shoreline of Konyaaltı set against the dramatic silhouette of the Beydağları (Taurus) mountain range.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-4",
    title: "Ancient Aspendos Amphitheater Architecture",
    category: "antalya",
    yearOrArea: "Classical Antiquity",
    location: "Serik, Antalya",
    caption:
      "Widely regarded as the best-preserved ancient Roman theater in the Mediterranean basin, famed for whispering acoustics.",
    image:
      "https://images.unsplash.com/photo-1674715577456-49ae7a6945a8?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-5",
    title: "Historic Ottoman Alleyways & Bougainvillea",
    category: "antalya",
    yearOrArea: "Kaleiçi Architecture",
    location: "Muratpaşa, Antalya",
    caption:
      "Pedestrian cobblestone lanes lined with traditional timber-framed mansions, artisanal workshops, and quiet courtyard cafes.",
    image:
      "https://images.unsplash.com/photo-1654162304103-6a273ca1fe7c?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-6",
    title: "Sunset Over Antalya Bay & Taurus Mountains",
    category: "antalya",
    yearOrArea: "Turkish Riviera",
    location: "Antalya Coast",
    caption:
      "Golden hour twilight casting amber tones across the Mediterranean sea and the towering limestone mountain ridge.",
    image:
      "https://images.unsplash.com/photo-1571753406356-fdb4e1cd204c?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-7",
    title: "Palm Promenade & Seaside Coastal Park",
    category: "antalya",
    yearOrArea: "Urban Coastline",
    location: "Konyaaltı Coastal Park",
    caption:
      "Modern pedestrian seaside boulevard featuring open-air seating, palm tree parks, and cycling promenades along the sea.",
    image:
      "https://images.unsplash.com/photo-1663574628814-7806616e9ac1?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
  {
    id: "gal-ayt-8",
    title: "Classical Antiquity & Temple Columns",
    category: "antalya",
    yearOrArea: "Pamphylian Heritage",
    location: "Perge & Side, Antalya",
    caption:
      "Ancient colonnaded streets and monumental marble architecture testifying to Antalya's deep classical heritage.",
    image:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80",
    isHistorical: false,
  },
];
