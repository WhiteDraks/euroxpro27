import type { ChecklistItem } from "./types";

// ============================================================
// EUROXPRO'27 — Delegate Checklist Items
// ============================================================

export const checklistItems: ChecklistItem[] = [
  // Documents
  {
    id: "doc-1",
    label: "Passport (valid 6+ months)",
    category: "Documents",
  },
  {
    id: "doc-2",
    label: "Visa or e-Visa, if you need one",
    category: "Documents",
  },
  {
    id: "doc-3",
    label: "Registration confirmation",
    category: "Documents",
  },
  {
    id: "doc-4",
    label: "Travel insurance",
    category: "Documents",
  },
  {
    id: "doc-5",
    label: "Flight tickets",
    category: "Documents",
  },
  {
    id: "doc-6",
    label: "Hotel details",
    category: "Documents",
  },
  {
    id: "doc-7",
    label: "Emergency contacts",
    category: "Documents",
  },
  // Health & Wellness
  {
    id: "health-1",
    label: "Your medicines",
    category: "Health",
  },
  {
    id: "health-2",
    label: "Vaccinations up to date",
    category: "Health",
  },
  {
    id: "health-3",
    label: "Painkillers and plasters",
    category: "Health",
  },
  {
    id: "health-4",
    label: "Sunscreen",
    category: "Health",
  },
  // Technology
  {
    id: "tech-1",
    label: "Phone charger",
    category: "Technology",
  },
  {
    id: "tech-2",
    label: "Plug adapter (European two-pin)",
    category: "Technology",
  },
  {
    id: "tech-3",
    label: "Power bank",
    category: "Technology",
  },
  {
    id: "tech-4",
    label: "eSIM or roaming",
    category: "Technology",
  },
  {
    id: "tech-5",
    label: "Headphones",
    category: "Technology",
  },
  // Clothing
  {
    id: "clothes-1",
    label: "Smart casual clothes",
    category: "Clothing",
  },
  {
    id: "clothes-2",
    label: "Formal outfit for the gala night",
    category: "Clothing",
  },
  {
    id: "clothes-3",
    label: "Comfortable shoes",
    category: "Clothing",
  },
  {
    id: "clothes-4",
    label: "Light jacket",
    category: "Clothing",
  },
  {
    id: "clothes-5",
    label: "Scarf or cover-up for mosques",
    category: "Clothing",
  },
  // Congress Essentials
  {
    id: "congress-1",
    label: "Notebook and pens",
    category: "Congress Essentials",
  },
  {
    id: "congress-2",
    label: "Reusable water bottle",
    category: "Congress Essentials",
  },
  {
    id: "congress-3",
    label: "Business cards",
    category: "Congress Essentials",
  },
  {
    id: "congress-4",
    label: "Laptop or tablet",
    category: "Congress Essentials",
  },
  // Money
  {
    id: "money-1",
    label: "Tell your bank you are travelling",
    category: "Money",
  },
  {
    id: "money-2",
    label: "A little Turkish Lira cash",
    category: "Money",
  },
  {
    id: "money-3",
    label: "Bank card",
    category: "Money",
  },
];

export const checklistCategories = Array.from(
  new Set(checklistItems.map((item) => item.category))
);
