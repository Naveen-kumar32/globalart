import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { StoriesScene } from "../components/three/Scenes.jsx";
import { Reveal, Stagger, item, TiltCard, RingCarousel } from "../components/ui/index.jsx";
import { TESTIMONIALS, LINKS } from "../data/content.js";

const C = ["#0095DA", "#FF5CA8", "#7C5CFF", "#2ED3A4", "#FFC93C", "#FF8A5B"];
const initials = (n) => n.replace(/^(Mr|Ms|Dr)\.?\s/, "").split(" ").map((x) => x[0]).slice(0, 2).join("");

export default function Stories() {
  return (
    <>
      <PageHero crumb="Parent Stories" eyebrow="Real parents, real smiles" icon="💬" title="Little changes. Big smiles." gradientWords={[2, 3]}
        lead="Parents of Globalart children share the change for the better they’ve seen — at home, in school and beyond." scene={<StoriesScene />} />

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <TiltCard className="glass" max={4} style={{ padding: 12, borderRadius: 36, maxWidth: 1000, margin: "0 auto" }}>
              <video src={LINKS.video} controls preload="none" playsInline poster="/assets/globalart-overview.jpg" style={{ width: "100%", borderRadius: 26, aspectRatio: "16/9", objectFit: "cover", background: "#14123A" }} />
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ overflow: "hidden" }}>
        <div className="container section-head"><Reveal><h2 className="h2">Spin the <span className="grad-text">story ring</span></h2></Reveal><Reveal delay={0.05}><p className="lead">Drag to rotate through stories from parents across India.</p></Reveal></div>
        <RingCarousel items={TESTIMONIALS} render={(t, i) => (
          <div className="clay" style={{ "--c": C[i % C.length], height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className="quote-card"><blockquote>{t.text}</blockquote></div>
            <div className="person"><span className="avatar" style={{ background: C[i % C.length] }}>{initials(t.name)}</span><span><b>{t.name}</b>{t.meta}</span></div>
          </div>
        )} />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Stagger className="grid g3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} variants={item}>
                <TiltCard className="glass pad quote-card" max={8} style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <blockquote>{t.text}</blockquote>
                  <div className="person"><span className="avatar" style={{ background: C[i % C.length] }}>{initials(t.name)}</span><span><b>{t.name}</b>{t.meta}</span></div>
                </TiltCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal><div className="neu-panel center" style={{ padding: "clamp(34px,6vw,80px)" }}>
            <h2 className="h1" style={{ fontSize: "clamp(34px,5vw,70px)" }}>Write your child’s <span className="grad-text">story next</span></h2>
            <p className="lead" style={{ margin: "0 auto 26px" }}>Start with a free trial class at a centre near you.</p>
            <div className="btns" style={{ justifyContent: "center" }}><Link to="/contact#book" className="btn btn--lg">Book a Free Trial ✏️</Link><Link to="/centres" className="btn btn--neu btn--lg">📍 Find a Centre</Link></div>
          </div></Reveal>
        </div>
      </section>
    </>
  );
}
