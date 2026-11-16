import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FilmHero, Lines, Reveal, Stagger, item, ScrollLit, StoryScroller, ExpandFilm, Reel, Video, ParallaxMedia,
  QuoteSlider, Counter, Magnetic, Marquee, Arrow, SectionHead, Tilt, useLocator, LocatorSelects, ALL_CENTRES,
} from "../components/ui/index.jsx";
import { STATS, BENEFITS, COURSES, TESTIMONIALS, COURSE_FILMS } from "../data/content.js";

const CHAPTERS = [
  { video: "petals-girl", tag: "Observe", title: <>Look <em>closer.</em></>, text: "Children learn to notice light, shape and colour in the world around them — the first step to drawing anything." },
  { video: "boy-drawing", tag: "Imagine", title: <>Dream it <em>first.</em></>, text: "Every artwork starts as an idea in the child’s own head. We ask questions — we never hand out templates to copy." },
  { video: "art-class", tag: "Create", title: <>Make it <em>real.</em></>, text: "Step-by-step techniques — shapes, composition, mixing colours — turn that idea into a picture they’re proud of." },
  { video: "festive-girl", tag: "Express", title: <>Share it <em>proudly.</em></>, text: "Confidence grows with every finished piece: in class, in school projects, on stage and in competitions." },
];


function Hero() {
  return (
    <FilmHero video="rangoli-girl" scene="Scene 01" place="The art class">
      <motion.p className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>Art & creativity programme · Ages 5–15</motion.p>
      <Lines lines={["Every child", "is an *artist.*"]} className="display" delay={1.2} />
      <motion.div className="hero__meta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9, duration: 1 }}>
        <p>Globalart’s 13-level programme grows imagination, focus and confidence — one brushstroke at a time. {ALL_CENTRES.length} centres across India, 650+ worldwide.</p>
        <div className="btns" style={{ margin: 0 }}>
          <Magnetic><Link to="/contact#book" className="btn btn--lg">Book a free trial <Arrow /></Link></Magnetic>
          <Link to="/centres" className="btn btn--ghost btn--lg">Find a centre</Link>
        </div>
        <span className="scrollcue mono hide-sm"><i />Scroll</span>
      </motion.div>
    </FilmHero>
  );
}

function Intro() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Since 1999 · 22 countries</p>
        <ScrollLit text="Globalart doesn’t teach children to *copy.* We teach them to *see,* to *imagine* and to *create* something that is entirely their own — and the confidence that comes with it shows up everywhere: in school, on stage and in life." />
        <div className="stats" style={{ marginTop: "clamp(60px,9vw,130px)" }}>
          {STATS.map((s) => <Reveal key={s.label} className="stat"><Counter to={s.value} suffix={s.suffix} indian={s.indian} /><span>{s.label}</span></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <Reel head={<div className="row-between"><SectionHead eyebrow="The programme" lines={["Five stages.", "*Thirteen* levels."]} /><Link to="/courses" className="btn btn--ghost">All course details <Arrow /></Link></div>}>
      {COURSES.map((c, i) => (
        <Link to={`/courses#${c.id}`} key={c.id} className="reel__card" data-cursor="View">
          <Video name={COURSE_FILMS[c.id]} hoverPlay />
          <div className="shade-b" />
          <div className="reel__body">
            <div className="reel__head mono"><span>Stage 0{i + 1}</span><span>{c.levelsCount} level{c.levelsCount > 1 ? "s" : ""}</span></div>
            <div>
              <span className="mono" style={{ color: "var(--accent)" }}>{c.age}</span>
              <h3 className="h2" style={{ marginTop: 10 }}>{c.name}</h3>
              <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,.8)", fontSize: 15 }}>{c.lead}</p>
            </div>
          </div>
        </Link>
      ))}
      <Link to="/courses#gclay" className="reel__card" data-cursor="View">
        <Video name="clay" hoverPlay />
        <div className="shade-b" />
        <div className="reel__body">
          <div className="reel__head mono"><span>New</span><span>GClay</span></div>
          <div><span className="mono" style={{ color: "var(--accent)" }}>Clay modelling</span><h3 className="h2" style={{ marginTop: 10 }}>Think in <em>3D</em></h3></div>
        </div>
      </Link>
    </Reel>
  );
}

function Benefits() {
  return (
    <section className="film-bg">
      <div className="film-bg__stick"><Video name="color-mix" className="fill" /></div>
      <div className="section" style={{ position: "relative" }}>
        <div className="container">
          <SectionHead eyebrow="Why parents choose us" lines={["What art", "*grows* in a child."]} lead="Proven over 21 years in India: Globalart builds abilities that last well beyond the art room." />
          <Stagger className="grid g3" style={{ marginTop: 70 }}>
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} variants={item}>
                <Tilt className="glass pad benefit" style={{ height: "100%" }}>
                  <span className="n">({String(i + 1).padStart(2, "0")})</span>
                  <div><h3>{b.title}</h3><p>{b.text}</p></div>
                </Tilt>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Finder() {
  const loc = useLocator();
  const nav = useNavigate();
  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (loc.state) p.set("state", loc.state);
    if (loc.city) p.set("city", loc.city);
    if (loc.area) p.set("area", loc.area);
    nav(`/centres${p.toString() ? "?" + p : ""}`);
  };
  return (
    <section className="section light" style={{ borderRadius: "40px 40px 0 0" }}>
      <div className="container split">
        <div>
          <SectionHead eyebrow={`${ALL_CENTRES.length} centres across India`} lines={["A studio", "*near you.*"]} lead="Choose your state, city and area to see the Globalart centres closest to home — with phone numbers and directions." />
          <form className="form" onSubmit={go} style={{ marginTop: 40 }}>
            <div className="row3"><LocatorSelects loc={loc} /></div>
            <div className="row-between" style={{ alignItems: "center" }}>
              <motion.span key={loc.matches.length} className="serif" style={{ fontSize: 28 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {loc.matches.length} centre{loc.matches.length === 1 ? "" : "s"} {loc.city ? `in ${loc.area || loc.city}` : loc.state ? `in ${loc.state}` : "nationwide"}
              </motion.span>
              <button className="btn btn--lg" type="submit">Show centres <Arrow /></button>
            </div>
          </form>
        </div>
        <ParallaxMedia video="yellow-boy" ratio="4/3" radius="20px" />
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="section" style={{ overflow: "hidden" }}>
      <div className="container split" style={{ alignItems: "start" }}>
        <div>
          <p className="eyebrow">Parents talk</p>
          <QuoteSlider quotes={TESTIMONIALS} />
          <div className="btns"><Link to="/stories" className="btn btn--ghost">More stories <Arrow /></Link></div>
        </div>
        <ParallaxMedia video="school-boys" ratio="4/3" radius="20px">
          <div className="shade-b" />
          <div className="vcard__body"><span className="mono" style={{ color: "rgba(255,255,255,.8)" }}>275,000+ children since 2005</span></div>
        </ParallaxMedia>
      </div>
    </section>
  );
}

function Franchise() {
  return (
    <section className="section--tight">
      <div className="container">
        <Link to="/franchise" className="vcard" data-cursor="Open" style={{ height: "min(56vh, 500px)", display: "block" }}>
          <Video name="art-kids" />
          <div className="shade-b" /><div className="vignette" />
          <div className="vcard__body" style={{ padding: "clamp(24px,4vw,56px)" }}>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>Become a franchisee</p>
            <Lines lines={["Bring Globalart", "to *your city.*"]} as="h2" className="h2" inView />
            <div className="btns"><span className="btn btn--lg">Start the conversation <Arrow /></span></div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Marquee items={["Observe", "Imagine", "Create", "Express", "Think creative"]} />
      <StoryScroller chapters={CHAPTERS} />
      <Courses />
      <ExpandFilm video="colour-powder" top="Create," bottom="don’t copy."
        caption={<div className="row-between"><p className="lead" style={{ color: "rgba(255,255,255,.88)", margin: 0 }}>Every Globalart artwork is uniquely the child’s own. A structured syllabus to international standards, small batches and trained, child-friendly teachers make it possible.</p><Link to="/about" className="btn">Our story <Arrow /></Link></div>} />
      <Benefits />
      <Finder />
      <Voices />
      <Franchise />
    </>
  );
}
