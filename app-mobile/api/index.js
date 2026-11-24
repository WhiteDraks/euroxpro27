// Vercel function: every /api/* request is routed here (see vercel.json).
import { handle } from "../lib/api.js";

export const config = { maxDuration: 60 };

function segments(request) {
  const url = new URL(request.url);
  const p = url.searchParams.get("__path") ?? url.pathname.replace(/^\/api\/?/, "");
  return p.split("/").filter(Boolean).map(decodeURIComponent);
}

const run = (request) => {
  let segs;
  try {
    segs = segments(request);
  } catch {
    // A broken %-escape in the path: answer 400 instead of crashing the function.
    return Response.json({ error: "bad_path" }, { status: 400 });
  }
  return handle(request, segs);
};

export const GET = run;
export const POST = run;
export const PATCH = run;
