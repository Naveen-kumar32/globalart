import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { Reveal, Stagger, item, SectionHead, Tilt, Arrow, QuoteSlider, Video } from "../components/ui/index.jsx";
import { TESTIMONIALS, LINKS } from "../data/content.js";

function Film() {
  const [play, setPlay] = useState(false);
  return (
    <div className="vcard" style={{ aspectRatio: "16/9" }} data-cursor={play ? undefined : "Play"}>
      {play ? (
        <video src={LINKS.video} controls autoPlay playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#000" }} />
      ) : (
        <button onClick={() => setPlay(true)} aria-label="Play the parent testimonial video" style={{ position: "absolute", inset: 0, width: "100%" }}>
          <Video name="colouring-hands" />
          <div className="shade-b" /><div className="vignette" />
          <motion.span initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} style={{ position: "absolute", left: "50%", top: "50%", translateX: "-50%", translateY: "-50%", width: 110, height: 110, borderRadius: "50%", display: "grid", placeItems: "center", zIndex: 2 }} className="glass">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0095DA" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </motion.span>
          <span className="vcard__body mono" style={{ textAlign: "left" }}>Testimonial · SIP Academy 20 years</span>
        </button>
      )}
    </div>
  );
}

export default function Stories() {
  return (
    <>
      <PageHero img="showing-art" crumb="Stories" eyebrow="From parents across India" lines={["Small hands,", "*big changes.*"]}
        lead="Real words from the parents of Globalart children — about confidence, focus and the joy of creating." />

      <section className="section">
        <div className="container split" style={{ alignItems: "start" }}>
          <div><p className="eyebrow">In their words</p><QuoteSlider quotes={TESTIMONIALS} interval={8000} /></div>
          <Film />
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHead eyebrow="All stories" lines={["Every family,", "a *different* story."]} />
          <Stagger className="grid g2" style={{ marginTop: 60 }}>
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={item}>
                <Tilt className="glass pad" style={{ height: "100%" }}>
                  <p className="serif" style={{ fontSize: "clamp(22px,2vw,28px)", lineHeight: 1.3, margin: 0 }}>“{t.text}”</p>
                  <div className="qmeta"><b>{t.name}</b><span>{t.meta}</span></div>
                </Tilt>
              </motion.div>
            ))}
          </Stagger>
          <Reveal><div className="btns" style={{ justifyContent: "center", marginTop: 70 }}><Link to="/contact#book" className="btn btn--lg">Start your child’s story <Arrow /></Link></div></Reveal>
        </div>
      </section>
    </>
  );
}
