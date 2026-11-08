/* Acceso seguro de asesoras: habla con Supabase (funciones advisor_login / advisor_check / admin_*).
   Los códigos viven solo en la base de datos, nunca en estos archivos. */
window.CMLACC = (function () {
  const U = "https://ltuklkfymedhqncwzpks.supabase.co", K = "sb_publishable_cmiZ-mhW1wBf6hQuscVp7g_P7Wg4bPh";
  const rpc = (fn, args) => fetch(U + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: JSON.stringify(args || {}) })
    .then(async r => { let j = null; try { j = await r.json(); } catch (e) {} if (r.status === 404) throw { missing: true }; if (!r.ok) throw { err: j }; return j; });
  const sesion = () => { try { return JSON.parse(sessionStorage.getItem("cml_sesion") || "null"); } catch (e) { return null; } };
  const guardar = s => { try { sessionStorage.setItem("cml_sesion", JSON.stringify(s)); } catch (e) {} };
  const salir = () => { try { sessionStorage.removeItem("cml_sesion"); sessionStorage.removeItem("cml_asesora"); localStorage.removeItem("cml_asesora"); } catch (e) {} };
  function login(code) {
    return rpc("advisor_login", { p_code: code }).then(j => { if (j && j.ok) guardar(j); return j; }).catch(e => ({ ok: false, error: e && e.missing ? "sin_backend" : "sin_conexion" }));
  }
  function check() {
    const s = sesion(); if (s && s.preview) return Promise.resolve({ ok: true }); if (!s || !s.token) return Promise.resolve({ ok: false });
    return rpc("advisor_check", { p_token: s.token }).catch(e => (e && e.missing ? { ok: true, legacy: true } : { ok: null }));
  }
  const admin = (fn, args) => { const s = sesion(); return rpc(fn, Object.assign({ p_token: s && s.token }, args || {})); };
  return { rpc, sesion, guardar, salir, login, check, admin };
})();
