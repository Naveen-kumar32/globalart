import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { Reveal, Stagger, item, ScrollLit, ParallaxMedia, Counter, SectionHead, Marquee, Arrow, Tilt, Lines } from "../components/ui/index.jsx";
import { STATS, TIMELINE, COUNTRIES, ENDORSEMENTS, EXPERTS } from "../data/content.js";

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  return (
    <div className="tl" ref={ref} style={{ marginTop: 70 }}>
      <div className="tl__line"><motion.b style={{ scaleX }} /></div>
      {TIMELINE.map((t, i) => (
        <Reveal key={t.year} delay={i * 0.08} className="tl__item">
          <span className="y">{t.year}</span><h4>{t.title}</h4><p>{t.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <PageHero video="art-class-2" crumb="About" eyebrow="Since 1999" lines={["More than art —", "a way to *think.*"]}
        lead="Globalart is a unique method of using art and drawing to grow creativity in children. Today: 22 countries, 650 centres and 2,75,000+ young lives." />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Our story</p>
          <ScrollLit text="Started in 1999 by founder *Mahair Goh,* Globalart is the first systematic, complete art programme built to develop the *artistic and creative potential* of children. SIP Academy brought it to India — opening the first centre in *Chennai in May 2005.*" />
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container split">
          <ParallaxMedia img="/assets/globalart-overview.jpg" alt="A Globalart student drawing" ratio="4/3" radius="20px" />
          <div>
            <Reveal><p className="lead" style={{ marginTop: 0 }}>Extensive research produced a step-by-step syllabus that has become a trendsetter — systematic and straightforward, and designed for every student, not just the “talented” ones.</p></Reveal>
            <Reveal delay={0.1}>
              <blockquote className="quote" style={{ fontSize: "clamp(28px,3vw,44px)", marginTop: 50 }}>Art and creativity can never be separated; one needs the other to realise our imagination.</blockquote>
              <div className="qmeta"><b>Mahair Goh</b><span>Founder, Globalart</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="stats">{STATS.map((s) => <Reveal key={s.label} className="stat"><Counter to={s.value} suffix={s.suffix} indian={s.indian} /><span>{s.label}</span></Reveal>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Milestones" lines={["Twenty-seven years", "of *creativity.*"]} />
          <Timeline />
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 0 }}>
        <div className="container"><SectionHead eyebrow="Global presence" lines={["Children creating", "around the *world.*"]} /></div>
        <div style={{ marginTop: 60 }}>
          <Marquee items={COUNTRIES.slice(0, 10).map(([n]) => n)} />
          <Marquee items={COUNTRIES.slice(10).map(([n]) => n)} reverse />
        </div>
        <div className="container"><Reveal><p className="muted mono" style={{ marginTop: 30, lineHeight: 1.8 }}>In India: Tamil Nadu · Karnataka · Telangana · Delhi NCR · Kerala · Rajasthan · Pondicherry · West Bengal</p></Reveal></div>
      </section>

      <section className="section" id="endorsement">
        <div className="container">
          <SectionHead eyebrow="Endorsements" lines={["Recognised by", "the *world.*"]} />
          <Stagger className="grid g4" style={{ marginTop: 60 }}>
            {ENDORSEMENTS.map((e, i) => (
              <motion.div key={e.title} variants={item}>
                <Tilt className="glass pad" style={{ height: "100%", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <span className="serif" style={{ fontStyle: "italic", color: "var(--accent)", fontSize: 18 }}>({String(i + 1).padStart(2, "0")})</span>
                  <div><h3 className="h3" style={{ marginBottom: 8 }}>{e.title}</h3><p className="muted" style={{ margin: 0, fontSize: 15 }}>{e.meta}</p></div>
                </Tilt>
              </motion.div>
            ))}
          </Stagger>
          <div className="grid g2" style={{ marginTop: 90, gap: 60 }}>
            {EXPERTS.map((x, i) => (
              <Reveal key={x.name} delay={i * 0.1}>
                <blockquote className="quote" style={{ fontSize: "clamp(26px,2.6vw,40px)" }}>{x.text}</blockquote>
                <div className="qmeta"><b>{x.name}</b><span>{x.meta}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="narrow center" style={{ marginBottom: 70 }}>
            <Lines lines={["“Creativity makes life", "more fun and more *interesting.*”"]} as="h2" className="h2" inView />
            <Reveal><p className="muted" style={{ marginTop: 20 }}>— Edward de Bono</p></Reveal>
          </div>
          <ParallaxMedia img="/assets/GA-21-Anniversary-Web-banner_1397Wx554H-px.jpg" alt="Celebrating 21 years of nurturing creativity in children across India" ratio="1400/555" radius="24px" strength={6} />
          <div className="btns" style={{ justifyContent: "center" }}><Link to="/courses" className="btn btn--lg">Explore the courses <Arrow /></Link><Link to="/centres" className="btn btn--ghost btn--lg">Find a centre</Link></div>
        </div>
      </section>
    </>
  );
}
