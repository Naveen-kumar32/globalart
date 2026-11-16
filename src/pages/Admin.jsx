import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api, useSession, logout, fmtDate } from "../lib/api.js";
import { Arrow } from "../components/ui/index.jsx";

const ROLES = ["Centre teacher", "Centre head", "Franchise owner", "Area head", "State head", "Head office staff", "Other"];
const EXPIRY = [["0", "Never expires"], ["30", "30 days"], ["90", "90 days"], ["365", "1 year"]];

function status(s) {
  if (!s.active) return ["Disabled", "off"];
  if (s.expiresAt && new Date(s.expiresAt) < new Date()) return ["Expired", "off"];
  return ["Active", "on"];
}

/** Shows a freshly issued code once, with copy-to-clipboard. */
function CodeReveal({ result, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(result.code); setCopied(true); } catch { setCopied(false); } };
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal__card" role="dialog" aria-modal="true" aria-labelledby="code-title" onClick={(e) => e.stopPropagation()}
        initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
        <p className="eyebrow">Access code ready</p>
        <h3 id="code-title" className="h3">Give this code to {result.staff.name}</h3>
        <div className="code-box"><code>{result.code}</code></div>
        <p className="muted" style={{ fontSize: 14 }}>For security it’s shown <b>only once</b>. If it’s lost, issue a new code — the old one stops working immediately.</p>
        <div className="btns" style={{ marginTop: 18 }}>
          <button className="btn" onClick={copy}>{copied ? "Copied ✓" : "Copy code"}</button>
          <button className="btn btn--ghost" onClick={onClose}>Done</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Admin() {
  const nav = useNavigate();
  const { loading, session } = useSession();
  const [staff, setStaff] = useState([]);
  const [notice, setNotice] = useState("");
  const [noticeSaved, setNoticeSaved] = useState("");
  const [form, setForm] = useState({ name: "", role: ROLES[0], centre: "", email: "", expiresInDays: "0" });
  const [reveal, setReveal] = useState(null);
  const [msg, setMsg] = useState({ text: "", bad: false });
  const [q, setQ] = useState("");
  const [pw, setPw] = useState({ current: "", next: "" });
  const [pwMsg, setPwMsg] = useState({ text: "", bad: false });

  const load = useCallback(async () => {
    try { const r = await api("/admin/staff"); setStaff(r.staff); setNotice(r.notice); }
    catch (e) { if (e.status === 401 || e.status === 403) nav("/login"); }
  }, [nav]);
  useEffect(() => { if (session?.role === "admin") load(); }, [session, load]);

  if (loading) return <div className="portal-loading" />;
  if (!session || session.role !== "admin") return <Navigate to="/login" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const flash = (text, bad = false) => { setMsg({ text, bad }); setTimeout(() => setMsg({ text: "", bad: false }), 4000); };

  const create = async (e) => {
    e.preventDefault();
    try {
      const r = await api("/admin/staff", { method: "POST", body: { ...form, expiresInDays: Number(form.expiresInDays) } });
      setReveal(r); setForm({ name: "", role: form.role, centre: "", email: "", expiresInDays: form.expiresInDays }); load();
    } catch (err) { flash(err.message, true); }
  };
  const act = async (fn, okText) => { try { const r = await fn(); if (r?.code) setReveal(r); else if (okText) flash(okText); load(); } catch (err) { flash(err.message, true); } };
  const saveNotice = async () => { try { await api("/admin/notice", { method: "PUT", body: { text: notice } }); setNoticeSaved("Saved — staff will see it on their portal."); setTimeout(() => setNoticeSaved(""), 3500); } catch (err) { setNoticeSaved(err.message); } };
  const changePw = async (e) => {
    e.preventDefault();
    try { await api("/admin/password", { method: "POST", body: pw }); setPw({ current: "", next: "" }); setPwMsg({ text: "Password updated.", bad: false }); }
    catch (err) { setPwMsg({ text: err.message, bad: true }); }
  };
  const signOut = async () => { await logout().catch(() => {}); nav("/login"); };

  const shown = staff.filter((s) => !q || `${s.name} ${s.role} ${s.centre} ${s.email}`.toLowerCase().includes(q.toLowerCase()));
  const activeCount = staff.filter((s) => status(s)[1] === "on").length;
  const recent = staff.filter((s) => s.lastLogin && Date.now() - new Date(s.lastLogin) < 7 * 864e5).length;

  return (
    <section className="portal">
      <div className="container">
        <header className="portal__head">
          <div>
            <p className="eyebrow">Administrator</p>
            <h1 className="h2">Staff access</h1>
            <p className="muted" style={{ margin: "8px 0 0" }}>Signed in as {session.user.name} · {session.user.email}</p>
          </div>
          <button className="btn btn--ghost" onClick={signOut}>Sign out</button>
        </header>

        <div className="kpis">
          {[[staff.length, "Staff with codes"], [activeCount, "Active codes"], [recent, "Signed in this week"]].map(([v, l]) => (
            <div className="kpi" key={l}><b>{v}</b><span>{l}</span></div>
          ))}
        </div>

        <div className="portal__grid">
          <div className="panel">
            <h2 className="panel__title">Issue a new access code</h2>
            <form className="form" onSubmit={create}>
              <div className="row2">
                <div className="field"><label htmlFor="n">Full name *</label><input id="n" className="input" value={form.name} onChange={set("name")} required maxLength={120} /></div>
                <div className="field"><label htmlFor="r">Role *</label><div className="select"><select id="r" value={form.role} onChange={set("role")}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div></div>
              </div>
              <div className="row2">
                <div className="field"><label htmlFor="c">Centre / region</label><input id="c" className="input" value={form.centre} onChange={set("centre")} placeholder="e.g. Adyar, Chennai" maxLength={120} /></div>
                <div className="field"><label htmlFor="e">Email (optional)</label><input id="e" className="input" type="email" value={form.email} onChange={set("email")} maxLength={160} /></div>
              </div>
              <div className="row2" style={{ alignItems: "end" }}>
                <div className="field"><label htmlFor="x">Code validity</label><div className="select"><select id="x" value={form.expiresInDays} onChange={set("expiresInDays")}>{EXPIRY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div></div>
                <button className="btn btn--lg btn--block" type="submit" disabled={!form.name.trim()}>Generate code <Arrow /></button>
              </div>
            </form>
            <p className={`note ${msg.bad ? "err" : "ok"}`} role="status">{msg.text}</p>
          </div>

          <div className="panel">
            <h2 className="panel__title">Notice for staff</h2>
            <p className="muted" style={{ fontSize: 14, marginTop: 0 }}>Shown at the top of every staff member’s portal.</p>
            <textarea className="textarea" value={notice} onChange={(e) => setNotice(e.target.value)} maxLength={2000} placeholder="e.g. Kreative Star ’26 entries close on 30 November." />
            <div className="row-between" style={{ marginTop: 12, alignItems: "center" }}>
              <span className="note ok">{noticeSaved}</span>
              <button className="btn btn--ghost btn--sm" onClick={saveNotice}>Save notice</button>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginTop: 24 }}>
          <div className="row-between" style={{ alignItems: "center", marginBottom: 16 }}>
            <h2 className="panel__title" style={{ margin: 0 }}>Staff ({staff.length})</h2>
            <input className="input input--sm" type="search" placeholder="Search name, role, centre…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search staff" />
          </div>
          {shown.length === 0 ? (
            <p className="muted" style={{ padding: "30px 0", textAlign: "center" }}>{staff.length ? "No staff match that search." : "No codes issued yet. Create the first one above."}</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Name</th><th>Role & centre</th><th>Status</th><th>Code</th><th>Last sign-in</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {shown.map((s) => {
                      const [label, tone] = status(s);
                      return (
                        <motion.tr key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <td><b>{s.name}</b>{s.email && <small>{s.email}</small>}</td>
                          <td>{s.role}<small>{s.centre || "—"}</small></td>
                          <td><span className={`badge badge--${tone}`}>{label}</span>{s.expiresAt && <small>until {new Date(s.expiresAt).toLocaleDateString("en-IN")}</small>}</td>
                          <td><code className="hint">…{s.codeHint}</code></td>
                          <td>{fmtDate(s.lastLogin)}</td>
                          <td><div className="table__actions">
                            <button className="btn btn--ghost btn--sm" onClick={() => act(() => api(`/admin/staff/${s.id}`, { method: "PATCH", body: { active: !s.active } }), s.active ? `${s.name} can no longer sign in.` : `${s.name} can sign in again.`)}>{s.active ? "Disable" : "Enable"}</button>
                            <button className="btn btn--ghost btn--sm" onClick={() => window.confirm(`Issue a new code for ${s.name}? Their current code will stop working.`) && act(() => api(`/admin/staff/${s.id}/regenerate`, { method: "POST" }))}>New code</button>
                            <button className="btn btn--ghost btn--sm btn--danger" onClick={() => window.confirm(`Remove ${s.name} permanently?`) && act(() => api(`/admin/staff/${s.id}`, { method: "DELETE" }), `${s.name} removed.`)}>Remove</button>
                          </div></td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel" style={{ marginTop: 24, maxWidth: 620 }}>
          <h2 className="panel__title">Change your password</h2>
          <form className="form" onSubmit={changePw}>
            <div className="row2">
              <div className="field"><label htmlFor="cp">Current password</label><input id="cp" className="input" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
              <div className="field"><label htmlFor="np">New password (10+ characters)</label><input id="np" className="input" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
            </div>
            <div><button className="btn btn--ghost" type="submit" disabled={!pw.current || pw.next.length < 10}>Update password</button></div>
            <p className={`note ${pwMsg.bad ? "err" : "ok"}`} role="status">{pwMsg.text}</p>
          </form>
        </div>
      </div>

      <AnimatePresence>{reveal && <CodeReveal result={reveal} onClose={() => setReveal(null)} />}</AnimatePresence>
    </section>
  );
}
