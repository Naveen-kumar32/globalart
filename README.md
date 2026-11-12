# Globalart — 3D website (React)

Multi-page React app with real-time 3D (Three.js via React Three Fiber), Framer Motion animations and glass / clay / neumorphic / aurora / liquid styling. All content comes from the original globalart.in.

## Run it

```bash
npm install        # first time only
npm run dev        # local dev server → http://localhost:5173
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Pages

| Route        | 3D scene                         |
|--------------|----------------------------------|
| `/`          | Floating art studio (palette, crayons, glass orb…) + globe |
| `/about`     | Interactive globe with country markers & flight arcs |
| `/courses`   | Level staircase with a bouncing ball |
| `/centres`   | Map pin with ripples — **centre finder (State → City → Area)** |
| `/franchise` | Growing bar chart, coins & star |
| `/stories`   | Speech bubble & hearts |
| `/faq`       | Glass orb & floating shapes |
| `/contact`   | Paper plane with trail — **free-trial booking form** |

## Where things live

- `src/data/content.js` — all text: courses, testimonials, FAQs, offices, links
- `src/data/centres.js` — the 158 centres (copied from globalart.in/locations on 12 Nov 2026)
- `src/components/three/` — 3D shapes and scenes
- `src/components/ui/` — reveal animations, tilt cards, living images, 3D ring carousel, locator
- `src/styles/global.css` — design system (glass, clay, neumorphic, aurora, liquid)

## Before going live

- Forms open the visitor's email app (`mailto:`). Connect them to a real backend/CRM to receive enquiries directly.
- The centre list is a snapshot — update `src/data/centres.js` (or wire it to the live source) when centres change.
- Host as a single-page app: the server must send `index.html` for every route (e.g. Netlify `_redirects`: `/* /index.html 200`, or Vercel rewrites).
- The previous static versions are kept in `previous-static-version/`.
