import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { StepsScene } from "../components/three/Scenes.jsx";
import { Reveal, Stagger, item, LivingImage, SectionHead, TiltCard } from "../components/ui/index.jsx";
import { COURSES, CAREERS, FEATURES, BENEFITS } from "../data/content.js";

/* Sticky stacked cards: each card scales back & tilts as the next one arrives. */
function StackCard({ c, i, total, progress }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.04]);
  const rotateX = useTransform(progress, [start, start + 0.25], [0, 8]);
  return (
    <div id={c.id} style={{ position: "sticky", top: `calc(110px + ${i * 26}px)`, height: "auto", marginBottom: 40, scrollMarginTop: 120 }}>
      <motion.div style={{ scale, rotateX, transformPerspective: 1200, transformOrigin: "50% 0" }}>
        <div className="clay split" style={{ "--c": c.color, padding: "clamp(26px,4vw,54px)", alignItems: "start", gap: 30 }}>
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span className="chip">Stage {i + 1}</span><span className="chip">{c.age}</span><span className="chip">{c.levelsCount} level{c.levelsCount > 1 ? "s" : ""}</span></div>
            <motion.div style={{ fontSize: "clamp(70px,9vw,120px)", lineHeight: 1, margin: "22px 0 10px", filter: "drop-shadow(0 18px 18px rgba(0,0,0,.2))" }} animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>{c.icon}</motion.div>
            <h2 className="h2" style={{ marginBottom: 10 }}>{c.name}</h2>
            <p className="lead" style={{ margin: 0 }}>{c.lead}</p>
          </div>
          <div className="grid" style={{ gap: 12 }}>
            {c.levels.map(([t, d]) => <div key={t} className="level"><b>{t}</b>{d}</div>)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stack() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} style={{ position: "relative" }}>
      {COURSES.map((c, i) => <StackCard key={c.id} c={c} i={i} total={COURSES.length} progress={scrollYProgress} />)}
    </div>
  );
}

export default function Courses() {
  return (
    <>
      <PageHero crumb="Courses" eyebrow="13 levels · 5 stages · ages 5–15" icon="🎓" title="Creativity in detail, level by level" gradientWords={[3, 4, 5]}
        lead="A carefully designed curriculum that introduces themes, composition techniques and media — and sets creative challenges to think out-of-the-box."
        scene={<StepsScene />}>
        <div className="btns" style={{ marginTop: 24 }}>{["⏱️ 2-hour classes", "👩‍🏫 Small batches", "🌍 International standards"].map((x) => <span key={x} className="chip chip--neu">{x}</span>)}</div>
      </PageHero>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <SectionHead eyebrow="The level map" icon="🗺️" title={<>Level up, one <span className="grad-text">artwork</span> at a time</>} lead="In a competitive world, strong creative ability is what differentiates the winners in all walks of life." />
          <Stack />
        </div>
      </section>

      <section className="section" id="gclay">
        <div className="container split">
          <div>
            <Reveal><p className="eyebrow"><b>✨</b>New programme · 6+ yrs</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Introducing <span className="grad-text">G-Clay</span></h2></Reveal>
            <Reveal delay={0.1}><p className="lead">An exciting new programme where children learn to sculpt & mould clay and make unique handcrafted models.</p></Reveal>
            <Reveal delay={0.15}><div className="btns" style={{ marginTop: 22 }}><Link to="/centres" className="btn btn--blue">Contact your nearest centre →</Link></div></Reveal>
          </div>
          <Reveal rotateX={0} style={{ position: "relative" }}>
            <div className="liquid" style={{ inset: "-6%", background: "linear-gradient(135deg,#9FD9FF,#B7F0DF)" }} />
            <LivingImage src="/assets/GClay-Web-banners-02.jpg" alt="Clay models made in the G-Clay programme" ratio="1400/556" strength={10} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="tenplus" style={{ paddingTop: 0 }}>
        <div className="container split">
          <Reveal rotateX={0} style={{ position: "relative" }}>
            <div className="liquid" style={{ inset: "-6%", background: "linear-gradient(135deg,#D7C9FF,#FFC6E2)" }} />
            <LivingImage src="/assets/GA_WebPage25_Desktop-03.jpg" alt="It's never too late to explore your creative side" ratio="1400/555" strength={10} />
          </Reveal>
          <div>
            <Reveal><p className="eyebrow"><b>🌟</b>Ages 10 & over</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2">It’s never too late to explore your <span className="grad-text">creative side</span></h2></Reveal>
            <Reveal delay={0.1}><p className="lead">Art classes that meet your child at their level — from India’s largest and most experienced chain of art centres.</p></Reveal>
            <Reveal delay={0.15}><div className="btns" style={{ marginTop: 22 }}><Link to="/contact#book" className="btn">Book a Free Trial →</Link></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="Why globalart" icon="💎" title={<>Features & <span className="grad-text">benefits</span></>} />
          <div className="grid g2">
            <Reveal><div className="neu-panel" style={{ height: "100%" }}><h3 className="h3">⭐ Features</h3><div className="grid" style={{ gap: 12 }}>{FEATURES.map((f) => <div key={f} className="neu-in" style={{ padding: "14px 18px", fontWeight: 700 }}>{f}</div>)}</div></div></Reveal>
            <Reveal delay={0.1}><div className="neu-panel" style={{ height: "100%" }}><h3 className="h3">💛 Benefits</h3><div className="grid" style={{ gap: 12 }}>{BENEFITS.map((b) => <div key={b.title} className="neu-in" style={{ padding: "14px 18px", fontWeight: 700 }}>{b.icon} {b.title}</div>)}</div></div></Reveal>
          </div>
          <div className="section-head" style={{ margin: "70px auto 26px" }}><Reveal><h3 className="h3">Where creativity can lead 🚀</h3></Reveal></div>
          <Stagger className="flags" gap={0.04}>
            {CAREERS.map((c) => <motion.span key={c} variants={item} whileHover={{ y: -6, scale: 1.06 }} className="flag chip--neu">{c}</motion.span>)}
          </Stagger>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal><TiltCard className="glass center" max={5} style={{ padding: "clamp(34px,6vw,80px)", borderRadius: 44 }}>
            <div className="pop"><h2 className="h1" style={{ fontSize: "clamp(36px,5vw,72px)" }}>Ready for <span className="grad-text">level one?</span></h2>
            <p className="lead" style={{ margin: "0 auto 26px" }}>Every child starts at the right level after a free trial class.</p>
            <div className="btns" style={{ justifyContent: "center" }}><Link to="/contact#book" className="btn btn--lg">Book a Free Trial ✏️</Link><Link to="/centres" className="btn btn--glass btn--lg">📍 Find a Centre</Link></div></div>
          </TiltCard></Reveal>
        </div>
      </section>
    </>
  );
}
