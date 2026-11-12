import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { HomeScene, GlobeScene } from "../components/three/Scenes.jsx";
import { Reveal, SplitHeading, TiltCard, LivingImage, Counter, Magnetic, Marquee, SectionHead, Stagger, item, RingCarousel, useLocator, LocatorSelects } from "../components/ui/index.jsx";
import { BENEFITS, COURSES, STATS, TESTIMONIALS, LINKS } from "../data/content.js";

const WORDS = ["draw ✏️", "imagine 💭", "create ✨", "express 💬", "shine 🌟"];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);
  return (
    <span className="hero__rot">
      <AnimatePresence mode="popLayout">
        <motion.span key={i} className="grad-text" initial={{ y: "100%", rotateX: -90, opacity: 0 }} animate={{ y: "0%", rotateX: 0, opacity: 1 }} exit={{ y: "-100%", rotateX: 90, opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: "inline-block", fontWeight: 800 }}>
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero__3d"><HomeScene /></div>
      <div className="container hero__grid">
        <div>
          <Reveal><p className="eyebrow"><b>🎨</b>Since 1999 · 22 countries · Ages 5–15</p></Reveal>
          <SplitHeading text="Where little artists grow big imaginations" gradientWords={[4, 5]} />
          <Reveal delay={0.5}><p className="h3" style={{ fontWeight: 600, margin: "6px 0 18px" }}>Your child learns to <Rotator /></p></Reveal>
          <Reveal delay={0.6}><p className="lead">Globalart is the first systematic, step-by-step art programme — designed so every child, even one who “can’t draw”, discovers the artist inside.</p></Reveal>
          <Reveal delay={0.7}>
            <div className="btns" style={{ marginTop: 30 }}>
              <Magnetic><Link to="/contact#book" className="btn btn--lg">Book a Free Trial <span className="arr">→</span></Link></Magnetic>
              <Magnetic><Link to="/centres" className="btn btn--glass btn--lg">📍 Centres near me</Link></Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.8}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
              <div style={{ display: "flex" }}>{["#0095DA", "#FF5CA8", "#FFC93C", "#2ED3A4"].map((c, i) => <span key={c} className="avatar" style={{ background: c, marginLeft: i ? -14 : 0, border: "3px solid #fff", flexBasis: 44, width: 44, height: 44, fontSize: 18 }}>{["🧒", "👧", "👦", "🧒🏽"][i]}</span>)}</div>
              <p style={{ margin: 0, fontWeight: 700, lineHeight: 1.3 }}><span className="grad-text" style={{ fontSize: 20 }}>2,75,000+</span><br /><span className="muted" style={{ fontSize: 14 }}>young artists worldwide</span></p>
            </div>
          </Reveal>
        </div>
        <div style={{ position: "relative", minHeight: 520 }}>
          <motion.div className="hero__floating glass" style={{ right: "2%", top: "4%" }} initial={{ opacity: 0, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -10, 0] }} transition={{ delay: 1.2, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}>
            <span className="ico">🏆</span><span><b>Limca</b>Book of Records</span>
          </motion.div>
          <motion.div className="hero__floating glass" style={{ left: "6%", bottom: "6%" }} initial={{ opacity: 0, scale: 0.6, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, 10, 0] }} transition={{ delay: 1.4, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}>
            <span className="ico">🎨</span><span><b>13 levels</b>from age 5 to 15</span>
          </motion.div>
        </div>
      </div>
      <div className="scroll-hint"><i />scroll</div>
    </section>
  );
}

function QuickFinder() {
  const loc = useLocator();
  const nav = useNavigate();
  const go = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (loc.state) q.set("state", loc.state);
    if (loc.city) q.set("city", loc.city);
    if (loc.area) q.set("area", loc.area);
    nav("/centres" + (q.toString() ? `?${q}` : ""));
  };
  return (
    <div className="container" style={{ position: "relative", zIndex: 5, marginTop: -30 }}>
      <Reveal>
        <form className="finder glass" onSubmit={go}>
          <div className="finder__title"><span className="pin">📍</span><span>Find a Globalart<br />centre near you</span></div>
          <LocatorSelects loc={loc} labels={false} />
          <button className="btn btn--blue" type="submit">Show centres →</button>
        </form>
      </Reveal>
    </div>
  );
}

function About() {
  return (
    <section className="section">
      <div className="container split">
        <Reveal rotateX={0} y={0} style={{ position: "relative" }}>
          <div className="liquid" style={{ inset: "-8%", background: "linear-gradient(135deg,#9FD9FF,#D7C9FF,#FFC6E2)", opacity: 0.8 }} />
          <LivingImage src="/assets/globalart-overview.jpg" alt="A Globalart student concentrating on her drawing" ratio="4/3" position="66% 30%">
            <div className="living__badge glass pad" style={{ left: -24, bottom: 30, padding: "14px 18px", borderRadius: 22 }}><b style={{ fontFamily: "var(--f-display)", fontSize: 22 }}>Create,</b><br /><span className="muted" style={{ fontWeight: 700 }}>not copy ✨</span></div>
            <div className="living__badge glass" style={{ right: -18, top: 28, padding: "12px 16px", borderRadius: 20, fontWeight: 800 }}>👩‍🏫 Small batches</div>
          </LivingImage>
        </Reveal>
        <div>
          <Reveal><p className="eyebrow"><b>?</b>What is globalart</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">More than art — a method for <span className="grad-text">creative minds</span></h2></Reveal>
          <Reveal delay={0.1}><p className="lead">Started in 1999 by Mr. Mahair Goh, Globalart uses art and drawing to enhance creativity in children. Its step-by-step syllabus is designed for every student — even those with little artistic talent.</p></Reveal>
          <Stagger className="grid g2" style={{ marginTop: 26 }}>
            {["Structured, systematic curriculum", "International teaching standards", "Trained, child-friendly teachers", "Small batches, individual attention"].map((f, i) => (
              <motion.div key={f} variants={item} className="neu" style={{ padding: "16px 18px", fontWeight: 700, display: "flex", gap: 12, alignItems: "center" }}>
                <span className="clay-icon" style={{ "--c": ["#0095DA", "#FF5CA8", "#2ED3A4", "#FFC93C"][i], width: 42, height: 42, fontSize: 18, margin: 0, borderRadius: 14 }}>{["📘", "🌍", "👩‍🏫", "👥"][i]}</span>{f}
              </motion.div>
            ))}
          </Stagger>
          <Reveal delay={0.2}><div style={{ marginTop: 28 }}><Link to="/about" className="link">Our story →</Link></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHead eyebrow="For parents" icon="💛" title={<>Why parents <span className="grad-text">love</span> Globalart</>} lead="A proven method that uses drawing & colour to build the skills your child needs everywhere — in school and in life." />
        <Stagger className="grid g3">
          {BENEFITS.map((b) => (
            <motion.div key={b.title} variants={item} style={{ transformPerspective: 1000 }}>
              <TiltCard className="clay" style={{ "--c": b.color, height: "100%" }}>
                <div className="pop"><div className="clay-icon" style={{ "--c": b.color }}>{b.icon}</div><h3 className="h3">{b.title}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{b.text}</p></div>
              </TiltCard>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const h = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 80, damping: 20 });
  const steps = [
    ["💭", "Spark an idea", "Each child comes up with their own idea for the theme — no copying from samples."],
    ["✏️", "Draw it out", "Teachers guide with simple techniques — finger drawing, point-to-point & drawing through shapes."],
    ["🎨", "Colour & compose", "Kids explore colours, backgrounds and composition with different media."],
    ["🏆", "Proud creation", "A one-of-a-kind artwork — and a little more confidence after every class."],
  ];
  return (
    <section className="section">
      <div className="container split" style={{ alignItems: "start" }}>
        <div style={{ position: "sticky", top: 130 }}>
          <Reveal><p className="eyebrow"><b>✦</b>Inside a 2-hour class</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">How the <span className="grad-text">magic</span> happens</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">Small batches, trained child-friendly teachers and a structured syllabus with international teaching standards.</p></Reveal>
        </div>
        <div ref={ref} style={{ position: "relative", paddingLeft: 46 }}>
          <div style={{ position: "absolute", left: 14, top: 0, bottom: 0, width: 5, borderRadius: 5, background: "rgba(124,92,255,.15)" }}>
            <motion.div style={{ height: h, background: "var(--grad)", borderRadius: 5, width: "100%" }} />
          </div>
          <div className="grid">
            {steps.map(([e, t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="neu-panel" style={{ position: "relative", padding: "28px 30px" }}>
                  <span style={{ position: "absolute", left: -46, top: 30, width: 34, height: 34, borderRadius: "50%", background: "var(--grad)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, boxShadow: "0 8px 18px -6px #7C5CFF" }}>{i + 1}</span>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{e}</div><h3 className="h3">{t}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseCard({ c, i, progress }) {
  const rotY = useTransform(progress, [0, 1], [18 - i * 4, -30 + i * 4]);
  return (
    <motion.div style={{ rotateY: rotY, transformPerspective: 1200, flex: "0 0 clamp(280px, 30vw, 380px)" }}>
      <Link to={`/courses#${c.id}`} className="clay course-card" style={{ "--c": c.color, minHeight: 420 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="chip">{c.age}</span><span className="chip">{c.levelsCount} level{c.levelsCount > 1 ? "s" : ""}</span></div>
        <div style={{ fontSize: 76, lineHeight: 1, margin: "26px 0 10px", filter: "drop-shadow(0 14px 14px rgba(0,0,0,.18))" }}>{c.icon}</div>
        <span className="muted" style={{ fontWeight: 800 }}>Stage {i + 1}</span>
        <h3>{c.name}</h3>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>{c.lead}</p>
        <span className="link" style={{ marginTop: "auto", alignSelf: "flex-start" }}>Explore →</span>
      </Link>
    </motion.div>
  );
}

function CoursesRail() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);
  return (
    <section ref={ref} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <div className="container"><SectionHead eyebrow="13 levels · 5 stages" icon="🎓" title={<>A creative journey from <span className="grad-text">5 to 15</span></>} /></div>
        <motion.div style={{ x, display: "flex", gap: 28, paddingLeft: "max(var(--gutter), calc((100vw - 1280px)/2 + var(--gutter)))" }}>
          {COURSES.map((c, i) => <CourseCard key={c.id} c={c} i={i} progress={scrollYProgress} />)}
          <motion.div style={{ flex: "0 0 340px", display: "grid", placeItems: "center" }}>
            <Link to="/courses" className="btn btn--lg">See every level →</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AgeQuiz() {
  const [age, setAge] = useState(7);
  const pick = age <= 7 ? COURSES[0] : age <= 9 ? COURSES[2] : age <= 12 ? COURSES[3] : COURSES[4];
  const note = age <= 7 ? "Joining dots, cut & paste and first colours build fine motor skills." : age <= 9 ? "Ideas, shapes, backgrounds and action scenes. Foundation graduates go through Pre-Basic first." : age <= 12 ? "It’s never too late! Classes meet your child at their level — now for kids 10 & over." : "Human figures, mixed media, sketching, painting & illustration.";
  return (
    <section className="section--tight">
      <div className="container">
        <Reveal>
          <div className="neu-panel split" style={{ gap: 40 }}>
            <div>
              <p className="eyebrow"><b>?</b>Quick quiz</p>
              <h2 className="h2">How old is your little artist?</h2>
              <input className="range" type="range" min="5" max="15" value={age} onChange={(e) => setAge(+e.target.value)} aria-label="Child's age" />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14, marginTop: 10, color: "var(--muted)" }}><span>5 yrs</span><span>10 yrs</span><span>15 yrs</span></div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={pick.id} className="clay" style={{ "--c": pick.color }} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.45 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="chip">Suggested start · {age} yrs</span><span style={{ fontSize: 54 }}>{pick.icon}</span></div>
                <h3 className="h2" style={{ margin: "10px 0 8px" }}>{pick.name}</h3>
                <p style={{ margin: "0 0 18px", color: "var(--ink-2)" }}>{note}</p>
                <div className="btns"><Link to={`/courses#${pick.id}`} className="btn btn--glass btn--sm">See the course</Link><Link to="/contact#book" className="btn btn--sm">Book free trial</Link></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WorldBand() {
  return (
    <section className="section band-dark" style={{ borderRadius: 48, margin: "0 clamp(8px,1.5vw,20px)" }}>
      <div className="container split">
        <div>
          <Reveal><p className="eyebrow" style={{ color: "var(--ink)" }}><b>🌏</b>Global presence</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">Loved by kids in <span className="grad-text">22 countries</span></h2></Reveal>
          <Reveal delay={0.1}><p className="lead">Started in 1999. In India since May 2005 with SIP Academy — first in Chennai, now across 8 states.</p></Reveal>
          <Stagger className="grid g2" style={{ marginTop: 30 }}>
            {STATS.map((s) => (
              <motion.div key={s.label} variants={item} className="glass glass--dark stat pad"><Counter to={s.value} suffix={s.suffix} indian={s.indian} /><span style={{ color: "rgba(255,255,255,.75)" }}>{s.label}</span></motion.div>
            ))}
          </Stagger>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: 600, aspectRatio: "1", justifySelf: "center" }}><GlobeScene dark /></div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section" style={{ overflow: "hidden" }}>
      <div className="container"><SectionHead eyebrow="Real parents, real smiles" icon="💬" title={<>“My child has opened up her <span className="grad-text">wings</span>”</>} lead="Drag the ring to spin through stories from parents across India." /></div>
      <RingCarousel items={TESTIMONIALS} render={(t, i) => (
        <div className="glass pad quote-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <blockquote>{t.text}</blockquote>
          <div className="person"><span className="avatar" style={{ background: ["#0095DA", "#FF5CA8", "#7C5CFF", "#2ED3A4"][i % 4] }}>{t.name.replace(/^(Mr|Ms|Dr)\.?\s/, "").split(" ").map((x) => x[0]).slice(0, 2).join("")}</span><span><b>{t.name}</b>{t.meta}</span></div>
        </div>
      )} />
      <p className="center" style={{ marginTop: 10 }}><Link to="/stories" className="link">Read all parent stories →</Link></p>
    </section>
  );
}

function Happening() {
  const cards = [
    { img: "/assets/GClay-Web-banners-02.jpg", pos: "78% 60%", tag: "New · 6+ yrs", title: "G-Clay", text: "Sculpt & mould clay into unique handcrafted models.", to: "/courses#gclay" },
    { img: "/assets/GA_WebPage25_Desktop-03.jpg", pos: "20% 40%", tag: "Ages 10+", title: "Never too late!", text: "Art classes that meet your child at their level.", to: "/courses#tenplus" },
    { img: "/assets/cartoon_comic.png", pos: "50% 40%", tag: "Contest", title: "Cartoon & Comic Clash", text: "Calling all young cartoonists and comic creators!", href: LINKS.comic },
    { img: "/assets/GA-21-Anniversary-Web-banner_1397Wx554H-px.jpg", pos: "10% 50%", tag: "Competition", title: "Kreative Star ’26", text: "An opportunity for your children to shine.", href: LINKS.kreativestar },
  ];
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="What’s new" icon="🎉" title={<>Happening at <span className="grad-text">Globalart</span></>} />
        <Stagger className="grid g4">
          {cards.map((c) => {
            const inner = (
              <div className="glass" style={{ padding: 12, height: "100%", display: "flex", flexDirection: "column" }}>
                <LivingImage src={c.img} alt={c.title} ratio="4/3" position={c.pos} strength={10} style={{ borderRadius: 22 }} />
                <div style={{ padding: "16px 8px 8px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <span className="chip" style={{ alignSelf: "flex-start" }}>{c.tag}</span>
                  <h3 className="h3" style={{ margin: "6px 0 0" }}>{c.title}</h3>
                  <p className="muted" style={{ margin: "0 0 10px", fontSize: 15 }}>{c.text}</p>
                  <span className="link" style={{ marginTop: "auto", alignSelf: "flex-start" }}>Explore →</span>
                </div>
              </div>
            );
            return (
              <motion.div key={c.title} variants={item}>
                {c.to ? <Link to={c.to} style={{ display: "block", height: "100%" }}>{inner}</Link> : <a href={c.href} target="_blank" rel="noopener" style={{ display: "block", height: "100%" }}>{inner}</a>}
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function FranchiseCta() {
  return (
    <section className="section--tight">
      <div className="container">
        <Reveal>
          <div style={{ position: "relative", borderRadius: 44, overflow: "hidden", padding: "clamp(36px,6vw,80px)" }}>
            <div className="liquid" style={{ width: "60%", height: "140%", left: "-10%", top: "-20%", background: "#7C5CFF" }} />
            <div className="liquid" style={{ width: "50%", height: "120%", right: "-10%", top: "-10%", background: "#FF5CA8", animationDelay: "-4s" }} />
            <div className="liquid" style={{ width: "40%", height: "90%", left: "35%", bottom: "-40%", background: "#0095DA", animationDelay: "-8s" }} />
            <div className="glass split" style={{ position: "relative", padding: "clamp(26px,4vw,50px)", background: "rgba(255,255,255,.28)", color: "#fff" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--ink)" }}><b>🤝</b>Partner with us</p>
                <h2 className="h2" style={{ textShadow: "0 4px 30px rgba(0,0,0,.2)" }}>Turn your love for art into a profession</h2>
                <p style={{ fontSize: 19, opacity: 0.95 }}>Join India’s largest team of creative centre owners — a proven international programme with online & offline classes.</p>
                <div className="btns" style={{ marginTop: 24 }}><Link to="/franchise" className="btn btn--sun btn--lg">Become a Franchisee →</Link><a href="tel:+917845741660" className="btn btn--glass btn--lg">📞 78457 41660</a></div>
              </div>
              <div className="grid g2">
                {[["23", "Countries"], ["150+", "Centres in India"], ["1L+", "Students trained"], ["2005", "In India since"]].map(([v, l]) => (
                  <TiltCard key={l} className="glass stat pad" style={{ color: "var(--ink)" }}><div className="pop"><b>{v}</b><span>{l}</span></div></TiltCard>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <QuickFinder />
      <div style={{ margin: "90px 0 40px" }}>
        <Marquee items={["✏️ Draw", "🎨 Colour", "✨ Create", "💭 Imagine", "🧠 Focus", "🌟 Shine", "🏺 G-Clay"]} />
        <Marquee variant="b" items={["Foundation", "Pre-Basic", "Basic", "Intermediate", "Advanced", "Drawing", "Painting", "Illustration"]} />
      </div>
      <About />
      <Benefits />
      <HowItWorks />
      <CoursesRail />
      <AgeQuiz />
      <WorldBand />
      <Testimonials />
      <Happening />
      <FranchiseCta />
    </>
  );
}
