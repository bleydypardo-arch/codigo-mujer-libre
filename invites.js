// Personal invitation QR codes.
// 1) Admin tab "Invitaciones QR": type a name -> link + QR (download as image). Nothing is stored; the name travels inside the link.
// 2) When someone opens a link with ?ref=Name, the signup form is pre-filled ("A friend invited me" + that name). Jazz still approves each member.
(function () {
  "use strict";
  const REF_KEY = "cml_ref";
  const clean = s => String(s || "").replace(/[<>"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 60);
  const store = {
    get() { try { return sessionStorage.getItem(REF_KEY) || ""; } catch { return ""; } },
    set(v) { try { sessionStorage.setItem(REF_KEY, v); } catch { /* ignore */ } }
  };

  // ---- member side: capture ?ref=, pre-fill the signup form ----
  function captureRef() {
    let ref = "";
    try { ref = clean(new URLSearchParams(location.search).get("ref")); } catch { ref = ""; }
    if (ref) store.set(ref);
  }
  function prefill() {
    const ref = store.get();
    if (!ref) return;
    const inp = document.getElementById("suInvited");
    if (inp && !inp.value) inp.value = ref;
    const r = document.querySelector('input[name="suHeard"][value="friend"]');
    if (r && !document.querySelector('input[name="suHeard"]:checked')) r.checked = true;
  }
  captureRef();
  document.addEventListener("DOMContentLoaded", () => { prefill(); setTimeout(prefill, 600); setTimeout(prefill, 1800); });
  window.addEventListener("hashchange", () => setTimeout(prefill, 50));

  // ---- admin side ----
  const T = {
    es: { tab: "Invitaciones QR", intro: "Crea un QR personal para cada persona que invita (tú, una anfitriona, una ciudad). Quien se une con ese QR llega a la solicitud con “Una amiga me invitó” y el nombre ya escritos. Tú sigues aprobando a cada una.", name: "Nombre de quien invita o de la ciudad", ph: "Ej.: Jazz, Orlando, Boston, Comunidad", make: "Crear QR", link: "Enlace", copy: "Copiar enlace", copied: "Enlace copiado", save: "Descargar imagen", need: "Escribe un nombre primero.", hint: "Imprime la imagen o compártela por WhatsApp. El QR funciona siempre, no caduca.", cap: "Escanea para unirte" },
    en: { tab: "Invitation QR", intro: "Create a personal QR for each person who invites (you, a host, a city). Whoever joins with that QR lands on the application with “A friend invited me” and the name already filled in. You still approve every member.", name: "Name of the person inviting, or the city", ph: "E.g.: Jazz, Orlando, Boston, Community", make: "Create QR", link: "Link", copy: "Copy link", copied: "Link copied", save: "Download image", need: "Type a name first.", hint: "Print the image or share it on WhatsApp. The QR works forever, it does not expire.", cap: "Scan to join" }
  };
  const base = () => location.origin + location.pathname.replace(/index\.html$/, "");
  const linkFor = name => base() + "?ref=" + encodeURIComponent(name) + "#unete";

  function drawQR(canvas, text, caption) {
    const q = window.CMLQR(text), quiet = 4, cell = 10, size = (q.n + quiet * 2) * cell;
    const capH = caption ? 64 : 0;
    canvas.width = size; canvas.height = size + capH;
    const g = canvas.getContext("2d");
    g.fillStyle = "#FFF9F8"; g.fillRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = "#272525";
    for (let r = 0; r < q.n; r++) for (let c = 0; c < q.n; c++) if (q.get(r, c)) g.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
    if (caption) {
      g.textAlign = "center"; g.fillStyle = "#9E4D56"; g.font = "600 26px 'Playfair Display', Georgia, serif";
      g.fillText(caption.top, size / 2, size - 6);
      g.fillStyle = "#6b6361"; g.font = "500 20px Inter, Arial, sans-serif";
      g.fillText(caption.bottom, size / 2, size + 30);
    }
  }

  function tab(C, K) {
    const L = T[C.lang()] || T.es, el = C.el;
    const wrap = el("div", { class: "admin-form" }, el("p", { class: "small-note", text: L.intro }));
    const input = el("input", { type: "text", maxlength: 60, placeholder: L.ph });
    const fb = el("p", { class: "form-feedback", role: "alert", hidden: true });
    const out = el("div", { class: "inv-out", hidden: true });
    const canvas = el("canvas", { class: "inv-canvas", "aria-label": "QR" });
    const linkTxt = el("input", { type: "text", readonly: "readonly", class: "inv-link" });
    let curName = "";
    const make = () => {
      const name = clean(input.value);
      if (!name) { fb.hidden = false; fb.textContent = L.need; out.hidden = true; return; }
      fb.hidden = true; curName = name;
      const url = linkFor(name);
      drawQR(canvas, url, { top: "Código Mujer Libre", bottom: L.cap + " · " + name });
      linkTxt.value = url; out.hidden = false;
    };
    const copy = async () => { try { await navigator.clipboard.writeText(linkTxt.value); } catch { linkTxt.select(); document.execCommand && document.execCommand("copy"); } K.toast(L.copied); };
    const save = () => { const a = document.createElement("a"); a.download = "QR-" + curName.replace(/[^\w\-]+/g, "_") + ".png"; a.href = canvas.toDataURL("image/png"); document.body.appendChild(a); a.click(); a.remove(); };
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); make(); } });
    out.append(canvas, el("label", {}, L.link, linkTxt),
      el("div", { class: "admin-bar" }, K.button(L.copy, "secondary", copy), K.button(L.save, "primary", save)),
      el("p", { class: "small-note", text: L.hint }));
    wrap.append(el("label", {}, L.name, input), el("div", { class: "admin-bar" }, K.button(L.make, "primary", make)), fb, out);
    return wrap;
  }

  function init() {
    const C = window.CML, A = window.CMLAdmin;
    if (!C || !A || !A.registerTab) return;
    const K = A.kit();
    A.registerTab("invites", { group: "content", label: { es: T.es.tab, en: T.en.tab }, render: async () => tab(C, K) });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
