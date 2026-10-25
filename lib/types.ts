// ============================================================
// EUROXPRO'27 — TypeScript Type Definitions
// ============================================================

export type ProductCategory =
  | "hoodies"
  | "tshirts"
  | "tote-bags"
  | "stickers"
  | "pins"
  | "notebooks"
  | "accessories";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "ONE SIZE";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  image: string | null;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  stockStatus: "available" | "limited" | "coming-soon" | "sold-out";
  isIllustrative: boolean;
  badge?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  selectedColor?: ProductColor;
};

export type ScheduleSession = {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  type:
    | "plenary"
    | "workshop"
    | "networking"
    | "social"
    | "break"
    | "logistics";
  location?: string;
  speaker?: string;
  description?: string;
  dressCode?: string;
};

export type ScheduleDay = {
  day: number;
  date: string; // e.g. "Day 1" or "TBC"
  label: string;
  sessions: ScheduleSession[];
};

export type Announcement = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category:
    | "general"
    | "registration"
    | "schedule"
    | "accommodation"
    | "travel"
    | "merch"
    | "important";
  publishedAt: string;
  isPinned: boolean;
  externalLink?: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type FAQCategory = {
  id: string;
  label: string;
  items: FAQItem[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  detail?: string;
  category: string;
};

export type LocationCategory =
  | "accommodation"
  | "venue"
  | "transport"
  | "attraction"
  | "food"
  | "health";
