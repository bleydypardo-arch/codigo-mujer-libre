(function () {
  const C = window.CMLV, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = n => Number.isInteger(n) ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : n.toFixed(2).replace(".", ",");
  let pais = null, asesora = null;
  const cp = () => pais ? C.precios[pais] : null;
  const money = n => { const c = cp() || C.precios.do; return c.moneda + num(n) + c.sufijo; };
  const P = id => C.paquetes.find(p => p.id === id);
  const PR = id => { const c = cp(); return c && c.p ? c.p[id] : null; };
  const dep = id => { const r = PR(id); return r ? r.feria * C.pago.separa : null; };
  const IMG = "ventas/img/";
  const vp = $("#viewport"), world = $("#world"), img = $("#img"), layer = $("#layer"), bg = $("#bg"), fade = $("#fade");

  /* ---------- salas ---------- */
  const q = (id, pts, w, h, html, cls) => ({ id, pts, w, h, html, cls });
  const hot = (x, y, l, a, notag) => ({ x, y, l, a, notag });
  const pk = id => { const p = P(id); return '<div class="pk ' + id + '" role="button" tabindex="0" data-a="pack:' + id + '" aria-label="Paquete ' + p.nombre + '"><b>' + p.nombre + "</b><span class=\"l\">" + esc(p.lema) + '</span><span class="p">Ver paquete</span></div>'; };
  const tvHtml = '<div class="tv"><h4><small>Código ML</small>Elige qué quieres ver</h4><div class="row">' +
    '<button class="tile" data-a="demo:centro"><i>▶</i><b>Centro comercial</b><span>Recorre tres boutiques de ejemplo, como si estuvieras ahí.</span></button>' +
    '<button class="tile" data-a="demo:luz"><i>▶</i><b>Una boutique por dentro</b><span>Entra a “Luz de Casa” y toca los productos.</span></button>' +
    '<button class="tile" data-a="demo:pasos"><i>▶</i><b>Cómo funcionan los paquetes</b><span>Gold, Platinum y Diamond en seis pasos.</span></button>' +
    '</div><div class="ft">Toca la pantalla para empezar</div></div>';

  const demoScreen = '<button type="button" class="ds" data-a="cml" aria-label="Ver el demo de Código Mujer Libre">' +
    [1, 2, 3, 4].map(n => '<i style="background-image:url(ventas/img/demo-' + n + '.webp);animation-delay:' + (n - 1) * 5 + 's"></i>').join("") +
    '<span class="dsl"></span><span class="dst"><small>Código Mujer Libre</small><b>Conoce el hotel<br>por dentro</b><em>▶ Ver demo · ES / EN</em></span></button>';
  const ROOMS = [
    { id: "puerta", name: "Entrada", src: "puerta.webp", w: 941, h: 1672, fit: "tall", focus: 50, quads: [],
      hs: [hot(50.5, 51.3, "Toca para entrar", "go:1")], hint: "Toca la puerta para entrar",
      guion: "<h5>Qué decir</h5><p>“Bienvenida a la Sala de reservas y ventas de Código ML. En unos minutos vas a ver cómo tu marca puede tener su propia boutique dentro de un hotel virtual.”</p><h5>Qué hacer</h5><ul><li>Pídele que toque la puerta dorada.</li></ul>" },
    { id: "recepcion", name: "Recepción", src: "recepcion.webp", w: 1774, h: 887, fit: "wide", focus: 60, quads: [q("cml", [[928,262],[1084,262],[1084,446],[928,446]], 320, 380, demoScreen)],
      hs: [hot(67.8, 41, "Bienvenida", "bienvenida"), hot(75.5, 57, "Boutique inaugural", "tienda"), hot(22, 62, "Charla de capacitación", "charla"), hot(97.4, 47.5, "Sala de paquetes →", "go:2")],
      hint: "Desliza para mirar alrededor · toca los puntos dorados",
      guion: "<h5>Qué decir</h5><p>“Esta es la recepción de nuestro hotel virtual. Código ML reúne bienestar, comunidad y boutiques de mujeres emprendedoras en un solo lugar.”</p><h5>Qué mostrar</h5><ul><li><b>Boutique inaugural:</b> cómo participar en el sorteo.</li><li><b>Charla de capacitación:</b> cómo expandir y vender más.</li><li>Pasillo de la derecha: sala de paquetes.</li></ul><h5>Cuidado</h5><ul><li>No prometas resultados de ventas.</li><li>El sorteo se cuenta con calma: sin prisa, sin presión.</li></ul>" },
    { id: "paquetes", name: "Sala de paquetes", src: "paquetes.webp", w: 1774, h: 887, fit: "wide", focus: 50,
      quads: [q("p1", [[580, 272], [764, 260], [764, 470], [580, 470]], 300, 330, pk("gold")), q("p2", [[795, 255], [993, 255], [993, 472], [795, 472]], 300, 330, pk("platinum")), q("p3", [[1025, 254], [1241, 251], [1241, 470], [1025, 472]], 300, 330, pk("diamond"))],
      hs: [hot(49.6, 62, "Comparar los tres", "comparar"), hot(2.6, 45, "← Recepción", "go:1"), hot(97.6, 49, "Salón de demos →", "go:3")],
      hint: "Toca un paquete para voltear la tarjeta",
      guion: "<h5>Qué decir</h5><p>“Tenemos tres paquetes. Todos incluyen tu puerta con tu logo y el botón que lleva a tu tienda. Cambia cuánto espacio, cuántos productos y cuánta experiencia tiene tu boutique.”</p><h5>Qué mostrar</h5><ul><li>Toca cada panel: la tarjeta se voltea y muestra lo que incluye.</li><li>La tableta de la mesa abre la comparación.</li></ul><h5>Precio de feria</h5><ul><li>Solo durante la feria. El precio normal rige desde el 1 de enero de 2027.</li><li>Se separa con el 30 %.</li><li>La mensualidad empieza cuando la dueña recibe su boutique.</li></ul>" },
    { id: "salon", name: "Salón de demos", src: "salon.webp", w: 941, h: 1671, fit: "tall", focus: 50,
      quads: [q("tv", [[343, 497], [850, 392], [850, 822], [343, 786]], 960, 540, tvHtml)],
      hs: [hot(45.7, 59, "Separar mi cupo", "reservar")], hint: "Toca la pantalla para ver el demo",
      guion: "<h5>Qué decir</h5><p>“En esta pantalla puedes ver cómo se siente una boutique de verdad. Toca la opción que quieras.”</p><h5>Qué mostrar</h5><ul><li><b>Centro comercial:</b> tres boutiques de ejemplo.</li><li><b>Una boutique por dentro:</b> entra y toca los productos.</li><li><b>Cómo funcionan los paquetes:</b> seis diapositivas.</li></ul><h5>Cuidado</h5><ul><li>Los productos y precios del demo son de ejemplo. Dilo claro.</li></ul>" },
    { id: "oficina", name: "Oficina de reservas", src: "oficina.webp", w: 941, h: 1670, fit: "tall", focus: 50,
      quads: [],
      hs: [hot(13, 28, "Bienestar", "pilar:0", 1), hot(33.8, 29.8, "Comunidad", "pilar:1", 1), hot(51.5, 31.3, "Viajes", "pilar:2", 1), hot(13, 44.6, "Crece y Florece", "pilar:3", 1), hot(33.8, 44.8, "Emprende", "pilar:4", 1), hot(51.5, 44.8, "Boutiques", "pilar:5", 1), hot(40.2, 59.4, "Reservar mi cupo", "reservar"), hot(59.3, 58.1, "Condiciones", "condiciones", 1)],
      hint: "Toca las esferas para conocer cada pilar · la tableta separa tu cupo",
      guion: "<h5>Qué decir</h5><p>“Estos seis pilares son todo lo que vive en Código ML. Tu boutique es uno de ellos. Para separar tu cupo, toca la tableta del escritorio.”</p><h5>Cierre</h5><ul><li>Confirma el paquete y el país.</li><li>Pregunta si quiere separar hoy con el 30 %.</li><li>Anota su código de representante en el formulario.</li><li>Lee con ella la letra pequeña (libro rojo).</li></ul>" },
    { id: "mioficina", name: "Mi oficina", src: "mioficina.webp", w: 1774, h: 887, fit: "wide", focus: 75,
      quads: [q("o_metas", [[1256,318],[1398,330],[1398,390],[1256,384]], 273, 120, CMLO.panel("metas")),q("o_plan", [[1413,331],[1520,344],[1520,397],[1413,393]], 233, 120, CMLO.panel("plan")),q("o_mujeres", [[1531,347],[1609,359],[1609,403],[1531,398]], 178, 120, CMLO.panel("mujeres")),q("o_incent", [[1255,401],[1399,404],[1399,473],[1255,476]], 230, 120, CMLO.panel("incent")),q("o_saldo", [[1413,408],[1520,409],[1520,466],[1413,468]], 214, 120, CMLO.panel("saldo")),q("o_reglas", [[1531,414],[1609,415],[1609,463],[1531,465]], 189, 120, CMLO.panel("reglas"))],
      hs: [hot(12.4,37.5,"Speech","of:speech",1),hot(19.6,39.5,"Entrenamiento","of:entrenamiento",1),hot(25.8,40.4,"Estrategia","of:estrategia",1),hot(12.4,45.9,"Liderazgo","of:liderazgo",1),hot(19.7,45.9,"Marketing","of:marketing",1),hot(25.8,46.2,"Ventas","of:ventas",1),hot(12.4,52.2,"Bienestar","of:bienestar",1),hot(19.7,52.2,"Experiencias","of:experiencias",1),hot(25.8,51.9,"Premium","of:premium",1),hot(73.3,62.6,"Mi agenda","tools:agenda",1),hot(50,63,"Mis herramientas","tools:inicio"),hot(84.3,58.3,"Mi saldo","of:saldo",1),hot(90,57.5,"Reunión con Jazz","of:reunion",1),hot(68.5,69,"Reglas","of:reglas",1),hot(2.2,55,"← Recepción","go:1"),hot(22.3,71,"Tu frase de hoy","of:frase")],
      hint: "Toca los tableros, los estantes y el escritorio · toca el mar",
      guion: "<h5>Tu oficina</h5><p>Aquí tienes tus metas, tu plan semanal, tu lista de mujeres y tu biblioteca. Toca los tableros de la pared y los libros del estante.</p>",
      live: { sea: { x: 622, y: 440, w: 436, h: 38 }, sun: [760, 428], glow: { x: 610, y: 490, w: 460, h: 62 }, fire: [[836, 514]], lamps: [[645, 534], [1043, 534]] } },
  ];
  const PUB = 5;
  let cur = 0, S = 1, sndOn = true, ctx = null, pad = null, opened = false;

  /* ---------- homografía: pega contenido sobre un cuadrilátero de la foto ---------- */
  function homog(w, h, p) {
    const s = [[0, 0], [w, 0], [w, h], [0, h]], A = [], b = [];
    for (let i = 0; i < 4; i++) { const [x, y] = s[i], [X, Y] = p[i]; A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.push(X); A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.push(Y); }
    const n = 8;
    for (let i = 0; i < n; i++) { let m = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[m][i])) m = r; [A[i], A[m]] = [A[m], A[i]]; [b[i], b[m]] = [b[m], b[i]];
      for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; } }
    const x = Array(n); for (let i = n - 1; i >= 0; i--) { let t = b[i]; for (let c = i + 1; c < n; c++) t -= A[i][c] * x[c]; x[i] = t / A[i][i]; }
    return "matrix3d(" + [x[0], x[3], 0, x[6], x[1], x[4], 0, x[7], 0, 0, 1, 0, x[2], x[5], 0, 1].join(",") + ")";
  }
  let Z = 1;
  function layout() {
    const R = ROOMS[cur], sw = vp.clientWidth, sh = vp.clientHeight;
    S = (R.fit === "wide" ? Math.max(sh / R.h, sw / R.w) : sh / R.h) * Z;
    world.style.width = R.w * S + "px"; world.style.height = R.h * S + "px";
    R.quads.forEach(k => { const el = $("#q-" + k.id, layer); if (el) el.style.transform = homog(k.w, k.h, k.pts.map(p => [p[0] * S, p[1] * S])); });
    const sc = world.offsetWidth > sw + 4; $("#pL").hidden = !sc; $("#pR").hidden = !sc;
  }

  /* ---------- mostrar una sala ---------- */
  function show(i, silent) {
    cur = i; Z = 1; const R = ROOMS[i];
    img.src = IMG + R.src; img.alt = R.name; bg.style.backgroundImage = "url(" + IMG + R.src + ")";
    layer.innerHTML = "";
    R.quads.forEach(k => { const d = document.createElement("div"); d.className = "quad"; d.id = "q-" + k.id; d.style.width = k.w + "px"; d.style.height = k.h + "px"; d.innerHTML = k.html; layer.appendChild(d); });
    R.hs.forEach(h => { const b = document.createElement("button"); b.type = "button"; b.className = "hot" + (h.notag ? " notag" : "") + (h.x > 88 ? " rt" : h.x < 12 ? " lt" : ""); b.style.left = h.x + "%"; b.style.top = h.y + "%"; b.dataset.a = h.a; b.setAttribute("aria-label", h.l); b.innerHTML = '<span class="tag">' + esc(h.l) + "</span>"; layer.appendChild(b); });
    layout();
    vp.scrollLeft = Math.max(0, world.offsetWidth * R.focus / 100 - vp.clientWidth / 2); vp.scrollTop = 0;
    { const b = $("#b360"); if (b) { b.hidden = R.id !== "mioficina" && R.id !== "recepcion"; b.textContent = (window.CMLI && CMLI.lang === "en") ? "Explore in 360°" : "Recorrer en 360°"; } }
    $("#roomName").textContent = R.name; $("#hintTx").textContent = R.hint;
    const hint = $("#hint"); hint.style.opacity = 1; clearTimeout(show.t); show.t = setTimeout(() => hint.style.opacity = 0, 9000);
    $$("#dots button").forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    window.CMLSea && (R.live ? CMLSea.start(layer, img, S, R.live) : CMLSea.stop());
    $("#bPrev").disabled = i === 0; const nx = $("#bNext"); nx.disabled = i >= PUB - 1; nx.querySelector("span").textContent = i === 0 ? "Entrar" : i === PUB - 2 ? "Última sala" : "Siguiente";
    nx.style.visibility = i >= PUB - 1 ? "hidden" : "visible";
    const nxt = i + 1 < PUB && ROOMS[i + 1]; if (nxt) { const im = new Image(); im.src = IMG + nxt.src; }
    renderGuion(); try { history.replaceState(null, "", "#sala" + i); } catch (e) {}
  }
  function go(i) {
    if (i < 0 || i >= ROOMS.length) return;
    if (i >= PUB && !asesora) { toast("Esta oficina es solo para asesoras."); return; }
    if (i > 0 && !opened) { opened = true; ac(); chime(); ambience(); }
    fade.classList.add("on"); setTimeout(() => { show(i); setTimeout(() => fade.classList.remove("on"), 60); }, 460);
  }
  /* ---------- ventanas ---------- */
  function modal(html, mount, wide) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="md' + (wide ? " wide" : "") + '" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">×</button>' + html + "</div>"; document.body.appendChild(ov);
    const close = () => { ov.remove(); document.removeEventListener("keydown", esck); };
    const esck = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esck); ov.addEventListener("click", e => { if (e.target === ov) close(); }); $(".x", ov).addEventListener("click", close);
    $$("[data-m]", ov).forEach(b => b.addEventListener("click", () => { const m = b.dataset.m; close(); act(m); }));
    mount && mount(ov, close); return close;
  }
  function toast(t) { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 3200); }
  const store = (k, v) => { try { const a = JSON.parse(localStorage.getItem(k) || "[]"); if (v) { a.push(v); localStorage.setItem(k, JSON.stringify(a)); } return a; } catch (e) { return []; } };
  function csv(rows, name) {
    if (!rows.length) { toast("Todavía no hay registros."); return; }
    const cols = Object.keys(rows[0]), esc2 = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    const t = "﻿" + [cols.join(",")].concat(rows.map(r => cols.map(c => esc2(r[c])).join(","))).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/csv;charset=utf-8" })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  const paisOpts = sel => C.paises.map(p => "<option" + (p === sel ? " selected" : "") + ">" + esc(p) + "</option>").join("");

  /* ---------- contenidos ---------- */
  function bienvenida() {
    modal('<div class="kick">Bienvenida</div><h3>Un hotel virtual hecho para mujeres</h3><p>Código ML reúne bienestar, comunidad, experiencias y boutiques de mujeres emprendedoras en un mismo lugar. Cada marca tiene su propia puerta, su propio local y sus visitas.</p><p>En esta sala puedes conocer los paquetes, ver cómo se siente una boutique y separar tu cupo.</p><div class="acts"><button class="bt2 w" data-m="go:2">Ver los paquetes</button></div>');
  }
  function charla() {
    modal('<div class="kick">Charla de capacitación</div><h3>Cómo expandir tu boutique y vender más</h3><p>Una charla práctica para emprendedoras que quieren que su marca se vea de lujo y llegue a más mujeres.</p><ul class="ck"><li>Cómo presentar tus productos para que se vean de alta gama.</li><li>Cómo llevar a tus seguidoras a tu boutique desde Instagram, TikTok y WhatsApp.</li><li>Cómo aprovechar las campañas del centro comercial, como Día de la Madre o Black Friday.</li><li>Tiempo para tus preguntas.</li></ul><p class="note">Pregunta a la representante por la próxima fecha y las condiciones.</p><div class="acts"><button class="bt2 w" data-m="reservar">Quiero más información</button></div>');
  }
  const ESTILOS = ["Elegante y de lujo", "Minimalista", "Natural y orgánico", "Colorido y alegre", "Romántico y femenino", "Moderno", "Artesanal"];
  const VENDE = ["Mi propia tienda en línea (Shopify, WooCommerce u otra)", "Una página o landing page", "WhatsApp o Instagram", "Un marketplace (Amazon, Mercado Libre, Etsy…)", "Aún no vendo en línea"];
  function tienda() {
    const opt = a => a.map(t => "<option>" + esc(t) + "</option>").join(""), chk = (n, a) => '<div class="opts">' + a.map(t => '<label><input type="checkbox" name="' + n + '" value="' + esc(t) + '"> ' + esc(t) + "</label>").join("") + "</div>";
    modal('<div class="kick">Boutique inaugural</div><h3>Vive la experiencia de tener tu propia boutique</h3><p>Participa en el sorteo de una de las 5 boutiques inaugurales del hotel virtual de Código ML.</p><ul class="ck"><li>Tu boutique diseñada para tu marca, con 15 productos con foto, precio y descripción.</li><li>1 hora de asesoría guiada con la diseñadora de tu tienda, para crear todo tu diseño.</li><li>Una pequeña experiencia virtual dentro de tu tienda.</li><li>1 hora de asesoría para atraer público y hacer crecer tu tienda.</li><li>6 meses de alojamiento en el hotel virtual sin mensualidad.</li><li>Te enseñamos a manejar tu boutique.</li></ul><p><b>Cómo es el sorteo:</b> todas las mujeres inscritas participan y se escogerán 5 al azar. Las boutiques se entregan durante ' + esc(C.entrega) + '.</p>' +
      '<form id="sf" autocomplete="off"><div class="fsec"><h4>1. Sobre ti</h4><div class="grid2"><label>Nombre completo<input name="nombre" required autocomplete="name"></label><label>WhatsApp<input name="whatsapp" required inputmode="tel" autocomplete="tel"></label><label>Correo<input name="correo" type="email" autocomplete="email"></label><label>País<select name="pais">' + paisOpts(cp() ? cp().nombre : "") + '</select></label><label>Ciudad<input name="ciudad"></label><label>Instagram o TikTok<input name="redes" placeholder="@tumarca"></label></div></div>' +
      '<div class="fsec"><h4>2. Tu emprendimiento</h4><div class="grid2"><label>Nombre de tu emprendimiento<input name="marca" required></label><label>¿Qué vendes?<input name="producto" required></label><label>¿Cuánto tiempo llevas?<select name="tiempo">' + opt(["Menos de 6 meses", "6 a 12 meses", "1 a 3 años", "Más de 3 años"]) + '</select></label><label>¿Ya tienes ventas?<select name="ventas">' + opt(["Sí, con frecuencia", "A veces", "Aún no"]) + '</select></label></div></div>' +
      '<div class="fsec"><h4>3. Cómo vendes en línea</h4><label>¿Tienes logo?<select name="logo">' + opt(["Sí", "No"]) + '</select></label><label>¿Dónde vendes tus productos en línea?</label>' + chk("donde", VENDE) + '<label>Link de tu tienda o página (el más importante)<input name="link" type="url" placeholder="https://"></label><p class="note">Lo necesitamos para que el botón de compra de tu boutique lleve a tu tienda.</p></div>' +
      '<div class="fsec"><h4>4. Tus productos</h4><p class="note">En tu boutique caben 15 productos.</p><div class="grid2"><label>¿Cuántos productos tiene tu línea?<input name="cuantos" inputmode="numeric"></label></div><label>Tus productos líderes (los que quieres en tu boutique)<textarea name="lideres" rows="3"></textarea></label></div>' +
      '<div class="fsec"><h4>5. Tu estilo</h4><label>¿Qué estilo tiene tu marca?</label>' + chk("estilo", ESTILOS) + '<label>¿Qué colores usa tu marca?<input name="colores" placeholder="Ej. dorado, blanco y vino"></label></div>' +
      '<label class="chk" style="margin-top:16px"><input type="checkbox" name="ok" required> Acepto que Código ML me contacte sobre el sorteo y que mis datos de contacto se usen solo para eso.</label><div class="acts"><button class="bt2 w" type="submit">Participar en el sorteo</button><a class="bt2 g" href="ventas/formulario.html" target="_blank" rel="noopener">Imprimir formulario en blanco</a></div>' +
      '</form><p class="note" style="margin-top:14px">Participar no garantiza ventas ni una cantidad de dinero: Código ML no asegura resultados económicos a las tiendas. Las condiciones completas del sorteo se entregan por escrito.</p>', (ov, close) => {
        $("#sf", ov).addEventListener("submit", e => {
          e.preventDefault(); const f = e.target, v = n => f[n].value.trim(), m = n => [...f.querySelectorAll('[name="' + n + '"]:checked')].map(x => x.value).join("; ");
          const d = { fecha: new Date().toLocaleString("es-CO"), nombre: v("nombre"), whatsapp: v("whatsapp"), correo: v("correo"), pais: f.pais.value, ciudad: v("ciudad"), redes: v("redes"), emprendimiento: v("marca"), producto: v("producto"), tiempo: f.tiempo.value, ventas: f.ventas.value, logo: f.logo.value, donde_vende: m("donde"), link_tienda: v("link"), productos_en_linea: v("cuantos"), productos_lideres: v("lideres"), estilo: m("estilo"), colores: v("colores"), asesora: asesora ? asesora.codigo : "" };
          store("cml_sorteo", d); const n = store("cml_sorteo").length; close(); renderGuion();
          modal('<div class="kick">Listo</div><h3>Ya estás participando, ' + esc(d.nombre.split(" ")[0]) + '</h3><p>Registramos tu participación (n.º ' + n + '). Se escogerán 5 mujeres al azar y te escribiremos por WhatsApp con las novedades del sorteo.</p><div class="acts"><button class="bt2 g" data-m="go:2">Ver los paquetes</button></div>');
        });
      }, true);
  }
  function packCard(id) {
    const p = P(id), r = PR(id), col = { gold: "#8E6420", platinum: "#5B5F72", diamond: "#5C0A24" }[id];
    const fr = r ? '<div class="nor">Precio normal <s>' + money(r.normal) + '</s></div><div class="fer">PRECIO DE FERIA</div><div class="pr">' + money(r.feria) + '</div><div class="mo">pago único de diseño · + ' + money(r.mensual) + ' al mes cuando abras</div>'
      : '<div class="nor"></div><div class="fer">PRECIO DE FERIA</div><div class="pr" style="font-size:34px;line-height:1.1">Pregúntalo a tu asesora</div><div class="mo">Cada país tiene su propio precio.</div>';
    const hrs = p.horas + (p.horas === 1 ? " hora" : " horas") + " en vivo contigo · " + p.trabajo + " horas de diseño y producción de tu boutique";
    return '<div class="flip" id="fl" aria-live="polite"><div class="in"><div class="fc fr">' + (p.destacado ? '<span class="badge">★ ' + esc(p.destacado) + "</span>" : "") + '<h4 style="color:' + col + '">' + p.nombre + '</h4><div class="lm">' + esc(p.lema) + "</div>" + fr + '<div class="tp">Toca para ver qué incluye ⟲</div></div><div class="fc bk"><h5>' + p.nombre + ' incluye</h5><div class="hr">' + esc(hrs) + (r ? " · para separar hoy " + money(dep(id)) : "") + '</div><ul><li>' + p.salas + (p.salas === 1 ? " sala" : " salas conectadas, como habitaciones de tu tienda") + "</li><li>" + p.productos + " productos publicados</li>" + p.incluye.filter(t => !/^\d+ salas?|productos con foto/.test(t)).map(t => "<li>" + esc(t) + "</li>").join("") + "</ul></div></div></div>";
  }
  function pack(id) {
    const c = cp();
    modal('<div class="kick">Oferta de feria</div><h3>Elige el paquete que va contigo</h3><div class="tabs" role="tablist">' + C.paquetes.map(p => '<button role="tab" data-t="' + p.id + '" aria-selected="' + (p.id === id) + '">' + p.nombre + "</button>").join("") + '</div><div id="pc">' + packCard(id) + '</div><div class="acts"><button class="bt2 w" id="rs">Reservar este paquete</button><button class="bt2 g" data-m="comparar">Comparar los tres</button></div><p class="note">' + (c ? esc(c.nota) + " " : "") + "Condiciones completas en la letra pequeña.</p>", (ov, close) => {
      let k = id; const bind = () => { const f = $("#fl", ov); f.addEventListener("click", () => f.classList.toggle("f")); };
      bind(); $$(".tabs button", ov).forEach(b => b.addEventListener("click", () => { k = b.dataset.t; $$(".tabs button", ov).forEach(x => x.setAttribute("aria-selected", String(x === b))); $("#pc", ov).innerHTML = packCard(k); bind(); }));
      $("#rs", ov).addEventListener("click", () => { close(); reservar(k); });
    });
  }
  function comparar() {
    const ps = C.paquetes, row = (l, f) => "<tr><td>" + l + "</td>" + ps.map(p => "<td>" + f(p) + "</td>").join("") + "</tr>", has = !!cp();
    const exp = p => p.id === "gold" ? "—" : p.id === "platinum" ? "1" : "2 a tu medida", hrs = p => p.horas + (p.horas === 1 ? " hora" : " horas");
    modal('<div class="kick">Comparar</div><h3>Los tres paquetes, lado a lado</h3><div class="cmpw"><table class="cmp"><thead><tr><th>Qué incluye</th>' + ps.map(p => "<th>" + p.nombre + "</th>").join("") + "</tr></thead><tbody>" +
      (has ? row("Precio normal (desde 1 ene 2027)", p => "<s>" + money(PR(p.id).normal) + "</s>") + row("<b>Precio de feria</b> (pago único)", p => "<b>" + money(PR(p.id).feria) + "</b>") + row("Para separar hoy (" + Math.round(C.pago.separa * 100) + " %)", p => money(dep(p.id))) + row("Mensualidad (desde que abres)", p => money(PR(p.id).mensual)) : row("Precio de feria", () => "Pregunta a tu asesora")) +
      row("Sesiones en vivo contigo", hrs) + row("Horas de diseño y producción de tu boutique", p => p.trabajo + " horas") + row("Salas de tu boutique", p => p.salas) + row("Productos publicados", p => p.productos) +
      row("Puerta con tu logo y nombre", () => "✓") + row("Botón de compra a tu tienda", () => "✓") + row("Música", p => ({ gold: "De ambiente", platinum: "La eliges tú", diamond: "Hecha para tu marca" }[p.id])) + row("Experiencia virtual", exp) +
      row("Informe mensual de visitas y clics", p => p.id === "gold" ? "—" : "✓") + row("Destacada en tu categoría", p => p.id === "gold" ? "—" : "✓") + row("Destacada en el inicio del hotel", p => p.id === "diamond" ? "✓" : "—") + row("Evento en vivo cada mes", p => p.id === "diamond" ? "✓" : "—") +
      row("Inducción para manejar tu tienda", p => ({ gold: "1 hora", platinum: "1,5 horas", diamond: "2 horas + 30 días de acompañamiento" }[p.id])) +
      '</tbody></table></div><p class="note" style="margin-top:12px">Tus ventas son tuyas: el botón de compra lleva a tu propia tienda, donde cobras tú. Código ML no cobra comisión por tus ventas.</p><div class="acts"><button class="bt2 w" data-m="reservar">Reservar mi cupo</button></div>', null, true);
  }
  const PIL = [
    { n: "Bienestar", ic: "✿", t: "Spa y rituales de calma: pausas, respiración y cuidado personal para el día a día." },
    { n: "Comunidad", ic: "♡", t: "Grupos de mujeres, encuentros y el Club de Fundadoras, con beneficios en nuestra red." },
    { n: "Viajes", ic: "✈", t: "Escapadas y experiencias para vivir junto a otras mujeres." },
    { n: "Crece y Florece", ic: "❦", t: "Contenido y herramientas para crecer: lectura, reflexión y hábitos." },
    { n: "Emprende", ic: "✦", t: "Un espacio para quienes emprenden: capacitación, conexiones y visibilidad." },
    { n: "Boutiques", ic: "◈", t: "Tu local virtual: puerta con tu logo, productos en vitrinas y un botón de compra que lleva a tu tienda.", cta: true }
  ];
  function pilar(i) {
    const p = PIL[i];
    modal('<div class="pil"><div class="ic">' + p.ic + '</div><div><div class="kick">Pilar ' + (i + 1) + " de 6</div><h3>" + esc(p.n) + "</h3></div></div><p>" + esc(p.t) + "</p>" + (p.cta ? '<div class="acts"><button class="bt2 w" data-m="go:2">Ver los paquetes</button><button class="bt2 g" data-m="reservar">Reservar mi cupo</button></div>' : ""));
  }
  function condiciones() {
    modal('<div class="kick">Letra pequeña</div><h3>Léela con calma</h3><ul class="ck">' + C.letraPequena.map(t => "<li>" + esc(t) + "</li>").join("") + '</ul><p class="note">La política de reembolso de la reserva se entrega por escrito al separar el cupo.</p>');
  }
  function reservar(pre) {
    const opts = C.paquetes.map(p => { const r = PR(p.id); return '<option value="' + p.id + '"' + (p.id === pre ? " selected" : "") + ">" + p.nombre + (r ? " · " + money(r.feria) : "") + "</option>"; }).join("") + '<option value="">Aún no sé, quiero asesoría</option>';
    const pc = Math.round(C.pago.separa * 100), nom = cp() ? cp().nombre : "";
    modal('<div class="kick">Separa tu cupo</div><h3>Tu boutique en el hotel de Código ML</h3><p>Déjanos tus datos y te escribimos para confirmar tu paquete. Para separar se paga el ' + pc + " % del precio de feria y el resto en " + C.pago.cuotas + " pagos antes del " + esc(C.pago.limite) + "; tu boutique se entrega durante " + esc(C.entrega) + ".</p>" +
      '<form id="rf" autocomplete="off"><div class="grid2"><label>Tu nombre<input name="nombre" required autocomplete="name"></label><label>WhatsApp<input name="whatsapp" required inputmode="tel" autocomplete="tel"></label><label>País<select name="pais">' + paisOpts(nom) + '</select></label><label>Tu marca<input name="marca"></label><label>Paquete<select name="paq">' + opts + '</select></label><label>Código de asesora<input name="rep" value="' + esc(asesora ? asesora.codigo : "") + '"></label></div><div id="rsum" class="note" style="margin-top:10px"></div><div class="acts"><button class="bt2 w" type="submit">' + (C.whatsapp ? "Enviar por WhatsApp" : "Enviar mi solicitud") + '</button><button class="bt2 g" type="button" data-m="condiciones">Ver condiciones</button></div></form>', (ov, close) => {
      const f = $("#rf", ov), sum = () => { const r = PR(f.paq.value); $("#rsum", ov).textContent = r ? "Precio de feria " + money(r.feria) + " · para separar hoy " + money(r.feria * C.pago.separa) + " · mensualidad " + money(r.mensual) + " desde que abres." : ""; };
      f.paq.addEventListener("change", sum); sum();
      f.addEventListener("submit", e => {
        e.preventDefault(); const p = P(f.paq.value), r = p && PR(p.id);
        const d = { fecha: new Date().toLocaleString("es-CO"), nombre: f.nombre.value.trim(), whatsapp: f.whatsapp.value.trim(), pais: f.pais.value, marca: f.marca.value.trim(), paquete: p ? p.nombre : "Asesoría", precio_feria: r ? money(r.feria) : "", para_separar: r ? money(r.feria * C.pago.separa) : "", asesora: f.rep.value.trim() };
        store("cml_reservas", d); renderGuion();
        const msg = ["Hola, quiero separar mi cupo en Código ML.", "", "Nombre: " + d.nombre, "WhatsApp: " + d.whatsapp, "País: " + d.pais, "Marca: " + d.marca, "Paquete: " + d.paquete + (r ? " (precio de feria " + d.precio_feria + ", para separar " + d.para_separar + ")" : ""), d.asesora ? "Asesora: " + d.asesora : ""].filter((x, i) => x !== "" || i < 2).join("\n");
        close();
        const url = C.whatsapp ? "https://wa.me/" + C.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(msg) : "mailto:" + C.email + "?subject=" + encodeURIComponent("Separar cupo · " + (d.marca || d.nombre)) + "&body=" + encodeURIComponent(msg);
        modal('<div class="kick">Gracias</div><h3>Recibimos tu solicitud, ' + esc(d.nombre.split(" ")[0]) + '</h3><p>Guardamos tus datos. ' + (C.whatsapp ? "Toca el botón para enviarnos el mensaje ya escrito por WhatsApp." : "Toca el botón para abrir tu correo con el mensaje ya escrito.") + '</p><div class="acts"><a class="bt2 w" href="' + url + '" target="_blank" rel="noopener">' + (C.whatsapp ? "Abrir WhatsApp" : "Abrir mi correo") + "</a></div>");
      });
    });
  }

  /* música de la sala: se calla mientras hay un demo o herramienta abierta y vuelve al cerrar */
  let ovN = 0;
  const ovOpen = () => { ovN++; stopAmb(); };
  const ovClose = () => { ovN = Math.max(0, ovN - 1); if (!ovN && opened && sndOn) ambience(); };
  /* ---------- demo en pantalla completa ---------- */
  function demo(which) {
    const dv = document.createElement("div"); dv.className = "dv dvb"; ovOpen();
    dv.innerHTML = '<div class="bar"><b>Código ML · Demo</b><div class="sw"><button data-w="centro">Centro comercial</button><button data-w="luz">Una boutique</button><button data-w="pasos">Los paquetes</button></div><button id="dh" type="button">↺ Inicio del demo</button><button class="cl" id="dx">← Volver a la sala</button></div><div id="dbody" style="flex:1;display:flex;flex-direction:column;min-height:0"></div>';
    document.body.appendChild(dv);
    let done = false; const close = () => { if (done) return; done = true; dv.remove(); document.removeEventListener("keydown", ek); ovClose(); }, ek = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", ek); $("#dx", dv).addEventListener("click", close); $("#dh", dv).addEventListener("click", () => set(curW));
    const body = $("#dbody", dv);
    let curW = which;
    function set(w) {
      curW = w;
      $$(".sw button", dv).forEach(b => b.classList.toggle("on", b.dataset.w === w));
      if (w === "pasos") return slides(body, close);
      body.innerHTML = '<iframe title="Demo" src="' + (w === "luz" ? "tienda.html?b=luz-de-casa" : "centro.html") + '" allow="autoplay"></iframe>';
    }
    $$(".sw button", dv).forEach(b => b.addEventListener("click", () => set(b.dataset.w))); set(which);
  }
  function slides(body, closeAll) {
    const S6 = [
      { k: "Código ML", h: "Tu boutique dentro de un hotel de lujo", p: "Una puerta con tu logo, un local con tu estilo y tus productos a la vista. Tus clientas entran, recorren y compran en tu tienda.", bg: "recepcion.webp" },
      { k: "Tu puerta", h: "Tus clientas entran como a una tienda de lujo", p: "Cada producto se ve con detalle, con su descripción y su precio. El botón de compra lleva a tu propia tienda: tú cobras y tú entregas.", bg: "puerta.webp" },
      { k: "Tres paquetes", h: "Elige el que va contigo", cards: true, bg: "paquetes.webp" },
      { k: "Experiencias", h: "Un momento que tus clientas recuerdan", p: "Una clienta entra a tu boutique de velas, elige la fragancia, el color y escribe su nombre en la etiqueta. Ve su vela “armarse” en pantalla y la compra en tu tienda.", bg: "salon.webp" },
      { k: "Así de simple", h: "Cómo creamos tu boutique", steps: ["Separas tu cupo con el 30 %.", "Nos envías logo, fotos y productos.", "Sesión con tu diseñadora.", "Construimos y te mostramos.", "Entrega durante " + C.entrega + ".", "Inducción y a vender."], bg: "oficina.webp" },
      { k: "Es tu momento", h: "Separa tu cupo hoy", p: "Precio de feria solo durante la feria. Habla con nuestra representante o toca el botón.", cta: true, bg: "recepcion.webp" }
    ];
    let i = 0; body.innerHTML = '<div class="sl"><div class="bgi"></div><button class="ar l" aria-label="Anterior">‹</button><div class="tx"></div><button class="ar r" aria-label="Siguiente">›</button><div class="dt"></div></div>';
    const sl = $(".sl", body), tx = $(".tx", sl), dt = $(".dt", sl);
    function draw() {
      const s = S6[i]; $(".bgi", sl).style.backgroundImage = "url(" + IMG + s.bg + ")";
      tx.innerHTML = '<div class="kk">' + esc(s.k) + "</div><h2>" + esc(s.h) + "</h2>" + (s.p ? "<p>" + esc(s.p) + "</p>" : "") +
        (s.cards ? '<div class="cards">' + C.paquetes.map(p => { const r = PR(p.id); return '<div class="c"><b>' + p.nombre + "</b><em>" + esc(p.lema) + "</em>" + (r ? "<s>Normal " + money(r.normal) + "</s><strong>" + money(r.feria) + "</strong><small>+ " + money(r.mensual) + " al mes · " + p.trabajo + " h de diseño y producción</small>" : '<strong style="font-size:22px">Pregunta el precio</strong><small>' + p.salas + (p.salas === 1 ? " sala" : " salas") + " · " + p.productos + " productos</small>") + "</div>"; }).join("") + "</div>" : "") +
        (s.steps ? '<div class="stp">' + s.steps.map((t, k) => "<div><b>" + (k + 1) + ".</b> " + esc(t) + "</div>").join("") + "</div>" : "") +
        (s.cta ? '<div class="acts"><button class="bt2 w" id="sr">Reservar mi cupo</button></div>' : "");
      dt.innerHTML = S6.map((_, k) => "<i" + (k === i ? ' class="on"' : "") + "></i>").join("");
      const r = $("#sr", tx); if (r) r.addEventListener("click", () => { closeAll(); reservar(); });
    }
    $(".ar.l", sl).addEventListener("click", () => { i = (i + S6.length - 1) % S6.length; draw(); }); $(".ar.r", sl).addEventListener("click", () => { i = (i + 1) % S6.length; draw(); });
    let sx = null; sl.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true }); sl.addEventListener("touchend", e => { if (sx == null) return; const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) { i = (i + (d < 0 ? 1 : S6.length - 1)) % S6.length; draw(); } sx = null; });
    draw();
  }

  /* ---------- sala de asesoras: código, guion, precios, objeciones, sorteo ---------- */
  let tab = "sala";
  const OBJ = [
    ["“Es caro” o “ahora no tengo”", "Se separa con el " + Math.round(C.pago.separa * 100) + " % y el resto se paga en " + C.pago.cuotas + " pagos antes del " + C.pago.limite + ". La mensualidad empieza cuando recibe su boutique. Si el presupuesto está justo, empieza por el Gold: después puede subir."],
    ["“¿Código ML me cobra comisión por mis ventas?”", "No. El botón de compra lleva a su propia tienda: ella cobra y ella entrega. Código ML no procesa pagos de productos."],
    ["“¿Y si no vendo?”", "No prometemos ventas. Le damos una vitrina de lujo, su puerta con su logo, visitas de una comunidad de mujeres y herramientas para compartir su boutique. Cuánto vende depende de su marca y de cómo la comparta."],
    ["“¿Cuándo recibo mi boutique?”", "Durante " + C.entrega + ", en el orden en que se separaron los cupos. Antes tiene una sesión con su diseñadora para elegir estilo, colores y música."],
    ["“¿Puedo cambiar mis productos?”", "Sí: en la inducción le enseñamos a manejar su tienda. Para ti: el panel de administración se está terminando, así que no prometas fechas ni funciones exactas."],
    ["“¿Y si me arrepiento?”", "La política de reembolso de la reserva se entrega por escrito al separar el cupo. No la improvises: léela con ella."],
    ["“No tengo mis productos listos”", "No hace falta hoy. Hay tiempo hasta enero: le damos una guía sencilla para preparar logo, fotos y lista de productos con precios."],
    ["“¿Qué es una sala conectada?”", "Una boutique puede tener varias salas, como habitaciones de una tienda de lujo, unidas por puertas o flechas. Gold tiene 1, Platinum 3 y Diamond 5."]
  ];
  const PLAN = [["0:00", "Puerta", "Bienvenida. Pídele que toque la puerta dorada."], ["1:00", "Recepción", "Presenta el hotel. Muestra la boutique inaugural y el sorteo."], ["3:00", "Sala de paquetes", "Voltea cada tarjeta. Explica lo que incluye cada paquete."], ["6:00", "Salón de demos", "Pon el demo en la pantalla: el centro comercial o una boutique por dentro."], ["8:00", "Oficina de reservas", "Las seis esferas, la letra pequeña y la tableta para separar."], ["10:00", "Cierre", "Pregunta si quiere separar hoy. Anota su código de asesora."]];
  if (window.CMLI && CMLI.lang === "en" && window.CMLD) { CMLD.OBJ.forEach(function (o, k) { if (OBJ[k]) OBJ[k] = o; }); CMLD.PLAN.forEach(function (o, k) { if (PLAN[k]) PLAN[k] = o; }); }
  function tabHtml() {
    if (tab === "precios") {
      const c = cp(), eq = c.equiv;
      if (!c.p) return "<h5>Precios · " + esc(c.nombre) + "</h5><p>Todavía no hay lista de precios para este país. Pregúntale a Jazz antes de dar un precio.</p>";
      return "<h5>Precios · " + esc(c.nombre) + '</h5><table class="cmp" style="font-size:12.5px"><thead><tr><th></th>' + C.paquetes.map(p => "<th>" + p.nombre + "</th>").join("") + "</tr></thead><tbody>" +
        [["Feria", r => money(r.feria) + (eq ? "<br><small>≈ " + eq.moneda + num(Math.round(r.feria * eq.tasa / 100) * 100) + "</small>" : "")], ["Normal (ene 2027)", r => "<s>" + money(r.normal) + "</s>"], ["Separar hoy (" + Math.round(C.pago.separa * 100) + " %)", r => money(r.feria * C.pago.separa)], ["Mensualidad", r => money(r.mensual)]].map(([l, f]) => "<tr><td>" + l + "</td>" + C.paquetes.map(p => "<td>" + f(c.p[p.id]) + "</td>").join("") + "</tr>").join("") + "</tbody></table>" +
        "<p style='margin-top:8px'>" + esc(c.nota) + "</p><h5>Pago</h5><ul><li>Separa con el " + Math.round(C.pago.separa * 100) + " %.</li><li>El resto en " + C.pago.cuotas + " pagos antes del " + esc(C.pago.limite) + ".</li><li>La boutique se entrega cuando el pago está completo.</li></ul><h5>Cuidado</h5><ul><li>No muestres ni menciones los precios de otro país.</li><li>No prometas ventas ni un día exacto de entrega: es durante " + esc(C.entrega) + ".</li></ul>";
    }
    if (tab === "plan") return "<h5>Recorrido de 10 minutos</h5><ul style='list-style:none;padding:0'>" + PLAN.map(x => "<li style='margin-bottom:9px'><b>" + x[0] + " · " + x[1] + "</b><br>" + x[2] + "</li>").join("") + "</ul><h5>Al final del día</h5><ul><li>Descarga el CSV del sorteo y de las reservas (abajo).</li><li>Haz el sorteo al cierre, frente a todas.</li></ul>";
    if (tab === "obj") return "<h5>Si te dicen…</h5>" + OBJ.map(o => "<p><b>" + esc(o[0]) + "</b><br>" + esc(o[1]) + "</p>").join("");
    return ROOMS[cur0].guion;
  }
  let cur0 = 0;
  function renderGuion() {
    cur0 = cur; if (!asesora) return;
    $(".gh b").textContent = asesora.nombre + " · " + cp().nombre;
    $("#gBody").innerHTML = '<div class="gtabs">' + [["sala", "Esta sala"], ["precios", "Precios"], ["plan", "10 min"], ["obj", "Objeciones"]].map(t => '<button data-t="' + t[0] + '" aria-selected="' + (t[0] === tab) + '">' + t[1] + "</button>").join("") + "</div>" + tabHtml();
    $$("#gBody .gtabs button").forEach(b => b.addEventListener("click", () => { tab = b.dataset.t; renderGuion(); }));
    const a = store("cml_sorteo").length, b = store("cml_reservas").length;
    $("#gLeads").innerHTML = "<div>Sorteo: <b>" + a + "</b> participantes · Reservas: <b>" + b + '</b></div><button id="dW" ' + (a ? "" : "disabled") + '>Sortear 5 ganadoras</button><button id="dS" ' + (a ? "" : "disabled") + '>Descargar participantes (CSV)</button><button id="dR" ' + (b ? "" : "disabled") + '>Descargar reservas (CSV)</button><button id="dP" class="lt">Formulario en blanco para imprimir</button><button id="dO" class="lt">Cerrar sesión de asesora</button>';
    $("#dW").addEventListener("click", sortear); $("#dS").addEventListener("click", () => csv(store("cml_sorteo"), "sorteo-codigo-ml.csv")); $("#dR").addEventListener("click", () => csv(store("cml_reservas"), "reservas-codigo-ml.csv")); $("#dO").addEventListener("click", logout); $("#dP").addEventListener("click", () => window.open("ventas/formulario.html", "_blank"));
  }
  const setRep = on => { $("#guion").hidden = !on; $("#bRep").setAttribute("aria-pressed", String(on)); if (on) renderGuion(); };
  const vpais = a => { try { return (a.admin && sessionStorage.getItem("cml_vista")) || a.pais; } catch (e) { return a.pais; } };
  function login(a) { asesora = a; pais = vpais(a); try { sessionStorage.setItem("cml_asesora", a.codigo); } catch (e) {} setRep(true); toast("Hola, " + a.nombre + ". Precios de " + cp().nombre + " activados."); }
  function logout() { asesora = null; pais = null; try { sessionStorage.removeItem("cml_sesion"); sessionStorage.removeItem("cml_asesora"); localStorage.removeItem("cml_asesora"); } catch (e) {} setRep(false); toast("Sesión de asesora cerrada. Ya no se muestran precios."); }
  const find = c => (C.asesoras || []).find(a => a.codigo.toLowerCase() === String(c).trim().toLowerCase());
  function askCode() {
    if (document.querySelector(".pg")) return;
    const g = document.createElement("div"); g.className = "pg"; g.setAttribute("role", "dialog"); g.setAttribute("aria-label", "Entrada de asesoras");
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(k => k === "" ? "<span></span>" : '<button type="button" data-k="' + k + '" aria-label="' + (k === "del" ? "Borrar" : k) + '">' + (k === "del" ? "⌫" : k) + "</button>").join("");
    g.innerHTML = '<div class="pgk"><div class="pgt">Sala de asesoras</div><div class="pgs">Escribe tu código</div><div class="pgd"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="pgm" aria-live="polite"></div><div class="pgn">' + keys + '</div><button class="pgx" type="button">Cancelar</button></div><div class="pgc"></div><div class="pgl"></div><div class="pgr"></div>';
    document.body.appendChild(g);
    let code = "", busy = false;
    const dots = [...g.querySelectorAll(".pgd i")], msg = g.querySelector(".pgm");
    const paint = () => dots.forEach((d, n) => d.classList.toggle("on", n < code.length));
    const end = () => { document.removeEventListener("keydown", kd); g.classList.add("out"); setTimeout(() => g.remove(), 500); };
    function add(k) {
      if (busy) return; msg.textContent = "";
      if (k === "del") code = code.slice(0, -1); else if (code.length < 6) code += k;
      paint(); tone(520 + code.length * 60, 0, .18, .05);
      if (code.length === 6 || (code.length === 4 && find(code))) check();
    }
    function check() {
      busy = true; const c = code;
      const fail = m => { g.querySelector(".pgk").classList.add("bad"); tone(180, 0, .35, .06); msg.textContent = m || "Ese código no es válido. Inténtalo de nuevo."; setTimeout(() => { g.querySelector(".pgk").classList.remove("bad"); code = ""; paint(); busy = false; }, 700); };
      (window.CMLACC ? CMLACC.login(c) : Promise.resolve({ ok: false, error: "sin_backend" })).then(r => {
        let a = null;
        if (r && r.ok) a = { codigo: r.id, nombre: r.nombre, pais: r.pais, admin: r.rol === "admin" };
        else if (r && r.error === "sin_backend") a = find(c);
        else return fail(({ bloqueado: "Tu acceso está desactivado. Escríbele a Jazz.", vencido: "Tu código venció. Pídele a Jazz el nuevo.", demasiados: "Demasiados intentos. Espera unos minutos.", sin_conexion: "No hay internet." })[r && r.error]);
        if (!a) return fail();
        proceed(a);
      });
    }
    function proceed(a) {
      dots.forEach(d => d.classList.add("ok")); tone(660, 0, .5, .06); tone(880, .15, .6, .05); tone(1175, .3, .8, .05);
      const pc = C.precios[a.pais], nom = a.nombre.split("·")[0].trim();
      setTimeout(() => g.classList.remove("open"), 650);
      setTimeout(() => {
        g.querySelector(".pgc").innerHTML = '<div class="pgc-in"><div class="pgc-k">Bienvenida, ' + esc(nom) + '</div><div class="pgc-p">' + esc(pc.nombre) + '</div><div class="pgc-n">Precios en ' + esc((pc.moneda + pc.sufijo).trim() || "tu moneda") + ' activados · tu guion de venta está listo</div><button class="bt2 w pgc-b" type="button">Entrar a mi sala</button></div>';
        g.classList.add("show"); g.querySelector(".pgc-b").addEventListener("click", enter);
      }, 1500);
      setTimeout(() => g.classList.add("open"), 1650);
      entT = setTimeout(enter, 4800);
      function enter() { if (entered) return; entered = true; clearTimeout(entT); login(a); end(); setTimeout(() => go(PUB), 350); }
    }
    let entT, entered = false;
    const kd = e => { if (e.key >= "0" && e.key <= "9") add(e.key); else if (e.key === "Backspace") add("del"); else if (e.key === "Escape" && !busy) end(); };
    document.addEventListener("keydown", kd);
    g.querySelectorAll(".pgn button").forEach(b => b.addEventListener("click", () => add(b.dataset.k)));
    g.querySelector(".pgx").addEventListener("click", () => { if (!busy) end(); });
    void g.offsetWidth; setTimeout(() => g.classList.add("open"), 80);
  }
  $("#bRep").addEventListener("click", () => { if (!asesora) askCode(); else setRep($("#guion").hidden); }); $("#gX").addEventListener("click", () => setRep(false));
  const rnd = m => { const a = new Uint32Array(1), lim = Math.floor(4294967296 / m) * m; do { crypto.getRandomValues(a); } while (a[0] >= lim); return a[0] % m; };
  function sortear() {
    const seen = {}, pool = store("cml_sorteo").filter(x => { const k = String(x.whatsapp).replace(/\D/g, ""); if (!k || seen[k]) return false; seen[k] = 1; return true; });
    if (!pool.length) { toast("Todavía no hay participantes."); return; }
    const n = Math.min(5, pool.length), s = Math.min(2, pool.length - n), arr = pool.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = rnd(i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    const win = arr.slice(0, n), sup = arr.slice(n, n + s), mask = w => "…" + String(w).replace(/\D/g, "").slice(-4);
    const li = (x, i, t) => "<li><b>" + esc(x.nombre) + "</b> · " + esc(x.pais) + (x.emprendimiento ? " · " + esc(x.emprendimiento) : "") + " · WhatsApp " + mask(x.whatsapp) + "</li>";
    const close = modal('<div class="kick">Sorteo · boutiques inaugurales</div><h3 id="sh">Sorteando…</h3><p id="sn" style="font:600 28px var(--serif);color:var(--wine);min-height:44px"></p><div id="sr2" hidden></div>', ov => {
      const names = pool.map(x => x.nombre), el = $("#sn", ov); let k = 0; const t = setInterval(() => { el.textContent = names[rnd(names.length)]; if (++k > 28) { clearInterval(t); $("#sh", ov).textContent = "¡Felicitaciones!"; el.remove(); const r = $("#sr2", ov); r.hidden = false; r.innerHTML = '<ul class="ck">' + win.map(li).join("") + "</ul>" + (sup.length ? "<p><b>Suplentes</b> (por si alguna no responde):</p><ul class='ck'>" + sup.map(li).join("") + "</ul>" : "") + '<div class="acts"><button class="bt2 w" id="gs">Guardar resultado (CSV)</button></div><p class="note">Sorteo hecho el ' + new Date().toLocaleString("es-CO") + " entre " + pool.length + " participantes.</p>"; try { localStorage.setItem("cml_ganadoras", JSON.stringify({ fecha: new Date().toISOString(), ganadoras: win, suplentes: sup })); } catch (e) {} $("#gs", r).addEventListener("click", () => csv(win.map(x => Object.assign({ puesto: "ganadora" }, x)).concat(sup.map(x => Object.assign({ puesto: "suplente" }, x))), "ganadoras-codigo-ml.csv")); } }, 110);
    });
  }

  function openCml() {
    const ov = document.createElement("div"); ov.className = "dv"; ovOpen(); ov.innerHTML = '<button class="dvb2" type="button">← Volver a la sala</button><iframe src="../demo.html?lang=' + (window.CMLI ? CMLI.lang : "es") + '" title="Demo de Código Mujer Libre" allow="fullscreen"></iframe><button class="dvx" aria-label="Cerrar demo">×</button><a class="dvo" href="../demo.html" target="_blank" rel="noopener">Abrir en pantalla completa ↗</a>';
    document.body.appendChild(ov);
    let done = false; const close = () => { if (done) return; done = true; ov.remove(); document.removeEventListener("keydown", k); ovClose(); }, k = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", k); ov.querySelector(".dvx").onclick = close; ov.querySelector(".dvb2").onclick = close;
  }
  function openTools(h) {
    const ov = document.createElement("div"); ov.className = "dv"; ovOpen(); ov.innerHTML = '<button class="dvb2" type="button">← Volver a la sala</button><iframe src="asesoras.html?emb=1#' + (h || "inicio") + '" title="Mis herramientas"></iframe><button class="dvx" aria-label="Volver a la oficina">×</button>';
    document.body.appendChild(ov); let done = false; const close = () => { if (done) return; done = true; ov.remove(); document.removeEventListener("keydown", k); ovClose(); }, k = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", k); ov.querySelector(".dvx").onclick = close; ov.querySelector(".dvb2").onclick = close;
  }
  function openOf(key) {
    if (!asesora || !window.CMLO) return;
    const X = { a: asesora, C, toast, esc, cp, money, PR, OBJ, PLAN, tone: tick }, r = CMLO.render(key, X); if (!r) return;
    modal(r.html, r.mount, true);
  }
  /* ---------- acciones ---------- */
  function act(a) {
    const [k, v] = String(a).split(":"); tick();
    ({ go: () => go(+v), bienvenida, tienda, charla, comparar, condiciones, reservar: () => reservar(), pack: () => pack(v), pilar: () => pilar(+v), demo: () => demo(v), of: () => openOf(v), cml: () => openCml(), tools: () => openTools(v) }[k] || (() => {}))();
  }
  layer.addEventListener("click", e => { if (moved) return; const t = e.target.closest("[data-a]"); if (t) act(t.dataset.a); });
  layer.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.dataset && e.target.dataset.a) { e.preventDefault(); act(e.target.dataset.a); } });
  $("#bRes").addEventListener("click", () => reservar());
  $("#bPrev").addEventListener("click", () => go(cur - 1)); $("#bNext").addEventListener("click", () => go(cur + 1));
  const dots = $("#dots"); ROOMS.forEach((R, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", R.name); b.addEventListener("click", () => go(i)); dots.appendChild(b); });
  [...dots.children].forEach((b, i) => { if (i >= PUB) b.remove(); });
  $("#pL").addEventListener("click", () => vp.scrollBy({ left: -vp.clientWidth * .6, behavior: "smooth" })); $("#pR").addEventListener("click", () => vp.scrollBy({ left: vp.clientWidth * .6, behavior: "smooth" }));
  /* mover con el dedo en todas las direcciones + acercar/alejar (pellizco, doble toque, rueda, botones) */
  let moved = false, zt = 0;
  const ZMAX = 3.5;
  function setZoom(nz, cx, cy) {
    nz = Math.max(1, Math.min(ZMAX, nz)); if (Math.abs(nz - Z) < 0.001) return;
    const r = vp.getBoundingClientRect(); if (cx == null) { cx = r.width / 2; cy = r.height / 2; } else { cx -= r.left; cy -= r.top; }
    const fx = (vp.scrollLeft + cx - world.offsetLeft) / world.offsetWidth, fy = (vp.scrollTop + cy - world.offsetTop) / world.offsetHeight;
    Z = nz; layout();
    vp.scrollLeft = fx * world.offsetWidth + world.offsetLeft - cx; vp.scrollTop = fy * world.offsetHeight + world.offsetTop - cy;
    $("#hint").style.opacity = 0;
    const R = ROOMS[cur]; if (R.live && window.CMLSea) { clearTimeout(zt); zt = setTimeout(() => CMLSea.start(layer, img, S, R.live), 150); }
  }
  const ptr = new Map(); let g = null;
  const mid = () => { const a = [...ptr.values()]; return a.length > 1 ? { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2, d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) } : null; };
  vp.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = false;
    const m = mid(); g = m ? { z0: Z, d0: m.d || 1 } : { sx: e.clientX, sy: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop };
  });
  window.addEventListener("pointermove", e => {
    if (!ptr.has(e.pointerId) || !g) return; ptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const m = mid();
    if (m && g.z0 != null) { moved = true; setZoom(g.z0 * m.d / g.d0, m.x, m.y); return; }
    if (g.sx == null) return;
    const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
    if (!moved && Math.hypot(dx, dy) > 6) { moved = true; vp.classList.add("drag"); }
    if (moved) { vp.scrollLeft = g.sl - dx; vp.scrollTop = g.st - dy; $("#hint").style.opacity = 0; }
  });
  const upP = e => { ptr.delete(e.pointerId); vp.classList.remove("drag"); const a = [...ptr.values()]; g = a.length === 1 ? { sx: a[0].x, sy: a[0].y, sl: vp.scrollLeft, st: vp.scrollTop } : null; if (!ptr.size) setTimeout(() => moved = false, 0); };
  window.addEventListener("pointerup", upP); window.addEventListener("pointercancel", upP);
  vp.addEventListener("wheel", e => { e.preventDefault(); setZoom(Z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY); }, { passive: false });
  vp.addEventListener("dblclick", e => { if (e.target.closest("[data-a]")) return; setZoom(Z > 1.2 ? 1 : 2.2, e.clientX, e.clientY); });
  let lastTap = 0; vp.addEventListener("pointerup", e => { if (e.pointerType === "mouse" || moved) return; const n = Date.now(); if (n - lastTap < 320 && !e.target.closest("[data-a]")) { setZoom(Z > 1.2 ? 1 : 2.2, e.clientX, e.clientY); lastTap = 0; } else lastTap = n; });
  $("#b360").addEventListener("click", () => window.CMLOf360 && CMLOf360.open(ROOMS[cur].id));
  $("#zIn").addEventListener("click", () => setZoom(Z * 1.4)); $("#zOut").addEventListener("click", () => setZoom(Z / 1.4));
  vp.addEventListener("scroll", () => { $("#hint").style.opacity = 0; }, { passive: true });
  window.addEventListener("resize", layout);

  /* ---------- sonido suave ---------- */
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
  function tone(f, t0, dur, vol) { const c = ac(); if (!c || !sndOn) return; const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f; const t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05); }
  const chime = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * .28, 2.6, .035)), tick = () => { if (ctx) { tone(880, 0, .6, .025); tone(1318.5, .08, .7, .018); } };
  function synthPad() { const c = ac(); if (!c || !sndOn || pad) return; const g = c.createGain(); g.gain.value = 0; g.connect(c.destination); g.gain.linearRampToValueAtTime(.018, c.currentTime + 4); pad = [261.63, 329.63, 392, 523.25].map(f => { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f; const og = c.createGain(); og.gain.value = .5; o.connect(og); og.connect(g); o.start(); return o; }); pad.g = g; }
  /* Música real: pon ventas/audio/ambiente.mp3 (música) y ventas/audio/olas.mp3 (mar). Si no están, suena el pad suave de siempre. */
  let mus = null, olas = null, musBad = false;
  function ambience() {
    if (!sndOn) return;
    if (musBad) return synthPad();
    if (!mus) {
      mus = new Audio("ventas/audio/ambiente.mp3?v=20261107b"); mus.loop = true; mus.volume = .12; mus.addEventListener("error", () => { musBad = true; mus = null; if (opened && sndOn) synthPad(); });
    }
    mus.play().catch(() => {}); olas && olas.play().catch(() => {});
  }
  function stopAmb() { if (mus) mus.pause(); if (olas) olas.pause(); if (pad) { pad.g.gain.linearRampToValueAtTime(0, ctx.currentTime + .8); const p = pad; pad = null; setTimeout(() => p.forEach(o => { try { o.stop(); } catch (e) {} }), 1000); } }
  $("#bSnd").addEventListener("click", e => { sndOn = !sndOn; e.currentTarget.setAttribute("aria-pressed", String(sndOn)); if (sndOn) { if (opened) ambience(); } else stopAmb(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAmb(); else if (opened && sndOn && !ovN) ambience(); });

  /* ---------- instalar como app ---------- */
  let ip = null; const bI = $("#bInst"), standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  try { navigator.serviceWorker && navigator.serviceWorker.register("../sw.js").catch(() => {}); } catch (e) {}
  if (!standalone && bI) {
    bI.hidden = false;
    addEventListener("beforeinstallprompt", e => { e.preventDefault(); ip = e; });
    bI.addEventListener("click", async () => {
      if (ip) { ip.prompt(); try { await ip.userChoice; } catch (e) {} ip = null; return; }
      modal('<div class="kick">Instalar</div><h3>Ponla en tu celular como una app</h3><p><b>iPhone (Safari):</b> toca el botón Compartir y elige “Agregar a pantalla de inicio”.</p><p><b>Android (Chrome):</b> toca los tres puntos ⋮ y elige “Instalar app” o “Agregar a pantalla de inicio”.</p><p class="note">Queda un icono de Código ML Asesoras. Entras con tu código y listo.</p>');
    });
  }
  /* ---------- inicio ---------- */
  const sp = new URLSearchParams(location.search), h0 = /^#sala(\d)$/.exec(location.hash);
  try { try { localStorage.removeItem("cml_asesora"); } catch (e) {} let ss = null; try { ss = JSON.parse(sessionStorage.getItem("cml_sesion") || "null"); } catch (e) {} const k = sessionStorage.getItem("cml_asesora") || sp.get("codigo"); const a = ss ? { codigo: ss.id, nombre: ss.nombre, pais: ss.pais, admin: ss.rol === "admin" } : (k && find(k)); if (a) { asesora = a; pais = vpais(a); try { sessionStorage.setItem("cml_asesora", a.codigo); } catch (e) {} setRep(sp.get("rep") === "1"); } } catch (e) {}
  const start = sp.get("sala") != null ? +sp.get("sala") : (sp.get("app") === "1" && asesora ? PUB : 0);
  if (start > 0) opened = true;
  show(Math.min(Math.max(start || 0, 0), ROOMS.length - 1));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
