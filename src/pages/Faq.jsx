import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { Reveal, Arrow, ParallaxMedia, Lines } from "../components/ui/index.jsx";
import { FAQS } from "../data/content.js";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero video="brush" crumb="FAQs" eyebrow="Ask us anything" lines={["Questions?", "*Answered.*"]}
        lead="Everything parents usually ask about Globalart — from the right age to start to how it helps at school." />

      <section className="section">
        <div className="narrow">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i, 5) * 0.04} y={30}>
                <div className={`qa ${isOpen ? "open" : ""}`}>
                  <button className="qa__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span className="qa__n">{String(i + 1).padStart(2, "0")}</span>{f.q}<span className="qa__plus" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
                        <motion.div className="qa__a" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
                          {Array.isArray(f.a) ? <ul>{f.a.map((x) => <li key={x}>{x}</li>)}</ul> : <p style={{ margin: 0 }}>{f.a}</p>}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section--tight">
        <div className="container split">
          <ParallaxMedia video="colored-pens" ratio="4/3" radius="20px" />
          <div>
            <Lines lines={["Still", "*curious?*"]} as="h2" className="h2" inView />
            <Reveal><p className="lead">Mail <a className="link" href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a> and our team will get back to you — or simply visit a centre for a free trial.</p></Reveal>
            <Reveal><div className="btns"><Link to="/contact#book" className="btn btn--lg">Book a free trial <Arrow /></Link><Link to="/contact" className="btn btn--ghost btn--lg">Contact us</Link></div></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
