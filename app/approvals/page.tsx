import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ApprovalsLeague } from "@/components/approvals/ApprovalsLeague";
import { getLeague } from "@/lib/approvals";

export const metadata: Metadata = {
  title: "Approvals League",
  description: "Live ranking of AIESEC local and member committees by approvals, realizations and completes during EUROXPRO'27.",
  alternates: { canonical: "/approvals" },
};

// Rebuilt at most every 30 seconds, whatever the crowd size.
export const revalidate = 30;

export default async function ApprovalsPage() {
  const league = await getLeague();
  return (
    <div>
      <PageHero
        eyebrow="Live during the congress"
        title="Approvals League"
        intro="Who is leading right now. Updates by itself."
      />
      <ApprovalsLeague initial={league} />
    </div>
  );
}
