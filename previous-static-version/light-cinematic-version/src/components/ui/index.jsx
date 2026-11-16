import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, animate, useReducedMotion } from "framer-motion";
import CENTRES from "../../data/centres.js";

export const ease = [0.22, 1, 0.36, 1];
const media = (n) => ({ src: `/media/${n}.mp4`, poster: `/media/${n}.jpg` });

/* ---------- Global pointer, as springy motion values (for depth parallax) ---------- */
export function usePointer(stiffness = 60, damping = 20) {
  const x = useMotionValue(0), y = useMotionValue(0);
  useEffect(() => {
    const m = (e) => { x.set((e.clientX / window.innerWidth) * 2 - 1); y.set((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener("pointermove", m, { passive: true });
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  return { x: useSpring(x, { stiffness, damping }), y: useSpring(y, { stiffness, damping }) };
}

/* ---------- Real footage: loads near the viewport, plays only while visible ---------- */
export function Video({ name, className, style, eager = false, active = true, hoverPlay = false }) {
  const ref = useRef(null);
  const [near, setNear] = useState(eager);
  const [seen, setSeen] = useState(false);
  const [hovered, setHovered] = useState(false);
  // hoverPlay: show the still frame, play only while the card is hovered / focused
  useEffect(() => {
    const host = hoverPlay && ref.current?.parentElement;
    if (!host) return;
    const on = () => setHovered(true), off = () => setHovered(false);
    host.addEventListener("pointerenter", on); host.addEventListener("pointerleave", off);
    host.addEventListener("focusin", on); host.addEventListener("focusout", off);
    return () => { host.removeEventListener("pointerenter", on); host.removeEventListener("pointerleave", off); host.removeEventListener("focusin", on); host.removeEventListener("focusout", off); };
  }, [hoverPlay]);
  if (hoverPlay) active = active && hovered;
  const reduce = useReducedMotion();
  const m = media(name);
  // Load when close to the screen; only decode/play while actually visible.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px" });
    const vis = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.05 });
    pre.observe(v); vis.observe(v);
    return () => { pre.disconnect(); vis.disconnect(); };
  }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v || !near) return;
    if (seen && active && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [seen, active, near, reduce]);
  return (
    <video ref={ref} className={className} style={style} poster={m.poster} muted loop playsInline preload={near ? "metadata" : "none"} aria-hidden="true">
      {near && <source src={m.src} type="video/mp4" />}
    </video>
  );
}

/* ---------- Live timecode, like a camera viewfinder ---------- */
export function Timecode({ label = "REC" }) {
  const ref = useRef(null);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      const f = Math.floor(((performance.now() - t0) / 1000) * 25);
      const p = (n) => String(n).padStart(2, "0");
      if (ref.current) ref.current.textContent = `${p(Math.floor(f / 90000) % 24)}:${p(Math.floor(f / 1500) % 60)}:${p(Math.floor(f / 25) % 60)}:${p(f % 25)}`;
    }, 40);
    return () => clearInterval(id);
  }, []);
  return <span className="tc mono"><i />{label} <span ref={ref}>00:00:00:00</span></span>;
}

/* ---------- Reveal: fade up out of soft focus ---------- */
export function Reveal({ children, delay = 0, y = 30, className, style, as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease, delay }} {...rest}>
      {children}
    </M>
  );
}

export function Stagger({ children, className, style, gap = 0.09 }) {
  return (
    <motion.div className={className} style={style} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}>
      {children}
    </motion.div>
  );
}
export const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/* ---------- Masked line headline. Wrap words in *stars* for the italic accent. ----------
   Pass lines as an array; each line rises out of its own mask. */
export function Lines({ lines, as = "h1", className = "h1", delay = 0.1, inView = false, style }) {
  const M = motion[as];
  const trigger = inView ? { whileInView: "show", viewport: { once: true, amount: 0.4 } } : { animate: "show" };
  return (
    <M className={className} style={style} initial="hidden" {...trigger} aria-label={lines.join(" ").replace(/\*/g, "")}
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}>
      {lines.map((l, i) => (
        <span className="line" key={i} aria-hidden="true">
          <motion.span variants={{ hidden: { y: "105%", skewY: 4 }, show: { y: "0%", skewY: 0, transition: { duration: 1.2, ease } } }}>
            {l.split(/(\*[^*]+\*)/).map((part, j) => part.startsWith("*") ? <em key={j}>{part.slice(1, -1)}</em> : part)}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

/* ---------- Paragraph whose words light up as you scroll through it ---------- */
function LitWord({ children, progress, range }) {
  const o = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity: o }}>{children}</motion.span>;
}
export function ScrollLit({ text, className = "statement" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const accent = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        const s = i / words.length;
        return (
          <span key={i}>
            <LitWord progress={scrollYProgress} range={[s, s + 1 / words.length]}>{accent ? <em>{clean}</em> : clean}</LitWord>{" "}
          </span>
        );
      })}
    </p>
  );
}

/* ---------- Full-screen cinematic hero with depth parallax ---------- */
export function FilmHero({ video, children, className = "hero", hud = false, scene = "Scene 01", place = "Globalart studio" }) {
  const ref = useRef(null);
  const p = usePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const vy = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const ty = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mx = useTransform(p.x, (v) => v * -12), my = useTransform(p.y, (v) => v * -8);
  const tx = useTransform(p.x, (v) => v * 6), tyy = useTransform(p.y, (v) => v * 4);
  return (
    <section ref={ref} className={className}>
      <motion.div className="hero__media" style={{ scale, y: vy }}
        initial={{ clipPath: "inset(30% 0% 30% 0%)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}>
        <motion.div style={{ width: "100%", height: "100%", x: mx, y: my }}><Video name={video} eager /></motion.div>
      </motion.div>
      <div className="shade-b" style={{ background: "linear-gradient(180deg, rgba(22,25,27,.4), rgba(22,25,27,.08) 30%, rgba(22,25,27,.3) 55%, rgba(22,25,27,.85))" }} />
      {hud && (
        <motion.div className="hero__hud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <div className="container mono"><Timecode /><span className="hide-sm">{scene} — {place}</span><span>4K · 25 FPS</span></div>
        </motion.div>
      )}
      <motion.div className="hero__inner" style={{ y: ty, opacity: fade }}>
        <motion.div className="container" style={{ x: tx, y: tyy }}>{children}</motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- Sticky story: chapters crossfade between films as you scroll ---------- */
export function StoryScroller({ chapters }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(chapters.length - 1, Math.max(0, Math.floor(v * chapters.length)))));
  const zoom = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  return (
    <section ref={ref} className="story" style={{ height: `${chapters.length * 85}vh` }}>
      <div className="story__stick">
        <motion.div className="story__vid" style={{ scale: zoom }}>
          {chapters.map((c, k) => (
            <motion.div key={c.video} style={{ position: "absolute", inset: 0 }} animate={{ opacity: k === i ? 1 : 0 }} transition={{ duration: 0.9, ease }}>
              {Math.abs(k - i) <= 1 && <Video name={c.video} className="fill" active={k === i} />}
            </motion.div>
          ))}
        </motion.div>
        <div className="shade-b" />
        <AnimatePresence mode="wait">
          <motion.div key={i} className="story__num" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.8, ease }}>0{i + 1}</motion.div>
        </AnimatePresence>
        <div className="story__bars">
          {chapters.map((_, k) => <i key={k}><motion.b animate={{ scaleY: k <= i ? 1 : 0 }} initial={false} transition={{ duration: 0.6, ease }} /></i>)}
        </div>
        <div className="story__copy">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial="hidden" animate="show" exit="exit"
                variants={{ show: { transition: { staggerChildren: 0.08 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.35 } } }}>
                <motion.div className="story__label mono" variants={item}><span>Chapter 0{i + 1} / 0{chapters.length}</span><span>{chapters[i].tag}</span></motion.div>
                <motion.h2 className="display" variants={item}>{chapters[i].title}</motion.h2>
                <motion.p className="lead" style={{ color: "rgba(237,231,221,.82)" }} variants={item}>{chapters[i].text}</motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- A framed film that opens up to full screen as you scroll ---------- */
export function ExpandFilm({ video, top, bottom, caption }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const ins = useTransform(scrollYProgress, [0, 0.6], [22, 4]);
  const insX = useTransform(scrollYProgress, [0, 0.6], [30, 4]);
  const rad = useTransform(scrollYProgress, [0, 0.6], [24, 24]);
  const clip = useTransform([ins, insX, rad], ([a, b, r]) => `inset(${a}% ${b}% ${a}% ${b}% round ${r}px)`);
  const sc = useTransform(scrollYProgress, [0, 0.6], [1.15, 1]);
  const l = useTransform(scrollYProgress, [0, 0.6], ["0vw", "-14vw"]);
  const r = useTransform(scrollYProgress, [0, 0.6], ["0vw", "14vw"]);
  const titleO = useTransform(scrollYProgress, [0.45, 0.62], [1, 0]);
  const capO = useTransform(scrollYProgress, [0.62, 0.78], [0, 1]);
  const capY = useTransform(scrollYProgress, [0.62, 0.78], [40, 0]);
  return (
    <section ref={ref} className="expand">
      <div className="expand__stick">
        <motion.div className="expand__media" style={{ clipPath: clip }}>
          <motion.div style={{ position: "absolute", inset: 0, scale: sc }}><Video name={video} className="fill" /></motion.div>
          <div className="shade-b" />
        </motion.div>
        <motion.div className="expand__title" style={{ opacity: titleO }}>
          <motion.span className="display" style={{ x: l }}>{top}</motion.span>
          <motion.span className="display" style={{ x: r, fontStyle: "italic" }}>{bottom}</motion.span>
        </motion.div>
        <motion.div className="expand__caption" style={{ opacity: capO, y: capY }}><div className="container">{caption}</div></motion.div>
      </div>
    </section>
  );
}

/* ---------- Vertical scroll drives a horizontal film reel ---------- */
export function Reel({ children, head }) {
  const ref = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const f = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} className="reel" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="reel__stick">
        <div className="container" style={{ marginBottom: "clamp(24px,4vh,48px)" }}>{head}</div>
        <motion.div ref={track} className="reel__track" style={{ x }}>{children}</motion.div>
        <div className="container" style={{ marginTop: 30 }}>
          <div style={{ height: 1, background: "var(--line)", position: "relative" }}><motion.div style={{ position: "absolute", inset: 0, background: "var(--accent)", scaleX: bar, transformOrigin: "left" }} /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Image/video with scroll parallax inside its frame ---------- */
export function ParallaxMedia({ video, img, alt = "", ratio = "4/5", className = "", radius = "var(--r)", children, strength = 7 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={`media ${className}`} style={{ aspectRatio: ratio, borderRadius: radius }}>
      <motion.div style={{ position: "absolute", inset: `-${strength + 2}% 0`, y }}>
        {video ? <Video name={video} className="fill" /> : <img className="fill" src={img} alt={alt} loading="lazy" />}
      </motion.div>
      {children}
    </div>
  );
}

/* ---------- Auto-advancing quote slider ---------- */
export function QuoteSlider({ quotes, interval = 7000 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((x) => (x + 1) % quotes.length), interval);
    return () => clearTimeout(t);
  }, [i, paused, interval, quotes.length]);
  const q = quotes[i];
  return (
    <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.8, ease }}>
          <blockquote className="quote">{q.text}</blockquote>
          <div className="qmeta"><b>{q.name}</b><span>{q.meta}</span></div>
        </motion.div>
      </AnimatePresence>
      <div className="qdots">
        {quotes.map((_, k) => (
          <button key={k} aria-label={`Quote ${k + 1}`} onClick={() => setI(k)}>
            {k === i
              ? <motion.b key={`on${i}${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0.15 : 1 }} transition={{ duration: paused ? 0.3 : interval / 1000, ease: "linear" }} />
              : <b style={{ transform: `scaleX(${k < i ? 1 : 0})` }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Counter ---------- */
export function Counter({ to, suffix = "", indian = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref}>{indian ? v.toLocaleString("en-IN") : v}{suffix}</b>;
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 }), y = useSpring(0, { stiffness: 220, damping: 15 });
  return (
    <motion.span ref={ref} style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.span>
  );
}

/* ---------- Subtle 3D tilt with a light sweep (for glass cards) ---------- */
export function Tilt({ children, className = "", style, max = 6, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 160, damping: 18 }), ry = useSpring(0, { stiffness: 160, damping: 18 });
  const gx = useMotionValue(50), gy = useMotionValue(50);
  const bg = useTransform([gx, gy], ([a, b]) => `radial-gradient(circle at ${a}% ${b}%, rgba(255,255,255,.14), transparent 55%)`);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = ref.current.getBoundingClientRect();
        const a = (e.clientX - r.left) / r.width, b = (e.clientY - r.top) / r.height;
        ry.set((a - 0.5) * max * 2); rx.set((0.5 - b) * max * 2); gx.set(a * 100); gy.set(b * 100);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }} {...rest}>
      {children}
      <motion.div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", background: bg }} />
    </motion.div>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items, reverse = false }) {
  const list = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? "marquee--rev" : ""}`} aria-hidden="true">
      <div className="marquee__track">{list.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}

export function Arrow() { return <span className="arrow" aria-hidden="true">→</span>; }

export function SectionHead({ eyebrow, lines, lead, light, children }) {
  return (
    <div style={{ maxWidth: 980 }}>
      {eyebrow && <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>}
      <Lines lines={lines} as="h2" className="h2" inView />
      {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
      {children}
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

export function LocatorSelects({ loc, labels = true, placeholders = ["Select state", "Select city", "Select area"], required = false, names = ["State", "City", "Centre area"] }) {
  const sel = ({ label, value, onChange, options, ph, disabled, name }) => (
    <div className="field" key={label}>
      {labels ? <label>{label}</label> : <label className="sr-only">{label}</label>}
      <div className="select">
        <select aria-label={label} name={name} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={required}>
          <option value="">{ph}</option>
          {options.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.v ? `${o.v} (${o.n})` : o}</option>)}
        </select>
      </div>
    </div>
  );
  return (
    <>
      {sel({ label: "State", value: loc.state, onChange: loc.setState, options: loc.states, ph: placeholders[0], name: names[0] })}
      {sel({ label: "City", value: loc.city, onChange: loc.setCity, options: loc.cities, ph: placeholders[1], disabled: !loc.state, name: names[1] })}
      {sel({ label: "Area", value: loc.area, onChange: loc.setArea, options: loc.areas, ph: placeholders[2], disabled: !loc.city, name: names[2] })}
    </>
  );
}

export const phonesOf = (p) => (p || "").split(/[\/;,]/).map((x) => x.trim()).filter((x) => x.replace(/\D/g, "").length >= 8);
export const mapsLink = (c) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${c.address || c.area}, ${c.city}, ${c.state}`);
