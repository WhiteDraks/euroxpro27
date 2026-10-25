import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Istanbul, Türkiye`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  keywords: ["EUROXPRO", "AIESEC", "congress", "Istanbul", "Turkey", "international", "leadership", "2027"],
  authors: [{ name: "EUROXPRO'27 Organizing Committee" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    title: `${siteConfig.name} — Istanbul, Türkiye`,
    description: siteConfig.shortDescription,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Istanbul, Türkiye`,
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
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
