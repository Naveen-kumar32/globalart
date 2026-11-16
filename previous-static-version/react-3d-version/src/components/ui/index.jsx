import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate, useAnimationFrame, useReducedMotion } from "framer-motion";
import CENTRES from "../../data/centres.js";

const ease = [0.22, 1, 0.36, 1];

/* ---------- 3D reveal on scroll ---------- */
export function Reveal({ children, delay = 0, y = 70, rotateX = -28, className, style, as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      style={{ transformPerspective: 1100, ...style }}
      initial={{ opacity: 0, y, rotateX, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function Stagger({ children, className, style, gap = 0.08 }) {
  return (
    <motion.div className={className} style={style} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}>
      {children}
    </motion.div>
  );
}
export const item = {
  hidden: { opacity: 0, y: 70, rotateX: -35, scale: 0.92 },
  show: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.9, ease } },
};

/* ---------- Split headline: words rise in ---------- */
export function SplitHeading({ text, as = "h1", className = "h1", delay = 0.15, gradientWords = [] }) {
  const M = motion[as];
  const words = text.split(" ");
  return (
    <M className={className} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word" aria-hidden="true">
            <motion.span className={gradientWords.includes(i) ? "grad-text" : undefined}
              variants={{ hidden: { y: "110%", rotate: 8 }, show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } } }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </M>
  );
}

/* ---------- Tilt card (3D + glare) ---------- */
export function TiltCard({ children, className = "", style, max = 12, glare = true, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const gx = useMotionValue(50), gy = useMotionValue(50);
  const bg = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.55), transparent 50%)`);
  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2); rx.set((0.5 - py) * max * 2); gx.set(px * 100); gy.set(py * 100);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref} className={`tilt ${className}`} style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }} onPointerMove={onMove} onPointerLeave={reset} {...rest}>
      {children}
      {glare && <motion.div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", background: bg, mixBlendMode: "soft-light" }} />}
    </motion.div>
  );
}

/* ---------- Living image: real-time liquid motion + 3D tilt + ken burns ---------- */
export function LivingImage({ src, alt, ratio = "4/3", position = "50% 50%", strength = 14, className = "", children, style }) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 150, damping: 16 }), ry = useSpring(0, { stiffness: 150, damping: 16 });
  const scale = useRef(null);
  const cur = useRef(strength);
  useEffect(() => {
    if (!scale.current || reduce) return;
    const c = animate(cur.current, hover ? strength * 2.6 : strength, {
      duration: 0.8,
      onUpdate: (v) => { cur.current = v; scale.current?.setAttribute("scale", v.toFixed(2)); },
    });
    return () => c.stop();
  }, [hover, strength, reduce]);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 16); rx.set((0.5 - py) * 16);
    ref.current.style.setProperty("--gx", px * 100 + "%"); ref.current.style.setProperty("--gy", py * 100 + "%");
  };
  return (
    <motion.div ref={ref} className={`living ${className}`} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, aspectRatio: ratio, ...style }}
      onPointerMove={move} onPointerEnter={() => setHover(true)} onPointerLeave={() => { setHover(false); rx.set(0); ry.set(0); }}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id={`liq${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="2" seed="3" result="n">
            {!reduce && <animate attributeName="baseFrequency" dur="14s" values="0.009 0.014;0.014 0.009;0.009 0.014" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap ref={scale} in="SourceGraphic" in2="n" scale={reduce ? 0 : strength} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="living__frame">
        <img src={src} alt={alt} loading="lazy" style={{ objectPosition: position, filter: `url(#liq${id})` }} />
      </div>
      <div className="living__glare" />
      {children}
    </motion.div>
  );
}

/* ---------- Counter ---------- */
export function Counter({ to, suffix = "", indian = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref}>{indian ? v.toLocaleString("en-IN") : v}{suffix}</b>;
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 14 }), y = useSpring(0, { stiffness: 220, damping: 14 });
  return (
    <motion.span ref={ref} style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.span>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items, variant = "a" }) {
  const list = [...items, ...items];
  return (
    <div className={`marquee marquee--${variant}`} aria-hidden="true">
      <div className="marquee__track">{list.map((t, i) => <span key={i}>{t} <span style={{ opacity: 0.5 }}>✦</span></span>)}</div>
    </div>
  );
}

export function SectionHead({ eyebrow, icon = "✦", title, lead, children }) {
  return (
    <div className="section-head">
      {eyebrow && <Reveal><p className="eyebrow"><b>{icon}</b>{eyebrow}</p></Reveal>}
      <Reveal delay={0.05}><h2 className="h2">{title}</h2></Reveal>
      {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
      {children}
    </div>
  );
}

/* ---------- 3D ring carousel ---------- */
export function RingCarousel({ items, render, radius = 520 }) {
  const rot = useMotionValue(0);
  const drag = useRef({ on: false, x: 0, v: 0 });
  const reduce = useReducedMotion();
  const [r, setR] = useState(radius);
  useEffect(() => {
    const f = () => setR(window.innerWidth < 600 ? radius * 0.62 : window.innerWidth < 1000 ? radius * 0.8 : radius);
    f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, [radius]);
  useAnimationFrame((_, dt) => {
    if (drag.current.on) return;
    drag.current.v *= 0.94;
    rot.set(rot.get() + drag.current.v + (reduce ? 0 : dt * 0.006));
  });
  const n = items.length, step = 360 / n;
  return (
    <div className="ring-stage"
      onPointerDown={(e) => { drag.current = { on: true, x: e.clientX, v: 0 }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (!drag.current.on) return; const dx = e.clientX - drag.current.x; drag.current.x = e.clientX; drag.current.v = dx * 0.15; rot.set(rot.get() + dx * 0.15); }}
      onPointerUp={() => (drag.current.on = false)} onPointerCancel={() => (drag.current.on = false)}>
      <motion.div className="ring" style={{ z: -r, rotateY: rot }}>
        {items.map((it, i) => (
          <figure key={i} style={{ transform: `rotateY(${i * step}deg) translateZ(${r}px)` }}>{render(it, i)}</figure>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Centre locator logic ---------- */
export const ALL_CENTRES = Object.entries(CENTRES).flatMap(([state, cities]) =>
  Object.entries(cities).flatMap(([city, list]) => list.map((c) => ({ ...c, state, city }))));
const sortA = (a, b) => a.localeCompare(b);

export function useLocator(init = {}) {
  const [state, setStateRaw] = useState(init.state && CENTRES[init.state] ? init.state : "");
  const [city, setCityRaw] = useState(init.city && CENTRES[init.state]?.[init.city] ? init.city : "");
  const [area, setArea] = useState(init.area || "");
  const states = useMemo(() => Object.keys(CENTRES).sort(sortA).map((s) => ({ v: s, n: Object.values(CENTRES[s]).flat().length })), []);
  const cities = useMemo(() => (state ? Object.keys(CENTRES[state]).sort(sortA).map((c) => ({ v: c, n: CENTRES[state][c].length })) : []), [state]);
  const areas = useMemo(() => (state && city ? [...new Set(CENTRES[state][city].map((c) => c.area))].sort(sortA) : []), [state, city]);
  const setState = (s) => { setStateRaw(s); setCityRaw(""); setArea(""); };
  const setCity = (c) => { setCityRaw(c); setArea(""); };
  const matches = useMemo(() => ALL_CENTRES.filter((c) => (!state || c.state === state) && (!city || c.city === city) && (!area || c.area === area)), [state, city, area]);
  return { state, city, area, setState, setCity, setArea, states, cities, areas, matches };
}

export function LocatorSelects({ loc, labels = true, placeholders = ["Select State", "Select City", "Select Area"], required = false, names = ["State", "City", "Centre area"] }) {
  const Sel = ({ label, value, onChange, options, ph, disabled, name, emoji }) => (
    <div className="field">
      {labels ? <label>{emoji} {label}</label> : <label className="sr-only">{label}</label>}
      <motion.div className="select" key={options.length + label} initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
        <select aria-label={label} name={name} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={required}>
          <option value="">{ph}</option>
          {options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.v ? `${o.v} (${o.n})` : o}</option>)}
        </select>
      </motion.div>
    </div>
  );
  return (
    <>
      {Sel({ label: "State", value: loc.state, onChange: loc.setState, options: loc.states, ph: placeholders[0], name: names[0], emoji: "📍" })}
      {Sel({ label: "City", value: loc.city, onChange: loc.setCity, options: loc.cities, ph: placeholders[1], disabled: !loc.state, name: names[1], emoji: "🏙️" })}
      {Sel({ label: "Area", value: loc.area, onChange: loc.setArea, options: loc.areas, ph: placeholders[2], disabled: !loc.city, name: names[2], emoji: "🏡" })}
    </>
  );
}

export const phonesOf = (p) => (p || "").split(/[\/;,]/).map((x) => x.trim()).filter((x) => x.replace(/\D/g, "").length >= 8);
export const mapsLink = (c) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${c.address || c.area}, ${c.city}, ${c.state}`);

/* ---------- Confetti burst ---------- */
export function burst(x, y, n = 40) {
  if (typeof document === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cols = ["#0095DA", "#7C5CFF", "#FF5CA8", "#FFC93C", "#2ED3A4"];
  for (let i = 0; i < n; i++) {
    const el = document.createElement("i");
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${8 + Math.random() * 8}px;height:${8 + Math.random() * 8}px;border-radius:${i % 2 ? "50%" : "3px"};background:${cols[i % cols.length]};z-index:999;pointer-events:none;box-shadow:inset 2px 2px 3px rgba(255,255,255,.6)`;
    document.body.appendChild(el);
    const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260;
    el.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 200}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }],
      { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => el.remove();
  }
}
