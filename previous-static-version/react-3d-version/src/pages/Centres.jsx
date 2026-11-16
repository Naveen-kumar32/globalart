import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { PinScene } from "../components/three/Scenes.jsx";
import { Reveal, useLocator, LocatorSelects, ALL_CENTRES, phonesOf, mapsLink, TiltCard } from "../components/ui/index.jsx";

const TINTS = ["#0095DA", "#FF5CA8", "#2ED3A4", "#7C5CFF", "#FFC93C", "#FF8A5B"];
const PAGE = 12;

export default function Centres() {
  const [params, setParams] = useSearchParams();
  const loc = useLocator({ state: params.get("state"), city: params.get("city"), area: params.get("area") });
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const p = {};
    if (loc.state) p.state = loc.state;
    if (loc.city) p.city = loc.city;
    if (loc.area) p.area = loc.area;
    setParams(p, { replace: true });
    setShown(PAGE);
  }, [loc.state, loc.city, loc.area]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return loc.matches.filter((c) => !s || `${c.area} ${c.address} ${c.city} ${c.state} ${c.contact}`.toLowerCase().includes(s));
  }, [loc.matches, q]);

  const where = loc.area ? `${loc.area}, ${loc.city}` : loc.city ? `${loc.city}, ${loc.state}` : loc.state || (q ? `“${q}”` : "");

  return (
    <>
      <PageHero crumb="Find a Centre" eyebrow={`${ALL_CENTRES.length} centres across India`} icon="📍" title="Find a Globalart centre near you" gradientWords={[4, 5]}
        lead="Pick your state, city and area to see centres close to home — then call them, get directions or book a free trial." scene={<PinScene />} />

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="glass pad" style={{ borderRadius: 36 }}>
              <form className="locator" onSubmit={(e) => e.preventDefault()}>
                <LocatorSelects loc={loc} placeholders={["All States", "All Cities", "All Areas"]} />
                <button type="button" className="btn btn--neu" onClick={() => { loc.setState(""); setQ(""); }}>↺ Reset</button>
              </form>
              <div className="field" style={{ marginTop: 16 }}>
                <label htmlFor="q" className="sr-only">Search</label>
                <input id="q" className="input" type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="🔎 …or type an area, road or pincode (e.g. Adyar, 560037)" autoComplete="off" />
              </div>
            </div>
          </Reveal>

          <div className="flags" style={{ marginTop: 26 }}>
            <button className={`chip chip--neu ${!loc.state ? "is-on" : ""}`} onClick={() => loc.setState("")}>🌏 All <em>{ALL_CENTRES.length}</em></button>
            {loc.states.map((s) => <button key={s.v} className={`chip chip--neu ${loc.state === s.v ? "is-on" : ""}`} onClick={() => loc.setState(s.v)}>{s.v} <em>{s.n}</em></button>)}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, margin: "50px 0 24px" }}>
            <h2 className="h3" style={{ margin: 0, fontSize: "clamp(24px,2.6vw,36px)" }} aria-live="polite">{where ? <>Centres in <span className="grad-text">{where}</span></> : "All Globalart centres"}</h2>
            <span className="chip chip--neu">{list.length} centre{list.length === 1 ? "" : "s"}</span>
          </div>

          {list.length === 0 ? (
            <div className="neu-panel center"><div style={{ fontSize: 70 }}>🔍</div><h3 className="h3">No centres match that search</h3><p>Try another area, or <Link to="/contact" className="link">contact our team</Link> — we’ll help you find the nearest one.</p></div>
          ) : (
            <motion.div className="results" layout>
              <AnimatePresence mode="popLayout">
                {list.slice(0, shown).map((c, i) => {
                  const ph = phonesOf(c.phone);
                  const tint = TINTS[i % TINTS.length];
                  const book = `/contact?state=${encodeURIComponent(c.state)}&city=${encodeURIComponent(c.city)}&area=${encodeURIComponent(c.area)}#book`;
                  return (
                    <motion.div key={`${c.state}-${c.city}-${c.area}-${c.address.slice(0, 12)}`} layout initial={{ opacity: 0, y: 50, rotateX: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.85, rotateX: 20, transition: { duration: 0.25, delay: 0 } }}
                      transition={{ duration: 0.55, delay: Math.min(i % PAGE, 11) * 0.035, ease: [0.22, 1, 0.36, 1] }} style={{ transformPerspective: 1000 }}>
                      <TiltCard className="glass pad centre" max={7} style={{ height: "100%", borderTop: `5px solid ${tint}` }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span className="chip">📍 {c.city}</span><span className="chip">{c.state}</span></div>
                        <h3>{c.area}</h3>
                        <p className="muted">{c.address}</p>
                        {c.contact && <p style={{ fontWeight: 800 }}>👩‍🏫 {c.contact}</p>}
                        <div className="centre__actions">
                          {ph[0] && <a className="btn btn--neu btn--sm" href={`tel:${ph[0].replace(/[^\d+]/g, "")}`}>📞 {ph[0]}</a>}
                          <a className="btn btn--neu btn--sm" href={mapsLink(c)} target="_blank" rel="noopener">🗺️ Directions</a>
                          <Link className="btn btn--sm" to={book}>✏️ Book trial</Link>
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
          {list.length > shown && <div className="center" style={{ marginTop: 34 }}><button className="btn btn--blue" onClick={() => setShown((s) => s + PAGE)}>Show more centres ↓</button></div>}
        </div>
      </section>

      <section className="section--tight">
        <div className="container grid g2">
          <Reveal><div className="clay" style={{ "--c": "#FFC93C", height: "100%" }}><h3 className="h3">🏢 Head Office</h3><p style={{ margin: "0 0 10px" }}><b>SIP Academy India Pvt. Ltd.</b><br />#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p><p style={{ margin: 0 }}><a className="link" href="tel:04442023331">044-42023331</a> &nbsp; <a className="link" href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a></p></div></Reveal>
          <Reveal delay={0.1}><div className="clay" style={{ "--c": "#FF5CA8", height: "100%" }}><h3 className="h3">🤔 No centre near you yet?</h3><p>Bring Globalart to your neighbourhood — become a franchisee and start your own creative centre.</p><Link to="/franchise" className="btn">Become a Franchisee →</Link></div></Reveal>
        </div>
      </section>
    </>
  );
}
