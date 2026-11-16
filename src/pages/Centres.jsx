import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero.jsx";
import { Reveal, useLocator, LocatorSelects, ALL_CENTRES, phonesOf, mapsLink, Arrow, SectionHead, Video } from "../components/ui/index.jsx";

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
      <PageHero img="art-class-india" crumb="Find a Centre" eyebrow={`${ALL_CENTRES.length} centres across India`} lines={["A Globalart studio,", "*close to home.*"]}
        lead="Pick your state, city and area to see the centres near you — then call, get directions or book a free trial." />

      <section className="section light" id="finder">
        <div className="container">
          <Reveal>
            <div className="form-panel">
              <form className="finder" onSubmit={(e) => e.preventDefault()}>
                <LocatorSelects loc={loc} placeholders={["All states", "All cities", "All areas"]} />
                <button type="button" className="btn btn--ghost" style={{ height: 56 }} onClick={() => { loc.setState(""); setQ(""); }}>Reset</button>
              </form>
              <div className="field" style={{ marginTop: 16 }}>
                <label htmlFor="q">Search</label>
                <input id="q" className="input" type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Type an area, road or pincode — e.g. Adyar, 560037" autoComplete="off" />
              </div>
            </div>
          </Reveal>

          <div className="flags" style={{ marginTop: 30 }}>
            <button className={`chip ${!loc.state ? "is-on" : ""}`} onClick={() => loc.setState("")}>All <em>{ALL_CENTRES.length}</em></button>
            {loc.states.map((s) => <button key={s.v} className={`chip ${loc.state === s.v ? "is-on" : ""}`} onClick={() => loc.setState(s.v)}>{s.v} <em>{s.n}</em></button>)}
          </div>

          <div className="row-between" style={{ margin: "60px 0 28px", alignItems: "baseline" }}>
            <h2 className="h2" style={{ fontSize: "clamp(32px,4vw,60px)" }} aria-live="polite">{where ? <>Centres in <em>{where}</em></> : "All Globalart centres"}</h2>
            <motion.span key={list.length} className="chip" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{list.length} centre{list.length === 1 ? "" : "s"}</motion.span>
          </div>

          {list.length === 0 ? (
            <div className="centre" style={{ textAlign: "center", padding: 50 }}><h3>No centres match that search</h3><p className="muted">Try another area, or <Link to="/contact" className="link">contact our team</Link> — we’ll help you find the nearest one.</p></div>
          ) : (
            <motion.div className="results" layout>
              <AnimatePresence mode="popLayout">
                {list.slice(0, shown).map((c, i) => {
                  const ph = phonesOf(c.phone);
                  const book = `/contact?state=${encodeURIComponent(c.state)}&city=${encodeURIComponent(c.city)}&area=${encodeURIComponent(c.area)}#book`;
                  return (
                    <motion.div key={`${c.state}-${c.city}-${c.area}-${c.address.slice(0, 12)}`} layout
                      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.7, delay: Math.min(i % PAGE, 11) * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="centre">
                        <span className="mono muted">{c.city} · {c.state}</span>
                        <h3>{c.area}</h3>
                        <p className="muted">{c.address}</p>
                        {c.contact && <p><b style={{ fontWeight: 500 }}>{c.contact}</b></p>}
                        <div className="centre__actions">
                          {ph[0] && <a className="btn btn--ghost btn--sm" href={`tel:${ph[0].replace(/[^\d+]/g, "")}`}>{ph[0]}</a>}
                          <a className="btn btn--ghost btn--sm" href={mapsLink(c)} target="_blank" rel="noopener">Directions</a>
                          <Link className="btn btn--sm" to={book}>Book trial <Arrow /></Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
          {list.length > shown && <div className="center" style={{ marginTop: 40 }}><button className="btn btn--lg" onClick={() => setShown((s) => s + PAGE)}>Show more centres</button></div>}
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead eyebrow="Head office" lines={["SIP Academy", "India Pvt. Ltd."]} />
            <Reveal><p className="lead">#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p></Reveal>
            <Reveal><p style={{ marginTop: 20 }}><a className="link" href="tel:04442023331">044-42023331</a> &nbsp;·&nbsp; <a className="link" href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a></p></Reveal>
          </div>
          <Link to="/franchise" className="vcard" data-cursor="Open" style={{ aspectRatio: "16/11" }}>
            <Video name="art-kids" />
            <div className="shade-b" />
            <div className="vcard__body">
              <p className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>No centre near you yet?</p>
              <h3 className="h2">Open one <em>yourself.</em></h3>
              <div className="btns" style={{ marginTop: 20 }}><span className="btn">Become a franchisee <Arrow /></span></div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
