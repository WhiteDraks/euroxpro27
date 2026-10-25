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

  // Event Dates (confirmed)
  startDate: new Date("2027-03-31T09:00:00+03:00"),
  endDate: new Date("2027-04-04T18:00:00+03:00"),
  datesLabel: "31 March – 4 April 2027",
  isDatesProvisional: false,

  // Venue & Accommodation
  venueName: "To be announced",
  venueAddress: "Antalya, Türkiye (exact venue to be announced)",
  venueCity: "Antalya, Türkiye",

  // Hotel
  hotelName: "To be announced",
  hotelAddress: "To be announced",
  hotelCheckIn: "14:00 (Arrival Day)",
  hotelCheckOut: "12:00 (Departure Day)",
  hotelPhone: "To be announced",

  // Registration
  registrationUrl: null as string | null,
  registrationOpen: false,
  registrationLabel: "Registration to be Announced",

  // Contact
  contactEmail: "contact@euroxpro27.com",
  supportEmail: "support@euroxpro27.com",

  // Social Media
  social: {
    instagram: "https://www.instagram.com/aiesecturkey/",
    linkedin: "https://www.linkedin.com/company/aiesec/",
    facebook: null as string | null,
    twitter: null as string | null,
  },

  // Brand Assets
  logo: "/images/euroxpro-logo.png",

  // SEO: absolute address used for share previews (WhatsApp, Instagram,
  // LinkedIn). On Vercel this is the production domain of the project.
  siteUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://euroxpro27.vercel.app",
};
