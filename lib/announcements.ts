import type { Announcement } from "./types";

// ============================================================
// EUROXPRO'27 — Announcements
// Add new announcements here. Most recent should appear first.
// ============================================================

export const announcements: Announcement[] = [
  {
    id: "ann-001",
    title: "Welcome to the EUROXPRO'27 Official Website",
    summary:
      "We are thrilled to launch the official EUROXPRO'27 website. Explore the congress pages and stay tuned for upcoming announcements.",
    content: `
We are delighted to launch the official EUROXPRO'27 website!

EUROXPRO'27 is coming to Istanbul, Türkiye — and we couldn't be more excited to share this journey with you. This website is your central hub for all congress information, from the delegate guide to the merch store.

Over the coming weeks and months, we will be updating the site with:
- Official congress dates and venue details
- Registration information
- Congress programme and speaker announcements  
- Accommodation and travel information
- Merchandise collection launch

Follow our social media channels for real-time updates, and make sure to check back here regularly. More exciting news is on the way!

— The EUROXPRO'27 Organizing Committee
    `.trim(),
    category: "general",
    publishedAt: "2026-10-25",
    isPinned: true,
  },
  {
    id: "ann-002",
    title: "Delegate Guide Now Available",
    summary:
      "The EUROXPRO'27 Delegate Guide is live! Find everything you need to know about travelling to Istanbul and preparing for the congress.",
    content: `
We have published the first version of the EUROXPRO'27 Delegate Guide!

The guide covers everything delegates need to know before arriving in Istanbul:

**Travel Preparation**
- Required travel documents and visa information
- Flight and airport guidance  
- Packing checklist
- What to expect at Istanbul airports

**During the Congress**
- Accommodation information (hotel details to be confirmed)
- Transportation around Istanbul
- Money, connectivity, and practical tips
- Health and safety resources

**Explore Istanbul**
- Must-see attractions near the congress area
- Local food and culture guide
- Useful Turkish phrases for delegates
- Suggested itineraries for free time

The guide will be updated as more official information is confirmed. Bookmark the Delegate Guide page and check back often.
    `.trim(),
    category: "general",
    publishedAt: "2026-10-25",
    isPinned: false,
  },
  {
    id: "ann-003",
    title: "Merch Store Preview — Express Your Interest",
    summary:
      "The EUROXPRO'27 merch collection is in development. Browse our planned items and express your interest in what you'd like to order.",
    content: `
The official EUROXPRO'27 merchandise collection is currently in production!

We have published a preview of the planned collection in our Merch Store. Items include:
- Limited-edition congress hoodie in deep navy and burgundy
- EUROXPRO'27 graphic t-shirts
- Canvas tote bag
- Delegate notebook
- Istanbul enamel pin set
- Sticker pack and accessories

**How to Express Your Interest**

At this stage, no payments are being collected. You can use the Merch Store to browse the collection, select items, and submit an expression of interest. The Organizing Committee will contact you when official orders open.

**Important**: All current products are illustrative examples. Final designs, exact pricing, and availability will be confirmed before the congress.

Stay tuned for the official merch launch announcement!
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
