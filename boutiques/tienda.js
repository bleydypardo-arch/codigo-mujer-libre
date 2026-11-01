(function () {
  const $ = (s, r) => (r || document).querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* ---- Boutiques (cada una es solo datos: Villa Navidad y Raíz Verde se agregan aquí) ---- */
  const B = {
    "luz-de-casa": {
      pre: "luz-", name: "Luz de Casa", sub: "Velas artesanales", cur: "USD", cta: "Comprar (demo)", room: "img/luz-de-casa.jpg", door: "img/puerta-luz-de-casa.jpg", yaw0: 61, music: "audio/luz-de-casa.mp3",
      studio: { kind: "candle", title: "Haz tu propia vela", sub: "Elige el color, escribe tu nombre y mira cómo queda.", price: 38, opts: [{ n: "Rosa", c: "#f0b6c4", d: "#d98aa0" }, { n: "Vino", c: "#9b2c47", d: "#6e1830" }, { n: "Marfil", c: "#f3e6cd", d: "#d9c49b" }] },
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
    }    ,
    "raiz-verde": {
      pre: "raiz-", door: "img/puerta-raiz-verde.jpg", name: "Raíz Verde", sub: "Productos naturales", cur: "USD", cta: "Comprar (demo)", room: "img/raiz-verde.jpg", music: "audio/raiz-verde.mp3",
      studio: { kind: "soap", title: "Arma tu jabón de regalo", sub: "Elige el aroma, escribe tu nombre y mira cómo queda.", price: 12, opts: [{ n: "Lavanda", c: "#b9a1d6", d: "#8d72b4" }, { n: "Oliva", c: "#9fb27a", d: "#738a4c" }, { n: "Miel", c: "#e8c377", d: "#c19a45" }] },
      points: [
        { x: 15, y: 40, l: "Jabones líquidos y cuidado", items: [{ n: "Jabón líquido de manos", d: "Fórmula vegetal con aceites esenciales. Frasco de vidrio 300 ml.", p: 14, img: "estante1" }] },
        { x: 25, y: 47, l: "Cremas y lociones", items: [{ n: "Crema corporal natural", d: "Manteca de karité y aceite de coco. Sin parabenos.", p: 22, img: "estante2" }] },
        { x: 15, y: 63, l: "Jabones en barra", items: [{ n: "Jabón artesanal en barra", d: "Elaborado en frío con avena, lavanda y miel.", p: 9, img: "jabones" }] },
        { x: 45, y: 64, l: "Mesa central de jabones", items: [{ n: "Set de jabones artesanales", d: "Tres jabones envueltos a mano en caja de regalo.", p: 26, img: "centro" }] },
        { x: 44, y: 46, l: "Lavanda", items: [{ n: "Ramo de lavanda seca", d: "Para aromatizar tu casa o tu clóset. Cultivo orgánico.", p: 18, img: "lavanda" }] },
        { x: 57, y: 56, l: "Mesa del fondo", items: [{ n: "Bolsitas aromáticas", d: "Hierbas y flores secas en bolsa de lino.", p: 12, img: "fondo" }] },
        { x: 72, y: 62, l: "Canasta", items: [{ n: "Canasta de regalo natural", d: "Jabón, crema y aceite esencial en canasta tejida.", p: 58, img: "canasta" }] },
        { x: 73, y: 46, l: "Estante de aceites", items: [{ n: "Aceites esenciales", d: "Aceites puros para difusor y masajes.", p: 16, img: "estanteder" }] },
        { x: 85, y: 54, l: "Mostrador", items: [{ n: "Kit de bienvenida", d: "Selección de mini productos para conocer la marca.", p: 34, img: "mostrador" }] }
      ]
    }    ,
    "villa-navidad": {
      pre: "villa-", door: "img/puerta-villa-navidad.jpg", name: "Villa Navidad", sub: "Manualidades navideñas", cur: "USD", cta: "Comprar (demo)", music: "audio/villa-navidad.mp3",
      studio: { kind: "ball", title: "Crea tu esfera navideña", sub: "Elige el color, escribe tu nombre y mira cómo queda.", price: 22, opts: [{ n: "Rojo", c: "#c1272d", d: "#7e1218" }, { n: "Dorado", c: "#e2b857", d: "#a67c1f" }, { n: "Verde", c: "#2f6b45", d: "#173d27" }] },
      scenes: [
        { room: "img/villa-pasillo.jpg", span: 130, pmin: -4, pmax: 4, pitchEnd: 0,
          links: [{ x: 51, y: 60, l: "Ver el local en 360°", to: 1 }],
          points: [
            { x: 10, y: 45, l: "Papel y listones", items: [{ n: "Papel de regalo navideño", d: "Rollos y listones en rojo, dorado y marfil.", p: 8, img: "p-papel" }] },
            { x: 51, y: 70, l: "Mesa central", items: [{ n: "Muñeco de nieve y esferas", d: "Muñeco de peluche, esferas y velas decorativas.", p: 29, img: "p-mesa" }] },
            { x: 94, y: 33, l: "Esferas colgantes", items: [{ n: "Esferas de árbol", d: "Esferas rojas, doradas y plateadas. Caja de 12.", p: 36, img: "p-esferas" }] },
            { x: 78, y: 59, l: "Medias navideñas", items: [{ n: "Medias navideñas bordadas", d: "Para chimenea o puerta, bordadas a mano.", p: 18, img: "p-medias" }] },
            { x: 59, y: 43, l: "Árbol de Navidad", items: [{ n: "Árbol decorado", d: "Árbol en rojo, dorado y marfil con lazos.", p: 120, img: "p-arbol" }] },
            { x: 33, y: 55, l: "Mostrador", items: [{ n: "Figura del mostrador", d: "Muñeco navideño de colección.", p: 45, img: "p-mostrador" }] }
          ] },
        { room: "img/villa-centro.jpg", span: 360, yaw0: 0,
          links: [{ x: 43, y: 68, l: "Volver al pasillo", to: 0 }],
          points: [
            { x: 6, y: 37, l: "Árbol de Navidad", items: [{ n: "Adornos de árbol artesanales", d: "Esferas y lazos en rojo y dorado, hechos a mano. Set de 12.", p: 36, img: "c-arbol" }] },
            { x: 8, y: 80, l: "Cajas de regalo", items: [{ n: "Cajas de regalo decoradas", d: "Envueltas con listón dorado, listas para regalar.", p: 15, img: "c-regalos" }] },
            { x: 50, y: 58, l: "Casitas y velas", items: [{ n: "Casita de cerámica con luz", d: "Pintada a mano, con luz cálida interior.", p: 42, img: "c-mesa" }] },
            { x: 72, y: 62, l: "Mostrador", items: [{ n: "Muñecos del mostrador", d: "Pareja de muñecos navideños, edición limitada.", p: 45, img: "c-mostrador" }] },
            { x: 91, y: 45, l: "Figuras navideñas", items: [{ n: "Figuras navideñas de colección", d: "Muñecos y personajes de Navidad pintados a mano.", p: 28, img: "c-estante" }] },
            { x: 17, y: 38, l: "Renos y arbolitos", items: [{ n: "Renos y arbolitos decorativos", d: "Figuras blancas y doradas para el hogar.", p: 34, img: "c-izq" }] }
          ] }
      ]
    }
  };
  /* Luz de Casa: dos vistas conectadas */
  B["luz-de-casa"].scenes = [
    { room: "img/luz-entrada.jpg", yaw0: 68, links: [{ x: 70, y: 63, l: "Ver desde el centro", to: 1 }], points: [
      { x: 50, y: 72, l: "Mesa de velas", items: [{ n: "Velas de soja con frutas y flores", d: "Naranja, limón, lavanda, romero y rosa. 45 horas de duración.", p: 24, img: "e-mesa" }, { n: "Difusor de varillas", d: "Aroma a orquídea y té blanco, frasco de vidrio. 120 ml.", p: 32, img: "e-difusor" }] },
      { x: 48, y: 43, l: "Orquídeas", items: [{ n: "Arreglo de orquídeas", d: "Orquídeas naturales en florero de cristal.", p: 62, img: "e-orquidea" }] },
      { x: 25, y: 47, l: "Velas rosa y marfil", items: [{ n: "Colección rosa y marfil", d: "Velas en vaso con tapa, cera de soja natural.", p: 28, img: "e-izq" }] },
      { x: 36, y: 47, l: "Velas de colores", items: [{ n: "Colección de colores", d: "Aromas intensos y frutales en vaso de vidrio.", p: 30, img: "e-centro" }] },
      { x: 7, y: 63, l: "Rincón de descanso", items: [{ n: "Vela de ambiente", d: "Para tu sala o tu rincón favorito.", p: 32, img: "e-sillon" }] },
      { x: 91, y: 59, l: "Mostrador", items: [{ n: "Vela personalizada con tu nombre", d: "Pedido especial. Entrega en 7 a 10 días.", p: 38, img: "e-mostrador" }] }
    ] },
    { room: "img/luz-centro.jpg", span: 360, yaw0: 0, links: [{ x: 42, y: 62, l: "Volver a la entrada", to: 0 }, { x: 60, y: 70, l: "Ver el pasillo", to: 2 }], points: [
      { x: 46, y: 80, l: "Mesa de velas", items: [{ n: "Velas de soja en vaso de vidrio", d: "Aromas a lavanda, cítricos, rosa y vainilla. 45 horas de duración.", p: 24, img: "c-mesa" }] },
      { x: 56, y: 42, l: "Orquídeas", items: [{ n: "Arreglo de orquídeas", d: "Orquídeas naturales en florero de cristal.", p: 62, img: "c-orquidea" }] },
      { x: 25, y: 60, l: "Mostrador", items: [{ n: "Vela personalizada con tu nombre", d: "Pedido especial. Entrega en 7 a 10 días.", p: 38, img: "c-mostrador" }] },
      { x: 85, y: 50, l: "Estantes de velas", items: [{ n: "Colección de velas en frasco", d: "Frascos de colores con aromas de temporada.", p: 28, img: "c-der" }] },
      { x: 6, y: 50, l: "Velas y cajas", items: [{ n: "Cajas regalo de velas", d: "Tres velas pequeñas y tarjeta con tu mensaje.", p: 48, img: "c-izq" }] },
      { x: 73, y: 59, l: "Rincón de descanso", items: [{ n: "Vela de ambiente", d: "Para tu sala o tu rincón favorito.", p: 32, img: "c-sillon" }] }
    ] },
    { room: "img/luz-pasillo.jpg", span: 130, pmin: -4, pmax: 4, links: [{ x: 50, y: 66, l: "Volver al centro", to: 1 }], points: [
      { x: 36, y: 80, l: "Mesa de velas", items: [{ n: "Velas de soja con flores y cítricos", d: "Naranja, romero, lavanda y rosa. 45 horas de duración.", p: 24, img: "p-velas" }] },
      { x: 28, y: 50, l: "Orquídeas", items: [{ n: "Arreglo de orquídeas", d: "Orquídeas naturales en florero de cristal.", p: 62, img: "p-orquidea" }] },
      { x: 68, y: 61, l: "Mostrador", items: [{ n: "Vela personalizada con tu nombre", d: "Pedido especial. Entrega en 7 a 10 días.", p: 38, img: "p-mostrador" }] },
      { x: 92, y: 51, l: "Estantes de velas", items: [{ n: "Velas en frasco de colores", d: "Aromas de temporada en vaso de vidrio.", p: 28, img: "p-der" }] },
      { x: 7, y: 45, l: "Velas y cajas regalo", items: [{ n: "Caja regalo de velas", d: "Velas y tarjeta con tu mensaje.", p: 48, img: "p-izq" }] },
      { x: 50, y: 57, l: "Mesa del fondo", items: [{ n: "Set de regalo", d: "Vela, difusor y tarjeta personalizada.", p: 54, img: "p-fondo" }] }
    ] }
  ];
  /* fin Luz de Casa */  const slug = (new URLSearchParams(location.search).get("b") || "luz-de-casa"), S = B[slug] || B["luz-de-casa"];
  document.title = S.name + " · Código ML";
  if (S.door) document.querySelectorAll("#doors img").forEach(i => { i.src = S.door; });
  $("#sName").textContent = S.name; $("#sSub").textContent = S.sub; $("#bname").textContent = S.name;
  const money = v => new Intl.NumberFormat("en-US", { style: "currency", currency: S.cur, maximumFractionDigits: 0 }).format(v);
  const scene = $("#scene"), doors = $("#doors"), tour = $("#tour");

  /* ---- sonido muy suave (con botón para quitarlo) ---- */
  let ctx = null, on = true;
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
  function tone(f, t0, dur, vol) { const c = ac(); if (!c || !on) return; const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f; const t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05); }
  const chime = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.28, 2.6, 0.035));
  const tick = () => { tone(880, 0, 0.7, 0.03); tone(1318.5, 0.08, 0.8, 0.02); };
  /* música real: archivo por boutique (audio/<boutique>.mp3). Si no existe, queda en silencio. */
  let bg = null;
  function ambience() { if (!on || !S.music) return; if (!bg) { bg = new Audio(S.music); bg.loop = true; bg.volume = 0; bg.addEventListener("error", () => { bg = null; }); }
    const p = bg.play(); p && p.catch(() => {}); let v = 0; const f = setInterval(() => { if (!bg) return clearInterval(f); v = Math.min(.3, v + .02); bg.volume = v; if (v >= .3) clearInterval(f); }, 120); }
  function stopAmb() { if (bg) { bg.pause(); } }
  $("#snd").addEventListener("click", e => { on = !on; e.currentTarget.setAttribute("aria-pressed", String(on)); if (on) ambience(); else stopAmb(); });

  /* ---- ventanas ---- */
  function modal(html, mount) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">×</button>' + html + "</div>"; document.body.appendChild(ov);
    const close = () => ov.remove(); ov.addEventListener("click", e => { if (e.target === ov) close(); }); $(".x", ov).addEventListener("click", close); mount && mount(ov, close); return close;
  }
  function zone(p) {
    modal("<h3>" + esc(p.l) + "</h3>" + p.items.map((it, i) => '<div class="item"><img class="sheet-photo" src="img/' + S.pre + it.img + '.jpg" alt="' + esc(it.n) + '"><div class="row"><div><b>' + esc(it.n) + "</b><span>" + esc(it.d) + '</span><span class="pp">' + money(it.p) + '</span><span class="demo">Producto de demostración · sin compra real conectada</span></div><button class="btn wine" data-i="' + i + '">' + S.cta + "</button></div></div>").join("") + '<p class="note">Demostración: productos y precios de ejemplo.</p>', (ov, close) => {
      ov.querySelectorAll(".btn").forEach(b => b.addEventListener("click", () => { const it = p.items[+b.dataset.i]; close(); buy(it.n, it.url, it.p, S.pre + it.img); }));
    });
  }
  function buy(name, url, price, img) {
    modal('<h3>Vas a la tienda de ' + esc(S.name) + '</h3><p>' + (name ? '<b>' + esc(name) + '</b><br>' : '') + 'Para pagar y coordinar la entrega pasas a la tienda de la emprendedora: su catálogo, su WhatsApp o su tienda en línea. Ella cobra directamente.</p><div class="acts"><button class="btn ghost" id="bk">Seguir recorriendo</button><button class="btn wine" id="go">Continuar a su tienda</button></div><p class="note">Demostración: se abrirá una página de ejemplo. En una boutique real se abre el enlace de compra de ese producto.</p>', (ov, close) => {
      $("#bk", ov).addEventListener("click", close);
      $("#go", ov).addEventListener("click", () => { const u = url || ("pago-demo.html?b=" + slug + "&n=" + encodeURIComponent(name || "") + "&p=" + (price || 0) + "&i=" + encodeURIComponent(img || "")); window.open(u, "_blank", "noopener"); close(); });
    });
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


  /* ---- experiencia inmersiva: crea el tuyo ---- */
  function art(kind, o, name) {
    const nm = esc(name || "Tu nombre"), fs = (name || "").length > 9 ? 30 : 40, F = "font-family=\"Great Vibes,Cormorant Garamond,cursive\"";
    if (kind === "candle") return '<svg viewBox="0 0 300 340" role="img" aria-label="Vela personalizada"><defs><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset=".25" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient><linearGradient id="wx" x1="0" x2="1"><stop offset="0" stop-color="' + o.c + '"/><stop offset="1" stop-color="' + o.d + '"/></linearGradient><radialGradient id="fl" cx=".5" cy=".7"><stop offset="0" stop-color="#fff7c8"/><stop offset=".6" stop-color="#ffc247"/><stop offset="1" stop-color="#ff8a2b" stop-opacity="0"/></radialGradient></defs><ellipse cx="150" cy="312" rx="96" ry="12" fill="#000" opacity=".16"/><ellipse cx="150" cy="84" rx="70" ry="60" fill="url(#fl)" opacity=".45"/><path d="M150 40c14 22 16 38 0 52-16-14-14-30 0-52z" fill="url(#fl)"/><rect x="148" y="86" width="4" height="22" fill="#3a2a22"/><rect x="62" y="104" width="176" height="204" rx="22" fill="url(#wx)"/><rect x="62" y="104" width="176" height="204" rx="22" fill="url(#gl)"/><rect x="62" y="104" width="176" height="204" rx="22" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><ellipse cx="150" cy="104" rx="88" ry="10" fill="#fff" opacity=".25"/><rect x="86" y="168" width="128" height="92" rx="6" fill="#fff8ec" stroke="#c9a45c" stroke-width="1.5"/><rect x="92" y="174" width="116" height="80" rx="3" fill="none" stroke="#c9a45c" stroke-width=".8"/><text x="150" y="196" text-anchor="middle" font-size="11" letter-spacing="3" fill="#9a6f2c" font-family="Inter,sans-serif">LUZ DE CASA</text><text x="150" y="236" text-anchor="middle" font-size="' + fs + '" fill="#3a2314" ' + F + '>' + nm + '</text></svg>';
    if (kind === "ball") return '<svg viewBox="0 0 300 340" role="img" aria-label="Esfera personalizada"><defs><radialGradient id="bs" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".12" stop-color="' + o.c + '"/><stop offset="1" stop-color="' + o.d + '"/></radialGradient></defs><ellipse cx="150" cy="322" rx="84" ry="9" fill="#000" opacity=".14"/><path d="M150 18v34" stroke="#b58a2c" stroke-width="3"/><circle cx="150" cy="16" r="8" fill="none" stroke="#b58a2c" stroke-width="3"/><rect x="128" y="48" width="44" height="22" rx="5" fill="#d9ae4a"/><rect x="128" y="48" width="44" height="7" rx="3" fill="#f3d98a"/><circle cx="150" cy="186" r="118" fill="url(#bs)"/><path d="M64 156c56 22 116 22 172 0" fill="none" stroke="#f3d98a" stroke-width="3" opacity=".9"/><text x="150" y="214" text-anchor="middle" font-size="' + (fs + 4) + '" fill="#fff3cf" ' + F + '>' + nm + '</text><g fill="#f3d98a" opacity=".9"><circle cx="92" cy="130" r="3"/><circle cx="212" cy="262" r="3"/><circle cx="108" cy="268" r="2"/><circle cx="204" cy="128" r="2"/></g></svg>';
    return '<svg viewBox="0 0 300 340" role="img" aria-label="Jabón personalizado"><defs><linearGradient id="sp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + o.c + '"/><stop offset="1" stop-color="' + o.d + '"/></linearGradient></defs><ellipse cx="150" cy="294" rx="110" ry="12" fill="#000" opacity=".14"/><rect x="48" y="104" width="204" height="170" rx="26" fill="url(#sp)"/><rect x="48" y="104" width="204" height="60" rx="26" fill="#fff" opacity=".18"/><rect x="48" y="150" width="204" height="86" fill="#fbf4e4"/><rect x="48" y="150" width="204" height="86" fill="none" stroke="#d9c49b" stroke-width="1.5"/><path d="M48 160h204M48 226h204" stroke="#c9a45c" stroke-width=".8" stroke-dasharray="3 4"/><text x="150" y="176" text-anchor="middle" font-size="10" letter-spacing="3" fill="#6b7a45" font-family="Inter,sans-serif">RAÍZ VERDE</text><text x="150" y="215" text-anchor="middle" font-size="' + fs + '" fill="#3a2a1a" ' + F + '>' + nm + '</text><path d="M150 104v170" stroke="#8a6a3a" stroke-width="3" opacity=".7"/><path d="M150 96c-22-26-44-24-52-6 20 8 40 8 52 6zM150 96c22-26 44-24 52-6-20 8-40 8-52 6z" fill="#6d8a4a"/></svg>';
  }
  function makeYours() {
    const st = S.studio; let cur = st.opts[0], nm = "";
    modal('<h3>' + esc(st.title) + '</h3><p>' + esc(st.sub) + '</p><div class="art" id="art"></div><label>Tu nombre<input id="nm" maxlength="14" autocomplete="off" placeholder="Escribe tu nombre"></label><div class="chips" id="chips">' + st.opts.map((o, i) => '<button type="button" class="chip' + (i ? "" : " on") + '" data-i="' + i + '"><i style="background:' + o.c + '"></i>' + o.n + "</button>").join("") + '</div><div class="acts"><span class="pp2">' + money(st.price) + '</span><button class="btn wine" id="mine">Pedir el mío</button></div><p class="note">Demostración: en tu boutique este botón se conecta con tu sistema de pedidos.</p>', (ov, close) => {
      const draw = () => { $("#art", ov).innerHTML = art(st.kind, cur, nm); };
      draw(); $("#nm", ov).addEventListener("input", e => { nm = e.target.value.trim(); draw(); });
      ov.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => { ov.querySelectorAll(".chip").forEach(x => x.classList.remove("on")); b.classList.add("on"); cur = st.opts[+b.dataset.i]; tick(); draw(); }));
      $("#mine", ov).addEventListener("click", () => { close(); buy(st.title.replace(/^\S+ \S+ /, "") + (nm ? " · " + nm : ""), st.url, st.price, "mini-" + slug); });
    });
  }
  $("#mk").textContent = S.studio.title; $("#mk").addEventListener("click", makeYours);
  /* ---- panorama esférico (una o varias vistas conectadas) ---- */
  const cv = $("#gl"), hots = $("#hots"), SC = S.scenes || [S];
  let P = null, zoom = 1, hotEls = [], cur = 0, busy = false;
  const base = () => { const a = cv.clientWidth / Math.max(1, cv.clientHeight); return a < 1 ? Math.min(100, 2 * Math.atan(Math.tan(35 * Math.PI / 180) / a) * 180 / Math.PI) : 72; };
  const applyFov = () => { if (P) P.S.fov = Math.min(base() * zoom, P.span / 2 - .01); };
  function paint() { if (!P) return; applyFov(); P.draw(); hotEls.forEach(h => { const q = P.project(h.p.x, h.p.y); if (!q) { h.el.style.visibility = "hidden"; return; } h.el.style.visibility = "visible"; h.el.style.left = q.x + "px"; h.el.style.top = q.y + "px"; }); }
  function setHots(sc) {
    hots.innerHTML = ""; hotEls = [];
    (sc.points || []).forEach(p => { const b = document.createElement("button"); b.type = "button"; b.className = "hot"; b.setAttribute("data-l", p.l); b.setAttribute("aria-label", p.l); b.addEventListener("click", () => { if (drag.moved) return; tick(); zone(p); }); hots.appendChild(b); hotEls.push({ p, el: b }); });
    (sc.links || []).forEach(p => { const b = document.createElement("button"); b.type = "button"; b.className = "hot go"; b.setAttribute("data-l", p.l); b.setAttribute("aria-label", p.l); b.textContent = "➜"; b.addEventListener("click", () => { if (drag.moved) return; tick(); loadScene(p.to, false); }); hots.appendChild(b); hotEls.push({ p, el: b }); });
  }
  function loadScene(i, first) {
    if (busy) return; busy = true; const sc = SC[i], im = new Image();
    im.onload = () => {
      const go = () => {
        P = CMLPano(cv, im, { span: sc.span || 360, yaw: sc.yaw0 || 0, pitch: sc.pitch0 || 0, fov: 75, pitchMin: sc.pmin == null ? -22 : sc.pmin, pitchMax: sc.pmax == null ? 32 : sc.pmax });
        if (!P) { $("#tour").classList.add("nogl"); busy = false; return; }
        P.span = sc.span || 360; cur = i; setHots(sc); zoom = first ? 1.45 : 1.35; paint(); cv.style.opacity = 1; busy = false;
        if (!first) { const z0 = zoom, t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - k, 3); zoom = z0 + (1 - z0) * e; paint(); if (k < 1) requestAnimationFrame(f); })(t0); }
      };
      if (first) go(); else { cv.style.opacity = 0; setTimeout(go, 320); }
    }; im.src = sc.room;
  }
  loadScene(0, true); window.addEventListener("resize", () => requestAnimationFrame(paint));

  /* ---- arrastrar para mirar alrededor (dedo o mouse) ---- */
  const drag = { on: false, moved: false, x: 0, y: 0, vx: 0, vy: 0, id: null };
  const degPerPx = () => { const vf = P.S.fov, hf = 2 * Math.atan(Math.tan(vf * Math.PI / 360) * cv.clientWidth / cv.clientHeight) * 180 / Math.PI; return { h: hf / cv.clientWidth, v: vf / cv.clientHeight }; };
  tour.addEventListener("pointerdown", e => { if (!P || e.target.closest(".arr,#snd")) return; drag.on = true; drag.moved = false; drag.x = e.clientX; drag.y = e.clientY; drag.vx = drag.vy = 0; drag.id = e.pointerId; tour.setPointerCapture && tour.setPointerCapture(e.pointerId); stopInertia(); });
  tour.addEventListener("pointermove", e => { if (!drag.on || !P) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true; if (!drag.moved) return; const k = degPerPx(); P.S.yaw -= dx * k.h; P.S.pitch += dy * k.v; drag.vx = dx * k.h; drag.vy = dy * k.v; drag.x = e.clientX; drag.y = e.clientY; tour.classList.add("drag"); $("#hint").style.opacity = 0; paint(); });
  const endDrag = () => { if (!drag.on) return; drag.on = false; tour.classList.remove("drag"); if (drag.moved) inertia(); setTimeout(() => { drag.moved = false; }, 80); };
  tour.addEventListener("pointerup", endDrag); tour.addEventListener("pointercancel", endDrag);
  let raf = 0; const stopInertia = () => cancelAnimationFrame(raf);
  function inertia() { stopInertia(); const step = () => { drag.vx *= .94; drag.vy *= .94; if (Math.abs(drag.vx) + Math.abs(drag.vy) < .02) return; P.S.yaw -= drag.vx; P.S.pitch += drag.vy; paint(); raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
  tour.addEventListener("wheel", e => { if (!P) return; e.preventDefault(); zoom = Math.max(.55, Math.min(1.3, zoom * (e.deltaY > 0 ? 1.06 : .94))); paint(); }, { passive: false });
  const turn = d => { if (!P) return; stopInertia(); const t0 = P.S.yaw, t1 = t0 + d, st = performance.now(); (function f(t) { const k = Math.min(1, (t - st) / 600), e = 1 - Math.pow(1 - k, 3); P.S.yaw = t0 + (t1 - t0) * e; paint(); if (k < 1) requestAnimationFrame(f); })(st); };
  $("#aL").addEventListener("click", () => turn(-40)); $("#aR").addEventListener("click", () => turn(40));

  /* avanzar / retroceder: la cámara se acerca o se aleja con suavidad */
  function walk(k) { if (!P) return; stopInertia(); const z0 = zoom, z1 = Math.max(.5, Math.min(1.35, z0 * k)), t0 = performance.now(); tick(); (function f(t) { const q = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - q, 3); zoom = z0 + (z1 - z0) * e; paint(); if (q < 1) requestAnimationFrame(f); })(t0); }
  $("#wf").addEventListener("click", () => walk(.72)); $("#wb").addEventListener("click", () => walk(1.32));

  /* ---- puerta: se abre y la cámara avanza hacia adentro ---- */
  let opened = false;
  function enter() {
    if (!P) return; const z0 = zoom, z1 = 1, t0 = performance.now(), yaw0 = P.S.yaw, pit0 = P.S.pitch;
    (function f(t) { const k = Math.min(1, (t - t0) / 4200), e = 1 - Math.pow(1 - k, 3); zoom = z0 + (z1 - z0) * e; P.S.pitch = pit0 + (SC[0].pitchEnd == null ? -4 : SC[0].pitchEnd) * e; paint(); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function open() {
    if (opened) return; opened = true; ac(); chime();
    scene.classList.add("opening"); $("#flash").classList.add("on"); doors.classList.add("open"); enter();
    setTimeout(() => { doors.classList.add("gone"); scene.classList.add("ready"); ["#top", "#hint", "#aL", "#aR", "#walk"].forEach(s => $(s).hidden = false); ambience(); }, 2900);
    setTimeout(() => { $("#hint").style.opacity = 0; }, 12000);
  }
  doors.addEventListener("click", open); doors.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });

  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAmb(); else if (opened && on) ambience(); });
})();
