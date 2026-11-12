import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { GlobeScene } from "../components/three/Scenes.jsx";
import { Reveal, Stagger, item, TiltCard, LivingImage, Counter, SectionHead } from "../components/ui/index.jsx";
import { COUNTRIES, ENDORSEMENTS, EXPERTS, STATS, TIMELINE } from "../data/content.js";

const C = ["#0095DA", "#FF5CA8", "#2ED3A4", "#7C5CFF", "#FFC93C"];

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <div className="tl" ref={ref}>
      <div className="tl__line"><motion.i style={{ scaleY }} /></div>
      {TIMELINE.map((t, i) => (
        <Reveal key={t.year} delay={0.05}>
          <div className="tl__item">
            <div className="tl__year clay clay--solid" style={{ "--c": C[i], padding: 0, borderRadius: 26 }}>{t.year}</div>
            <TiltCard className="glass pad" max={6}><div className="pop"><h3 className="h3" style={{ marginBottom: 6 }}>{t.title}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{t.text}</p></div></TiltCard>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <PageHero crumb="About" eyebrow="Since 1999" icon="🌱" title="More than just art — a way to think" gradientWords={[5, 6, 7, 8]}
        lead="Globalart is the unique methodology of using art and drawing to enhance creativity in children. Now in 22 countries, 650 centres and 2,75,000+ young lives."
        scene={<GlobeScene />}>
        <div className="btns" style={{ marginTop: 26 }}><Link to="/courses" className="btn btn--lg">Explore courses →</Link><Link to="/centres" className="btn btn--glass btn--lg">📍 Find a centre</Link></div>
      </PageHero>

      <section className="section">
        <div className="container split">
          <Reveal rotateX={0} style={{ position: "relative" }}>
            <div className="liquid" style={{ inset: "-6%", background: "linear-gradient(135deg,#FFE7A3,#FFC6E2,#D7C9FF)" }} />
            <LivingImage src="/assets/globalart-overview.jpg" alt="Globalart student drawing" ratio="1/1" position="62% 30%">
              <div className="living__badge glass" style={{ right: -16, bottom: 26, padding: "14px 18px", borderRadius: 22, fontWeight: 800 }}>🎨 Every creation is unique</div>
            </LivingImage>
          </Reveal>
          <div>
            <Reveal><p className="eyebrow"><b>📖</b>Our story</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Born from a love of <span className="grad-text">art & children</span></h2></Reveal>
            <Reveal delay={0.1}><p>Started in 1999, Globalart is the first and only systematic, complete and efficient art programme that aims to develop the artistic and creative potential of children. Founder <b>Mr. Mahair Goh</b> has a passion for art and has worked with children for over two decades.</p></Reveal>
            <Reveal delay={0.15}><p>Extensive research produced a step-by-step syllabus that has become a trendsetter — systematic and straightforward, designed for every student. Globalart was launched in India by <b>SIP Academy</b>, starting with its first centre in <b>Chennai in May 2005</b>.</p></Reveal>
            <Reveal delay={0.2}>
              <div className="neu-panel" style={{ marginTop: 22, padding: "24px 28px" }}>
                <p style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 20, lineHeight: 1.35, letterSpacing: "-.02em", margin: 0 }}>“Art & Creativity can never be separated, one needs the other to function as a team to realise our imagination.”</p>
                <p className="muted" style={{ margin: "10px 0 0", fontWeight: 800 }}>— Mahair Goh, Founder</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Stagger className="grid g4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} variants={item}><TiltCard className="clay stat center" style={{ "--c": C[i] }}><div className="pop"><Counter to={s.value} suffix={s.suffix} indian={s.indian} /><span>{s.label}</span></div></TiltCard></motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Milestones" icon="🚀" title={<>Our colourful <span className="grad-text">journey</span></>} />
          <Timeline />
        </div>
      </section>

      <section className="section band-dark" style={{ borderRadius: 48, margin: "0 clamp(8px,1.5vw,20px)" }}>
        <div className="container">
          <SectionHead eyebrow="Global presence" icon="🌏" title={<>Kids creating all around the <span className="grad-text">world</span></>} lead="The places we’ve made an impact — you can be a part of this map too." />
          <Stagger className="flags" gap={0.03}>
            {COUNTRIES.map(([n, , , f], i) => (
              <motion.span key={n} variants={item} whileHover={{ y: -8, rotate: -4, scale: 1.06 }} className="flag glass glass--dark" style={i === 0 ? { background: "linear-gradient(135deg,#FF8A5B,#FFC93C)", color: "#14123A" } : undefined}><i>{f}</i>{n}</motion.span>
            ))}
          </Stagger>
          <Reveal><p className="center" style={{ marginTop: 34 }}><span className="chip" style={{ color: "#fff", background: "rgba(255,255,255,.1)" }}>🇮🇳 In India: Tamil Nadu · Karnataka · Telangana · Delhi NCR · Kerala · Rajasthan · Pondicherry · West Bengal</span></p></Reveal>
        </div>
      </section>

      <section className="section" id="endorsement">
        <div className="container">
          <SectionHead eyebrow="Endorsement" icon="🏆" title={<>The world recognises us — <span className="grad-text">it’s time you did too</span></>} />
          <Stagger className="grid g4">
            {ENDORSEMENTS.map((e, i) => (
              <motion.div key={e.title} variants={item}><TiltCard className="clay" style={{ "--c": C[i], height: "100%" }}><div className="pop"><div className="clay-icon" style={{ "--c": C[i] }}>{e.icon}</div><h3 className="h3">{e.title}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{e.meta}</p></div></TiltCard></motion.div>
            ))}
          </Stagger>
          <Stagger className="grid g2" style={{ marginTop: 30 }}>
            {EXPERTS.map((x, i) => (
              <motion.figure key={x.name} variants={item} className="glass pad quote-card" style={{ margin: 0 }}>
                <blockquote>{x.text}</blockquote>
                <figcaption className="person"><span className="avatar" style={{ background: C[i + 2] }}>{x.name.split(" ").slice(-2).map((w) => w[0]).join("")}</span><span><b>{x.name}</b>{x.meta}</span></figcaption>
              </motion.figure>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal>
            <div className="glass center" style={{ padding: "clamp(30px,5vw,64px)", borderRadius: 44 }}>
              <p className="grad-text" style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: "clamp(24px,3vw,40px)", lineHeight: 1.25, letterSpacing: "-.03em", margin: "0 auto 14px", maxWidth: 980 }}>“Creativity involves breaking out of established patterns in order to look at things in a different way. Creativity makes life more fun and more interesting.”</p>
              <p className="muted" style={{ fontWeight: 800, margin: 0 }}>— Edward de Bono</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}><div style={{ marginTop: 34 }}><LivingImage src="/assets/GA-21-Anniversary-Web-banner_1397Wx554H-px.jpg" alt="Celebrating 21 years of nurturing creativity in children across India" ratio="1400/555" strength={8} /></div></Reveal>
        </div>
      </section>
    </>
  );
}
