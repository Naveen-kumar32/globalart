import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Grain, Navbar, Footer, Fab, ScrollProgress, PageShell, useSmoothScroll, lenisRef, PAGE_NAMES } from "./components/Layout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Courses = lazy(() => import("./pages/Courses.jsx"));
const Centres = lazy(() => import("./pages/Centres.jsx"));
const Franchise = lazy(() => import("./pages/Franchise.jsx"));
const Stories = lazy(() => import("./pages/Stories.jsx"));
const Faq = lazy(() => import("./pages/Faq.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

const TITLES = {
  "/": "Globalart India — Art & Creativity Classes for Kids 5–15 | Think Creative",
  "/about": "About Globalart — Our Story, Global Presence & Endorsements",
  "/courses": "Globalart Courses — 13 Levels of Art & Creativity for Ages 5–15",
  "/centres": "Find a Globalart Centre Near You",
  "/franchise": "Become a Globalart Franchisee",
  "/stories": "Parent Stories — Globalart",
  "/faq": "FAQs — Globalart",
  "/contact": "Contact Globalart & Book a Free Trial Class",
};

function ScrollToHash() {
  const { hash, pathname } = useLocation();
  const prev = useRef(pathname);
  useEffect(() => {
    document.title = TITLES[pathname] || TITLES["/"];
    const samePage = prev.current === pathname;
    prev.current = pathname;
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -110, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
    }, samePage ? 30 : 1300);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  useSmoothScroll();
  const resetScroll = () => { lenisRef.current ? lenisRef.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0); };
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <ScrollToHash />
      <AnimatePresence mode="wait" onExitComplete={resetScroll}>
        <PageShell key={location.pathname} name={PAGE_NAMES[location.pathname] || "Globalart"}>
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#000" }} />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/centres" element={<Centres />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
          <Footer />
        </PageShell>
      </AnimatePresence>
      <Fab />
      <Grain />
    </>
  );
}
