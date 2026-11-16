import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Reveal, Video, Counter, Magnetic, Arrow, SectionHead, Lines, SketchReveal, Media, useLocator, LocatorSelects, ALL_CENTRES } from "../components/ui/index.jsx";
import { STATS, BENEFITS, COURSES, TESTIMONIALS, COURSE_MEDIA, ENDORSEMENTS, EXPERTS, CAREERS } from "../data/content.js";

/* ==========================================================================
   1. Opening — a pencil draws the frame, the photo appears as a sketch, then colour is painted in
   ========================================================================== */
function SketchHero() {
  const ref = useRef(null);
  const paint = useMotionValue(0);
  useEffect(() => {
    const c = animate(paint, 1, { duration: 2.4, delay: 1.5, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [paint]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const frameY = useTransform(p, [0, 1], [0, 80]);
  const cardY = useTransform(p, [0, 1], [0, -60]);
  const statY = useTransform(p, [0, 1], [0, 40]);
  return (
    <section ref={ref} className="shero">
      <div className="container shero__grid">
        <div className="shero__copy">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Art & creativity programme · Ages 5–15</motion.p>
          <Lines lines={["Every great mind", "begins with a", "single line."]} className="display" delay={0.55} />
          <svg className="shero__stroke" viewBox="0 0 420 24" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M4 16 C 90 6, 180 22, 260 12 S 380 8, 416 14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 1.2, ease: [0.65, 0, 0.35, 1] }} />
          </svg>
          <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
            A structured 13-level programme that grows imagination, observation and confidence — taught in small batches by trained teachers at {ALL_CENTRES.length} centres across India.
          </motion.p>
          <motion.div className="btns" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45, duration: 0.8 }}>
            <Magnetic><Link to="/contact#book" className="btn btn--lg">Book a free trial class <Arrow /></Link></Magnetic>
            <a href="#journey" className="btn btn--ghost btn--lg">See the journey</a>
          </motion.div>
          <motion.ul className="shero__trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
            <li><b>22</b> countries</li><li><b>650+</b> centres</li><li><b>Since 1999</b></li>
          </motion.ul>
        </div>

        <motion.div className="shero__art" style={{ y: frameY }}>
          <svg className="shero__outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <motion.rect x="0.6" y="0.6" width="98.8" height="98.8" rx="4" ry="5.5" initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: [1, 1, 0] }} transition={{ pathLength: { duration: 1.3, delay: 0.4, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 4.2, times: [0, 0.85, 1] } }} />
          </svg>
          <motion.div className="shero__frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.8 }}>
            <SketchReveal m={{ img: "art-class-india" }} alt="Children painting together in a Globalart class" progress={paint} eager />
          </motion.div>
          <motion.div className="shero__card" style={{ y: cardY }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6, duration: 0.8 }}>
            <div className="shero__card-media"><Video name="hands-drawing" className="fill" eager /></div>
            <div><small>Stage 01 · Age 5</small><b>The first confident line</b></div>
          </motion.div>
          <motion.div className="shero__stat" style={{ y: statY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9, duration: 0.8 }}>
            <b>2,75,000+</b><span>children have learnt to think creatively with Globalart</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   2. The journey — one continuous line, ages 5 → 15
   ========================================================================== */
const STAGE_COPY = {
  foundation: { title: "The first line becomes a habit.", gains: ["Fine motor control and a steady grip", "Confidence with colour", "Sitting focused through a full class"] },
  prebasic: { title: "Learning to really look.", gains: ["Observation drawing", "Grid drawing and proportion", "Patience with detail"] },
  basic: { title: "Ideas start to take shape.", gains: ["Composition and backgrounds", "Drawing action and movement", "Human features from every angle"] },
  intermediate: { title: "Every picture tells a story.", gains: ["Themes, figures and professions", "Mixed-media colouring", "Scenes from their own life"] },
  advanced: { title: "A confident, original creator.", gains: ["Pencil shading and sketching", "Painting technique", "Posters and illustration"] },
};

/** Heading whose words come into focus as it scrolls into view (scrubbed, not timed). */
function ScrubTitle({ text }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 88%", "start 42%"] });
  const words = text.split(" ");
  return (
    <h3 ref={ref} className="stage__title" aria-label={text}>
      {words.map((w, i) => <ScrubWord key={i} p={p} i={i} n={words.length}>{w}</ScrubWord>)}
    </h3>
  );
}
function ScrubWord({ p, i, n, children }) {
  const a = i / n, b = Math.min(1, a + 1.6 / n);
  const opacity = useTransform(p, [a, b], [0.12, 1]);
  const y = useTransform(p, [a, b], [18, 0]);
  return <motion.span aria-hidden="true" style={{ opacity, y }}>{children}</motion.span>;
}

function Stage({ c, i, flip, nodeRef }) {
  const media = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: media, offset: ["start 85%", "center 50%"] });
  const gainO = useTransform(p, [0.8, 1], [0, 1]);
  const gainY = useTransform(p, [0.8, 1], [20, 0]);
  const copy = STAGE_COPY[c.id];
  return (
    <article className={`stage ${flip ? "stage--flip" : ""}`} id={`stage-${c.id}`}>
      <span className="stage__node" ref={nodeRef} />
      <div ref={media} className="stage__media">
        {/* colour is painted in from the side nearest the journey line */}
        <SketchReveal m={COURSE_MEDIA[c.id]} progress={p} from={flip ? "left" : "right"} alt={`${c.name} stage at a Globalart class`}>
          <motion.div className="stage__gain" style={{ opacity: gainO, y: gainY }}>
            <small>What your child gains</small>
            <ul>{copy.gains.map((g) => <li key={g}>{g}</li>)}</ul>
          </motion.div>
        </SketchReveal>
      </div>
      <div>
        <div className="stage__age"><b>Stage 0{i + 1}</b><span>{c.name} · {c.age}</span></div>
        <ScrubTitle text={copy.title} />
        <Reveal><p className="lead">{c.lead}</p></Reveal>
        <Reveal delay={0.05}>
          <div className="stage__levels">{c.levels.map(([l, d]) => <div key={l}><b>{l}</b><span>{d}</span></div>)}</div>
        </Reveal>
      </div>
    </article>
  );
}

function Journey() {
  const section = useRef(null);
  const svg = useRef(null);
  const ink = useRef(null);
  const tip = useRef(null);
  const ageRef = useRef(null);
  const barRef = useRef(null);
  const nodeRefs = useRef([]);
  const endRef = useRef(null);
  const geo = useRef({ samples: [], len: 0, top: 0, nodeYs: [] });
  const [box, setBox] = useState({ w: 0, h: 0, d: "" });
  const [active, setActive] = useState(0);

  // Build the path through each stage's node; re-measure on resize.
  useLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    const build = () => {
      const r = el.getBoundingClientRect();
      const w = el.offsetWidth, h = el.offsetHeight;
      const mobile = window.innerWidth <= 880;
      const cx = mobile ? Math.max(18, (w - Math.min(1200, w - 36)) / 2 + 10) : w / 2;
      // keep the curve inside the gap between the two columns
      const swing = mobile ? 8 : Math.min(60, w * 0.04);
      const pts = [{ x: cx, y: Math.max(40, (nodeRefs.current[0]?.getBoundingClientRect().top ?? r.top) - r.top - window.innerHeight * 0.55) }];
      nodeRefs.current.forEach((n) => n && pts.push({ x: cx, y: n.getBoundingClientRect().top - r.top }));
      if (endRef.current) pts.push({ x: cx, y: endRef.current.getBoundingClientRect().top - r.top });
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let k = 1; k < pts.length; k++) {
        const a = pts[k - 1], b = pts[k], dy = b.y - a.y, s = k % 2 ? swing : -swing;
        d += ` C ${a.x + s} ${a.y + dy * 0.45}, ${b.x + s} ${b.y - dy * 0.45}, ${b.x} ${b.y}`;
      }
      geo.current.top = r.top + window.scrollY;
      geo.current.nodeYs = pts.slice(1, nodeRefs.current.length + 1).map((p) => p.y);
      setBox({ w, h, d });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sample the path once per layout so scrolling only does a cheap lookup.
  useEffect(() => {
    const path = ink.current;
    if (!path || !box.d) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    const N = 600, samples = [];
    for (let k = 0; k <= N; k++) { const l = (k / N) * len; const pt = path.getPointAtLength(l); samples.push([l, pt.x, pt.y]); }
    geo.current.samples = samples; geo.current.len = len;
    update(window.scrollY);
  }, [box]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (scrollY) => {
    const { samples, len, top, nodeYs } = geo.current;
    if (!samples.length) return;
    const target = scrollY + window.innerHeight * 0.55 - top; // the pen follows the reader's eye line
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; samples[mid][2] < target ? (lo = mid + 1) : (hi = mid); }
    const [l, x, y] = samples[lo];
    ink.current.style.strokeDashoffset = `${len - l}`;
    tip.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    tip.current.style.opacity = target < samples[0][2] ? 0 : 1;
    const first = nodeYs[0] ?? 0, last = nodeYs[nodeYs.length - 1] ?? 1;
    const t = Math.min(1, Math.max(0, (target - first) / (last - first)));
    if (ageRef.current) ageRef.current.textContent = String(Math.round(5 + t * 10));
    if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;
    let idx = 0;
    nodeYs.forEach((ny, k) => { if (target >= ny - window.innerHeight * 0.25) idx = k; });
    setActive((cur) => (cur === idx ? cur : idx));
  };
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);

  return (
    <section ref={section} className="journey" id="journey">
      <svg ref={svg} className="journey__svg" width={box.w} height={box.h} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true">
        <path className="journey__track" d={box.d} />
        <path ref={ink} className="journey__ink" d={box.d} />
      </svg>
      <span ref={tip} className="journey__tip" aria-hidden="true" />

      <div className="journey__rail" aria-hidden="true">
        <div className="rail">
          <div className="rail__age"><small>Age</small><b ref={ageRef}>5</b></div>
          <div className="rail__info">
            <span>{COURSES[active].name}</span>
            <i><b ref={barRef} style={{ transform: "scaleX(0)" }} /></i>
            <small>Stage {active + 1} of {COURSES.length}</small>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="journey__intro">
          <SectionHead eyebrow="The journey" lines={["Ten years. Five stages.", "One growing *creative mind.*"]} lead="Scroll through the path every Globalart child follows — from a five-year-old’s first confident line to a teenager’s original illustration." />
        </div>
        {COURSES.map((c, i) => <Stage key={c.id} c={c} i={i} flip={i % 2 === 1} nodeRef={(el) => (nodeRefs.current[i] = el)} />)}
        <div className="journey__end" ref={endRef}>
          <p className="eyebrow">Age 15 and beyond</p>
          <h3 className="h2" style={{ maxWidth: "18ch", margin: "0 auto" }}>Creativity that opens <em>real careers.</em></h3>
          <div className="careers">{CAREERS.map((c) => <span key={c} className="chip">{c}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   3. Six abilities — pinned list, scrubbed by scroll
   ========================================================================== */
const ROW = 92;
function Abilities() {
  const ref = useRef(null);
  const n = BENEFITS.length;
  const [idx, setIdx] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => { const k = Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))); setIdx((c) => (c === k ? c : k)); });
  const y = useTransform(p, (v) => -(v * (n - 1)) * ROW - ROW / 2);
  const radius = useTransform(p, [0, 0.5, 1], ["50%", "28px", "28px"]);
  const mediaScale = useTransform(p, [0, 0.5], [0.82, 1]);
  return (
    <section ref={ref} className="abil" style={{ height: `${100 + n * 55}vh` }}>
      <div className="abil__stick">
        <div className="container abil__grid">
          <div>
            <p className="eyebrow">What parents notice</p>
            <div className="abil__count mono"><span>0{idx + 1} / 0{n}</span><i><motion.b style={{ scaleX: p }} /></i></div>
            <div className="abil__list">
              <motion.div className="abil__track" style={{ y }}>
                {BENEFITS.map((b, k) => <div key={b.title} className={`abil__item ${k === idx ? "is-on" : ""}`}><small>0{k + 1}</small>{b.title}</div>)}
              </motion.div>
            </div>
          </div>
          <div className="abil__side">
            <motion.div className="abil__media" style={{ borderRadius: radius, scale: mediaScale }}><Video name="teacher-drawing" className="fill" /></motion.div>
            <div className="abil__text">
              <AnimatePresence mode="wait">
                <motion.p key={idx} style={{ margin: 0 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>{BENEFITS[idx].text}</motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. Proof
   ========================================================================== */
function Proof() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Trusted for over two decades" lines={["Proven with 2,75,000+ children", "in *22 countries.*"]} />
        <div className="stats" style={{ marginTop: 56 }}>
          {STATS.map((s) => <Reveal key={s.label} className="stat"><Counter to={s.value} suffix={s.suffix} indian={s.indian} /><span>{s.label}</span></Reveal>)}
        </div>
        <Reveal><div className="proof__logos">{ENDORSEMENTS.map((e) => <div key={e.title}><b>{e.title}</b><span>{e.meta}</span></div>)}</div></Reveal>
        <div className="grid g2" style={{ marginTop: 70, gap: 50 }}>
          {EXPERTS.map((x, k) => (
            <Reveal key={x.name} delay={k * 0.08}>
              <blockquote className="quote">{x.text}</blockquote>
              <div className="qmeta"><b>{x.name}</b><span>{x.meta}</span></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   5. How joining works — a connector line lights each step
   ========================================================================== */
const STEPS = [
  ["Find a centre", `Choose from ${ALL_CENTRES.length} centres across India — most families have one close to home.`],
  ["Book a free trial", "Your child joins a real class with other children. No cost and no obligation."],
  ["Start at the right level", "The centre recommends the starting level that suits your child’s age and ability."],
  ["Grow every week", "Small batches and trained teachers — with progress you can see in every artwork."],
];
function Steps() {
  const ref = useRef(null);
  const [lit, setLit] = useState(-1);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  useMotionValueEvent(p, "change", (v) => { const k = Math.floor(v * (STEPS.length - 1) + 0.05); setLit((c) => (c === k ? c : k)); });
  return (
    <section className="section light">
      <div className="container">
        <SectionHead eyebrow="Joining is simple" lines={["From first visit", "to *first artwork.*"]} />
        <div className="steps" ref={ref}>
          <div className="steps__line"><motion.b style={{ scaleX: p }} /></div>
          {STEPS.map(([t, d], k) => (
            <div key={t} className={`step ${k <= lit ? "is-on" : ""}`}>
              <div className="step__dot">{k + 1}</div>
              <h3>{t}</h3><p>{d}</p>
            </div>
          ))}
        </div>
        <div className="btns"><Link to="/contact#book" className="btn btn--lg">Book a free trial class <Arrow /></Link><Link to="/centres" className="btn btn--ghost btn--lg">Find a centre</Link></div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. Parent voices — cards peel off the stack as you scroll
   ========================================================================== */
function DeckCard({ t, i, n, p }) {
  const transform = useTransform(p, (v) => {
    const k = v * (n - 1) - i; // <0 waiting in the pile, 0..1 leaving, >1 gone
    if (k < 0) { const d = Math.min(3, -k); return `translate3d(0, ${d * 16}px, 0) scale(${1 - d * 0.045})`; }
    if (i === n - 1) return "none";
    const e = Math.min(1, k);
    return `translate3d(${e * -12}%, ${e * -125}%, 0) rotate(${e * -9}deg)`;
  });
  const opacity = useTransform(p, (v) => { const k = v * (n - 1) - i; return k < -3 ? 0 : k > 1 ? 0 : 1; });
  return (
    <motion.div className="deck__card" style={{ transform, opacity, zIndex: n - i }}>
      <p>{t.text}</p>
      <div className="deck__who"><b>{t.name}</b><span>{t.meta}</span></div>
    </motion.div>
  );
}
function Voices() {
  const ref = useRef(null);
  const n = TESTIMONIALS.length;
  const [idx, setIdx] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => { const k = Math.min(n - 1, Math.round(v * (n - 1))); setIdx((c) => (c === k ? c : k)); });
  return (
    <section ref={ref} className="deck" style={{ height: `${100 + n * 38}vh` }}>
      <div className="deck__stick">
        <div className="container deck__grid">
          <div>
            <SectionHead eyebrow="Parents across India" lines={["What families", "*tell us.*"]} lead="Real words from parents in Chennai, Coimbatore, Bengaluru, Hyderabad, Delhi and Jaipur." />
            <div className="deck__count" style={{ marginTop: 30 }}>{String(idx + 1).padStart(2, "0")}<span style={{ fontSize: "0.4em", color: "var(--grey-2)" }}> / {String(n).padStart(2, "0")}</span></div>
            <Link to="/stories" className="btn btn--ghost" style={{ marginTop: 10 }}>All parent stories <Arrow /></Link>
          </div>
          <div className="deck__pile">{TESTIMONIALS.map((t, i) => <DeckCard key={t.name} t={t} i={i} n={n} p={p} />)}</div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   7. Centre finder
   ========================================================================== */
function Finder() {
  const loc = useLocator();
  const nav = useNavigate();
  const go = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (loc.state) q.set("state", loc.state);
    if (loc.city) q.set("city", loc.city);
    if (loc.area) q.set("area", loc.area);
    nav(`/centres${q.toString() ? "?" + q : ""}`);
  };
  return (
    <section className="section light">
      <div className="container split">
        <div>
          <SectionHead eyebrow={`${ALL_CENTRES.length} centres across India`} lines={["A Globalart centre,", "*close to home.*"]} lead="Choose your state, city and area to see the centres nearest you — with phone numbers and directions." />
          <form className="form" onSubmit={go} style={{ marginTop: 36 }}>
            <div className="row3"><LocatorSelects loc={loc} /></div>
            <div className="row-between" style={{ alignItems: "center" }}>
              <motion.span key={loc.matches.length} style={{ fontWeight: 600, fontSize: 18 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {loc.matches.length} centre{loc.matches.length === 1 ? "" : "s"} {loc.city ? `in ${loc.area || loc.city}` : loc.state ? `in ${loc.state}` : "nationwide"}
              </motion.span>
              <button className="btn btn--lg" type="submit">Show centres <Arrow /></button>
            </div>
          </form>
        </div>
        <div className="media" style={{ aspectRatio: "4/3", borderRadius: 20 }}><Media m={{ img: "teacher-boy" }} alt="A teacher guiding a child’s drawing" /></div>
      </div>
    </section>
  );
}

/* ==========================================================================
   8. Finale — a circle of footage opens into the call to action
   ========================================================================== */
function Finale() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const r = useTransform(p, [0, 0.65], [9, 80]);
  const clipPath = useTransform(r, (v) => `circle(${v}% at 50% 66%)`);
  const leadColor = useTransform(p, [0.3, 0.55], ["#23272a", "#ffffff"]);
  const shade = useTransform(p, [0.35, 0.65], [0, 1]);
  const btnO = useTransform(p, [0.55, 0.75], [0, 1]);
  const btnY = useTransform(p, [0.55, 0.75], [24, 0]);
  return (
    <section ref={ref} className="cta-circle">
      <div className="cta-circle__stick">
        <motion.div className="cta-circle__media" style={{ clipPath }}>
          <Media m={{ img: "crayons-boy" }} alt="A boy holding out a handful of crayons" />
          <motion.div style={{ position: "absolute", inset: 0, background: "rgba(18,21,23,.5)", opacity: shade }} />
        </motion.div>
        <div className="cta-circle__copy">
          <div>
            <motion.p className="cta-circle__lead" style={{ color: leadColor, margin: "0 auto" }}>Their journey starts with one class.</motion.p>
            <motion.div className="btns" style={{ justifyContent: "center", opacity: btnO, y: btnY }}>
              <Link to="/contact#book" className="btn btn--lg">Book a free trial class <Arrow /></Link>
              <Link to="/centres" className="btn btn--ghost btn--lg" style={{ background: "rgba(255,255,255,.14)", color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Find a centre</Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SketchHero />
      <Journey />
      <Abilities />
      <Proof />
      <Steps />
      <Voices />
      <Finder />
      <Finale />
    </>
  );
}
