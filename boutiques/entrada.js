(function () {
  const D = window.CMLB, $ = (s, r) => (r || document).querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const scene = $("#scene"), doors = $("#doors"), tour = $("#tour"), room = $("#room");
  $("#pr").textContent = "USD " + D.price.intro;
  $("#pr2").textContent = "el primer mes · luego USD " + D.price.monthly + " al mes";

  /* ---------- sonido muy suave (WebAudio), con botón para quitarlo ---------- */
  let ctx = null, on = true;
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
  function tone(f, t0, dur, vol) {
    const c = ac(); if (!c || !on) return;
    const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f;
    const t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  const chime = () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.28, 2.6, 0.035)); };
  const tick = () => { tone(880, 0, 0.7, 0.03); tone(1318.5, 0.08, 0.8, 0.02); };
  let pad = null;
  function ambience() {
    const c = ac(); if (!c || !on || pad) return;
    const g = c.createGain(); g.gain.value = 0; g.connect(c.destination); g.gain.linearRampToValueAtTime(0.02, c.currentTime + 4);
    pad = [261.63, 329.63, 392, 523.25].map(f => { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f; const og = c.createGain(); og.gain.value = 0.5; o.connect(og); og.connect(g); o.start(); return o; }); pad.g = g;
  }
  function stopAmb() { if (pad) { const c = ctx; pad.g.gain.linearRampToValueAtTime(0, c.currentTime + 0.8); const p = pad; pad = null; setTimeout(() => p.forEach(o => { try { o.stop(); } catch (e) {} }), 1000); } }
  $("#snd").addEventListener("click", e => { on = !on; e.currentTarget.setAttribute("aria-pressed", String(on)); if (on) ambience(); else stopAmb(); });

  /* ---------- puntos del recorrido (zonas de la boutique) ---------- */
  const PTS = [
    { x: 14, y: 46, l: "Matcha & Café", items: [{ n: "Matcha ceremonial", d: "Polvo de primera cosecha. 30 g.", p: "USD 34", ic: "tea" }, { n: "Café de especialidad", d: "Tostión media, notas de cacao.", p: "USD 22", ic: "jar" }] },
    { x: 50, y: 38, l: "Atención personal", items: [{ n: "Asesoría de bienestar", d: "Sesión privada de 30 minutos por video.", p: "USD 40", ic: "heart" }] },
    { x: 57, y: 63, l: "Aceites y difusores", items: [{ n: "Aceite esencial de lavanda", d: "Puro, 15 ml.", p: "USD 24", ic: "bottle" }, { n: "Difusor de varillas", d: "Aroma a orquídea y vainilla.", p: "USD 46", ic: "candle" }] },
    { x: 82, y: 28, l: "Kits de bienestar", items: [{ n: "Kit ritual de autocuidado", d: "Regalo con propósito, en caja con lazo.", p: "USD 68", ic: "box" }] },
    { x: 94, y: 40, l: "Collares difusores", items: [{ n: "Collar difusor dorado", d: "Lleva tu esencia contigo.", p: "USD 52", ic: "ring" }] },
    { x: 86, y: 84, l: "Cremas", items: [{ n: "Crema de caléndula", d: "Hidratación suave para rostro y cuerpo.", p: "USD 28", ic: "jar" }, { n: "Aceite corporal", d: "Textura sedosa, absorción rápida.", p: "USD 32", ic: "bottle" }] }
  ];
  const ICO = window.CMLI;
  PTS.forEach(p => { const b = document.createElement("button"); b.type = "button"; b.className = "hot"; b.style.left = p.x + "%"; b.style.top = p.y + "%"; b.setAttribute("data-l", p.l); b.setAttribute("aria-label", p.l); b.addEventListener("click", () => { tick(); zone(p); }); room.appendChild(b); });

  /* ---------- ventanas ---------- */
  function modal(html, mount) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">×</button>' + html + "</div>"; document.body.appendChild(ov);
    const close = () => ov.remove(); ov.addEventListener("click", e => { if (e.target === ov) close(); }); $(".x", ov).addEventListener("click", close); mount && mount(ov, close); return close;
  }
  function zone(p) {
    modal("<h3>" + esc(p.l) + "</h3><p>Ejemplo de cómo se vería una de tus vitrinas.</p>" + p.items.map((it, i) => '<div class="pcard"><div class="art2">' + (ICO ? ICO(it.ic) : "") + '</div><div><b>' + esc(it.n) + "</b><span>" + esc(it.d) + '</span><span class="pp">' + esc(it.p) + '</span></div><button class="btn wine" data-i="' + i + '">Comprar</button></div>').join("") + '<p class="note">Demostración: productos y precios de ejemplo.</p>', (ov, close) => {
      ov.querySelectorAll(".btn").forEach(b => b.addEventListener("click", () => { close(); buy(p.items[+b.dataset.i]); }));
    });
  }
  function buy(it) {
    modal("<h3>Aquí se abre tu tienda</h3><p>En tu boutique, este botón lleva a <b>tu tienda</b> (Shopify, WooCommerce, tu agenda de reservas o tu pago) en una pestaña nueva. Tú recibes el dinero y gestionas la entrega.</p><p style=\"margin-top:10px\">Antes, tu clienta crea su cuenta gratis en Código ML y puede recorrer el hotel: spa, café, atelier y más. Cada visita construye comunidad para tu marca.</p><p class=\"note\">Demostración: no se realiza ninguna compra.</p><div class=\"acts\"><button class=\"btn ghost\" id=\"ok\">Entendido</button></div>", (ov, close) => $("#ok", ov).addEventListener("click", close));
  }
  function interest() {
    modal('<h3>Quiero mi boutique virtual</h3><p>Cuéntanos de tu marca y te escribimos con una propuesta para tu espacio.</p><label>Tu nombre<input id="in" autocomplete="name"></label><label>Nombre de tu marca<input id="ib"></label><label>Instagram o TikTok<input id="is" placeholder="@tumarca"></label><label>Ciudad y país<input id="ic"></label><label>¿Qué vendes?<select id="it"><option>Productos físicos</option><option>Conferencias, cursos o servicios</option><option>Viajes y experiencias</option><option>Belleza o cabello</option><option>Otro</option></select></label><label>Tu correo o WhatsApp<input id="ie"></label><div class="acts"><button class="btn wine" id="send">Enviar mi interés</button></div><p class="note">Se abrirá tu correo con el mensaje listo para enviar a Código ML. Tus datos no se publican.</p>', (ov, close) => {
      $("#send", ov).addEventListener("click", () => {
        const v = id => $("#" + id, ov).value.trim();
        if (!v("in") || !v("ie")) { const t = document.createElement("div"); t.className = "toast"; t.textContent = "Falta tu nombre y un medio de contacto."; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); return; }
        const body = ["Quiero mi boutique virtual en Código ML.", "", "Nombre: " + v("in"), "Marca: " + v("ib"), "Redes: " + v("is"), "Ciudad y país: " + v("ic"), "Vendo: " + v("it"), "Contacto: " + v("ie")].join("\n");
        close(); location.href = "mailto:" + D.email + "?subject=" + encodeURIComponent("Quiero mi boutique virtual · " + (v("ib") || v("in"))) + "&body=" + encodeURIComponent(body);
      });
    });
  }
  $("#want").addEventListener("click", interest);

  /* ---------- abrir la puerta ---------- */
  let opened = false;
  function open() {
    if (opened) return; opened = true; ac(); chime();
    scene.classList.add("opening"); $("#flash").classList.add("on"); doors.classList.add("open");
    setTimeout(() => { doors.classList.add("gone"); scene.classList.add("ready"); ["#top", "#hint", "#aL", "#aR"].forEach(s => $(s).hidden = false); ambience(); center(); }, 2900);
    setTimeout(() => { $("#hint").style.opacity = 0; }, 11000);
  }
  doors.addEventListener("click", open); doors.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  function center() { tour.scrollTo({ left: (tour.scrollWidth - tour.clientWidth) * 0.42 }); setTimeout(() => tour.scrollTo({ left: (tour.scrollWidth - tour.clientWidth) * 0.58, behavior: "smooth" }), 400); }
  $("#aL").addEventListener("click", () => tour.scrollBy({ left: -tour.clientWidth * 0.6, behavior: "smooth" }));
  $("#aR").addEventListener("click", () => tour.scrollBy({ left: tour.clientWidth * 0.6, behavior: "smooth" }));
  tour.addEventListener("scroll", () => { $("#hint").style.opacity = 0; }, { passive: true, once: true });
  /* arrastrar con el mouse */
  let dx = 0, sx = 0, down = false, moved = false;
  tour.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse" || e.target.closest(".hot")) return; down = true; moved = false; sx = e.clientX; dx = tour.scrollLeft; tour.classList.add("drag"); });
  window.addEventListener("pointermove", e => { if (!down) return; if (Math.abs(e.clientX - sx) > 3) moved = true; tour.scrollLeft = dx - (e.clientX - sx); });
  window.addEventListener("pointerup", () => { down = false; tour.classList.remove("drag"); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAmb(); else if (opened && on) ambience(); });
})();
