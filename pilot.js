// Código Mujer Libre — pilot-readiness: "Forgot password", "Resend confirmation", and the choose-a-new-password panel.
// Additive only: the existing login / sign-up code is untouched. It reuses the same supabase client (window.CML.db).
(function () {
"use strict";
const ES = {
  forgotLink: "¿Olvidaste tu contraseña?", resendLink: "Reenviar el correo de confirmación",
  forgotTitle: "Recupera tu contraseña", forgotIntro: "Escribe tu correo y te enviaremos un enlace para elegir una contraseña nueva.",
  forgotBtn: "Enviar enlace", forgotBack: "← Volver a entrar",
  forgotSent: "Si ese correo tiene una cuenta, te enviamos un enlace. Revisa también tu carpeta de spam.",
  forgotFail: "No pudimos enviar el enlace ahora. Inténtalo de nuevo en unos minutos.",
  forgotNeed: "Escribe tu correo.",
  recoverTitle: "Elige tu nueva contraseña", recoverIntro: "Usa al menos 8 caracteres.", recoverNew: "Contraseña nueva", recoverRepeat: "Repite la contraseña", recoverBtn: "Guardar contraseña",
  recoverShort: "La contraseña debe tener al menos 8 caracteres.", recoverMismatch: "Las contraseñas no coinciden.",
  recoverDone: "Contraseña actualizada. Ya puedes entrar con la nueva.",
  recoverFail: "Ese enlace ya no es válido. Vuelve a entrar y pide uno nuevo.",
  resendSent: "Listo. Si tu cuenta está pendiente de confirmar, te enviamos el correo otra vez.",
  resendFail: "No pudimos reenviarlo ahora. Inténtalo de nuevo en unos minutos.",
  linkExpired: "Ese enlace ya venció. Si confirmabas tu correo, escribe tu correo y usa «Reenviar el correo de confirmación»; si cambiabas tu contraseña, usa «¿Olvidaste tu contraseña?».",
  legalPrivacy: "Privacidad", legalTerms: "Términos",
  supNotice: "Este espacio no es un servicio de emergencia ni se atiende las 24 horas. En peligro inmediato, usa los recursos de emergencia de esta página."
};
const EN = {
  forgotLink: "Forgot your password?", resendLink: "Resend confirmation email",
  forgotTitle: "Reset your password", forgotIntro: "Enter your email and we will send you a link to choose a new password.",
  forgotBtn: "Send link", forgotBack: "← Back to sign in",
  forgotSent: "If that email has an account, we sent you a link. Check your spam folder too.",
  forgotFail: "We couldn't send the link right now. Please try again in a few minutes.",
  forgotNeed: "Enter your email.",
  recoverTitle: "Choose your new password", recoverIntro: "Use at least 8 characters.", recoverNew: "New password", recoverRepeat: "Repeat the password", recoverBtn: "Save password",
  recoverShort: "Your password needs at least 8 characters.", recoverMismatch: "The passwords don't match.",
  recoverDone: "Password updated. You can now sign in with the new one.",
  recoverFail: "That link is no longer valid. Go back to sign in and request a new one.",
  resendSent: "Done. If your account is waiting to be confirmed, we sent the email again.",
  resendFail: "We couldn't resend it right now. Please try again in a few minutes.",
  linkExpired: "That link has expired. If you were confirming your email, enter your email and use “Resend confirmation email”; if you were changing your password, use “Forgot your password?”.",
  legalPrivacy: "Privacy", legalTerms: "Terms",
  supNotice: "This space is not an emergency service and is not monitored 24/7. In immediate danger, use the emergency resources on this page."
};
const $ = id => document.getElementById(id);
let C = null, db = null;
const t = k => { const v = C.t(k); return typeof v === "string" ? v : k; };
const redirect = () => window.location.origin + window.location.pathname;

function note(id, key, ok) {
  const n = $(id); if (!n) return;
  n.hidden = !key; n.textContent = key ? t(key) : ""; n.dataset.key = key || "";
  n.classList.toggle("ok", !!ok);
}
function enable(btn, on) { if (btn) btn.disabled = !on; }

// ----- forgot password -----
let inForgot = false;
function showForgot() {
  inForgot = true;
  $("loginForm").hidden = true; $("forgotForm").hidden = false;
  note("forgotFeedback", "");
  const e = $("forgotEmail"); if (!e.value) e.value = $("loginEmail").value.trim();
  e.focus({ preventScroll: true });
}
function hideForgot() { inForgot = false; $("forgotForm").hidden = true; }
function backToLogin() {
  hideForgot(); $("loginForm").hidden = false;
  if ($("forgotEmail").value && !$("loginEmail").value) $("loginEmail").value = $("forgotEmail").value.trim();
}
async function sendReset(ev) {
  ev.preventDefault();
  const email = $("forgotEmail").value.trim();
  if (!email) return note("forgotFeedback", "forgotNeed");
  enable($("forgotBtn"), false); note("forgotFeedback", "");
  try {
    const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: redirect() });
    // Same neutral answer whether or not the account exists (nothing is revealed); only real failures say so.
    if (error && !/not found|no user/i.test(String(error.message || ""))) note("forgotFeedback", "forgotFail");
    else note("forgotFeedback", "forgotSent", true);
  } catch { note("forgotFeedback", "forgotFail"); }
  finally { enable($("forgotBtn"), true); }
}

// ----- choose a new password (opened from the email link) -----
function showRecover() {
  ["loginForm", "signupForm", "forgotForm", "authTabs", "authIntro", "joinThanks"].forEach(id => { if ($(id)) $(id).hidden = true; });
  $("recoverForm").hidden = false; $("recoverBack").hidden = true; note("recoverFeedback", "");
  $("recoverPw").focus({ preventScroll: true });
}
function endRecovery() {
  window.CML_RECOVERY = false;
  try { history.replaceState(null, "", window.location.pathname); } catch { /* ignore */ }
}
async function saveNewPassword(ev) {
  ev.preventDefault();
  const a = $("recoverPw").value, b = $("recoverPw2").value;
  if (a.length < 8) return note("recoverFeedback", "recoverShort");
  if (a !== b) return note("recoverFeedback", "recoverMismatch");
  enable($("recoverBtn"), false); note("recoverFeedback", "");
  try {
    const { error } = await db.auth.updateUser({ password: a });
    if (error) { $("recoverBack").hidden = false; return note("recoverFeedback", "recoverFail"); }
    $("recoverPw").value = ""; $("recoverPw2").value = "";
    await db.auth.signOut();                      // she signs in again with the new password, the normal way
    endRecovery();
    $("recoverForm").hidden = true;
    ["loginForm", "authTabs", "authIntro"].forEach(id => { if ($(id)) $(id).hidden = false; });
    note("loginFeedback", "recoverDone", true);
    $("loginPassword").focus({ preventScroll: true });
  } catch { $("recoverBack").hidden = false; note("recoverFeedback", "recoverFail"); }
  finally { enable($("recoverBtn"), true); }
}
function leaveRecover() {
  endRecovery(); db.auth.signOut().catch(() => {});
  $("recoverForm").hidden = true;
  ["loginForm", "authTabs", "authIntro"].forEach(id => { if ($(id)) $(id).hidden = false; });
}
function onRecoveryEvent() {
  if (!window.CML_RECOVERY) return;
  if (/error_code=otp_expired/.test(window.location.hash + window.location.search) && !/type=recovery/.test(window.location.hash + window.location.search)) {
    endRecovery(); note("loginFeedback", "linkExpired"); return;
  }
  showRecover();
}

// ----- resend confirmation email -----
async function resend(email, fbId, btn) {
  if (!email) { $("loginEmail").focus(); return; }
  enable(btn, false);
  try {
    const { error } = await db.auth.resend({ type: "signup", email, options: { emailRedirectTo: redirect() } });
    note(fbId, error ? "resendFail" : "resendSent", !error);
  } catch { note(fbId, "resendFail"); }
  finally { setTimeout(() => enable(btn, true), 30000); }   // gentle: one resend every 30 s
}
function syncResend() {
  const fb = $("loginFeedback"), k = fb && !fb.hidden ? fb.dataset.key : "";
  if (fb && !/^(recoverDone|resendSent)$/.test(fb.dataset.key || "")) fb.classList.remove("ok");   // the app's own messages stay "error" styled
  $("loginResend").hidden = !(k === "authNotConfirmed" || k === "linkExpired" || k === "resendSent" || k === "resendFail");
}

function init() {
  C = window.CML; if (!C || !$("forgotForm")) return;
  db = C.db; C.addStrings(ES, EN);
  $("forgotLink").addEventListener("click", showForgot);
  $("forgotBack").addEventListener("click", backToLogin);
  $("forgotForm").addEventListener("submit", sendReset);
  $("recoverForm").addEventListener("submit", saveNewPassword);
  $("recoverBack").addEventListener("click", leaveRecover);
  $("loginResend").addEventListener("click", () => resend($("loginEmail").value.trim(), "loginFeedback", $("loginResend")));
  $("thanksResend").addEventListener("click", () => resend(($("joinThanks").dataset.email || "").trim(), "thanksResendFb", $("thanksResend")));
  // when the app switches the view itself (tabs, join, welcome), the extra panels get out of the way
  const hideExtras = () => { if (inForgot) hideForgot(); };
  new MutationObserver(() => { if (!$("loginForm").hidden || !$("signupForm").hidden || $("authCard").hidden) hideExtras(); })
    .observe($("loginForm"), { attributes: true, attributeFilter: ["hidden"] });
  new MutationObserver(() => { if (!$("signupForm").hidden) hideExtras(); }).observe($("signupForm"), { attributes: true, attributeFilter: ["hidden"] });
  new MutationObserver(syncResend).observe($("loginFeedback"), { attributes: true, attributeFilter: ["hidden", "data-key"] });
  document.addEventListener("cml:recovery", onRecoveryEvent);
  if (window.CML_RECOVERY && !$("authForms").hidden) onRecoveryEvent();   // the app may have been ready before this file loaded
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
