// ============================================================
// EUROXPRO'27 — Centralized Event Configuration
// Edit this file to update event details across the entire site
// ============================================================

export const siteConfig = {
  name: "EUROXPRO'27",
  tagline: "One City. Different Perspectives. One Shared Future.",
  shortDescription:
    "An international AIESEC congress bringing together driven young leaders from across Europe and beyond, hosted in the magnificent city of Istanbul, Türkiye.",
  longDescription:
    "EUROXPRO'27 is a premier international congress organized under the AIESEC network, gathering ambitious young leaders from across Europe and the world. Over several transformative days, delegates will engage in high-impact sessions, workshops, and cultural experiences in one of the world's most captivating cities — Istanbul, Türkiye.",

  // Event Dates — set to null until confirmed
  // Example: new Date('2027-07-15')
  startDate: null as Date | null,
  endDate: null as Date | null,
  datesLabel: "[CONGRESS DATES TO BE CONFIRMED]",

  // Venue
  venueName: "[VENUE NAME TO BE CONFIRMED]",
  venueAddress: "[VENUE ADDRESS TO BE CONFIRMED]",
  venueCity: "Istanbul, Türkiye",

  // Hotel
  hotelName: "[HOTEL NAME TO BE CONFIRMED]",
  hotelAddress: "[HOTEL ADDRESS TO BE CONFIRMED]",
  hotelCheckIn: "TBC",
  hotelCheckOut: "TBC",
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
    bio: "Leading the EUROXPRO'27 organizing team with a vision for an unforgettable congress experience.",
    image: null as string | null,
  },
  {
    name: "[OCP Name]",
    role: "Organizing Committee President",
    department: "Congress",
    bio: "Coordinating all congress operations to deliver a world-class event.",
    image: null as string | null,
  },
  {
    name: "[Logistics Lead]",
    role: "VP Logistics",
    department: "Logistics",
    bio: "Managing travel, accommodation, and on-ground logistics for all delegates.",
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
    bio: "Designing the congress agenda, sessions, and delegate learning journey.",
    image: null as string | null,
  },
];

// ============================================================
// Useful Locations for the Map
// ============================================================
export const usefulLocations = [
  {
    id: "hotel",
    name: "Congress Hotel",
    description: "[HOTEL NAME TO BE CONFIRMED]",
    category: "accommodation" as const,
    address: "[ADDRESS TO BE CONFIRMED]",
    mapUrl: "https://maps.google.com",
    placeholder: true,
  },
  {
    id: "venue",
    name: "Congress Venue",
    description: "[VENUE NAME TO BE CONFIRMED]",
    category: "venue" as const,
    address: "[ADDRESS TO BE CONFIRMED]",
    mapUrl: "https://maps.google.com",
    placeholder: true,
  },
  {
    id: "ist-airport",
    name: "Istanbul Airport (IST)",
    description: "Main international airport serving Istanbul.",
    category: "transport" as const,
    address: "Tayakadın, Istanbul",
    mapUrl: "https://maps.google.com/?q=Istanbul+Airport+IST",
    placeholder: false,
  },
  {
    id: "saw-airport",
    name: "Sabiha Gökçen Airport (SAW)",
    description: "Secondary international airport on the Asian side.",
    category: "transport" as const,
    address: "Sabiha Gökçen Airport, Pendik, Istanbul",
    mapUrl: "https://maps.google.com/?q=Sabiha+Gokcen+Airport",
    placeholder: false,
  },
  {
    id: "hagia-sophia",
    name: "Hagia Sophia",
    description: "Iconic Byzantine cathedral and mosque.",
    category: "attraction" as const,
    address: "Sultan Ahmet, Fatih, Istanbul",
    mapUrl: "https://maps.google.com/?q=Hagia+Sophia+Istanbul",
    placeholder: false,
  },
  {
    id: "grand-bazaar",
    name: "Grand Bazaar",
    description: "One of the world's oldest and largest covered markets.",
    category: "attraction" as const,
    address: "Beyazıt, Fatih, Istanbul",
    mapUrl: "https://maps.google.com/?q=Grand+Bazaar+Istanbul",
    placeholder: false,
  },
];
