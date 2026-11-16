// One server for everything: the website, the staff/admin API, and (in development) Vite's dev server.
//   npm run dev    -> http://localhost:5190 with hot reload
//   npm run build && npm start -> production
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { api } from "./api.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isProd = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const PORT = Number(process.env.PORT) || 5190;

const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY); // set when behind a load balancer

app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});

app.use("/api", api);

if (isProd) {
  const dist = path.join(root, "dist");
  app.use(express.static(dist, { index: false, maxAge: "7d", setHeaders: (res, file) => file.endsWith(".html") && res.set("Cache-Control", "no-cache") }));
  // Single-page app: every other route gets index.html, so refreshing /courses etc. works.
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}

app.listen(PORT, () => console.log(`Globalart running at http://localhost:${PORT} (${isProd ? "production" : "development"})`));
