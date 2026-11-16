import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { Reveal, Stagger, item, Video, Media, ParallaxMedia, SectionHead, Marquee, Arrow, Lines } from "../components/ui/index.jsx";
import { COURSES, FEATURES, BENEFITS, CAREERS, COURSE_MEDIA } from "../data/content.js";

/** Course card that pins, then recedes into the dark as the next card slides over it. */
function StackCard({ c, i, n }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90px", "end 90px"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (n - i) * 0.025]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  return (
    <div ref={ref} className="stack__item" id={c.id} style={{ scrollMarginTop: 90, top: 100 + i * 12 }}>
      <motion.div className="stack__card" style={{ scale }}>
        <motion.div className="stack__dim" style={{ opacity: dim }} />
        <div className="stack__media media"><Media m={COURSE_MEDIA[c.id]} alt={`${c.name} stage`} /></div>
        <div className="stack__body">
          <div>
            <div className="row-between mono" style={{ color: "var(--muted)" }}><span>Stage 0{i + 1} / 0{n}</span><span style={{ color: "var(--accent)" }}>{c.age}</span></div>
            <h2 className="h2" style={{ marginTop: 20 }}>{c.name}</h2>
            <p className="lead">{c.lead}</p>
          </div>
          <div>{c.levels.map(([l, d]) => <div className="lvl" key={l}><b>{l}</b><span>{d}</span></div>)}</div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Courses() {
  return (
    <>
      <PageHero img="class-painting" crumb="Courses" eyebrow="13 levels · Ages 5–15" lines={["Step by step,", "*level by level.*"]}
        lead="A structured, international-standard syllabus that meets each child where they are — then helps them grow." />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="The journey" lines={["Five stages to", "a *confident* artist."]} lead="Each stage builds on the last. Children start at the right level after a free trial class." />
          <div style={{ marginTop: 70 }}>{COURSES.map((c, i) => <StackCard key={c.id} c={c} i={i} n={COURSES.length} />)}</div>
        </div>
      </section>

      <section className="section" id="gclay" style={{ scrollMarginTop: 90 }}>
        <div className="container split">
          <div>
            <Reveal><p className="eyebrow">New programme · 6+ years</p></Reveal>
            <Lines lines={["Introducing", "*G-Clay.*"]} as="h2" className="h2" inView />
            <Reveal delay={0.1}><p className="lead">An exciting programme where children learn to sculpt and mould clay into unique, handcrafted models — thinking in three dimensions.</p></Reveal>
            <Reveal delay={0.15}><div className="btns"><Link to="/centres" className="btn">Ask your nearest centre <Arrow /></Link></div></Reveal>
          </div>
          <ParallaxMedia video="clay" ratio="4/3" radius="20px" />
        </div>
      </section>

      <section className="section--tight" id="tenplus">
        <div className="container split">
          <ParallaxMedia video="painting-girl-2" ratio="4/3" radius="20px" />
          <div>
            <Reveal><p className="eyebrow">Ages 10 and over</p></Reveal>
            <Lines lines={["It’s never too late", "to *create.*"]} as="h2" className="h2" inView />
            <Reveal delay={0.1}><p className="lead">Art classes that meet your child at their level — from India’s largest and most experienced chain of art centres.</p></Reveal>
            <Reveal delay={0.15}><div className="btns"><Link to="/contact#book" className="btn">Book a free trial <Arrow /></Link></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Why Globalart" lines={["Features and", "*benefits.*"]} />
          <div className="grid g2" style={{ marginTop: 60 }}>
            <Reveal className="glass pad">
              <p className="eyebrow">Features</p>
              {FEATURES.map((f, i) => <div className="lvl" key={f} style={{ gridTemplateColumns: "50px 1fr" }}><span className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>0{i + 1}</span><b>{f}</b></div>)}
            </Reveal>
            <Reveal className="glass pad" delay={0.1}>
              <p className="eyebrow">Benefits</p>
              {BENEFITS.map((b, i) => <div className="lvl" key={b.title} style={{ gridTemplateColumns: "50px 1fr" }}><span className="serif" style={{ fontStyle: "italic", color: "var(--accent)" }}>0{i + 1}</span><b>{b.title}</b></div>)}
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(60px,8vw,110px)" }}>
        <div className="container"><p className="eyebrow">Where creativity can lead</p></div>
        <Marquee items={CAREERS} />
      </section>
    </>
  );
}
