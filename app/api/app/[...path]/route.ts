import { handle } from "@/lib/delegate/api";

// Delegate app API: see lib/delegate/api.ts.
export const maxDuration = 60;

type Ctx = { params: Promise<{ path: string[] }> };
const run = async (req: Request, { params }: Ctx) => handle(req, (await params).path);

export const GET = run;
export const POST = run;
export const PATCH = run;
