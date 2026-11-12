import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { burst } from "./ui/index.jsx";

function Field({ f, bad }) {
  const id = "f-" + f.name.replace(/\W+/g, "");
  return (
    <div className={`field ${bad ? "bad" : ""}`}>
      <label htmlFor={id}>{f.label}{f.required ? " *" : ""}</label>
      {f.options ? (
        <div className="select"><select id={id} name={f.name} required={f.required} defaultValue=""><option value="">Select</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select></div>
      ) : f.textarea ? (
        <textarea id={id} className="textarea" name={f.name} placeholder={f.placeholder} />
      ) : (
        <input id={id} className="input" name={f.name} type={f.type || "text"} required={f.required} pattern={f.pattern} autoComplete={f.autoComplete} />
      )}
    </div>
  );
}

/** A neumorphic form that composes an email (no server needed). */
export default function MailForm({ to, subject, fields, submitLabel, success, footer, before, extraLines }) {
  const ref = useRef(null);
  const [bad, setBad] = useState({});
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const shaker = useAnimationControls();

  const submit = (e) => {
    e.preventDefault();
    const form = ref.current;
    const b = {};
    [...form.elements].forEach((el) => { if (el.name && ((el.required && el.disabled) || (!el.disabled && !el.checkValidity()))) b[el.name] = true; });
    setBad(b);
    if (Object.keys(b).length) { setErr("Oops! Please fill in the highlighted fields 🙂"); shaker.start({ x: [0, -14, 12, -8, 6, 0], transition: { duration: 0.5 } }); return; }
    setErr("");
    const lines = [];
    new FormData(form).forEach((v, k) => v && lines.push(`${k}: ${v}`));
    if (extraLines) lines.push("", ...extraLines());
    const body = `${subject}\n\n${lines.join("\n")}\n\nSent from the Globalart website`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const r = form.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 60);
    setSent(true);
  };

  return (
    <motion.div className="neu-panel" animate={shaker}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" className="center" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} style={{ padding: "30px 0" }}>
            <motion.div style={{ fontSize: 80 }} animate={{ y: [0, -14, 0], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🎉</motion.div>
            <h3 className="h2">Yay! Almost done</h3>
            <p className="lead" style={{ margin: "0 auto 20px" }}>{success}</p>
            <button className="btn btn--neu" onClick={() => setSent(false)}>← Edit details</button>
          </motion.div>
        ) : (
          <motion.form key="form" ref={ref} className="form" noValidate onSubmit={submit} onInput={(e) => e.target.name && bad[e.target.name] && setBad((b) => ({ ...b, [e.target.name]: false }))} exit={{ rotateY: 90, opacity: 0 }}>
            {before}
            {fields.map((f, i) => Array.isArray(f)
              ? <div key={i} className="row2">{f.map((x) => <Field key={x.name} f={x} bad={bad[x.name]} />)}</div>
              : <Field key={f.name} f={f} bad={bad[f.name]} />)}
            <button className="btn btn--lg btn--block" type="submit">{submitLabel}</button>
            <p className="note err" role="status">{err}</p>
            {footer}
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
