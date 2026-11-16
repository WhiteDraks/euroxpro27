import { getLeague } from "@/lib/approvals";

// Cached for 30 seconds like the page itself: open league pages poll
// this, and every visitor in that window gets the same stored answer.
export const revalidate = 30;

export async function GET() {
  const league = await getLeague();
  if (!league) return Response.json({ error: "unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
  return Response.json(league);
}
