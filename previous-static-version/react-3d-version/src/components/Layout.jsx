import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";
import { LINKS } from "../data/content.js";
import { Magnetic } from "./ui/index.jsx";

export const lenisRef = { current: null };

const NAV = [
  ["/", "Home"], ["/about", "About"], ["/courses", "Courses"], ["/centres", "Find a Centre"], ["/stories", "Stories"], ["/faq", "FAQs"], ["/contact", "Contact"],
];
const MOBILE = [...NAV.slice(0, 4), ["/franchise", "Franchise"], ...NAV.slice(4)];

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; };
  }, []);
}

export function Aurora() {
  return (<><div className="aurora" aria-hidden="true"><i /><i /><i /><i /></div><div className="noise" aria-hidden="true" /></>);
}

export function Cursor() {
  const x = useSpring(-100, { stiffness: 350, damping: 28 }), y = useSpring(-100, { stiffness: 350, damping: 28 });
  const dx = useSpring(-100, { stiffness: 1200, damping: 50 }), dy = useSpring(-100, { stiffness: 1200, damping: 50 });
  const s = useSpring(1, { stiffness: 300, damping: 20 });
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); dx.set(e.clientX); dy.set(e.clientY); };
    const o = (e) => s.set(e.target.closest("a,button,select,input,textarea,canvas,[data-hover]") ? 1.8 : 1);
    window.addEventListener("pointermove", m); document.addEventListener("pointerover", o);
    return () => { window.removeEventListener("pointermove", m); document.removeEventListener("pointerover", o); };
  }, [x, y, dx, dy, s]);
  return (<><motion.div className="cursor" style={{ x, y, scale: s }} /><motion.div className="cursor-dot" style={{ x: dx, y: dy }} /></>);
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const last = useRef(0);
  const { pathname } = useLocation();
  useMotionValueEvent(scrollY, "change", (y) => { setHidden(!open && y > last.current && y > 320); last.current = y; });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    open ? lenisRef.current?.stop() : lenisRef.current?.start();
  }, [open]);

  return (
    <>
      <div className="topline">
        <div className="container">
          <p className="topline__msg" style={{ margin: 0 }}>🎉 Celebrating 21 years of nurturing creativity in India · <a href={LINKS.kreativestar} target="_blank" rel="noopener">Kreative Star ’26 is live →</a></p>
          <div className="topline__links"><Link to="/franchise" style={{ color: "#FFD873" }}>Become a Franchisee</Link><a href={LINKS.login} target="_blank" rel="noopener">Login</a></div>
        </div>
      </div>
      <header className={`nav ${hidden ? "is-hidden" : ""}`}>
        <div className="container">
          <div className="nav__bar glass">
            <Link to="/" className="nav__logo" aria-label="Globalart home"><img src="/assets/globalart-abacus.png" alt="globalart — Think Creative" width="150" height="42" /></Link>
            <nav className="nav__links" aria-label="Main">
              {NAV.slice(1).map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
                  {({ isActive }) => (<>{isActive && <motion.span layoutId="navpill" className="nav__pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}{label}</>)}
                </NavLink>
              ))}
            </nav>
            <div className="nav__cta">
              <Link to="/franchise" className="btn btn--glass btn--sm hide-md">🤝 Franchise</Link>
              <Magnetic><Link to="/contact#book" className="btn btn--sm">✏️ Free Trial</Link></Magnetic>
              <button className={`burger ${open ? "open" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mmenu" initial={{ opacity: 0, clipPath: "circle(0% at 92% 6%)" }} animate={{ opacity: 1, clipPath: "circle(150% at 92% 6%)" }} exit={{ opacity: 0, clipPath: "circle(0% at 92% 6%)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            {MOBILE.map(([to, label], i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 40, rotateX: -50 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }}>
                <NavLink to={to} end={to === "/"} className={({ isActive }) => `mlink ${isActive ? "active" : ""}`}>{label}</NavLink>
              </motion.div>
            ))}
            <div className="btns" style={{ marginTop: 24 }}>
              <Link to="/contact#book" className="btn btn--lg">✏️ Book a Free Trial</Link>
              <a href="tel:04442023331" className="btn btn--neu btn--lg">📞 044-42023331</a>
            </div>
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
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));
  return (
    <AnimatePresence>
      {show && pathname !== "/contact" && (
        <motion.div className="fab" initial={{ y: 120, rotate: -10 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 120 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          <Link to="/contact#book" className="btn btn--lg">🎨 Free Trial Class</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageShell({ children }) {
  return (
    <>
      <motion.div className="curtain" initial={{ scaleY: 1, transformOrigin: "top" }} animate={{ scaleY: 0, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }}
        exit={{ scaleY: 1, transformOrigin: "bottom", transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }} />
      <motion.main id="main" initial={{ opacity: 0, y: 60, rotateX: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 } }}
        exit={{ opacity: 0, y: -40, scale: 0.97, transition: { duration: 0.4 } }} style={{ transformPerspective: 1400, transformOrigin: "50% 0" }}>
        {children}
      </motion.main>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__logo"><img src="/assets/globalart-abacus.png" alt="globalart" width="150" height="42" /></Link>
            <p>Using art & drawing to grow creativity, confidence and concentration in children aged 5–15 — since 1999.</p>
            <p>A unit of SIP Academy India Pvt. Ltd.<br />#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p>
            <div className="socials">
              <a href={LINKS.facebook} target="_blank" rel="noopener" aria-label="Facebook"><img src="/assets/fb.svg" alt="" /></a>
              <a href={LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram"><img src="/assets/in.svg" alt="" /></a>
              <a href={LINKS.youtube} target="_blank" rel="noopener" aria-label="YouTube"><img src="/assets/yt.svg" alt="" /></a>
              <a href={LINKS.twitter} target="_blank" rel="noopener" aria-label="Twitter / X"><img src="/assets/tw.svg" alt="" /></a>
            </div>
          </div>
          <div><h4>Explore</h4><nav><Link to="/about">About Globalart</Link><Link to="/courses">Courses & Levels</Link><Link to="/stories">Parent Stories</Link><Link to="/faq">FAQs</Link><a href={LINKS.gallery} target="_blank" rel="noopener">Gallery</a></nav></div>
          <div><h4>Join us</h4><nav><Link to="/contact#book">Book a Free Trial</Link><Link to="/centres">Find a Centre</Link><Link to="/franchise">Become a Franchisee</Link><a href={LINKS.kreativestar} target="_blank" rel="noopener">Kreative Star ’26</a><a href={LINKS.login} target="_blank" rel="noopener">Login</a></nav></div>
          <div><h4>Say hello</h4><nav><a href="tel:04442023331">044-42023331</a><a href="tel:04442605609">044-42605609</a><a href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a><a href="tel:+917845741660">Franchise: 78457 41660</a></nav>
            <a href={LINKS.sip} target="_blank" rel="noopener" style={{ display: "inline-block", marginTop: 16, background: "#fff", padding: "6px 10px", borderRadius: 12 }}><img src="/assets/sip-academy-logo1.png" alt="SIP Academy" width="104" height="36" /></a>
          </div>
        </div>
        <div className="footer__giant grad-text">think creative</div>
        <div className="footer__bottom"><span>© 2026 SIP Academy India Pvt. Ltd. All rights reserved.</span><a href={LINKS.privacy} target="_blank" rel="noopener">Privacy Policy</a></div>
      </div>
    </footer>
  );
}
