import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import MailForm from "../components/MailForm.jsx";
import { Reveal, Stagger, item, Tilt, useLocator, LocatorSelects, phonesOf, SectionHead } from "../components/ui/index.jsx";
import { OFFICES } from "../data/content.js";

export default function Contact() {
  const [params] = useSearchParams();
  const loc = useLocator({ state: params.get("state"), city: params.get("city"), area: params.get("area") });
  const chosen = loc.area ? loc.matches : [];

  const centreBox = (
    <>
      <div className="field"><label>Preferred centre *</label></div>
      <div className="row3" style={{ marginTop: -8 }}><LocatorSelects loc={loc} labels={false} placeholders={["State", "City", "Area"]} required /></div>
      <AnimatePresence>
        {chosen.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            {chosen.map((c) => (
              <div key={c.address} style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                <b className="serif" style={{ fontSize: 24 }}>Globalart {c.area}</b>
                <p className="muted" style={{ margin: "4px 0", fontSize: 15 }}>{c.address}</p>
                {phonesOf(c.phone)[0] && <a className="link" style={{ fontSize: 15 }} href={`tel:${phonesOf(c.phone)[0].replace(/[^\d+]/g, "")}`}>{c.phone}</a>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <PageHero video="lehenga-girl" crumb="Contact" eyebrow="It’s free" lines={["Let’s meet your", "*little artist.*"]}
        lead="Book a free trial class at your nearest centre, or reach our team directly." />

      <section className="section light" id="book" style={{ scrollMarginTop: 0 }}>
        <div className="container split" style={{ alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <SectionHead eyebrow="Free trial class" lines={["Book a", "*trial class.*"]} lead="Tell us about your child and choose a centre. The centre will call you to fix a convenient time." />
            <Reveal>
              <div className="stats" style={{ marginTop: 50, gridTemplateColumns: "1fr 1fr" }}>
                <div className="stat"><b>2 hrs</b><span>per weekly class</span></div>
                <div className="stat"><b>5–15</b><span>years of age</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <MailForm to="sipinfo@sipacademyindia.com" subject="Globalart free trial class booking" submitLabel="Book my free class"
              success="Your email app has opened with the booking details — just press send. The centre will call you to fix a time."
              fields={[
                [{ name: "Parent name", label: "Parent name", required: true, autoComplete: "name" }, { name: "Mobile", label: "Mobile", type: "tel", required: true, pattern: "[0-9+ ]{10,14}" }],
                [{ name: "Child name", label: "Child name", required: true }, { name: "Child age", label: "Child age", options: ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], required: true }],
                { name: "Email", label: "Email", type: "email" },
              ]}
              footer={centreBox}
              extraLines={() => chosen.flatMap((c) => [`Centre: Globalart ${c.area}, ${c.city}`, `Address: ${c.address}`, c.phone ? `Centre phone: ${c.phone}` : ""])}
            />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row-between">
            <SectionHead eyebrow="Our team" lines={["Talk to a", "*real person.*"]} lead="Our regional heads are happy to help — with centres, classes or starting a franchise in your area." />
            <Reveal className="glass pad" style={{ maxWidth: 420 }}>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Head office</p>
              <h3 className="h3" style={{ fontSize: 24 }}>SIP Academy India Pvt. Ltd</h3>
              <p className="muted" style={{ fontSize: 15 }}>#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p>
              <p style={{ margin: 0, fontSize: 15 }}><a className="link" href="tel:04442023331">044-42023331</a> / <a className="link" href="tel:04442605609">42605609</a><br /><a className="link" href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a></p>
            </Reveal>
          </div>
          <Stagger className="grid g3" style={{ marginTop: 60 }}>
            {OFFICES.map((o) => (
              <motion.div key={o.name} variants={item}>
                <Tilt className="glass pad member" style={{ height: "100%" }}>
                  <div className="member__head">
                    <img className="member__photo" src={o.photo} alt={o.name} width="88" height="88" loading="lazy" />
                    <div>
                      <span className="member__tag">{o.tag}</span>
                      <h3 className="member__name">{o.name}</h3>
                      <p className="member__role">{o.role}</p>
                    </div>
                  </div>
                  {o.addr && <p className="muted" style={{ margin: "18px 0 0", fontSize: 14 }}>{o.addr}</p>}
                  <div className="member__contact">
                    <a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a>
                    <a href={`mailto:${o.email}`}>{o.email}</a>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
