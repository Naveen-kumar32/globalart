import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";
import { LINKS } from "../data/content.js";
import { Magnetic, Arrow, Lines } from "./ui/index.jsx";

export const lenisRef = { current: null };

export const NAV = [
  ["/", "Home"], ["/about", "About"], ["/courses", "Courses"], ["/centres", "Find a Centre"], ["/franchise", "Franchise"], ["/stories", "Stories"], ["/faq", "FAQs"], ["/contact", "Contact"],
];
export const PAGE_NAMES = { ...Object.fromEntries(NAV), "/login": "Staff sign in", "/admin": "Staff access", "/staff": "Staff portal" };

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; };
  }, []);
}

export function Grain() { return <div className="grain" aria-hidden="true" />; }

/** Ring cursor; shows a word (e.g. “Play”, “View”) over elements with data-cursor. */
export function Cursor() {
  const x = useSpring(-100, { stiffness: 300, damping: 28 }), y = useSpring(-100, { stiffness: 300, damping: 28 });
  const dx = useSpring(-100, { stiffness: 1400, damping: 60 }), dy = useSpring(-100, { stiffness: 1400, damping: 60 });
  const s = useSpring(1, { stiffness: 300, damping: 22 });
  const [label, setLabel] = useState("");
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); dx.set(e.clientX); dy.set(e.clientY); };
    const o = (e) => {
      const l = e.target.closest("[data-cursor]");
      setLabel(l ? l.dataset.cursor : "");
      s.set(l ? 2.1 : e.target.closest("a,button,select,input,textarea") ? 1.6 : 1);
    };
    window.addEventListener("pointermove", m); document.addEventListener("pointerover", o);
    return () => { window.removeEventListener("pointermove", m); document.removeEventListener("pointerover", o); };
  }, [x, y, dx, dy, s]);
  return (
    <>
      <motion.div className={`cursor ${label ? "has-label" : ""}`} style={{ x, y, scale: s }}>
        <AnimatePresence>{label && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 0.5 }} exit={{ opacity: 0 }}>{label}</motion.span>}</AnimatePresence>
      </motion.div>
      {!label && <motion.div className="cursor-dot" style={{ x: dx, y: dy }} />}
    </>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  const last = useRef(0);
  const { pathname } = useLocation();
  useMotionValueEvent(scrollY, "change", (y) => { setHidden(!open && y > last.current && y > 400); setSolid(y > 60); last.current = y; });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    open ? lenisRef.current?.stop() : lenisRef.current?.start();
  }, [open]);

  return (
    <>
      <motion.header className={`nav ${hidden ? "is-hidden" : ""} ${solid || open ? "is-solid" : ""}`} initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <div className="container">
          <div className="nav__bar">
            <Link to="/" className="nav__logo" aria-label="Globalart home"><img src="/assets/globalart-abacus.png" alt="globalart — Think Creative" width="150" height="42" /></Link>
            <nav className="nav__links" aria-label="Main">
              {NAV.slice(1).map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
                  {({ isActive }) => (<>{isActive && <motion.span layoutId="navpill" className="nav__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}{label}</>)}
                </NavLink>
              ))}
            </nav>
            <div className="nav__cta">
              <Link to="/login" className="nav__login">Login</Link>
              <span className="hide-sm"><Magnetic><Link to="/contact#book" className="btn btn--sm">Book a free trial <Arrow /></Link></Magnetic></span>
              <button className={`burger ${open ? "open" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
            </div>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="mmenu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
            {NAV.map(([to, label], i) => (
              <div key={to} style={{ overflow: "hidden" }}>
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <NavLink to={to} end={to === "/"} className={({ isActive }) => `mlink ${isActive ? "active" : ""}`}><small>0{i + 1}</small>{label}</NavLink>
                </motion.div>
              </div>
            ))}
            <motion.div className="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <Link to="/contact#book" className="btn btn--lg">Book a free trial <Arrow /></Link>
              <Link to="/login" className="btn btn--ghost btn--lg">Staff login</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Fab() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 900));
  return (
    <AnimatePresence>
      {show && !["/contact", "/login", "/admin", "/staff"].includes(pathname) && (
        <motion.div className="fab" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <Link to="/contact#book" className="btn">Free trial class <Arrow /></Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Black film curtain with the page name, then the page fades in from soft focus. */
export function PageShell({ children, name }) {
  return (
    <>
      <motion.div className="curtain" initial={{ clipPath: "inset(0 0 0% 0)" }} animate={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.55 } }}
        exit={{ clipPath: ["inset(100% 0 0% 0)", "inset(0% 0 0% 0)"], transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}>
        <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -30], transition: { duration: 1.3, times: [0, 0.3, 0.6, 1] } }}>{name}</motion.span>
      </motion.div>
      <motion.main id="main" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.5 } }} exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.3 } }}>
        {children}
      </motion.main>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <div>
            <p className="eyebrow">Free trial class · Ages 5–15</p>
            <Lines lines={["Every child has", "a *story* to draw."]} as="h2" className="h2" inView />
          </div>
          <div className="btns" style={{ margin: 0 }}>
            <Magnetic><Link to="/contact#book" className="btn btn--lg">Book a free trial <Arrow /></Link></Magnetic>
            <Link to="/centres" className="btn btn--ghost btn--lg">Find a centre</Link>
          </div>
        </div>
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__logo"><img src="/assets/globalart-abacus.png" alt="globalart" width="150" height="42" /></Link>
            <p>Using art and drawing to grow creativity, confidence and concentration in children aged 5–15 — since 1999.</p>
            <p>A unit of SIP Academy India Pvt. Ltd.<br />#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p>
            <div className="socials">
              <a href={LINKS.facebook} target="_blank" rel="noopener" aria-label="Facebook"><img src="/assets/fb.svg" alt="" /></a>
              <a href={LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram"><img src="/assets/in.svg" alt="" /></a>
              <a href={LINKS.youtube} target="_blank" rel="noopener" aria-label="YouTube"><img src="/assets/yt.svg" alt="" /></a>
              <a href={LINKS.twitter} target="_blank" rel="noopener" aria-label="Twitter / X"><img src="/assets/tw.svg" alt="" /></a>
            </div>
          </div>
          <div><h4>Explore</h4><nav><Link to="/about">About Globalart</Link><Link to="/courses">Courses & levels</Link><Link to="/stories">Parent stories</Link><Link to="/faq">FAQs</Link><a href={LINKS.gallery} target="_blank" rel="noopener">Gallery</a></nav></div>
          <div><h4>Join us</h4><nav><Link to="/contact#book">Book a free trial</Link><Link to="/centres">Find a centre</Link><Link to="/franchise">Become a franchisee</Link><a href={LINKS.kreativestar} target="_blank" rel="noopener">Kreative Star ’26</a><Link to="/login">Staff login</Link></nav></div>
          <div><h4>Say hello</h4><nav><a href="tel:04442023331">044-42023331</a><a href="tel:04442605609">044-42605609</a><a href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a><a href="tel:+917845741660">Franchise: 78457 41660</a></nav></div>
        </div>
        <div className="footer__giant">think <em>creative</em></div>
        <div className="footer__bottom"><span>© 2026 SIP Academy India Pvt. Ltd. All rights reserved.</span><a href={LINKS.privacy} target="_blank" rel="noopener">Privacy Policy</a></div>
      </div>
    </footer>
  );
}
