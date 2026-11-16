import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api, useSession } from "../lib/api.js";
import { Video, Arrow } from "../components/ui/index.jsx";

const ease = [0.22, 1, 0.36, 1];

/** Formats typing into GA-XXXX-XXXX-XXXX-XXXX as the person types or pastes. */
function formatCode(v) {
  let raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.startsWith("GA")) raw = raw.slice(2);
  raw = raw.slice(0, 16);
  const groups = raw.match(/.{1,4}/g) || [];
  return raw ? "GA-" + groups.join("-") : "";
}

export default function Login() {
  const nav = useNavigate();
  const { loading, session } = useSession();
  const [tab, setTab] = useState("staff");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const first = useRef(null);

  useEffect(() => { setError(""); first.current?.focus(); }, [tab]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const r = tab === "staff"
        ? await api("/auth/staff", { method: "POST", body: { code } })
        : await api("/auth/admin", { method: "POST", body: { email, password } });
      nav(r.role === "admin" ? "/admin" : "/staff");
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  const ready = tab === "staff" ? code.replace(/[^A-Z0-9]/g, "").length === 18 : email && password;

  return (
    <section className="auth">
      <div className="auth__media">
        <Video name="art-kids" eager />
        <div className="auth__shade" />
        <div className="auth__quote">
          <p className="eyebrow" style={{ color: "#fff" }}>Globalart team</p>
          <h2 className="h2" style={{ color: "#fff" }}>Every class you run<br />shapes a young mind.</h2>
          <p style={{ color: "rgba(255,255,255,.85)", maxWidth: 420 }}>The staff portal for Globalart teachers, centre heads and franchise partners.</p>
        </div>
      </div>

      <div className="auth__panel">
        <motion.div className="auth__card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.4 }}>
          <p className="eyebrow">Staff portal</p>
          <h1 className="h2" style={{ marginBottom: 10 }}>Sign in</h1>
          <p className="muted" style={{ margin: "0 0 28px" }}>For Globalart staff only. Access codes are issued by your administrator.</p>

          {!loading && session && (
            <div className="auth__already">
              Signed in as <b>{session.user.name}</b>.{" "}
              <Link className="link" to={session.role === "admin" ? "/admin" : "/staff"}>Continue to your {session.role === "admin" ? "dashboard" : "portal"} →</Link>
            </div>
          )}

          <div className="seg" role="tablist" aria-label="Sign-in type">
            {[["staff", "Staff — access code"], ["admin", "Administrator"]].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>
                {tab === k && <motion.span layoutId="seg" className="seg__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span>{l}</span>
              </button>
            ))}
          </div>

          <form className="form" onSubmit={submit} noValidate>
            <AnimatePresence mode="wait" initial={false}>
              {tab === "staff" ? (
                <motion.div key="s" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.25 }} className="form">
                  <div className="field">
                    <label htmlFor="code">Access code</label>
                    <input ref={first} id="code" className="input input--code" value={code} onChange={(e) => setCode(formatCode(e.target.value))}
                      placeholder="GA-XXXX-XXXX-XXXX-XXXX" autoComplete="one-time-code" spellCheck="false" inputMode="text" aria-describedby="code-help" />
                    <small id="code-help" className="muted">Don’t have a code? Ask your Globalart administrator.</small>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="a" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.25 }} className="form">
                  <div className="field"><label htmlFor="email">Email</label><input ref={first} id="email" className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div className="field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                </motion.div>
              )}
            </AnimatePresence>
            <button className="btn btn--lg btn--block" type="submit" disabled={!ready || busy}>{busy ? "Signing in…" : "Sign in"} {!busy && <Arrow />}</button>
            <p className="note err" role="alert">{error}</p>
          </form>

          <p className="muted" style={{ fontSize: 14, marginTop: 24 }}>Looking for the franchise management software? <a className="link" href="https://www.sipacademysoftware.com/fa-ga/login" target="_blank" rel="noopener">Open it here</a>.</p>
        </motion.div>
      </div>
    </section>
  );
}
