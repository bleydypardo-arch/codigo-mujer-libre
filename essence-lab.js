/* Taller de esencias: la mujer crea su propia esencia con flores y hierbas (Tienda de Bienestar) */
(() => {
const C = () => window.CML;
const ING = [
  { k: "rosa", c: "#E58FA6", t: ["Rosa", "Rose"], g: "flor" }, { k: "lavanda", c: "#A58BCB", t: ["Lavanda", "Lavender"], g: "flor" },
  { k: "jazmin", c: "#F3E7B8", t: ["Jazmín", "Jasmine"], g: "flor" }, { k: "orquidea", c: "#D96FB0", t: ["Orquídea", "Orchid"], g: "flor" },
  { k: "manzanilla", c: "#F2D36B", t: ["Manzanilla", "Chamomile"], g: "flor" }, { k: "romero", c: "#6E9A63", t: ["Romero", "Rosemary"], g: "hierba" },
  { k: "menta", c: "#74C7A5", t: ["Menta", "Mint"], g: "hierba" }, { k: "eucalipto", c: "#8DB7A8", t: ["Eucalipto", "Eucalyptus"], g: "hierba" },
  { k: "albahaca", c: "#5E8C4A", t: ["Albahaca", "Basil"], g: "hierba" }, { k: "vainilla", c: "#D9B77E", t: ["Vainilla", "Vanilla"], g: "hierba" }];
const INT = [{ k: "calma", t: ["Calma", "Calm"] }, { k: "amor", t: ["Amor propio", "Self-love"] }, { k: "energia", t: ["Energía", "Energy"] }, { k: "sueno", t: ["Dormir en paz", "Restful sleep"] }];
const S = { ES: { open: "Crea tu esencia", sub: "Elige flores y hierbas y diseña la tuya", h: "Tu taller de esencias", flores: "Flores", hierbas: "Hierbas", inten: "Tu intención", pick: "Elige hasta 3 ingredientes", name: "Ponle nombre a tu esencia", save: "Guardar mi esencia", saved: "Guardada. Pronto podrás pedirla hecha para ti.", close: "Cerrar", def: "Mi esencia" },
  EN: { open: "Create your essence", sub: "Pick flowers and herbs and design your own", h: "Your essence studio", flores: "Flowers", hierbas: "Herbs", inten: "Your intention", pick: "Choose up to 3 ingredients", name: "Name your essence", save: "Save my essence", saved: "Saved. Soon you will be able to order it made for you.", close: "Close", def: "My essence" } };
const L = () => (C() && C().lang() === "en") ? 1 : 0, s = k => S[L() ? "EN" : "ES"][k];
const mk = (cls, html, tag) => { const n = document.createElement(tag || "div"); n.className = cls; if (html) n.innerHTML = html; return n; };
function open() {
  if (document.querySelector(".el-ov")) return;
  const sel = [], st = { intent: "calma" };
  const ov = mk("el-ov", '<div class="el-card"><button type="button" class="el-x" aria-label="' + s("close") + '">×</button><h2>' + s("h") + '</h2><div class="el-bottle"><svg viewBox="0 0 120 170"><defs><linearGradient id="elg" x1="0" y1="0" x2="0" y2="1"><stop class="g1" offset="0" stop-color="#f5e6d0"/><stop class="g2" offset="1" stop-color="#e3c6a0"/></linearGradient><clipPath id="elc"><path d="M42 58h36v10c18 8 28 24 28 50 0 26-12 40-46 40S14 144 14 118c0-26 10-42 28-50z"/></clipPath></defs><rect x="46" y="14" width="28" height="22" rx="5" fill="#C9A169"/><rect x="50" y="34" width="20" height="26" fill="#f6efe6" stroke="#C9A169"/><g clip-path="url(#elc)"><rect x="0" y="62" width="120" height="120" fill="url(#elg)"/><g class="el-pet"></g></g><path d="M42 58h36v10c18 8 28 24 28 50 0 26-12 40-46 40S14 144 14 118c0-26 10-42 28-50z" fill="none" stroke="#C9A169" stroke-width="2.4"/></svg></div><div class="el-nm"></div><div class="el-bd"></div><input class="el-in" maxlength="28"><button type="button" class="el-save"></button><p class="el-ok"></p></div>');
  const bd = ov.querySelector(".el-bd"), pet = ov.querySelector(".el-pet"), nm = ov.querySelector(".el-nm"), inp = ov.querySelector(".el-in");
  inp.placeholder = s("name"); ov.querySelector(".el-save").textContent = s("save");
  const sec = (title, items, cls) => { bd.appendChild(mk("el-h", title)); const row = mk("el-row"); items.forEach(i => { const b = mk("el-chip " + cls, '<i style="background:' + (i.c || "#C9A169") + '"></i>' + i.t[L()], "button"); b.type = "button"; b.dataset.k = i.k; row.appendChild(b); }); bd.appendChild(row); };
  sec(s("flores") + " · " + s("pick"), ING.filter(i => i.g === "flor"), "ing"); sec(s("hierbas"), ING.filter(i => i.g === "hierba"), "ing"); sec(s("inten"), INT, "int");
  const paint = () => {
    const cs = sel.map(k => ING.find(i => i.k === k).c);
    ov.querySelector(".g1").setAttribute("stop-color", cs[0] || "#f5e6d0"); ov.querySelector(".g2").setAttribute("stop-color", cs[1] || cs[0] || "#e3c6a0");
    pet.innerHTML = ""; cs.forEach((c, ci) => { for (let n = 0; n < 7; n++) pet.insertAdjacentHTML("beforeend", '<ellipse class="p" cx="' + (30 + ((n * 23 + ci * 11) % 60)) + '" cy="' + (100 + ((n * 17) % 50)) + '" rx="5" ry="8" fill="' + c + '" style="animation-delay:' + (-(n * .7 + ci)) + 's"/>'); });
    bd.querySelectorAll(".ing").forEach(b => b.classList.toggle("on", sel.includes(b.dataset.k))); bd.querySelectorAll(".int").forEach(b => b.classList.toggle("on", b.dataset.k === st.intent));
    nm.textContent = (inp.value || s("def")) + " · " + sel.map(k => ING.find(i => i.k === k).t[L()]).join(" + ");
  };
  bd.addEventListener("click", e => { const b = e.target.closest(".el-chip"); if (!b) return; if (b.classList.contains("int")) st.intent = b.dataset.k; else { const i = sel.indexOf(b.dataset.k); if (i >= 0) sel.splice(i, 1); else { if (sel.length >= 3) sel.shift(); sel.push(b.dataset.k); } } paint(); });
  inp.addEventListener("input", paint);
  ov.querySelector(".el-save").addEventListener("click", () => { try { const a = JSON.parse(localStorage.getItem("cml_essences") || "[]"); a.push({ n: inp.value || s("def"), ing: sel, intent: st.intent, at: Date.now() }); localStorage.setItem("cml_essences", JSON.stringify(a.slice(-20))); } catch (e) {} ov.querySelector(".el-ok").textContent = s("saved"); });
  const close = () => { ov.remove(); }; ov.querySelector(".el-x").addEventListener("click", close); ov.addEventListener("click", e => { if (e.target === ov) close(); });
  sel.push("rosa", "lavanda"); document.body.appendChild(ov); paint();
}
function button() { const b = mk("el-open", '<span class="el-oi">✿</span><span><b>' + s("open") + '</b><small>' + s("sub") + '</small></span>', "button"); b.type = "button"; b.addEventListener("click", open); return b; }
window.CMLEssenceLab = { open, button };
})();
