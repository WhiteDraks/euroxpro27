// ============================================================
// EUROXPRO'27 — Centralized Event Configuration
// Edit this file to update event details across the entire site
// ============================================================

export const siteConfig = {
  name: "EUROXPRO'27",
  tagline: "Where Europe Meets the Mediterranean",
  proposedTheme: "Where Europe Meets the Mediterranean",
  proposedSupportingLine:
    "One region. Different realities. A shared ambition to create more global opportunities.",
  isThemeProposed: true, // Editable creative direction; subject to official ratification
  shortDescription:
    "The premier annual regional congress of AIESEC in Europe, convening young leaders from 50+ entities to align on regional priorities, expand international exchange opportunities, and develop transformative leadership in Antalya, Türkiye.",
  longDescription:
    "EUROXPRO'27 brings together national governing teams, local committee leaders, and young change-makers from across Europe and the Mediterranean. Hosted by MC Türkiye in the historic coastal city of Antalya, the congress is dedicated to regional alignment, organizational performance, and scaling high-impact youth exchanges.",

  // Event Dates (Provisional Framework / Subject to Official Ratification)
  startDate: new Date("2027-03-31T09:00:00+03:00"),
  endDate: new Date("2027-04-04T18:00:00+03:00"),
  datesLabel: "31 March – 4 April 2027 (Provisional)",
  isDatesProvisional: true, // Clearly indicated until officially ratified

  // Venue & Accommodation
  venueName: "[Official Congress Venue to be Announced]",
  venueAddress: "[Antalya Venue Location to be Announced]",
  venueCity: "Antalya, Türkiye",

  // Hotel
  hotelName: "[Official Congress Accommodation to be Announced]",
  hotelAddress: "[Antalya Accommodation to be Announced]",
  hotelCheckIn: "14:00 (Arrival Day)",
  hotelCheckOut: "12:00 (Departure Day)",
  hotelPhone: "[Official Support Line to be Announced]",

  // Registration
  registrationUrl: null as string | null,
  registrationOpen: false,
  registrationLabel: "Registration to be Announced",

  // Contact
  contactEmail: "[contact@euroxpro27.com]",
  supportEmail: "[support@euroxpro27.com]",

  // Social Media
  social: {
    instagram: "https://www.instagram.com/aiesecturkey/",
    linkedin: "https://www.linkedin.com/company/aiesec/",
    facebook: null as string | null,
    twitter: null as string | null,
  },

  // SEO
  siteUrl: "https://euroxpro27.com",
  ogImage: "/images/og-image.jpg",
};

// ============================================================
// Organizing Committee
// ============================================================
export const organizingCommittee = [
  {
    name: "[LC President Name]",
    role: "Local Committee President",
    department: "Leadership",
    bio: "Leading the EUROXPRO'27 organizing team with a vision for an unforgettable congress experience in Antalya.",
    image: null as string | null,
  },
  {
    name: "[OCP Name]",
    role: "Organizing Committee President",
    department: "Congress",
    bio: "Coordinating all congress operations to deliver a world-class Mediterranean event.",
    image: null as string | null,
  },
  {
    name: "[Logistics Lead]",
    role: "VP Logistics",
    department: "Logistics",
    bio: "Managing travel, AYT airport transfers, accommodation, and on-ground logistics for all delegates.",
    image: null as string | null,
  },
  {
    name: "[Finance Lead]",
    role: "VP Finance",
    department: "Finance",
    bio: "Overseeing the financial planning and delegate fee management.",
    image: null as string | null,
  },
  {
    name: "[Marketing Lead]",
    role: "VP Marketing & Communications",
    department: "Marketing",
    bio: "Crafting the EUROXPRO'27 brand experience and delegate communications.",
    image: null as string | null,
  },
  {
    name: "[Programme Lead]",
    role: "VP Programme",
    department: "Programme",
    bio: "Designing the congress agenda, plenary tracks, and Mediterranean leadership sessions.",
    image: null as string | null,
  },
];

// ============================================================
// Useful Locations for the Map (Antalya)
// ============================================================
export const usefulLocations = [
  {
    id: "hotel",
    name: "Congress Hotel Resort",
    description: "[CONGRESS HOTEL PROPERTY TO BE CONFIRMED]",
    category: "accommodation" as const,
    address: "Antalya Coastal Zone, Türkiye",
    mapUrl: "https://maps.google.com/?q=Antalya+Turkey",
    placeholder: true,
  },
  {
    id: "venue",
    name: "Congress Plenary Venue",
    description: "[CONGRESS VENUE TO BE CONFIRMED]",
    category: "venue" as const,
    address: "Antalya, Türkiye",
    mapUrl: "https://maps.google.com/?q=Antalya+Turkey",
    placeholder: true,
  },
  {
    id: "ayt-airport",
    name: "Antalya Airport (AYT)",
    description: "Main international gateway with Terminals 1, 2, and Domestic Terminal.",
    category: "transport" as const,
    address: "Yeşilköy, Antalya Havalimanı, Muratpaşa/Antalya",
    mapUrl: "https://maps.google.com/?q=Antalya+Airport+AYT",
    placeholder: false,
  },
  {
    id: "kaleici",
    name: "Kaleiçi (Historic Old Town & Roman Harbor)",
    description: "Antalya's historic walled center with Ottoman-era mansions and ancient Roman marina.",
    category: "attraction" as const,
    address: "Selçuk, Muratpaşa/Antalya",
    mapUrl: "https://maps.google.com/?q=Kaleici+Antalya",
    placeholder: false,
  },
  {
    id: "duden-waterfalls",
    name: "Lower Düden Waterfalls",
    description: "Spectacular cascade dropping 40 meters directly from cliffs into the Mediterranean.",
    category: "attraction" as const,
    address: "Çağlayan, Muratpaşa/Antalya",
    mapUrl: "https://maps.google.com/?q=Duden+Waterfalls+Antalya",
    placeholder: false,
  },
  {
    id: "aspendos",
    name: "Ancient Aspendos Amphitheater",
    description: "Best-preserved ancient Greco-Roman theater in the Mediterranean basin.",
    category: "attraction" as const,
    address: "Serik, Antalya",
    mapUrl: "https://maps.google.com/?q=Aspendos+Antalya",
    placeholder: false,
  },
];
