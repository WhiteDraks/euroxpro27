# EUROXPRO’27 — Official International Congress Website & Delegate Hub

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/WhiteDraks/euroxpro27)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-101B35)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-741F3D)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

Official web portal and delegate operations hub for **EUROXPRO’27**, an international AIESEC congress hosted in Antalya, Türkiye (31 March – 4 April 2027).

> **Congress Motto:** *Where Mediterranean Horizons Inspire Tomorrow’s Leadership.*

---

## 🏛️ Project Architecture & Implemented Routes

The website is a fully typed, responsive multi-page application with centralized content models:

- **`/` — Home**: Cinematic Mediterranean hero, editorial layout, confirmed dates & Antalya city badge, delegate tool cards, Turkish Riviera destination showcase, and capsule merch preview.
- **`/congress` — The Congress**: Congress vision, Mediterranean leadership tracks, social evenings (Turkish Night Gala & Global Village dress codes), and an interactive 5-day timetable (31 March – 4 April 2027).
- **`/delegate-guide` — Delegate Guide**: Audited travel logistics, verified passport & official e-Visa links (`evisa.gov.tr`), Antalya Airport (AYT) transit, AntRay light rail & AntalyaKart rules, currency (TRY/₺) & banking advice, connectivity/eSIM, 112 emergency services, and an interactive `localStorage` packing checklist.
- **`/explore-antalya` — Explore Antalya**: Curated landmarks (Kaleiçi historic old town, Düden Waterfalls, Konyaaltı & Taurus Mountains, Aspendos), Mediterranean gastronomy & dining etiquette, practical Turkish phrases with pronunciations, and useful city locations.
- **`/explore-istanbul` — Legacy Route**: Automatically redirects to `/explore-antalya`.
- **`/merch` — Merch Store**: Congress capsule collection, interactive modal for size/color/quantity selection, real-time cart subtotal calculation, and an expression-of-interest pre-order flow.
- **`/faq` — FAQ**: Real-time search and categorized accordions (Registration, Visas, Accommodation, Transportation, Payments, Schedule, Merch, Safety).
- **`/announcements` — Announcements**: News bulletin with pinned announcements (including Antalya host city notice), category filtering, and expandable read-more views.
- **`/contact` — Contact & OC**: Organizing Committee leadership profiles and a validated contact form routed by department.
- **`/_not-found` — 404**: Branded custom not-found page.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: `>= 18.17.0` (Recommended: Node 20+)
- **npm**: `>= 9.x`

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/WhiteDraks/euroxpro27.git
cd euroxpro27
npm install
```

### 3. Environment Variables
Create your local environment configuration:

```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Verification
```bash
# Type check with TypeScript
npx tsc --noEmit

# Run ESLint
npx eslint .

# Create production build
npm run build
```

---

## 🌐 Deploying to Vercel

The application is fully optimized for **Vercel**:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub (`WhiteDraks/euroxpro27`).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `euroxpro27` repository.
4. Framework preset will automatically detect **Next.js**.
5. (Optional) In **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`
6. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

---

## 📋 Integrations & Status Report

| Integration Area | Current Operational State | Next Steps for Organizing Committee |
|---|---|---|
| **Congress Dates & Venue** | ✅ **Confirmed Dates (31 March – 4 April 2027)** | Venue city is **Antalya, Türkiye**. Update `lib/config.ts` (`venueName`, `venueAddress`) once exact congress hall is designated. |
| **Hotel Lodging** | `[HOTEL NAME TO BE CONFIRMED]` | Update `lib/config.ts` (`hotelName`, `hotelAddress`, `hotelCheckIn`) once hotel contracts are finalized. |
| **Official e-Visa** | ✅ **Active** | Linked directly to official government portals (`evisa.gov.tr` and `mfa.gov.tr`). |
| **Packing Checklist** | ✅ **Active** | Uses browser `localStorage` and `useSyncExternalStore` for persistent offline tracking. |
| **Merchandise Store** | ✅ **Active (Pre-Order Interest)** | Submits expressions of interest. To connect live Stripe payments, integrate Stripe Checkout or Lemonsqueezy in `components/merch/MerchStore.tsx`. |
| **Contact Form** | ✅ **Active (Client Validation)** | To send real emails, supply `RESEND_API_KEY` in Vercel environment variables and hook up a Route Handler (`app/api/contact/route.ts`). |
| **Live Weather API** | Informational Seasonal Climate | To enable real-time 7-day weather closer to the congress, configure `WEATHER_API_KEY` (e.g. OpenWeatherMap). |

---

## 🔒 Security & Safe Handling

- No API keys or credentials are hardcoded into client-side code.
- `.env.example` provides clean variable templates without exposing sensitive secrets.
- All external links open safely with `rel="noopener noreferrer"`.
- Zero personally identifiable delegate information is exposed publicly.

---

## 📄 License & Attribution
Designed for **EUROXPRO’27** & **AIESEC in Türkiye / Antalya**.
All trademarks and visual assets belong to their respective entities.
