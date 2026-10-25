import type { Product } from "./types";

// ============================================================
// EUROXPRO'27 — Merchandise Catalog
// All products are illustrative until the real collection is confirmed
// ============================================================

export const CURRENCY = "EUR";
export const CURRENCY_SYMBOL = "€";

export const products: Product[] = [
  {
    id: "hoodie-navy",
    name: "EUROXPRO'27 Congress Hoodie",
    description:
      "Premium heavyweight hoodie in deep navy. Features embroidered EUROXPRO'27 wordmark on the chest and Istanbul skyline graphic on the back. Made from 80% cotton, 20% polyester.",
    price: 45,
    currency: CURRENCY,
    category: "hoodies",
    image: null,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Deep Navy", hex: "#101B35" },
      { name: "Burgundy", hex: "#741F3D" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "Limited Edition",
  },
  {
    id: "tshirt-white",
    name: "EUROXPRO'27 Graphic T-Shirt",
    description:
      "100% organic cotton tee with the EUROXPRO'27 graphic. Soft, sustainable, and perfect for casual wear or as a congress souvenir.",
    price: 25,
    currency: CURRENCY,
    category: "tshirts",
    image: null,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Warm Ivory", hex: "#F7F3ED" },
      { name: "Deep Navy", hex: "#101B35" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "tote-bag",
    name: "Congress Tote Bag",
    description:
      "Heavy-duty canvas tote bag with the EUROXPRO'27 wordmark and tagline. Spacious enough for your congress materials, laptop, and city exploration essentials.",
    price: 18,
    currency: CURRENCY,
    category: "tote-bags",
    image: null,
    colors: [
      { name: "Natural Canvas", hex: "#E8DFD0" },
      { name: "Navy", hex: "#172443" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "notebook",
    name: "EUROXPRO'27 Delegate Notebook",
    description:
      "Hardcover A5 notebook with ivory pages and the EUROXPRO'27 cover design. Elastic closure, ribbon bookmark, and pen loop. Perfect for congress notes and reflections.",
    price: 15,
    currency: CURRENCY,
    category: "notebooks",
    image: null,
    colors: [{ name: "Navy", hex: "#101B35" }],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "pin-set",
    name: "Istanbul Enamel Pin Set",
    description:
      "A set of 3 collectible enamel pins featuring iconic Istanbul motifs: the Bosphorus bridge, a tulip, and the EUROXPRO'27 crest. Each pin is gold-plated with hard enamel finish.",
    price: 12,
    currency: CURRENCY,
    category: "pins",
    image: null,
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "Collector's Item",
  },
  {
    id: "sticker-pack",
    name: "EUROXPRO'27 Sticker Pack",
    description:
      "A pack of 6 vinyl stickers featuring the EUROXPRO'27 wordmark, Istanbul illustrations, and congress graphic elements. Weather-resistant and fade-proof.",
    price: 6,
    currency: CURRENCY,
    category: "stickers",
    image: null,
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "keychain",
    name: "Istanbul Keychain",
    description:
      "Premium metal keychain with the EUROXPRO'27 logo and Istanbul skyline silhouette. A perfect everyday reminder of your congress experience.",
    price: 8,
    currency: CURRENCY,
    category: "accessories",
    image: null,
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "cap-navy",
    name: "EUROXPRO'27 Cap",
    description:
      "Classic 6-panel structured cap in deep navy with embroidered EUROXPRO'27 logo. Adjustable strap fits all sizes.",
    price: 22,
    currency: CURRENCY,
    category: "accessories",
    image: null,
    colors: [
      { name: "Deep Navy", hex: "#101B35" },
      { name: "Burgundy", hex: "#741F3D" },
    ],
    sizes: ["ONE SIZE"],
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "New",
  },
];

export const productCategories: Array<{
  id: string;
  label: string;
}> = [
  { id: "all", label: "All Products" },
  { id: "hoodies", label: "Hoodies" },
  { id: "tshirts", label: "T-Shirts" },
  { id: "tote-bags", label: "Tote Bags" },
  { id: "notebooks", label: "Notebooks" },
  { id: "pins", label: "Pins" },
  { id: "stickers", label: "Stickers" },
  { id: "accessories", label: "Accessories" },
];

export const orderInstructions = `
**How to Order**

The EUROXPRO'27 merch collection is currently in final production. Availability and exact pricing will be confirmed closer to the congress.

To express your interest in specific items:
1. Select your desired products and fill in the order form below.
2. Your order request will be logged and you will be contacted by the Organizing Committee when orders officially open.
3. No payment is collected at this stage — this is an expression of interest only.

Orders will be available for collection at the congress registration desk. Shipping may be available for select items post-congress, subject to confirmation.

Questions? Contact [support@euroxpro27.com]
`;
