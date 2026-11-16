import express from "express";
import * as store from "./store.js";

export const api = express.Router();
const COOKIE = "ga_session";

api.use(express.json({ limit: "16kb" }));

// Writes must be JSON. Browsers can't send cross-site JSON without a CORS preflight (which we never
// allow), and the session cookie is SameSite=Strict, so this blocks cross-site request forgery.
api.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !req.is("application/json")) {
    return res.status(415).json({ error: "Expected JSON" });
  }
  res.set("Cache-Control", "no-store");
  next();
});

/* ---------- helpers ---------- */
function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}
function setSessionCookie(req, res, token) {
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: req.secure, path: "/", maxAge: store.SESSION_HOURS * 36e5 });
}
const session = (req) => store.readSession(readCookie(req, COOKIE));
const str = (v, max = 120) => String(v ?? "").trim().slice(0, max);

function requireRole(role) {
  return (req, res, next) => {
    const s = session(req);
    if (!s) return res.status(401).json({ error: "Please sign in." });
    if (s.role !== role) return res.status(403).json({ error: "Not allowed." });
    req.session = s;
    next();
  };
}

// Simple in-memory limiter: 8 failed sign-ins per IP per 15 minutes.
const attempts = new Map();
const WINDOW = 15 * 60 * 1000, MAX_FAILS = 8;
function limited(req) {
  const a = attempts.get(req.ip);
  if (!a || a.reset < Date.now()) return false;
  return a.count >= MAX_FAILS;
}
function fail(req) {
  const a = attempts.get(req.ip);
  if (!a || a.reset < Date.now()) attempts.set(req.ip, { count: 1, reset: Date.now() + WINDOW });
  else a.count++;
}
const slow = () => new Promise((r) => setTimeout(r, 300 + Math.random() * 300));

/* ---------- auth ---------- */
api.get("/auth/me", (req, res) => {
  const s = session(req);
  if (!s) return res.status(401).json({ error: "Not signed in." });
  res.json({ role: s.role, user: s.user });
});

api.post("/auth/staff", async (req, res) => {
  if (limited(req)) return res.status(429).json({ error: "Too many attempts. Please wait 15 minutes and try again." });
  const staff = store.checkStaffCode(req.body?.code);
  if (!staff) { fail(req); await slow(); return res.status(401).json({ error: "That access code isn’t valid. Check it with your administrator." }); }
  setSessionCookie(req, res, store.createSession("staff", staff.id));
  res.json({ role: "staff", user: staff });
});

api.post("/auth/admin", async (req, res) => {
  if (limited(req)) return res.status(429).json({ error: "Too many attempts. Please wait 15 minutes and try again." });
  const admin = store.checkAdmin(req.body?.email, req.body?.password);
  if (!admin) { fail(req); await slow(); return res.status(401).json({ error: "Email or password is incorrect." }); }
  setSessionCookie(req, res, store.createSession("admin", admin.id));
  res.json({ role: "admin", user: admin });
});

api.post("/auth/logout", (req, res) => {
  store.endSession(readCookie(req, COOKIE));
  res.clearCookie(COOKIE, { path: "/" });
  res.json({ ok: true });
});

/* ---------- staff portal ---------- */
api.get("/staff/portal", requireRole("staff"), (req, res) => {
  res.json({ user: req.session.user, notice: store.getNotice() });
});

/* ---------- admin ---------- */
const admin = express.Router();
admin.use(requireRole("admin"));

admin.get("/staff", (req, res) => res.json({ staff: store.listStaff(), notice: store.getNotice() }));

admin.post("/staff", (req, res) => {
  const name = str(req.body?.name), role = str(req.body?.role, 80), centre = str(req.body?.centre), email = str(req.body?.email, 160);
  const days = Number(req.body?.expiresInDays) || 0;
  if (!name || !role) return res.status(400).json({ error: "Name and role are required." });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "That email doesn’t look right." });
  if (days < 0 || days > 3650) return res.status(400).json({ error: "Expiry must be between 0 and 3650 days." });
  res.status(201).json(store.createStaff({ name, role, centre, email, expiresInDays: days }));
});

admin.post("/staff/:id/regenerate", (req, res) => {
  const r = store.regenerateCode(req.params.id);
  r ? res.json(r) : res.status(404).json({ error: "Staff member not found." });
});

admin.patch("/staff/:id", (req, res) => {
  const s = store.setStaffActive(req.params.id, req.body?.active);
  s ? res.json({ staff: s }) : res.status(404).json({ error: "Staff member not found." });
});

admin.delete("/staff/:id", (req, res) => {
  store.deleteStaff(req.params.id) ? res.json({ ok: true }) : res.status(404).json({ error: "Staff member not found." });
});

admin.put("/notice", (req, res) => res.json({ notice: store.setNotice(req.body?.text) }));

admin.post("/password", (req, res) => {
  const next = String(req.body?.next || "");
  if (next.length < 10) return res.status(400).json({ error: "Use at least 10 characters for the new password." });
  store.changeAdminPassword(req.session.user.id, req.body?.current, next)
    ? res.json({ ok: true })
    : res.status(400).json({ error: "Current password is incorrect." });
});

api.use("/admin", admin);
api.use((req, res) => res.status(404).json({ error: "Not found" }));
