(function () {
  const $ = (s, r) => (r || document).querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* ---- Boutiques (cada una es solo datos: Villa Navidad y Raíz Verde se agregan aquí) ---- */
  const B = {
    "luz-de-casa": {
      name: "Luz de Casa", sub: "Velas artesanales", cur: "USD", cta: "Comprar", room: "img/luz-de-casa.jpg",
      points: [
        { x: 47, y: 68, l: "Mesa central", items: [
          { n: "Vela de soja en vaso de vidrio", d: "Aromas de vainilla, rosa y sándalo. 45 horas de duración.", p: 24, img: "mesa" },
          { n: "Difusor de varillas", d: "Aroma a orquídea y té blanco, frasco de vidrio. 120 ml.", p: 32, img: "difusores" } ] },
        { x: 62, y: 62, l: "Cajas regalo", items: [{ n: "Caja regalo de velas", d: "Tres velas pequeñas y tarjeta con tu mensaje.", p: 48, img: "cajas" }] },
        { x: 24, y: 44, l: "Velas rosa y marfil", items: [{ n: "Colección rosa y marfil", d: "Velas en vaso con tapa, cera de soja natural.", p: 28, img: "rosa" }] },
        { x: 35, y: 37, l: "Velas vino", items: [{ n: "Colección vino y noche", d: "Aromas intensos de cedro, higo y ámbar.", p: 30, img: "vino" }] },
        { x: 22, y: 67, l: "Canastas", items: [{ n: "Canasta de regalo", d: "Velas blancas y jabón artesanal en canasta tejida.", p: 56, img: "canastas" }] },
        { x: 49, y: 46, l: "Orquídeas", items: [{ n: "Arreglo de orquídeas", d: "Orquídeas naturales en florero de cristal.", p: 62, img: "orquideas" }] },
        { x: 88, y: 40, l: "Sets de regalo", items: [{ n: "Set de regalo con tarjeta", d: "Vela, difusor y tarjeta personalizada.", p: 54, img: "sets" }] },
        { x: 91, y: 58, l: "Mostrador", items: [{ n: "Vela personalizada con tu nombre", d: "Pedido especial. Entrega en 7 a 10 días.", p: 38, img: "mostrador" }] }
      ]
    }
  };
  const slug = (new URLSearchParams(location.search).get("b") || "luz-de-casa"), S = B[slug] || B["luz-de-casa"];
  document.title = S.name + " · Código ML";
  $("#sName").textContent = S.name; $("#sSub").textContent = S.sub; $("#bname").textContent = S.name;
  $("#roomImg").src = S.room; $("#roomImg").alt = "Interior de " + S.name;
  const money = v => new Intl.NumberFormat("en-US", { style: "currency", currency: S.cur, maximumFractionDigits: 0 }).format(v);
  const room = $("#room"), scene = $("#scene"), doors = $("#doors"), tour = $("#tour");

  /* ---- sonido muy suave (con botón para quitarlo) ---- */
  let ctx = null, on = true, pad = null;
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
  function tone(f, t0, dur, vol) { const c = ac(); if (!c || !on) return; const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f; const t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05); }
  const chime = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.28, 2.6, 0.035));
  const tick = () => { tone(880, 0, 0.7, 0.03); tone(1318.5, 0.08, 0.8, 0.02); };
  function ambience() { const c = ac(); if (!c || !on || pad) return; const g = c.createGain(); g.gain.value = 0; g.connect(c.destination); g.gain.linearRampToValueAtTime(0.02, c.currentTime + 4); pad = [261.63, 329.63, 392, 523.25].map(f => { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f; const og = c.createGain(); og.gain.value = 0.5; o.connect(og); og.connect(g); o.start(); return o; }); pad.g = g; }
  function stopAmb() { if (pad) { const c = ctx, p = pad; pad = null; p.g.gain.linearRampToValueAtTime(0, c.currentTime + 0.8); setTimeout(() => p.forEach(o => { try { o.stop(); } catch (e) {} }), 1000); } }
  $("#snd").addEventListener("click", e => { on = !on; e.currentTarget.setAttribute("aria-pressed", String(on)); if (on) ambience(); else stopAmb(); });

  /* ---- ventanas ---- */
  function modal(html, mount) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">×</button>' + html + "</div>"; document.body.appendChild(ov);
    const close = () => ov.remove(); ov.addEventListener("click", e => { if (e.target === ov) close(); }); $(".x", ov).addEventListener("click", close); mount && mount(ov, close); return close;
  }
  function zone(p) {
    modal("<h3>" + esc(p.l) + "</h3>" + p.items.map((it, i) => '<div class="item"><img class="sheet-photo" src="img/luz-' + it.img + '.jpg" alt="' + esc(it.n) + '"><div class="row"><div><b>' + esc(it.n) + "</b><span>" + esc(it.d) + '</span><span class="pp">' + money(it.p) + '</span></div><button class="btn wine" data-i="' + i + '">' + S.cta + "</button></div></div>").join("") + '<p class="note">Demostración: productos y precios de ejemplo.</p>', (ov, close) => {
      ov.querySelectorAll(".btn").forEach(b => b.addEventListener("click", () => { close(); buy(); }));
    });
  }
  function buy() {
    modal("<h3>Aquí se conectará tu tienda</h3><p>Este botón se conectará con el catálogo y el sistema de venta de la emprendedora (su tienda en línea, su WhatsApp o su sistema de reservas). Ella cobra directamente y gestiona la entrega.</p><p class=\"note\">Demostración: no se realiza ninguna compra.</p><div class=\"acts\"><button class=\"btn ghost\" id=\"ok\">Entendido</button></div>", (ov, close) => $("#ok", ov).addEventListener("click", close));
  }
  function interest() {
    modal('<h3>Quiero mi boutique virtual</h3><p>Cuéntanos de tu marca y te escribimos con una propuesta.</p><label>Tu nombre<input id="in" autocomplete="name"></label><label>Nombre de tu marca<input id="ib"></label><label>Instagram o TikTok<input id="is" placeholder="@tumarca"></label><label>Ciudad y país<input id="ic"></label><label>¿Qué vendes?<input id="it"></label><label>Tu correo o WhatsApp<input id="ie"></label><div class="acts"><button class="btn wine" id="send">Enviar mi interés</button></div><p class="note">Se abrirá tu correo con el mensaje listo para enviar a Código ML. Tus datos no se publican.</p>', (ov, close) => {
      $("#send", ov).addEventListener("click", () => {
        const v = id => $("#" + id, ov).value.trim();
        if (!v("in") || !v("ie")) { const t = document.createElement("div"); t.className = "toast"; t.textContent = "Falta tu nombre y un medio de contacto."; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); return; }
        const body = ["Quiero mi boutique virtual en Código ML.", "", "Nombre: " + v("in"), "Marca: " + v("ib"), "Redes: " + v("is"), "Ciudad y país: " + v("ic"), "Vendo: " + v("it"), "Contacto: " + v("ie")].join("\n");
        close(); location.href = "mailto:" + (window.CMLB ? CMLB.email : "codigomujerlibre@gmail.com") + "?subject=" + encodeURIComponent("Quiero mi boutique virtual · " + (v("ib") || v("in"))) + "&body=" + encodeURIComponent(body);
      });
    });
  }
  $("#want").addEventListener("click", interest);

  /* ---- puntos dorados ---- */
  S.points.forEach(p => { const b = document.createElement("button"); b.type = "button"; b.className = "hot"; b.style.left = p.x + "%"; b.style.top = p.y + "%"; b.setAttribute("data-l", p.l); b.setAttribute("aria-label", p.l); b.addEventListener("click", () => { if (tour.__moved) return; tick(); zone(p); }); room.appendChild(b); });

  /* ---- puerta y recorrido ---- */
  let opened = false;
  function open() {
    if (opened) return; opened = true; ac(); chime();
    scene.classList.add("opening"); $("#flash").classList.add("on"); doors.classList.add("open");
    setTimeout(() => { doors.classList.add("gone"); scene.classList.add("ready"); ["#top", "#hint", "#aL", "#aR"].forEach(s => $(s).hidden = false); ambience(); center(); }, 2900);
    setTimeout(() => { $("#hint").style.opacity = 0; }, 11000);
  }
  doors.addEventListener("click", open); doors.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  function center() { tour.scrollTo({ left: (tour.scrollWidth - tour.clientWidth) * 0.42 }); setTimeout(() => tour.scrollTo({ left: (tour.scrollWidth - tour.clientWidth) * 0.55, behavior: "smooth" }), 400); }
  $("#aL").addEventListener("click", () => tour.scrollBy({ left: -tour.clientWidth * 0.6, behavior: "smooth" }));
  $("#aR").addEventListener("click", () => tour.scrollBy({ left: tour.clientWidth * 0.6, behavior: "smooth" }));
  tour.addEventListener("scroll", () => { $("#hint").style.opacity = 0; }, { passive: true, once: true });
  let dx = 0, sx = 0, down = false;
  tour.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; tour.__moved = false; sx = e.clientX; dx = tour.scrollLeft; });
  window.addEventListener("pointermove", e => { if (!down) return; if (Math.abs(e.clientX - sx) > 4) { tour.__moved = true; tour.classList.add("drag"); } if (tour.__moved) tour.scrollLeft = dx - (e.clientX - sx); });
  window.addEventListener("pointerup", () => { down = false; tour.classList.remove("drag"); setTimeout(() => { tour.__moved = false; }, 60); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAmb(); else if (opened && on) ambience(); });
})();
