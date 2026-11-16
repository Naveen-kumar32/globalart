import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FilmHero, Lines } from "./ui/index.jsx";

/** Shared inner-page hero: full-bleed film, masked headline, breadcrumb. */
export default function PageHero({ video, crumb, eyebrow, lines, lead, children, scene = "Scene 02" }) {
  return (
    <FilmHero video={video} className="phero" scene={scene} place={crumb}>
      <motion.div className="crumb mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <Link to="/">Globalart</Link><span>/</span><span style={{ color: "#fff" }}>{crumb}</span>
      </motion.div>
      {eyebrow && <motion.p className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>{eyebrow}</motion.p>}
      <Lines lines={lines} className="h1" delay={1.1} />
      {(lead || children) && (
        <motion.div className="hero__meta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }}>
          {lead && <p>{lead}</p>}
          {children}
        </motion.div>
      )}
    </FilmHero>
  );
}
