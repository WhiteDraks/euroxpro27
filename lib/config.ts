// ============================================================
// EUROXPRO'27 — Centralized Event Configuration
// Edit this file to update event details across the entire site
// ============================================================

export const siteConfig = {
  name: "EUROXPRO'27",
  tagline: "Where Mediterranean Horizons Inspire Tomorrow’s Leadership.",
  shortDescription:
    "An international AIESEC congress bringing together driven young leaders from across Europe and beyond, hosted on the turquoise coast of Antalya, Türkiye.",
  longDescription:
    "EUROXPRO'27 is a premier international congress organized under the AIESEC network, gathering ambitious young leaders from across Europe and the world. Over five transformative days, delegates will engage in high-impact sessions, workshops, and cultural experiences along the Mediterranean coast in Antalya, Türkiye.",

  // Confirmed Event Dates
  startDate: new Date("2027-03-31T09:00:00+03:00"),
  endDate: new Date("2027-04-04T18:00:00+03:00"),
  datesLabel: "31 March – 4 April 2027",

  // Venue
  venueName: "[CONGRESS VENUE TO BE CONFIRMED]",
  venueAddress: "[ANTALYA VENUE ADDRESS TO BE CONFIRMED]",
  venueCity: "Antalya, Türkiye",

  // Hotel
  hotelName: "[CONGRESS RESORT TO BE CONFIRMED]",
  hotelAddress: "[ANTALYA RESORT ADDRESS TO BE CONFIRMED]",
  hotelCheckIn: "14:00 (31 March 2027)",
  hotelCheckOut: "12:00 (4 April 2027)",
  hotelPhone: "[HOTEL PHONE TO BE CONFIRMED]",

  // Registration
  registrationUrl: null as string | null, // Set to your form URL when ready
  registrationOpen: false,
  registrationLabel: "Registration Opening Soon",

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
