import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { PlaneScene } from "../components/three/Scenes.jsx";
import MailForm from "../components/MailForm.jsx";
import { Reveal, Stagger, item, TiltCard, useLocator, LocatorSelects, phonesOf } from "../components/ui/index.jsx";
import { OFFICES } from "../data/content.js";

const C = ["#0095DA", "#FF5CA8", "#2ED3A4", "#7C5CFF", "#FFC93C", "#FF8A5B"];

export default function Contact() {
  const [params] = useSearchParams();
  const loc = useLocator({ state: params.get("state"), city: params.get("city"), area: params.get("area") });
  const chosen = loc.area ? loc.matches : [];

  const centreBox = (
    <>
      <p style={{ margin: "6px 0 -4px", fontFamily: "var(--f-display)", fontWeight: 600, letterSpacing: "-.02em" }}>📍 Choose your preferred centre</p>
      <div className="row3"><LocatorSelects loc={loc} labels={false} placeholders={["State", "City", "Area"]} required /></div>
      <AnimatePresence>
        {chosen.length > 0 && (
          <motion.div initial={{ opacity: 0, rotateX: -60, height: 0 }} animate={{ opacity: 1, rotateX: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ transformPerspective: 800 }}>
            {chosen.map((c) => (
              <div key={c.address} className="clay" style={{ "--c": "#2ED3A4", padding: "16px 20px", borderRadius: 22, marginBottom: 8 }}>
                <b style={{ fontFamily: "var(--f-display)", letterSpacing: "-.02em" }}>🎨 Globalart {c.area}</b>
                <p style={{ margin: "4px 0 0", fontSize: 15 }}>{c.address}</p>
                {phonesOf(c.phone)[0] && <a className="link" href={`tel:${phonesOf(c.phone)[0].replace(/[^\d+]/g, "")}`}>📞 {c.phone}</a>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <PageHero crumb="Contact" eyebrow="It’s free!" icon="✏️" title="Let’s meet your little artist" gradientWords={[3, 4]}
        lead="Book a free trial class at your nearest centre, or reach our friendly team directly." scene={<PlaneScene />} />

      <section className="section--tight" id="book" style={{ paddingTop: 0, scrollMarginTop: 110 }}>
        <div className="container split" style={{ alignItems: "start" }}>
          <Reveal>
            <div>
              <h2 className="h2" style={{ marginBottom: 20 }}>Book a <span className="grad-text">free trial</span> class</h2>
              <MailForm to="sipinfo@sipacademyindia.com" subject="Globalart free trial class booking" submitLabel="Book my free class 🎨"
                success="Your email app has opened with the booking details — just hit send. The centre will call you to fix a time."
                fields={[
                  [{ name: "Parent name", label: "Parent name", required: true, autoComplete: "name" }, { name: "Mobile", label: "Mobile", type: "tel", required: true, pattern: "[0-9+ ]{10,14}" }],
                  [{ name: "Child name", label: "Child name", required: true }, { name: "Child age", label: "Child age", options: ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], required: true }],
                  { name: "Email", label: "Email", type: "email" },
                ]}
                footer={centreBox}
                extraLines={() => chosen.flatMap((c) => [`Centre: Globalart ${c.area}, ${c.city}`, `Address: ${c.address}`, c.phone ? `Centre phone: ${c.phone}` : ""])}
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <TiltCard className="clay clay--solid" max={6} style={{ "--c": "#7C5CFF", marginBottom: 22 }}>
                <div className="pop">
                  <span className="chip" style={{ color: "var(--ink)" }}>🏢 Head Office</span>
                  <h3 className="h3" style={{ marginTop: 12 }}>SIP Academy India Pvt. Ltd</h3>
                  <p style={{ margin: "0 0 10px", opacity: 0.92 }}>#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p>
                  <p style={{ margin: 0, fontWeight: 800 }}><a href="tel:04442023331">044-42023331</a> / <a href="tel:04442605609">42605609</a><br /><a href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a></p>
                </div>
              </TiltCard>
            </Reveal>
            <Stagger className="grid g2">
              {OFFICES.map((o, i) => (
                <motion.div key={o.name} variants={item}>
                  <TiltCard className="glass pad" max={8} style={{ height: "100%", borderTop: `5px solid ${C[i]}` }}>
                    <span className="chip">{o.tag}</span>
                    <h3 style={{ fontSize: 18, margin: "12px 0 4px" }}>{o.name}</h3>
                    <p className="muted" style={{ margin: "0 0 8px", fontSize: 14 }}>{o.role}{o.addr ? <><br />{o.addr}</> : null}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800 }}><a className="link" href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a><br /><a href={`mailto:${o.email}`} style={{ color: "var(--violet)", wordBreak: "break-all" }}>{o.email}</a></p>
                  </TiltCard>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
