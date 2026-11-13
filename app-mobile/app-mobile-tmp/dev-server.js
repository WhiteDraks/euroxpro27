// Local server: serves public/ and the same API as the Vercel function.
// Also works as a production server on any Node host:  node dev-server.js
// Without Upstash env vars, data is kept in memory (lost on restart).
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { handle } from "./lib/api.js";

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function file(res, rel) {
  const f = path.normalize(path.join(PUBLIC, rel));
  if (!f.startsWith(PUBLIC + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) return false;
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "no-cache" });
  fs.createReadStream(f).pipe(res);
  return true;
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      const segs = url.pathname.slice(5).split("/").filter(Boolean).map(decodeURIComponent);
      const response = await handle(request, segs);
      const headers = Object.fromEntries(response.headers);
      const cookies = response.headers.getSetCookie?.() || [];
      if (cookies.length) headers["set-cookie"] = cookies;
      res.writeHead(response.status, headers);
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";
    if (file(res, rel)) return;
    file(res, "/index.html"); // client-side route
  })
  .listen(PORT, () => console.log(`EUROXPRO'27 app on http://localhost:${PORT}`));
