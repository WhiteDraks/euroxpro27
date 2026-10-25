import { siteConfig } from "@/lib/config";

// ============================================================
// Event details in schema.org format, so Google can show the congress
// with its dates and city in search results.
// ============================================================

export function EventStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    startDate: siteConfig.startDate.toISOString(),
    endDate: siteConfig.endDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: siteConfig.siteUrl,
    image: [`${siteConfig.siteUrl}/opengraph-image`],
    location: {
      "@type": "Place",
      name: siteConfig.venueCity,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Antalya",
        addressCountry: "TR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "AIESEC in Türkiye",
      url: "https://aiesec.org",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
