import type { ChecklistItem } from "./types";

// ============================================================
// EUROXPRO'27 — Delegate Checklist Items
// ============================================================

export const checklistItems: ChecklistItem[] = [
  // Documents
  {
    id: "doc-1",
    label: "Valid passport (check expiry — 6+ months beyond travel dates)",
    category: "Documents",
  },
  {
    id: "doc-2",
    label: "Visa or e-Visa (if required for your nationality)",
    detail: "Check evisa.gov.tr for requirements",
    category: "Documents",
  },
  {
    id: "doc-3",
    label: "Congress registration confirmation",
    category: "Documents",
  },
  {
    id: "doc-4",
    label: "Travel insurance documents",
    category: "Documents",
  },
  {
    id: "doc-5",
    label: "Flight tickets (digital or printed)",
    category: "Documents",
  },
  {
    id: "doc-6",
    label: "Hotel confirmation details",
    category: "Documents",
  },
  {
    id: "doc-7",
    label: "Emergency contact information",
    category: "Documents",
  },
  // Health & Wellness
  {
    id: "health-1",
    label: "Personal medications (sufficient supply + extra)",
    detail: "Bring original packaging and prescriptions if possible",
    category: "Health",
  },
  {
    id: "health-2",
    label: "Any required vaccinations up to date",
    category: "Health",
  },
  {
    id: "health-3",
    label: "Basic first aid items (painkillers, plasters, etc.)",
    category: "Health",
  },
  {
    id: "health-4",
    label: "Sunscreen (Istanbul can be sunny!)",
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
    label: "Travel adapter (Türkiye uses Type F/C plugs, 220V)",
    detail: "Standard European plugs work in Türkiye",
    category: "Technology",
  },
  {
    id: "tech-3",
    label: "Portable power bank",
    category: "Technology",
  },
  {
    id: "tech-4",
    label: "International roaming enabled or eSIM arranged",
    detail: "Consider a Turkish SIM card or eSIM for local data",
    category: "Technology",
  },
  {
    id: "tech-5",
    label: "Headphones or earbuds",
    category: "Technology",
  },
  // Clothing
  {
    id: "clothes-1",
    label: "Smart casual clothing for congress sessions",
    category: "Clothing",
  },
  {
    id: "clothes-2",
    label: "Formal outfit for the Turkish Night Gala",
    detail: "Dress code: Formal / Traditional Attire",
    category: "Clothing",
  },
  {
    id: "clothes-3",
    label: "Comfortable walking shoes for city exploration",
    category: "Clothing",
  },
  {
    id: "clothes-4",
    label: "Light jacket or cardigan (evenings can be cool)",
    category: "Clothing",
  },
  {
    id: "clothes-5",
    label: "Cover-up for visiting mosques (shoulders and knees covered)",
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
    label: "Business cards or contact cards",
    category: "Congress Essentials",
  },
  {
    id: "congress-4",
    label: "Laptop or tablet (if needed for workshops)",
    category: "Congress Essentials",
  },
  // Money
  {
    id: "money-1",
    label: "Notify your bank of your travel dates",
    category: "Money",
  },
  {
    id: "money-2",
    label: "Some Turkish Lira cash for small purchases",
    detail: "ATMs are widely available in Istanbul",
    category: "Money",
  },
  {
    id: "money-3",
    label: "Credit/debit card accepted in most places",
    category: "Money",
  },
];

export const checklistCategories = Array.from(
  new Set(checklistItems.map((item) => item.category))
);
