import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionLayer } from "@/components/common/MotionLayer";
import { OfflineSupport } from "@/components/common/OfflineSupport";
import { siteConfig } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";

// Fonts are downloaded at build time and served with the site, so they
// keep working offline and never call Google from the visitor's browser.
// Apple devices use the system face (SF Pro); everyone else gets Inter,
// which is drawn in the same spirit.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — Antalya, Türkiye | 31 March – 4 April 2027`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  keywords: ["EUROXPRO", "AIESEC", "congress", "Antalya", "Türkiye", "Turkish Riviera", "Mediterranean", "international", "leadership", "2027"],
  authors: [{ name: "EUROXPRO'27 Organizing Committee" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: `${siteConfig.name} — Antalya, Türkiye | ${siteConfig.datesLabel}`,
    description: siteConfig.shortDescription,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Antalya, Türkiye | ${siteConfig.datesLabel}`,
    description: siteConfig.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <OfflineSupport />
        <MotionLayer />
        <Analytics />
      </body>
    </html>
  );
}
