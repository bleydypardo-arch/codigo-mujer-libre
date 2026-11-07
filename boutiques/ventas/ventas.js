(function () {
  const C = window.CMLV, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = n => Number.isInteger(n) ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : n.toFixed(2).replace(".", ",");
  const money = n => C.moneda + num(n);
  const P = id => C.paquetes.find(p => p.id === id);
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

  const ROOMS = [
    { id: "puerta", name: "Entrada", src: "puerta.webp", w: 941, h: 1672, fit: "tall", focus: 50, quads: [],
      hs: [hot(50.5, 51.3, "Toca para entrar", "go:1")], hint: "Toca la puerta para entrar",
      guion: "<h5>Qué decir</h5><p>“Bienvenida a la Sala de reservas y ventas de Código ML. En unos minutos vas a ver cómo tu marca puede tener su propia boutique dentro de un hotel virtual.”</p><h5>Qué hacer</h5><ul><li>Pídele que toque la puerta dorada.</li></ul>" },
    { id: "recepcion", name: "Recepción", src: "recepcion.webp", w: 1774, h: 887, fit: "wide", focus: 60, quads: [],
      hs: [hot(58.8, 40, "Bienvenida", "bienvenida"), hot(75.5, 57, "Boutique inaugural", "tienda"), hot(22, 62, "Charla de capacitación", "charla"), hot(97.4, 47.5, "Sala de paquetes →", "go:2")],
      hint: "Desliza para mirar alrededor · toca los puntos dorados",
      guion: "<h5>Qué decir</h5><p>“Esta es la recepción de nuestro hotel virtual. Código ML reúne bienestar, comunidad y boutiques de mujeres emprendedoras en un solo lugar.”</p><h5>Qué mostrar</h5><ul><li><b>Boutique inaugural:</b> cómo participar en el sorteo.</li><li><b>Charla de capacitación:</b> cómo expandir y vender más.</li><li>Pasillo de la derecha: sala de paquetes.</li></ul><h5>Cuidado</h5><ul><li>No prometas resultados de ventas.</li><li>El sorteo se cuenta con calma: sin prisa, sin presión.</li></ul>" },
    { id: "paquetes", name: "Sala de paquetes", src: "paquetes.webp", w: 1774, h: 887, fit: "wide", focus: 50,
      quads: [q("p1", [[580, 272], [764, 260], [764, 470], [580, 470]], 300, 330, pk("gold")), q("p2", [[795, 255], [993, 255], [993, 472], [795, 472]], 300, 330, pk("platinum")), q("p3", [[1025, 254], [1241, 251], [1241, 470], [1025, 472]], 300, 330, pk("diamond"))],
      hs: [hot(49.6, 62, "Comparar los tres", "comparar"), hot(2.6, 45, "← Recepción", "go:1"), hot(97.6, 49, "Salón de demos →", "go:3")],
      hint: "Toca un paquete para voltear la tarjeta",
      guion: "<h5>Qué decir</h5><p>“Tenemos tres paquetes. Todos incluyen tu puerta con tu logo y el botón que lleva a tu tienda. Cambia cuánto espacio, cuántos productos y cuánta experiencia tiene tu boutique.”</p><h5>Qué mostrar</h5><ul><li>Toca cada panel: la tarjeta se voltea y muestra lo que incluye.</li><li>La tableta de la mesa abre la comparación.</li></ul><h5>Precio de feria</h5><ul><li>Solo durante la feria. El precio normal rige desde el 1 de enero de 2027.</li><li>Se separa con el 50 %.</li><li>La mensualidad empieza cuando la dueña recibe su boutique.</li></ul>" },
    { id: "salon", name: "Salón de demos", src: "salon.webp", w: 941, h: 1671, fit: "tall", focus: 50,
      quads: [q("tv", [[343, 497], [850, 392], [850, 822], [343, 786]], 960, 540, tvHtml)],
      hs: [hot(45.7, 59, "Separar mi cupo", "reservar")], hint: "Toca la pantalla para ver el demo",
      guion: "<h5>Qué decir</h5><p>“En esta pantalla puedes ver cómo se siente una boutique de verdad. Toca la opción que quieras.”</p><h5>Qué mostrar</h5><ul><li><b>Centro comercial:</b> tres boutiques de ejemplo.</li><li><b>Una boutique por dentro:</b> entra y toca los productos.</li><li><b>Cómo funcionan los paquetes:</b> seis diapositivas.</li></ul><h5>Cuidado</h5><ul><li>Los productos y precios del demo son de ejemplo. Dilo claro.</li></ul>" },
    { id: "oficina", name: "Oficina de reservas", src: "oficina.webp", w: 941, h: 1670, fit: "tall", focus: 50,
      quads: [],
      hs: [hot(13, 28, "Bienestar", "pilar:0", 1), hot(33.8, 29.8, "Comunidad", "pilar:1", 1), hot(51.5, 31.3, "Viajes", "pilar:2", 1), hot(13, 44.6, "Crece y Florece", "pilar:3", 1), hot(33.8, 44.8, "Emprende", "pilar:4", 1), hot(51.5, 44.8, "Boutiques", "pilar:5", 1), hot(40.2, 59.4, "Reservar mi cupo", "reservar"), hot(59.3, 58.1, "Condiciones", "condiciones", 1)],
      hint: "Toca las esferas para conocer cada pilar · la tableta separa tu cupo",
      guion: "<h5>Qué decir</h5><p>“Estos seis pilares son todo lo que vive en Código ML. Tu boutique es uno de ellos. Para separar tu cupo, toca la tableta del escritorio.”</p><h5>Cierre</h5><ul><li>Confirma el paquete y el país.</li><li>Pregunta si quiere separar hoy con el 50 %.</li><li>Anota su código de representante en el formulario.</li><li>Lee con ella la letra pequeña (libro rojo).</li></ul>" }
  ];
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
  function layout() {
    const R = ROOMS[cur], sw = vp.clientWidth, sh = vp.clientHeight;
    S = R.fit === "wide" ? Math.max(sh / R.h, sw / R.w) : sh / R.h;
    world.style.width = R.w * S + "px"; world.style.height = R.h * S + "px";
    R.quads.forEach(k => { const el = $("#q-" + k.id, layer); if (el) el.style.transform = homog(k.w, k.h, k.pts.map(p => [p[0] * S, p[1] * S])); });
    const sc = world.offsetWidth > sw + 4; $("#pL").hidden = !sc; $("#pR").hidden = !sc;
  }

  /* ---------- mostrar una sala ---------- */
  function show(i, silent) {
    cur = i; const R = ROOMS[i];
    img.src = IMG + R.src; img.alt = R.name; bg.style.backgroundImage = "url(" + IMG + R.src + ")";
    layer.innerHTML = "";
    R.quads.forEach(k => { const d = document.createElement("div"); d.className = "quad"; d.id = "q-" + k.id; d.style.width = k.w + "px"; d.style.height = k.h + "px"; d.innerHTML = k.html; layer.appendChild(d); });
    R.hs.forEach(h => { const b = document.createElement("button"); b.type = "button"; b.className = "hot" + (h.notag ? " notag" : "") + (h.x > 88 ? " rt" : h.x < 12 ? " lt" : ""); b.style.left = h.x + "%"; b.style.top = h.y + "%"; b.dataset.a = h.a; b.setAttribute("aria-label", h.l); b.innerHTML = '<span class="tag">' + esc(h.l) + "</span>"; layer.appendChild(b); });
    layout();
    vp.scrollLeft = Math.max(0, world.offsetWidth * R.focus / 100 - vp.clientWidth / 2);
    $("#roomName").textContent = R.name; $("#hintTx").textContent = R.hint;
    const hint = $("#hint"); hint.style.opacity = 1; clearTimeout(show.t); show.t = setTimeout(() => hint.style.opacity = 0, 9000);
    $$("#dots button").forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    $("#bPrev").disabled = i === 0; const nx = $("#bNext"); nx.disabled = i === ROOMS.length - 1; nx.querySelector("span").textContent = i === 0 ? "Entrar" : i === ROOMS.length - 2 ? "Última sala" : "Siguiente";
    nx.style.visibility = i === ROOMS.length - 1 ? "hidden" : "visible";
    const nxt = ROOMS[i + 1]; if (nxt) { const im = new Image(); im.src = IMG + nxt.src; }
    renderGuion(); try { history.replaceState(null, "", "#sala" + i); } catch (e) {}
  }
  function go(i) {
    if (i < 0 || i >= ROOMS.length) return;
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
  function tienda() {
    modal('<div class="kick">Boutique inaugural</div><h3>Vive la experiencia de tener tu propia boutique</h3><p>Participa en el sorteo de una boutique inaugural dentro del hotel virtual de Código ML.</p><ul class="ck"><li>Boutique con 15 productos, con foto, precio y descripción.</li><li>6 meses de alojamiento en el hotel virtual sin mensualidad.</li><li>Entrega la primera semana de enero.</li><li>2 horas de asesoría con tu diseñadora.</li><li>Tu llave de administración para cambiar precios y productos cuando quieras.</li><li>Para marcas de Colombia, República Dominicana y España.</li></ul><form id="sf" autocomplete="off"><div class="grid2"><label>Tu nombre<input name="nombre" required autocomplete="name"></label><label>WhatsApp<input name="whatsapp" required inputmode="tel" autocomplete="tel"></label><label>País<select name="pais">' + paisOpts() + '</select></label><label>Tu marca o lo que vendes<input name="marca"></label></div><label class="chk"><input type="checkbox" name="ok" required> Acepto que Código ML me contacte sobre el sorteo y mis datos de contacto se usen solo para eso.</label><div class="acts"><button class="bt2 w" type="submit">Participar en el sorteo</button></div></form><p class="note">Las condiciones del sorteo se entregan por escrito.</p>', (ov, close) => {
      $("#sf", ov).addEventListener("submit", e => {
        e.preventDefault(); const f = e.target, d = { fecha: new Date().toLocaleString("es-CO"), nombre: f.nombre.value.trim(), whatsapp: f.whatsapp.value.trim(), pais: f.pais.value, marca: f.marca.value.trim(), representante: C.feria.vendedora || "" };
        store("cml_sorteo", d); const n = store("cml_sorteo").length; close(); renderGuion();
        modal('<div class="kick">Listo</div><h3>Ya estás participando, ' + esc(d.nombre.split(" ")[0]) + '</h3><p>Registramos tu participación (n.º ' + n + '). Te escribiremos por WhatsApp con las novedades del sorteo.</p><div class="acts"><button class="bt2 g" data-m="go:2">Ver los paquetes</button></div>');
      });
    });
  }
  function packCard(id) {
    const p = P(id), dep = p.feria * C.deposito;
    return '<div class="flip" id="fl" aria-live="polite"><div class="in"><div class="fc fr">' + (p.destacado ? '<span class="badge">★ ' + esc(p.destacado) + "</span>" : "") + "<h4 style=\"color:" + ({ gold: "#8E6420", platinum: "#5B5F72", diamond: "#5C0A24" }[id]) + '">' + p.nombre + '</h4><div class="lm">' + esc(p.lema) + '</div><div class="nor">Precio normal <s>' + money(p.normal) + '</s></div><div class="fer">PRECIO DE FERIA</div><div class="pr">' + money(p.feria) + '</div><div class="mo">pago único de diseño · + ' + money(p.mensual) + ' al mes cuando abras</div><div class="tp">Toca para ver qué incluye ⟲</div></div><div class="fc bk"><h5>' + p.nombre + ' incluye</h5><div class="hr">' + p.horas + (p.horas === 1 ? " hora" : " horas") + " con tu diseñadora · para separar hoy " + money(dep) + '</div><ul>' + p.incluye.map(t => "<li>" + esc(t) + "</li>").join("") + "</ul></div></div></div>";
  }
  function pack(id) {
    modal('<div class="kick">Oferta de feria</div><h3>Elige el paquete que va contigo</h3><div class="tabs" role="tablist">' + C.paquetes.map(p => '<button role="tab" data-t="' + p.id + '" aria-selected="' + (p.id === id) + '">' + p.nombre + "</button>").join("") + '</div><div id="pc">' + packCard(id) + '</div><div class="acts"><button class="bt2 w" id="rs">Reservar este paquete</button><button class="bt2 g" data-m="comparar">Comparar los tres</button></div><p class="note">Precios en USD. Condiciones completas en la letra pequeña.</p>', (ov, close) => {
      let c = id; const bind = () => { const f = $("#fl", ov); f.addEventListener("click", () => f.classList.toggle("f")); };
      bind(); $$(".tabs button", ov).forEach(b => b.addEventListener("click", () => { c = b.dataset.t; $$(".tabs button", ov).forEach(x => x.setAttribute("aria-selected", String(x === b))); $("#pc", ov).innerHTML = packCard(c); bind(); }));
      $("#rs", ov).addEventListener("click", () => { close(); reservar(c); });
    });
  }
  function comparar() {
    const ps = C.paquetes, row = (l, f) => "<tr><td>" + l + "</td>" + ps.map(p => "<td>" + f(p) + "</td>").join("") + "</tr>";
    const exp = p => p.id === "gold" ? "—" : p.id === "platinum" ? "1" : "2 a tu medida";
    modal('<div class="kick">Comparar</div><h3>Los tres paquetes, lado a lado</h3><div class="cmpw"><table class="cmp"><thead><tr><th>Qué incluye</th>' + ps.map(p => "<th>" + p.nombre + "</th>").join("") + "</tr></thead><tbody>" +
      row("Precio normal (desde 1 ene 2027)", p => "<s>" + money(p.normal) + "</s>") + row("<b>Precio de feria</b> (pago único)", p => "<b>" + money(p.feria) + "</b>") + row("Para separar hoy (50 %)", p => money(p.feria * C.deposito)) + row("Mensualidad (desde que abres)", p => money(p.mensual)) +
      row("Tiempo con tu diseñadora", p => p.horas + (p.horas === 1 ? " hora" : " horas")) + row("Salas de tu boutique", p => ({ gold: 1, platinum: 3, diamond: 5 }[p.id])) + row("Productos publicados", p => ({ gold: 15, platinum: 30, diamond: 60 }[p.id])) +
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
    const opts = C.paquetes.map(p => '<option value="' + p.id + '"' + (p.id === pre ? " selected" : "") + ">" + p.nombre + " · " + money(p.feria) + "</option>").join("") + '<option value="">Aún no sé, quiero asesoría</option>';
    modal('<div class="kick">Separa tu cupo</div><h3>Tu boutique en el hotel de Código ML</h3><p>Déjanos tus datos y te escribimos para confirmar tu paquete. Para separar se paga el ' + Math.round(C.deposito * 100) + ' % del precio de feria; tu boutique se entrega a partir del ' + esc(C.entrega) + ".</p>" +
      '<form id="rf" autocomplete="off"><div class="grid2"><label>Tu nombre<input name="nombre" required autocomplete="name"></label><label>WhatsApp<input name="whatsapp" required inputmode="tel" autocomplete="tel"></label><label>País<select name="pais">' + paisOpts() + '</select></label><label>Tu marca<input name="marca"></label><label>Paquete<select name="paq">' + opts + '</select></label><label>Código de representante (si tienes)<input name="rep" value="' + esc(C.feria.vendedora || "") + '"></label></div><div id="rsum" class="note" style="margin-top:10px"></div><div class="acts"><button class="bt2 w" type="submit">' + (C.whatsapp ? "Enviar por WhatsApp" : "Enviar mi solicitud") + '</button><button class="bt2 g" type="button" data-m="condiciones">Ver condiciones</button></div></form>', (ov, close) => {
      const f = $("#rf", ov), sum = () => { const p = P(f.paq.value); $("#rsum", ov).textContent = p ? "Precio de feria " + money(p.feria) + " · para separar hoy " + money(p.feria * C.deposito) + " · mensualidad " + money(p.mensual) + " desde que abres." : ""; };
      f.paq.addEventListener("change", sum); sum();
      f.addEventListener("submit", e => {
        e.preventDefault(); const p = P(f.paq.value);
        const d = { fecha: new Date().toLocaleString("es-CO"), nombre: f.nombre.value.trim(), whatsapp: f.whatsapp.value.trim(), pais: f.pais.value, marca: f.marca.value.trim(), paquete: p ? p.nombre : "Asesoría", precio_feria: p ? p.feria : "", para_separar: p ? p.feria * C.deposito : "", representante: f.rep.value.trim() };
        store("cml_reservas", d); renderGuion();
        const msg = ["Hola, quiero separar mi cupo en Código ML.", "", "Nombre: " + d.nombre, "WhatsApp: " + d.whatsapp, "País: " + d.pais, "Marca: " + d.marca, "Paquete: " + d.paquete + (p ? " (precio de feria " + money(p.feria) + ", para separar " + money(p.feria * C.deposito) + ")" : ""), d.representante ? "Representante: " + d.representante : ""].filter((x, i, a) => x !== "" || i < 2).join("\n");
        close();
        const url = C.whatsapp ? "https://wa.me/" + C.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(msg) : "mailto:" + C.email + "?subject=" + encodeURIComponent("Separar cupo · " + (d.marca || d.nombre)) + "&body=" + encodeURIComponent(msg);
        modal('<div class="kick">Gracias</div><h3>Recibimos tu solicitud, ' + esc(d.nombre.split(" ")[0]) + '</h3><p>Guardamos tus datos. ' + (C.whatsapp ? "Toca el botón para enviarnos el mensaje ya escrito por WhatsApp." : "Toca el botón para abrir tu correo con el mensaje ya escrito.") + '</p><div class="acts"><a class="bt2 w" href="' + url + '" target="_blank" rel="noopener">' + (C.whatsapp ? "Abrir WhatsApp" : "Abrir mi correo") + "</a></div>");
      });
    });
  }

  /* ---------- demo en pantalla completa ---------- */
  function demo(which) {
    const dv = document.createElement("div"); dv.className = "dv";
    dv.innerHTML = '<div class="bar"><b>Código ML · Demo</b><div class="sw"><button data-w="centro">Centro comercial</button><button data-w="luz">Una boutique</button><button data-w="pasos">Los paquetes</button></div><button class="cl" id="dx">Cerrar</button></div><div id="dbody" style="flex:1;display:flex;flex-direction:column;min-height:0"></div>';
    document.body.appendChild(dv);
    const close = () => { dv.remove(); document.removeEventListener("keydown", ek); }, ek = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", ek); $("#dx", dv).addEventListener("click", close);
    const body = $("#dbody", dv);
    function set(w) {
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
      { k: "Así de simple", h: "Cómo creamos tu boutique", steps: ["Separas tu cupo con el 50 %.", "Nos envías logo, fotos y productos.", "Sesión con tu diseñadora.", "Construimos y te mostramos.", "Entrega desde el " + C.entrega + ".", "Inducción y a vender."], bg: "oficina.webp" },
      { k: "Es tu momento", h: "Separa tu cupo hoy", p: "Precio de feria solo durante la feria. Habla con nuestra representante o toca el botón.", cta: true, bg: "recepcion.webp" }
    ];
    let i = 0; body.innerHTML = '<div class="sl"><div class="bgi"></div><button class="ar l" aria-label="Anterior">‹</button><div class="tx"></div><button class="ar r" aria-label="Siguiente">›</button><div class="dt"></div></div>';
    const sl = $(".sl", body), tx = $(".tx", sl), dt = $(".dt", sl);
    function draw() {
      const s = S6[i]; $(".bgi", sl).style.backgroundImage = "url(" + IMG + s.bg + ")";
      tx.innerHTML = '<div class="kk">' + esc(s.k) + "</div><h2>" + esc(s.h) + "</h2>" + (s.p ? "<p>" + esc(s.p) + "</p>" : "") +
        (s.cards ? '<div class="cards">' + C.paquetes.map(p => '<div class="c"><b>' + p.nombre + "</b><em>" + esc(p.lema) + "</em><s>Normal " + money(p.normal) + "</s><strong>" + money(p.feria) + "</strong><small>+ " + money(p.mensual) + " al mes · " + p.horas + " h con tu diseñadora</small></div>").join("") + "</div>" : "") +
        (s.steps ? '<div class="stp">' + s.steps.map((t, k) => "<div><b>" + (k + 1) + ".</b> " + esc(t) + "</div>").join("") + "</div>" : "") +
        (s.cta ? '<div class="acts"><button class="bt2 w" id="sr">Reservar mi cupo</button></div>' : "");
      dt.innerHTML = S6.map((_, k) => "<i" + (k === i ? ' class="on"' : "") + "></i>").join("");
      const r = $("#sr", tx); if (r) r.addEventListener("click", () => { closeAll(); reservar(); });
    }
    $(".ar.l", sl).addEventListener("click", () => { i = (i + S6.length - 1) % S6.length; draw(); }); $(".ar.r", sl).addEventListener("click", () => { i = (i + 1) % S6.length; draw(); });
    let sx = null; sl.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true }); sl.addEventListener("touchend", e => { if (sx == null) return; const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) { i = (i + (d < 0 ? 1 : S6.length - 1)) % S6.length; draw(); } sx = null; });
    draw();
  }

  /* ---------- guion del representante ---------- */
  function renderGuion() {
    $("#gBody").innerHTML = ROOMS[cur].guion;
    const a = store("cml_sorteo").length, b = store("cml_reservas").length;
    $("#gLeads").innerHTML = '<div>Sorteo: <b>' + a + '</b> participantes · Reservas: <b>' + b + '</b></div><button id="dS" ' + (a ? "" : "disabled") + '>Descargar participantes del sorteo (CSV)</button><button id="dR" ' + (b ? "" : "disabled") + ">Descargar reservas (CSV)</button>";
    $("#dS").addEventListener("click", () => csv(store("cml_sorteo"), "sorteo-codigo-ml.csv")); $("#dR").addEventListener("click", () => csv(store("cml_reservas"), "reservas-codigo-ml.csv"));
  }
  const setRep = on => { $("#guion").hidden = !on; $("#bRep").setAttribute("aria-pressed", String(on)); };
  $("#bRep").addEventListener("click", () => setRep($("#guion").hidden)); $("#gX").addEventListener("click", () => setRep(false));

  /* ---------- acciones ---------- */
  function act(a) {
    const [k, v] = String(a).split(":"); tick();
    ({ go: () => go(+v), bienvenida, tienda, charla, comparar, condiciones, reservar: () => reservar(), pack: () => pack(v), pilar: () => pilar(+v), demo: () => demo(v) }[k] || (() => {}))();
  }
  layer.addEventListener("click", e => { if (moved) return; const t = e.target.closest("[data-a]"); if (t) act(t.dataset.a); });
  layer.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.dataset && e.target.dataset.a) { e.preventDefault(); act(e.target.dataset.a); } });
  $("#bRes").addEventListener("click", () => reservar());
  $("#bPrev").addEventListener("click", () => go(cur - 1)); $("#bNext").addEventListener("click", () => go(cur + 1));
  const dots = $("#dots"); ROOMS.forEach((R, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", R.name); b.addEventListener("click", () => go(i)); dots.appendChild(b); });
  $("#pL").addEventListener("click", () => vp.scrollBy({ left: -vp.clientWidth * .6, behavior: "smooth" })); $("#pR").addEventListener("click", () => vp.scrollBy({ left: vp.clientWidth * .6, behavior: "smooth" }));
  /* arrastrar con el mouse */
  let down = false, moved = false, sx = 0, sl0 = 0;
  vp.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl0 = vp.scrollLeft; });
  window.addEventListener("pointermove", e => { if (!down) return; if (Math.abs(e.clientX - sx) > 5) { moved = true; vp.classList.add("drag"); } if (moved) vp.scrollLeft = sl0 - (e.clientX - sx); });
  window.addEventListener("pointerup", () => { down = false; vp.classList.remove("drag"); setTimeout(() => moved = false, 0); });
  vp.addEventListener("scroll", () => { $("#hint").style.opacity = 0; }, { passive: true });
  window.addEventListener("resize", layout);

  /* ---------- sonido suave ---------- */
  const ac = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; };
  function tone(f, t0, dur, vol) { const c = ac(); if (!c || !sndOn) return; const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f; const t = c.currentTime + t0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05); }
  const chime = () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * .28, 2.6, .035)), tick = () => { if (ctx) { tone(880, 0, .6, .025); tone(1318.5, .08, .7, .018); } };
  function ambience() { const c = ac(); if (!c || !sndOn || pad) return; const g = c.createGain(); g.gain.value = 0; g.connect(c.destination); g.gain.linearRampToValueAtTime(.018, c.currentTime + 4); pad = [261.63, 329.63, 392, 523.25].map(f => { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f; const og = c.createGain(); og.gain.value = .5; o.connect(og); og.connect(g); o.start(); return o; }); pad.g = g; }
  function stopAmb() { if (pad) { pad.g.gain.linearRampToValueAtTime(0, ctx.currentTime + .8); const p = pad; pad = null; setTimeout(() => p.forEach(o => { try { o.stop(); } catch (e) {} }), 1000); } }
  $("#bSnd").addEventListener("click", e => { sndOn = !sndOn; e.currentTarget.setAttribute("aria-pressed", String(sndOn)); if (sndOn) { if (opened) ambience(); } else stopAmb(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAmb(); else if (opened && sndOn) ambience(); });

  /* ---------- inicio ---------- */
  const sp = new URLSearchParams(location.search), h0 = /^#sala(\d)$/.exec(location.hash);
  if (sp.get("rep") === "1") setRep(true);
  const start = sp.get("sala") != null ? +sp.get("sala") : 0;
  if (start > 0) opened = true;
  show(Math.min(Math.max(start || 0, 0), ROOMS.length - 1));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
