import type { Announcement } from "./types";

// ============================================================
// EUROXPRO'27 — Announcements
// Add new announcements here. Most recent should appear first.
// ============================================================

export const announcements: Announcement[] = [
  {
    id: "ann-000",
    title: "Official Announcement: EUROXPRO'27 Confirmed for Antalya, 31 March – 4 April 2027",
    summary:
      "The Organizing Committee is thrilled to officially announce that EUROXPRO'27 will take place in the coastal paradise of Antalya, Türkiye from 31 March to 4 April 2027.",
    content: `
We are proud to officially confirm the host city and dates for EUROXPRO'27!

**Location**: Antalya, Türkiye  
**Dates**: 31 March – 4 April 2027 (5 Days: Wednesday to Sunday)

Antalya offers an extraordinary setting on the Turkish Riviera where the turquoise Mediterranean meets the dramatic Taurus Mountains. Delegates will experience world-class congress facilities, inspiring seaside plenary halls, and rich Mediterranean culture.

**Key Milestones & What to Expect Next:**
- 31 March 2027: Arrival Day, Welcome Desk at Antalya Airport (AYT) & Opening Ceremony
- 1–3 April 2027: Plenaries, Impact Workshops, Bilateral Networking, Kaleiçi Cultural Afternoon & Turkish Night Gala
- 4 April 2027: Closing Plenary, Farewell Lunch & Departures
- Registration opening dates and official delegate package pricing will be released shortly.

Stay tuned for upcoming announcements regarding speaker lineups and registration links!

— The EUROXPRO'27 Organizing Committee
    `.trim(),
    category: "important",
    publishedAt: "2026-10-25",
    isPinned: true,
  },
  {
    id: "ann-001",
    title: "Welcome to the EUROXPRO'27 Official Portal",
    summary:
      "Explore the congress portal and stay tuned for delegate preparation resources and updates.",
    content: `
Welcome to the official digital hub for EUROXPRO'27 in Antalya, Türkiye!

This website is your central hub for all congress logistics, including the complete 5-day schedule framework, airport and transit guidance, packing checklists, and the merchandise preview store.

Follow our social media channels for real-time updates and announcements.

— The EUROXPRO'27 Organizing Committee
    `.trim(),
    category: "general",
    publishedAt: "2026-10-25",
    isPinned: false,
  },
  {
    id: "ann-002",
    title: "Antalya Delegate Preparation Guide is Live",
    summary:
      "Find everything you need to know about travelling to Antalya Airport (AYT), AntRay transit, packing, and visas.",
    content: `
The EUROXPRO'27 Delegate Guide has been published with comprehensive travel briefings for Antalya, Türkiye:

**Travel & Arrival**
- Flights to Antalya Airport (AYT) and international transit options
- Ground transfers via AntRay light rail tram and Havaş coaches
- Interactive packing checklist stored directly in your browser
- Turkish e-Visa and passport validity requirements

**Congress Experience**
- Mediterranean spring climate profile (18°C–23°C)
- Money, currency exchange, and contactless card payments
- Connectivity, local eSIMs, and power voltage
- Exploring Kaleiçi Old Town, Düden Waterfalls, and local Mediterranean cuisine

Bookmark the Delegate Guide page to prepare your journey!
    `.trim(),
    category: "travel",
    publishedAt: "2026-10-25",
    isPinned: false,
  },
  {
    id: "ann-003",
    title: "Merch Store Preview — Mediterranean Collection",
    summary:
      "Browse our planned items and express your interest in the official EUROXPRO'27 apparel and memorabilia.",
    content: `
The official EUROXPRO'27 merchandise collection is in active development!

Browse items in our Merch Store:
- Limited-edition congress hoodie in deep navy and burgundy
- EUROXPRO'27 Mediterranean graphic t-shirts
- Riviera canvas tote bag
- Delegate executive notebook
- Antalya collectible enamel pin set & keychains

Express your interest through our catalog to help the OC plan order batches.
    `.trim(),
    category: "merch",
    publishedAt: "2026-10-25",
    isPinned: false,
  },
];

export const categories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "registration", label: "Registration" },
  { id: "schedule", label: "Schedule" },
  { id: "accommodation", label: "Accommodation" },
  { id: "travel", label: "Travel" },
  { id: "merch", label: "Merch" },
  { id: "important", label: "Important" },
];
