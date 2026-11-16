# Globalart — website and staff portal

A multi-page React site for parents, built as a scroll-driven journey through a child's growth from age 5 to 15, plus a staff portal where an administrator issues access codes. A small Node/Express server runs the site and the staff API together.

## Run it

```bash
npm install                 # first time only
npm run create-admin -- --email you@example.com --name "Your Name"   # once; prints a generated password
npm run dev                 # site + API with hot reload → http://localhost:5190
```

Production:

```bash
npm run build               # builds the site into dist/
npm start                   # serves dist/ and the API on PORT (default 5190)
```

Environment variables (all optional): `PORT`, `DATA_DIR` (where staff data is stored, default `server/data/`), `TRUST_PROXY` (set to `1` when running behind a load balancer or HTTPS proxy so secure cookies and rate limits work correctly), `CODE_SECRET` (otherwise generated into `DATA_DIR/secret.key`).

## Staff login

- **Login** button in the nav → `/login`.
- **Staff** sign in with an access code like `GA-K7QM-9XPD-R2HT-WN4C`. There are no usernames or passwords for staff.
- **Administrators** sign in with email and password, then at `/admin` they can:
  - issue a code for a staff member (name, role, centre, optional expiry). The code is shown **once**; copy it and give it to the person.
  - disable or re-enable someone, issue a replacement code (the old one stops working immediately), or remove them.
  - post a notice that appears on every staff member's portal.
  - change their own password.
- Staff land on `/staff`: the notice, links to the franchise software, Kreative Star, the course structure, and their regional contacts.

Security notes:
- Passwords are hashed with scrypt; access codes are stored only as HMAC hashes. Nothing secret is kept in plain text.
- Sessions use an `httpOnly`, `SameSite=Strict` cookie (`Secure` over HTTPS) and expire after 12 hours.
- Sign-in is limited to 8 failed attempts per IP per 15 minutes.
- Data lives in `server/data/` (ignored by git). Back this folder up; deleting it removes all staff and admin accounts.
- To add another admin, or to reset a forgotten password, run `npm run create-admin -- --email ...` again.

## Pages

| Route        | Signature effect |
|--------------|------------------|
| `/`          | Footage seen through giant "THINK CREATIVE" letters, then a fly-through · a journey line that draws itself with an age counter (5 → 15) · pinned list of abilities · steps connector · parent cards peeling off a stack · circle-reveal finale |
| `/about`, `/courses`, `/centres`, `/franchise`, `/stories`, `/faq`, `/contact` | Full-width film hero, scroll reveals; centre finder and free-trial booking form |
| `/login`, `/admin`, `/staff` | Staff portal |

## Where things live

- `server/` — Express server (`index.js`), API routes (`api.js`), storage and hashing (`store.js`), admin CLI (`create-admin.js`)
- `src/pages/` — one file per page; `Home.jsx` holds the journey
- `src/data/content.js` — all text: courses, testimonials, FAQs, offices, links
- `src/data/centres.js` — the 158 centres (copied from globalart.in/locations on 12 Nov 2026)
- `public/media/` — video clips (`.mp4`) and their poster frames (`.jpg`); `public/team/` — team photos
- `src/styles/global.css` — the design system

## Before going live

- Host on a service that runs Node (for example Render, Railway, Fly.io, or a VPS). A static-only host can't run the staff login. Put it behind HTTPS and set `TRUST_PROXY=1`.
- Enquiry and booking forms still open the visitor's email app (`mailto:`). They can be moved onto this server later to save enquiries directly.
- The centre list is a snapshot. Update `src/data/centres.js` when centres change.
- **Videos are free stock footage**: mostly Indian children from Pexels (free licence, no attribution required), plus 4 hands-only clips from Mixkit. Replace them with real Globalart class footage by keeping the same file names in `public/media/` (720p, about 3–7 MB each) and replacing the matching `.jpg` poster frames.
- **Team photos** come from the original globalart.in contact page. Edit them in `OFFICES` in `src/data/content.js`.
- Earlier designs are kept in `previous-static-version/`.
