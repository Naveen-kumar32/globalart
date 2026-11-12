import { Link } from "react-router-dom";
import { Reveal, SplitHeading } from "./ui/index.jsx";

export default function PageHero({ crumb, eyebrow, icon = "✦", title, gradientWords = [], lead, scene, children }) {
  return (
    <section className="phero">
      <div className="phero__3d">{scene}</div>
      <div className="container phero__grid">
        <div>
          <Reveal><p className="crumbs"><Link to="/">Home</Link> / <span>{crumb}</span></p></Reveal>
          {eyebrow && <Reveal delay={0.05}><p className="eyebrow"><b>{icon}</b>{eyebrow}</p></Reveal>}
          <SplitHeading text={title} gradientWords={gradientWords} className="h1" />
          {lead && <Reveal delay={0.4}><p className="lead">{lead}</p></Reveal>}
          {children && <Reveal delay={0.5}>{children}</Reveal>}
        </div>
        <div />
      </div>
    </section>
  );
}
