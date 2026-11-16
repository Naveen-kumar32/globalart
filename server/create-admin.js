// Create (or reset) an administrator account.
//   npm run create-admin -- --email you@example.com [--name "Your Name"] [--password "..."]
// If no password is given, a strong one is generated and printed once.
import crypto from "node:crypto";
import { createAdmin } from "./store.js";

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };

const email = get("--email");
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run create-admin -- --email you@example.com [--name "Your Name"] [--password "..."]');
  process.exit(1);
}
let password = get("--password");
const generated = !password;
if (generated) password = crypto.randomBytes(12).toString("base64url");
if (password.length < 10) { console.error("Password must be at least 10 characters."); process.exit(1); }

const admin = createAdmin({ email, name: get("--name"), password });
console.log(`Administrator ready: ${admin.email}`);
if (generated) console.log(`Password (shown once — store it safely): ${password}`);
