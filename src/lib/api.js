import { useCallback, useEffect, useState } from "react";

/** JSON fetch against our own server. Throws an Error with the server's message on failure. */
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    headers: body !== undefined || method !== "GET" ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : method !== "GET" ? "{}" : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data?.error || (res.status >= 500 ? "The server isn’t responding. Please try again." : "Something went wrong."));
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Current signed-in user: { loading, session: {role,user}|null, refresh } */
export function useSession() {
  const [state, setState] = useState({ loading: true, session: null });
  const refresh = useCallback(async () => {
    try { setState({ loading: false, session: await api("/auth/me") }); }
    catch { setState({ loading: false, session: null }); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { ...state, refresh };
}

export const logout = () => api("/auth/logout", { method: "POST" });

export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
