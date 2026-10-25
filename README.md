# EUROXPRO’27 — Official International Congress Website & Delegate Hub

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/WhiteDraks/euroxpro27)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-101B35)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-741F3D)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

Official web portal and delegate operations hub for **EUROXPRO’27**, an international AIESEC-related congress hosted in Istanbul, Türkiye.

> **Congress Motto:** *One City. Different Perspectives. One Shared Future.*

---

## 🏛️ Project Architecture & Implemented Routes

The website is a fully typed, responsive multi-page application with centralized content models:

- **`/` — Home**: Cinematic transcontinental hero, editorial layout, draft congress status, delegate tool cards, Istanbul introduction, and limited merch preview.
- **`/congress` — The Congress**: Congress vision, delegate eligibility criteria, social evenings (Turkish Night Gala & Bosphorus Night dress codes), and an interactive day-by-day timetable with session filtering.
- **`/delegate-guide` — Delegate Guide**: Audited travel logistics, verified passport & official e-Visa links (`evisa.gov.tr`), IST/SAW airport transit, Istanbulkart rules, currency (TRY/₺) & banking advice, connectivity/eSIM, 112 emergency services, and an interactive `localStorage` packing checklist.
- **`/explore-istanbul` — Explore Istanbul**: Curated landmarks (Hagia Sophia, Blue Mosque, Galata Tower, Grand Bazaar), Turkish culinary guide & dining etiquette, practical Turkish phrases with pronunciations, and useful city locations.
- **`/merch` — Merch Store**: Congress capsule collection, interactive modal for size/color/quantity selection, real-time cart subtotal calculation, and an expression-of-interest pre-order flow.
- **`/faq` — FAQ**: Real-time search and categorized accordions (Registration, Visas, Accommodation, Transportation, Payments, Schedule, Merch, Safety).
- **`/announcements` — Announcements**: News bulletin with pinned announcements, category filtering, and expandable read-more views.
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
| **Congress Dates & Venue** | `[TO BE CONFIRMED]` Placeholders | Update `lib/config.ts` (`startDate`, `venueName`, `venueAddress`) once finalized. |
| **Hotel Lodging** | `[HOTEL NAME TO BE CONFIRMED]` | Update `lib/config.ts` (`hotelName`, `hotelAddress`, `hotelCheckIn`) once contracts are signed. |
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
Designed for **EUROXPRO’27** & **AIESEC in Türkiye / Istanbul**.
All trademarks and visual assets belong to their respective entities.
