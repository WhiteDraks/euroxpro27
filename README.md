# EUROXPRO’27 — Official International Congress Website & Delegate Hub

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/WhiteDraks/euroxpro27)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-101B35)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-741F3D)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

Official web portal and delegate operations hub for **EUROXPRO’27**, the premier regional conference of **AIESEC in Europe**, hosted by **MC Türkiye** in Antalya, Türkiye (Provisional Dates: 31 March – 4 April 2027).

> **Proposed Creative Positioning:** *Where Europe Meets the Mediterranean*  
> **Supporting Line:** *One region. Different realities. A shared ambition to create more global opportunities.*

---

## 🏛️ Project Architecture & Implemented Routes

The website is a fully typed, responsive multi-page application with centralized content models and verified AIESEC in Europe context:

- **`/` — Home**: Cinematic Mediterranean hero, editorial layout, proposed creative positioning, three core dimensions (Purpose, Destination, Experience), historical retrospective (**Previous Editions: Greece 2026, Rimini 2025, Alanya 2024**), image-led conference & destination gallery, official partners placeholder, capsule merch preview, and delegate preparation banner.
- **`/congress` — The Congress**: In-depth narrative on AIESEC in Europe's regional mission, organizational alignment, and exchange growth (*Global Volunteer, Global Talent, Global Teacher*); Previous Editions retrospective; 5-day indicative schedule framework (*Program to be announced*); and curated cultural evenings (*Global Village, Turkish Night Gala*).
- **`/delegate-guide` — Delegate Guide**: Practical information hub covering registration & participation criteria, accommodation status (TBA), arrival/departure via Antalya Airport (AYT), AntRay light rail & AntalyaKart rules, currency (TRY/₺) & banking advice, connectivity/eSIM, 112 emergency services, interactive `localStorage` packing checklist, and bulletin/FAQ links.
- **`/explore-antalya` — Explore Antalya**: Verified cultural highlights (Kaleiçi historic old town & Roman harbor, Lower Düden Waterfalls, Konyaaltı beach & Taurus Mountains, Aspendos theater), Mediterranean culinary traditions (Antalya piyaz, fresh seafood, citrus preserves), and transit routes.
- **`/explore-istanbul` — Legacy Route**: Automatically redirects to `/explore-antalya`.
- **`/merch` — Merch Store**: Capsule collection with explicit DEMO pre-order & expression-of-interest status (no live payments).
- **`/faq` — FAQ**: Real-time search and categorized accordions (Registration, Travel & Visas, Accommodation, Transportation, Payments, Schedule, Merch, Safety).
- **`/announcements` — Announcements**: News bulletin with pinned updates, category filtering, and polished empty-state handling.
- **`/contact` — Contact & OC**: Organizing Committee leadership profiles and validated inquiry form with client validation.
- **`/_not-found` — 404**: Branded custom not-found page.

---

## ✏️ Content Editor (`/admin`)

All texts and photos of the **Home**, **The Congress** and **Explore Antalya** pages (plus the home gallery, previous editions and partners sections) live in [`content/site.json`](content/site.json) and can be edited from **`/admin`** without touching code.

- Sign in with the shared admin password.
- Edit any text; `**bold**` and `*italic*` are supported.
- Upload photos from a computer or phone. They are resized (max 2000 px) and converted to WebP in the browser before upload, or paste an `images.unsplash.com` address.
- Press **Kaydet** (Save). In production every save becomes one commit on the repository, and Vercel redeploys the site within a few minutes.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Password for `/admin`. Changing it signs every session out. |
| `GITHUB_TOKEN` | In production | Fine-grained GitHub token with **Contents: Read and write** on this repository. Used to commit edits and uploaded photos. |
| `GITHUB_REPO` | No | `owner/name`, defaults to `WhiteDraks/euroxpro27`. |
| `GITHUB_BRANCH` | No | Branch Vercel deploys from, defaults to `main`. |

Locally (`npm run dev` without `GITHUB_TOKEN`), saves are written straight to `content/site.json` and `public/uploads/`.

---

## ⚡ Performance on Slow Connections

- Images are served as AVIF/WebP at quality 60, sized to the visitor's screen, and cached for 31 days.
- Only each page's hero photo is preloaded; everything else lazy-loads.
- The home gallery shows 6 photos first and loads the rest on request.
- Editor uploads are compressed before they reach the server and are cached as immutable.

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
Create `.env.local` with at least an admin password for the content editor:

```bash
echo "ADMIN_PASSWORD=choose-a-password" > .env.local
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
