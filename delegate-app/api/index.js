// Vercel function: every /api/* request is routed here (see vercel.json).
import { handle } from "../lib/api.js";

export const config = { maxDuration: 60 };

function segments(request) {
  const url = new URL(request.url);
  const p = url.searchParams.get("__path") ?? url.pathname.replace(/^\/api\/?/, "");
  return p.split("/").filter(Boolean).map(decodeURIComponent);
}

const run = (request) => handle(request, segments(request));

export const GET = run;
export const POST = run;
export const PATCH = run;
