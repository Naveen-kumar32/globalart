// Tiny JSON-file store for staff access. No external database needed.
// Secrets are never stored in plain text:
//  - admin passwords: scrypt with a per-user salt
//  - staff access codes: HMAC-SHA256 keyed with a server secret (codes are high-entropy, so this
//    is safe and lets us look a code up directly)
//  - session tokens: SHA-256 (the raw token only lives in the user's httpOnly cookie)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || path.join(here, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SECRET_FILE = path.join(DATA_DIR, "secret.key");

fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });

/* ---------- server secret (for code hashing) ---------- */
function loadSecret() {
  if (process.env.CODE_SECRET) return Buffer.from(process.env.CODE_SECRET);
  if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(32).toString("hex"), { mode: 0o600 });
  return Buffer.from(fs.readFileSync(SECRET_FILE, "utf8").trim());
}
const SECRET = loadSecret();

/* ---------- persistence ---------- */
const EMPTY = { admins: [], staff: [], sessions: [], notice: "" };
let db = load();
let loadedAt = mtime();
function mtime() { try { return fs.statSync(DB_FILE).mtimeMs; } catch { return 0; } }
/** Re-read the file if something else (e.g. `npm run create-admin`) changed it while we were running. */
function sync() { const m = mtime(); if (m !== loadedAt) { db = load(); loadedAt = m; } }
function load() {
  try { return { ...EMPTY, ...JSON.parse(fs.readFileSync(DB_FILE, "utf8")) }; }
  catch (e) { if (e.code !== "ENOENT") throw e; return structuredClone(EMPTY); }
}
function save() {
  const tmp = DB_FILE + "." + process.pid + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, DB_FILE); // atomic replace
  loadedAt = mtime();
}

/* ---------- hashing helpers ---------- */
export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}
function verifyPassword(pw, stored) {
  const [, saltHex, hashHex] = String(stored).split("$");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(pw, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}
const codeHash = (code) => crypto.createHmac("sha256", SECRET).update(code).digest("hex");
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const id = () => crypto.randomUUID();

/* ---------- access codes: GA-XXXX-XXXX-XXXX-XXXX (80 bits) ---------- */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export function newCode() {
  const bytes = crypto.randomBytes(16);
  const chars = [...bytes].map((b) => ALPHABET[b % 32]).join("");
  return "GA-" + chars.match(/.{4}/g).join("-");
}
export function normaliseCode(input) {
  const raw = String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = raw.startsWith("GA") ? raw.slice(2) : raw;
  if (body.length !== 16) return null;
  return "GA-" + body.match(/.{4}/g).join("-");
}

/* ---------- admins ---------- */
export function countAdmins() { sync(); return db.admins.length; }
export function createAdmin({ email, name, password }) { sync();
  email = String(email).trim().toLowerCase();
  const existing = db.admins.find((a) => a.email === email);
  if (existing) { existing.passwordHash = hashPassword(password); existing.name = name || existing.name; save(); return publicAdmin(existing); }
  const admin = { id: id(), email, name: name || "Administrator", passwordHash: hashPassword(password), createdAt: new Date().toISOString(), lastLogin: null };
  db.admins.push(admin); save();
  return publicAdmin(admin);
}
const DUMMY_HASH = hashPassword(crypto.randomBytes(12).toString("hex"));
export function checkAdmin(email, password) { sync();
  const admin = db.admins.find((a) => a.email === String(email || "").trim().toLowerCase());
  // always run scrypt so response time doesn't reveal whether the email exists
  const ok = verifyPassword(String(password || ""), admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !ok) return null;
  admin.lastLogin = new Date().toISOString(); save();
  return publicAdmin(admin);
}
export function changeAdminPassword(adminId, current, next) { sync();
  const admin = db.admins.find((a) => a.id === adminId);
  if (!admin || !verifyPassword(String(current || ""), admin.passwordHash)) return false;
  admin.passwordHash = hashPassword(next); save();
  return true;
}
const publicAdmin = ({ id, email, name, lastLogin }) => ({ id, email, name, lastLogin });

/* ---------- staff ---------- */
const publicStaff = ({ id, name, role, centre, email, active, createdAt, expiresAt, lastLogin, codeHint }) =>
  ({ id, name, role, centre, email, active, createdAt, expiresAt, lastLogin, codeHint });

export function listStaff() { sync(); return db.staff.map(publicStaff).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }

export function createStaff({ name, role, centre, email, expiresInDays }) { sync();
  const code = newCode();
  const now = new Date();
  const staff = {
    id: id(), name, role, centre, email: email || "", active: true,
    codeHash: codeHash(code), codeHint: code.slice(-4),
    createdAt: now.toISOString(),
    expiresAt: expiresInDays ? new Date(now.getTime() + expiresInDays * 864e5).toISOString() : null,
    lastLogin: null,
  };
  db.staff.push(staff); save();
  return { staff: publicStaff(staff), code };
}
export function regenerateCode(staffId) { sync();
  const s = db.staff.find((x) => x.id === staffId);
  if (!s) return null;
  const code = newCode();
  s.codeHash = codeHash(code); s.codeHint = code.slice(-4);
  endSessionsFor("staff", staffId); save();
  return { staff: publicStaff(s), code };
}
export function setStaffActive(staffId, active) { sync();
  const s = db.staff.find((x) => x.id === staffId);
  if (!s) return null;
  s.active = !!active;
  if (!s.active) endSessionsFor("staff", staffId);
  save();
  return publicStaff(s);
}
export function deleteStaff(staffId) { sync();
  const before = db.staff.length;
  db.staff = db.staff.filter((x) => x.id !== staffId);
  endSessionsFor("staff", staffId); save();
  return db.staff.length !== before;
}
export function checkStaffCode(input) { sync();
  const code = normaliseCode(input);
  if (!code) return null;
  const h = codeHash(code);
  const s = db.staff.find((x) => crypto.timingSafeEqual(Buffer.from(x.codeHash), Buffer.from(h)));
  if (!s || !s.active) return null;
  if (s.expiresAt && new Date(s.expiresAt) < new Date()) return null;
  s.lastLogin = new Date().toISOString(); save();
  return publicStaff(s);
}
export function getStaff(staffId) { sync(); const s = db.staff.find((x) => x.id === staffId); return s ? publicStaff(s) : null; }
export function getAdmin(adminId) { sync(); const a = db.admins.find((x) => x.id === adminId); return a ? publicAdmin(a) : null; }

/* ---------- notice shown to staff ---------- */
export const getNotice = () => { sync(); return db.notice || ""; };
export function setNotice(text) { sync(); db.notice = String(text || "").slice(0, 2000); save(); return db.notice; }

/* ---------- sessions ---------- */
export const SESSION_HOURS = 12;
export function createSession(role, userId) { sync();
  const token = crypto.randomBytes(32).toString("base64url");
  pruneSessions();
  db.sessions.push({ tokenHash: sha256(token), role, userId, expiresAt: new Date(Date.now() + SESSION_HOURS * 36e5).toISOString() });
  save();
  return token;
}
export function readSession(token) { sync();
  if (!token) return null;
  const h = sha256(token);
  const s = db.sessions.find((x) => x.tokenHash === h);
  if (!s || new Date(s.expiresAt) < new Date()) return null;
  const user = s.role === "admin" ? getAdmin(s.userId) : getStaff(s.userId);
  if (!user || (s.role === "staff" && !user.active)) return null;
  return { role: s.role, user };
}
export function endSession(token) { sync();
  if (!token) return;
  const h = sha256(token);
  db.sessions = db.sessions.filter((x) => x.tokenHash !== h); save();
}
function endSessionsFor(role, userId) { db.sessions = db.sessions.filter((x) => !(x.role === role && x.userId === userId)); }
function pruneSessions() { const now = new Date(); db.sessions = db.sessions.filter((x) => new Date(x.expiresAt) > now); }
