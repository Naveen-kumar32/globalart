import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { FloatingScene } from "../components/three/Scenes.jsx";
import { Reveal } from "../components/ui/index.jsx";
import { FAQS } from "../data/content.js";

const SHAPES = [
  ["orb", [0, 0.2, 0], { radius: 1.1 }],
  ["blob", [-2.2, 1.3, -1], { color: "#FF5CA8", radius: 0.6 }],
  ["donut", [2.2, 1.2, -0.5], { color: "#FFC93C" }],
  ["pill", [2.0, -1.4, 0.5], { color: "#2ED3A4", rotation: [0, 0, 0.8] }],
  ["star", [-2.1, -1.4, 0.4], { scale: 0.45 }],
  ["cube", [0.4, 2.1, -1.2], { color: "#7C5CFF", size: 0.6 }],
  ["blob", [0.6, -2, 0.8], { color: "#0095DA", radius: 0.45 }],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero crumb="FAQs" eyebrow="Ask us anything" icon="❓" title="Questions? We’ve got answers." gradientWords={[2, 3, 4]}
        lead="Ask and you shall receive — answers, that is, to all your frequently asked questions about Globalart." scene={<FloatingScene items={SHAPES} />} />

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="grid" style={{ gap: 16 }}>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={Math.min(i, 5) * 0.04} y={40}>
                  <motion.div className={`qa ${isOpen ? "open glass" : "neu"}`} layout transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}>
                    <motion.button layout="position" className="qa__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                      <span className="qa__n">{String(i + 1).padStart(2, "0")}</span>{f.q}<span className="qa__plus">+</span>
                    </motion.button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
                          <motion.div className="qa__a" initial={{ y: -10, filter: "blur(6px)" }} animate={{ y: 0, filter: "blur(0px)" }}>
                            {Array.isArray(f.a) ? <ul>{f.a.map((x) => <li key={x}>{x}</li>)}</ul> : <p style={{ margin: 0 }}>{f.a}</p>}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal><div className="clay center" style={{ "--c": "#7C5CFF", padding: "clamp(34px,6vw,70px)" }}>
            <h2 className="h2">Still curious? 🤔</h2>
            <p className="lead" style={{ margin: "0 auto 24px" }}>Mail <a className="link" href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a> and our team will get back to you — or simply visit a centre for a free trial.</p>
            <div className="btns" style={{ justifyContent: "center" }}><Link to="/contact#book" className="btn btn--lg">Book a Free Trial ✏️</Link><Link to="/contact" className="btn btn--glass btn--lg">💬 Contact us</Link></div>
          </div></Reveal>
        </div>
      </section>
    </>
  );
}
