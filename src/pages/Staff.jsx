import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, useSession, logout, fmtDate } from "../lib/api.js";
import { LINKS, OFFICES } from "../data/content.js";

const RESOURCES = [
  { title: "Franchise management software", text: "Student records, fees and attendance.", href: LINKS.login, ext: true },
  { title: "Kreative Star ’26", text: "Competition details and entries.", href: LINKS.kreativestar, ext: true },
  { title: "Cartoon & comic clash (PDF)", text: "Event brief to share with parents.", href: LINKS.comic, ext: true },
  { title: "Media gallery", text: "Photos and videos from centres.", href: LINKS.gallery, ext: true },
  { title: "Centre directory", text: "All 158 centres with phone numbers.", href: "/centres" },
  { title: "Course structure", text: "All 5 stages and 13 levels.", href: "/courses" },
];

export default function Staff() {
  const nav = useNavigate();
  const { loading, session } = useSession();
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (session?.role !== "staff") return;
    api("/staff/portal").then((r) => setNotice(r.notice)).catch((e) => e.status === 401 && nav("/login"));
  }, [session, nav]);

  if (loading) return <div className="portal-loading" />;
  if (!session || session.role !== "staff") return <Navigate to="/login" replace />;
  const u = session.user;
  const signOut = async () => { await logout().catch(() => {}); nav("/login"); };

  return (
    <section className="portal">
      <div className="container">
        <header className="portal__head">
          <div>
            <p className="eyebrow">Staff portal</p>
            <h1 className="h2">Welcome, {u.name.split(" ")[0]}.</h1>
            <p className="muted" style={{ margin: "8px 0 0" }}>{u.role}{u.centre ? ` · ${u.centre}` : ""} · last sign-in {fmtDate(u.lastLogin)}</p>
          </div>
          <button className="btn btn--ghost" onClick={signOut}>Sign out</button>
        </header>

        {notice && (
          <motion.div className="notice" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <b>Notice from head office</b>
            <p>{notice}</p>
          </motion.div>
        )}

        <h2 className="panel__title" style={{ margin: "40px 0 16px" }}>Resources</h2>
        <div className="grid g3">
          {RESOURCES.map((r, i) => {
            const inner = (<><b>{r.title}</b><span>{r.text}</span><i aria-hidden="true">{r.ext ? "↗" : "→"}</i></>);
            return (
              <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                {r.ext ? <a className="resource" href={r.href} target="_blank" rel="noopener">{inner}</a> : <Link className="resource" to={r.href}>{inner}</Link>}
              </motion.div>
            );
          })}
        </div>

        <h2 className="panel__title" style={{ margin: "48px 0 16px" }}>Your regional contacts</h2>
        <div className="grid g3">
          {OFFICES.map((o) => (
            <div key={o.name} className="panel member-mini">
              <img src={o.photo} alt="" width="56" height="56" />
              <div><b>{o.name}</b><span>{o.role}</span><a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
