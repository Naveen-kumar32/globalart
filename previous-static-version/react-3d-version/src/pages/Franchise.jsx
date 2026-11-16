import { motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { GrowthScene } from "../components/three/Scenes.jsx";
import { Reveal, Stagger, item, TiltCard, Counter, SectionHead } from "../components/ui/index.jsx";
import MailForm from "../components/MailForm.jsx";
import { EXPERTS, INDIA_STATES, LINKS } from "../data/content.js";

const WHY = [
  { icon: "🌍", c: "#0095DA", t: "Proven & international", d: "A successful international programme present in 23 countries. In India since 2005 with over 150 centres, and international course content & material." },
  { icon: "🎓", c: "#FF5CA8", t: "Real results", d: "Over 1,00,000 students trained in India. Average duration of a student in the course is 12 months. Alumni in leading design colleges & corporates." },
  { icon: "📈", c: "#2ED3A4", t: "Proven model", d: "A proven business model in metros and mini-metros. Pandemic-proof with online & offline classes, backed by a successful network." },
];

export default function Franchise() {
  return (
    <>
      <PageHero crumb="Franchise" eyebrow="Partner with us" icon="🤝" title="Turn your love for art into a profession" gradientWords={[5, 6]}
        lead="Become an entrepreneur and join India’s largest team of creative centre owners." scene={<GrowthScene />}>
        <div className="btns" style={{ marginTop: 26 }}><a href="#apply" className="btn btn--lg">Partner with us now →</a><a href="tel:+917845741660" className="btn btn--glass btn--lg">📞 78457 41660</a></div>
      </PageHero>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <SectionHead eyebrow="Why partner with Globalart" icon="💎" title={<>A proven programme, a <span className="grad-text">happy</span> business</>} />
          <Stagger className="grid g3">
            {WHY.map((w) => (
              <motion.div key={w.t} variants={item}><TiltCard className="clay" style={{ "--c": w.c, height: "100%" }}><div className="pop"><div className="clay-icon" style={{ "--c": w.c }}>{w.icon}</div><h3 className="h3">{w.t}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{w.d}</p></div></TiltCard></motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section band-dark" style={{ borderRadius: 48, margin: "0 clamp(8px,1.5vw,20px)" }}>
        <div className="container">
          <Stagger className="grid g4">
            {[[23, "", "Countries"], [150, "+", "Centres in India"], [100000, "+", "Students trained in India", true], [12, "", "Months avg. student journey"]].map(([v, s, l, ind]) => (
              <motion.div key={l} variants={item} className="glass glass--dark stat pad center"><Counter to={v} suffix={s} indian={ind} /><span style={{ color: "rgba(255,255,255,.75)" }}>{l}</span></motion.div>
            ))}
          </Stagger>
          <Stagger className="grid g2" style={{ marginTop: 40 }}>
            {EXPERTS.map((x) => (
              <motion.figure key={x.name} variants={item} className="glass glass--dark pad quote-card" style={{ margin: 0 }}>
                <blockquote>{x.text}</blockquote>
                <figcaption className="person" style={{ color: "rgba(255,255,255,.7)" }}><span className="avatar">{x.name.split(" ").slice(-2).map((w) => w[0]).join("")}</span><span><b style={{ color: "#fff" }}>{x.name}</b>{x.meta}</span></figcaption>
              </motion.figure>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Simple next steps" icon="🧭" title={<>Write your <span className="grad-text">success story</span></>} />
          <Stagger className="grid g3">
            {[["📝", "Share your details", "Fill in the short enquiry form below with your location."], ["📞", "We call you", "Our franchise team gets in touch to understand your plans and answer questions."], ["🚀", "Explore together", "Learn about the opportunity in your area and the support Globalart provides."]].map(([e, t, d], i) => (
              <motion.div key={t} variants={item} className="neu-panel" style={{ position: "relative" }}>
                <span style={{ position: "absolute", right: 24, top: 18, fontFamily: "var(--f-display)", fontSize: 60, fontWeight: 800, opacity: 0.08 }}>0{i + 1}</span>
                <div style={{ fontSize: 44 }}>{e}</div><h3 className="h3">{t}</h3><p style={{ margin: 0, color: "var(--ink-2)" }}>{d}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section" id="apply" style={{ paddingTop: 0, scrollMarginTop: 110 }}>
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <Reveal><p className="eyebrow"><b>✉️</b>Let’s talk</p></Reveal>
            <Reveal delay={0.05}><h2 className="h2">Become our <span className="grad-text">franchisee</span></h2></Reveal>
            <Reveal delay={0.1}><p className="lead">Tell us a little about yourself and where you’d like to start a centre. Our team will reach out.</p></Reveal>
            <Reveal delay={0.15}>
              <div className="clay" style={{ "--c": "#FFC93C", marginTop: 26 }}>
                <p style={{ margin: "0 0 8px", fontWeight: 800 }}>📞 Call: <a className="link" href="tel:+917845741660">78457 41660</a></p>
                <p style={{ margin: 0, fontWeight: 800 }}>✉️ Mail: <a className="link" href="mailto:gainfo@sipacademyindia.com">gainfo@sipacademyindia.com</a></p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <MailForm to="gainfo@sipacademyindia.com" subject="Globalart franchise enquiry" submitLabel="Send my enquiry 🚀"
              success="Your email app has opened with your enquiry — just hit send. Our franchise team will be in touch soon."
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
