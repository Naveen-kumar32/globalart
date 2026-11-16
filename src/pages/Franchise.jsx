import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import MailForm from "../components/MailForm.jsx";
import { Reveal, Stagger, item, Counter, SectionHead, Tilt, ExpandFilm, Arrow, ScrollLit } from "../components/ui/index.jsx";
import { EXPERTS, INDIA_STATES, LINKS } from "../data/content.js";

const WHY = [
  { t: "Proven & international", d: "A successful international programme present in 23 countries. In India since 2005 with over 150 centres, and international course content and material." },
  { t: "Real results", d: "Over 1,00,000 students trained in India. The average student stays 12 months. Alumni in leading design colleges and corporates." },
  { t: "A model that works", d: "A proven business model in metros and mini-metros. Pandemic-proof with online and offline classes, backed by a successful network." },
];
const STEPS = [
  ["Share your details", "Fill in the short enquiry form below with your location."],
  ["We call you", "Our franchise team gets in touch to understand your plans and answer questions."],
  ["Explore together", "Learn about the opportunity in your area and the support Globalart provides."],
];

export default function Franchise() {
  return (
    <>
      <PageHero video="teacher-drawing" crumb="Franchise" eyebrow="Partner with us" lines={["Turn a love for art", "into a *profession.*"]}
        lead="Become an entrepreneur and join India’s largest team of creative-centre owners.">
        <div className="btns" style={{ margin: 0 }}><a href="#apply" className="btn btn--lg">Partner with us <Arrow /></a><a href="tel:+917845741660" className="btn btn--ghost btn--lg">78457 41660</a></div>
      </PageHero>

      <section className="section">
        <div className="container">
          <p className="eyebrow">The opportunity</p>
          <ScrollLit text="Parents across India are looking for more than marks. They want *creative, confident* children. Globalart gives you a *proven programme,* trained-teacher support and a brand trusted for over *two decades.*" />
          <div className="stats" style={{ marginTop: 100 }}>
            {[[23, "", "Countries"], [150, "+", "Centres in India"], [100000, "+", "Students trained in India", true], [12, "", "Months, average student journey"]].map(([v, s, l, ind]) => (
              <Reveal key={l} className="stat"><Counter to={v} suffix={s} indian={ind} /><span>{l}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHead eyebrow="Why partner with Globalart" lines={["A proven programme,", "a *happy* business."]} />
          <Stagger className="grid g3" style={{ marginTop: 60 }}>
            {WHY.map((w, i) => (
              <motion.div key={w.t} variants={item}>
                <Tilt className="glass pad benefit" style={{ height: "100%" }}>
                  <span className="n">({String(i + 1).padStart(2, "0")})</span>
                  <div><h3>{w.t}</h3><p>{w.d}</p></div>
                </Tilt>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <ExpandFilm video="art-class" top="Build something" bottom="that matters."
        caption={<div className="grid g2" style={{ gap: 40 }}>{EXPERTS.map((x) => <div key={x.name}><p className="serif" style={{ fontSize: "clamp(20px,2vw,28px)", lineHeight: 1.25, margin: 0 }}>“{x.text}”</p><p className="mono" style={{ marginTop: 14, color: "rgba(255,255,255,.75)" }}>{x.name}</p></div>)}</div>} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Simple next steps" lines={["Write your", "*success story.*"]} />
          <div className="grid g3" style={{ marginTop: 60 }}>
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.1} style={{ borderTop: "1px solid var(--line)", paddingTop: 26 }}>
                <span className="serif" style={{ fontSize: 80, lineHeight: 1, color: "var(--accent)", fontStyle: "italic" }}>0{i + 1}</span>
                <h3 className="h3" style={{ margin: "18px 0 10px" }}>{t}</h3><p className="muted" style={{ margin: 0 }}>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section light" id="apply" style={{ scrollMarginTop: 0 }}>
        <div className="container split" style={{ alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <SectionHead eyebrow="Let’s talk" lines={["Become our", "*franchisee.*"]} lead="Tell us a little about yourself and where you’d like to start a centre. Our team will reach out." />
            <Reveal><p style={{ marginTop: 30 }}>Call <a className="link" href="tel:+917845741660">78457 41660</a><br />Mail <a className="link" href="mailto:gainfo@sipacademyindia.com">gainfo@sipacademyindia.com</a></p></Reveal>
          </div>
          <Reveal delay={0.1}>
            <MailForm to="gainfo@sipacademyindia.com" subject="Globalart franchise enquiry" submitLabel="Send my enquiry"
              success="Your email app has opened with your enquiry — just press send. Our franchise team will be in touch soon."
              fields={[
                { name: "Name", label: "Your name", required: true, autoComplete: "name" },
                [{ name: "Mobile", label: "Mobile", type: "tel", required: true, pattern: "[0-9+ ]{10,14}" }, { name: "Email", label: "Email", type: "email", required: true }],
                [{ name: "State", label: "State", options: INDIA_STATES, required: true }, { name: "City / Area", label: "City & area", required: true }],
                { name: "Message", label: "Anything you’d like to tell us?", textarea: true, placeholder: "Your background, space availability, questions…" },
              ]}
              footer={<p className="muted" style={{ margin: 0, fontSize: 14 }}>Prefer the official form? <a className="link" href={LINKS.franchiseForm} target="_blank" rel="noopener">Apply on globalart.in</a></p>}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
