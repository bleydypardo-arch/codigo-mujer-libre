/* Mi oficina (asesoras): contenido de cada tablero, estante y objeto del escritorio.
   Los datos de este dispositivo (lista de mujeres, metas del día, agenda) se guardan solo en este navegador. Más adelante se guardarán en Supabase. */
(function () {
  const PANELS = { metas: ["◎", "Metas de hoy"], plan: ["▦", "Plan semanal"], incent: ["✦", "Incentivos"], saldo: ["◈", "Mi saldo"], mujeres: ["♡", "Mis mujeres"], reglas: ["❖", "Reglas y archivos"] };
  const panel = k => '<button type="button" class="op" data-a="of:' + k + '" aria-label="' + PANELS[k][1] + '"><i>' + PANELS[k][0] + "</i><b>" + PANELS[k][1] + "</b></button>";
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const K = (X, n) => "cml_of_" + (X.a ? X.a.codigo : "x") + "_" + n;
  const get = (X, n, d) => { try { const v = localStorage.getItem(K(X, n)); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const set = (X, n, v) => { try { localStorage.setItem(K(X, n), JSON.stringify(v)); } catch (e) {} };
  const first = X => (X.a ? X.a.nombre.split("·")[0].trim().split(" ")[0] : "");
  const wa = (X, text) => X.C.whatsapp ? "https://wa.me/" + X.C.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(text) : "mailto:" + X.C.email + "?subject=" + encodeURIComponent("Asesora · " + first(X)) + "&body=" + encodeURIComponent(text);
  const copy = (txt, X) => { const ok = () => X.toast("Copiado. Pégalo en WhatsApp."); try { navigator.clipboard.writeText(txt).then(ok, () => { fall(); }); } catch (e) { fall(); } function fall() { const t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (e) {} t.remove(); } };
  const shell = (kick, title, inner, foot) => '<div class="kick">' + kick + "</div><h3>" + title + "</h3>" + inner + (foot ? '<p class="note">' + foot + "</p>" : "");
  const list = a => "<ul>" + a.map(x => "<li>" + x + "</li>").join("") + "</ul>";
  const soon = (X, kick, title, intro, topics) => ({ html: shell(kick, title, "<p>" + intro + "</p><h5 class='oh'>Aquí vas a encontrar</h5>" + list(topics), "Esta sección se está preparando. Mientras tanto, apóyate en Speech, Ventas y Mis mujeres.") });

  /* ---------- tableros de la pared ---------- */
  function metas(X) {
    const items = [{ id: "muj", t: "Inscribir mujeres en la plataforma", n: 2 }, { id: "bien", t: "Escribir la bienvenida a mis mujeres nuevas" }, { id: "demo", t: "Mostrar la sala a una emprendedora" }, { id: "post", t: "Compartir el mensaje del día con mis contactos" }, { id: "plan", t: "Revisar mi plan semanal" }];
    const key = "metas_" + today();
    const body = () => { const s = get(X, key, {}); const done = items.filter(i => i.n ? (s[i.id] || 0) >= i.n : s[i.id]).length;
      return '<div class="obar"><i style="width:' + Math.round(done / items.length * 100) + '%"></i></div><p class="note">' + done + " de " + items.length + " metas de hoy cumplidas</p>" +
        items.map(i => i.n ? '<div class="orow"><span>' + i.t + ' <small>(meta sugerida: ' + i.n + ')</small></span><span class="ocnt"><button data-c="-" data-i="' + i.id + '">−</button><b>' + (s[i.id] || 0) + '</b><button data-c="+" data-i="' + i.id + '">+</button></span></div>' : '<button class="orow chk' + (s[i.id] ? " on" : "") + '" data-k="' + i.id + '"><span>' + i.t + "</span><i>" + (s[i.id] ? "✓" : "") + "</i></button>").join(""); };
    return { html: shell("Metas de hoy", "Tu día en Código ML", '<div id="ob">' + body() + "</div>", "Son metas sugeridas para ayudarte a organizar el día; tú decides cuándo y cómo. Tu meta de resultado de la semana está en el Plan semanal."),
      mount: ov => { const host = ov.querySelector("#ob"); const bind = () => { host.innerHTML = body(); host.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const s = get(X, key, {}); s[b.dataset.k] = !s[b.dataset.k]; set(X, key, s); bind(); }); host.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { const s = get(X, key, {}); s[b.dataset.i] = Math.max(0, (s[b.dataset.i] || 0) + (b.dataset.c === "+" ? 1 : -1)); set(X, key, s); bind(); }); }; bind(); } };
  }
  const WEEKS = [
    ["2026-11-09", "Semana 1 · Arranque", "10 mujeres inscritas (acumulado 10) · 30 contactos", ["Capacitación en la sala y la app", "Aprender el guion", "Preparar mi lista de contactos", "Presentarme como asesora en mis redes", "Agendar mi primera charla"]],
    ["2026-11-16", "Semana 2", "10 mujeres más (acumulado 20) · 1 charla o evento · 5 demos de boutiques", ["Charla con un grupo de mujeres", "Mostrar la sala a emprendedoras", "Seguimiento a las mujeres inscritas"]],
    ["2026-11-23", "Semana 3", "10 mujeres más (acumulado 30) · 8 demos · 1 reserva de boutique · 2 empresas contactadas", ["Charla o live", "Visitas a emprendedoras", "Primer acercamiento a empresas (paquete corporativo)"]],
    ["2026-11-30", "Semana 4", "10 mujeres más (acumulado 40) · 10 demos · 2 reservas · 3 negocios para el directorio", ["Alianzas con negocios locales", "Segunda charla", "Seguimiento a reservas"]],
    ["2026-12-07", "Semana 5 · Cierre", "10 mujeres más (acumulado 50, plazo 14 de diciembre) · 3 reservas acumuladas · informe final", ["Evento final", "Ordenar mi lista de mujeres verificadas", "Reunión de resultados con Jazz"]]
  ];
  function plan(X) {
    const t = today(); let cur = -1; WEEKS.forEach((w, i) => { if (w[0] <= t) cur = i; });
    const rows = WEEKS.map((w, i) => '<section class="owk' + (i === cur ? " now" : "") + '"><h4>' + w[1] + (i === cur ? " · esta semana" : "") + "</h4><p class='goal'><b>Meta de la semana:</b> " + w[2] + "</p><p class='sug'><small>Actividades sugeridas</small></p>" + list(w[3]) + "</section>").join("");
    return { html: shell("Plan semanal", "Tus primeras cinco semanas", (t < WEEKS[0][0] ? "<p>Tu plan empieza el lunes 9 de noviembre.</p>" : "") + rows, "La meta de cada semana es el resultado que buscamos. Las actividades son sugerencias: tú decides cuándo y cómo hacerlas. Hay un cierre semanal de resultados, sin horarios ni reportes diarios.") };
  }
  function incent() {
    return { html: shell("Incentivos", "Cómo ganas con Código ML", '<table class="cmp"><tbody>' + [["Boutique que vendes", "15 % de lo que la clienta pagó"], ["Mensualidad de esa boutique", "10 % durante los primeros 12 meses, mientras siga activa y pagando"], ["Paquete corporativo", "10 %"], ["Negocio en el ecosistema (US$20 al mes)", "US$5 al mes mientras siga pagando"], ["Mujeres inscritas con tu código", "Bono escalonado de Jazz: 50 mujeres = US$50 · 100 mujeres = US$100 · 150 mujeres = US$150"]].map(r => "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + "</td></tr>").join("") + "</tbody></table>",
      "Las comisiones se calculan sobre pagos efectivamente recibidos, sin impuestos, comisiones de pasarela ni reembolsos. Las mujeres cuentan cuando están verificadas y activas. No se promete ningún ingreso. Las condiciones completas están en las Reglas del programa.") };
  }
  function saldo(X) {
    const tile = (l) => '<div class="otile"><b>—</b><span>' + l + "</span></div>";
    return { html: shell("Mi saldo", "Tu cuenta en un vistazo", '<div class="otiles">' + tile("Lo que vendí") + tile("Ya entró") + tile("Me deben") + tile("Ya me pagaron") + '</div><p>Muy pronto este tablero se llena solo con tus ventas. Mientras tanto, Jazz te envía tu estado de cuenta cada mes.</p><div class="acts"><a class="bt2 w" target="_blank" rel="noopener" href="' + wa(X, "Hola Jazz, soy " + first(X) + " (asesora de " + X.cp().nombre + "). Quiero mi estado de cuenta.") + '">Pedir mi estado de cuenta</a></div>', "Tu cuenta y tus pagos son privados: solo tú los ves.") };
  }
  const CARE = [
    ["Día 0 · Bienvenida", "Hola {nombre}, soy {asesora} de Código ML. Qué alegría que ya estés adentro. Hoy solo te invito a que entres a la bienvenida y me cuentes qué te pareció."],
    ["Día 1 · Primer paso", "Hola {nombre}, ¿cómo amaneciste? Te invito a ver el mensaje del día en Código ML. Cuando lo leas, dime cómo te hizo sentir."],
    ["Día 3 · Descubrir", "{nombre}, ¿ya entraste al spa a conocerlo? Entremos juntas hoy, te acompaño y te cuento qué hay."],
    ["Día 5 · Compartir", "Mira, {nombre}: hoy hay algo nuevo en Código ML. Entra y cuéntame cuál es tu favorito."],
    ["Día 7 · Comunidad", "{nombre}, esta semana hay un evento en la comunidad. ¿Te apuntas? Si quieres traer a una amiga, también es bienvenida."],
    ["Día 14 · Reactivar", "Hola {nombre}, te extrañamos. Hay novedades en Código ML. ¿Entramos juntas un ratico?"],
    ["Día 30 · Cerrar el mes", "{nombre}, ya llevas un mes con nosotras. ¿Qué es lo que más te gusta? ¿Qué te gustaría encontrar?"]
  ];
  function mujeres(X) {
    const goal = X.a && X.a.pais === "co" ? 50 : 0;
    const body = () => { const L = get(X, "mujeres", []); return '<div class="obar"><i style="width:' + (goal ? Math.min(100, Math.round(L.length / goal * 100)) : 0) + '%"></i></div><p class="note">' + L.length + (goal ? " de " + goal + " mujeres anotadas" : " mujeres anotadas") + "</p>" +
      '<form id="of" autocomplete="off"><div class="grid2"><label>Nombre<input name="n" required></label><label>WhatsApp<input name="w" required inputmode="tel"></label><label>Ciudad<input name="c"></label></div><div class="acts"><button class="bt2 w" type="submit">Anotar mujer</button></div></form>' +
      (L.length ? '<ul class="olist">' + L.map((m, i) => "<li><span><b>" + X.esc(m.n) + "</b> · " + X.esc(m.w) + (m.c ? " · " + X.esc(m.c) : "") + "<small> " + X.esc(m.f) + '</small></span><button data-d="' + i + '" aria-label="Borrar">×</button></li>').join("") + "</ul>" : "<p class='note'>Aquí anotas a cada mujer que inscribes. Solo se guarda en este dispositivo.</p>") +
      (L.length ? '<div class="acts"><button class="bt2 g" data-x="csv">Descargar mi lista</button><button class="bt2 g" data-x="wa">Enviar mi lista a Jazz</button></div>' : "") +
      '<h5 class="oh">Mensajes para cuidarlas</h5><label>Para quién<select id="osel"><option value="">Escoge una mujer</option>' + L.map((m, i) => '<option value="' + i + '">' + X.esc(m.n) + "</option>").join("") + "</select></label>" +
      CARE.map((c, i) => '<div class="omsg"><b>' + c[0] + '</b><p class="mtxt" data-i="' + i + '"></p><button class="bt2 g" data-cp="' + i + '">Copiar</button></div>').join(""); };
    return { html: shell("Mis mujeres", "Anota y cuida a tus mujeres", '<div id="om">' + body() + "</div>", "Escríbeles solo a las mujeres que aceptaron que las contactes. Si alguna pide que no le escribas más, se respeta de inmediato. Sus datos son de Código ML: no los uses para nada más."),
      mount: ov => { const host = ov.querySelector("#om"); const txt = i => { const sel = host.querySelector("#osel"), L = get(X, "mujeres", []), m = sel && sel.value !== "" ? L[+sel.value] : null; return CARE[i][1].replace(/\{nombre\}/g, m ? m.n.split(" ")[0] : "amiga").replace(/\{asesora\}/g, first(X)); };
        const fill = () => host.querySelectorAll(".mtxt").forEach(p => p.textContent = txt(+p.dataset.i));
        const bind = () => { host.innerHTML = body(); fill();
          host.querySelector("#of").onsubmit = e => { e.preventDefault(); const f = e.target, L = get(X, "mujeres", []); L.push({ n: f.n.value.trim(), w: f.w.value.trim(), c: f.c.value.trim(), f: new Date().toLocaleDateString("es-CO") }); set(X, "mujeres", L); bind(); X.toast("Anotada."); };
          host.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { const L = get(X, "mujeres", []); L.splice(+b.dataset.d, 1); set(X, "mujeres", L); bind(); });
          host.querySelector("#osel").onchange = fill; host.querySelectorAll("[data-cp]").forEach(b => b.onclick = () => copy(txt(+b.dataset.cp), X));
          const csv = host.querySelector("[data-x=csv]"); if (csv) csv.onclick = () => { const L = get(X, "mujeres", []); const q = s => '"' + String(s || "").replace(/"/g, '""') + '"'; const data = "﻿Nombre,WhatsApp,Ciudad,Fecha,Asesora\n" + L.map(m => [m.n, m.w, m.c, m.f, X.a.nombre].map(q).join(",")).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "text/csv;charset=utf-8" })); a.download = "mis-mujeres-codigo-ml.csv"; a.click(); };
          const w = host.querySelector("[data-x=wa]"); if (w) w.onclick = () => { const L = get(X, "mujeres", []); window.open(wa(X, "Mi lista de mujeres inscritas (" + L.length + ") · " + X.a.nombre + "\n" + L.map((m, i) => (i + 1) + ". " + m.n + " · " + m.w + (m.c ? " · " + m.c : "")).join("\n")), "_blank"); }; };
        bind(); } };
  }
  function reglas() {
    return { html: shell("Reglas del programa", "Lo que sí y lo que no", list(["La clienta paga siempre a Código ML, nunca a la asesora.", "No cambies precios ni hagas promesas fuera de las condiciones oficiales.", "No prometas ganancias, ventas ni resultados a nadie.", "Ganas solo por lo que tú vendes o inscribes; no hay comisión por reclutar asesoras.", "Las comisiones se pagan sobre pagos efectivamente recibidos; si hay reembolso, se descuenta.", "Las mujeres cuentan cuando están verificadas y activas.", "Los datos de las mujeres son de Código ML: no los copies ni los uses para otra cosa.", "Escríbeles solo a quienes aceptaron, con respeto y sin spam.", "Usa solo la lista de precios de tu país y no menciones los de otros países.", "Trabajas por cuenta propia: eliges tus horarios y tu forma de trabajar."]) + '<div class="acts"><a class="bt2 g" href="formulario.html" target="_blank" rel="noopener">Formulario de participación (imprimir)</a></div>', "Este es un resumen. Las reglas completas y tu contrato son los que valen; pregúntale a Jazz si tienes dudas.") };
  }
  const TIPOS = ["Evento", "Charla", "Reunión", "Café o matcha", "Viaje", "Retiro", "Otro"];
  function agenda(X) {
    const body = () => { const L = get(X, "agenda", []).sort((a, b) => a.d.localeCompare(b.d)); return '<form id="af" autocomplete="off"><div class="grid2"><label>Fecha<input name="d" type="date" required></label><label>Qué es<select name="t">' + TIPOS.map(t => "<option>" + t + "</option>").join("") + '</select></label><label style="grid-column:1/-1">Detalle<input name="x" placeholder="Ej. Charla con el grupo de emprendedoras"></label></div><div class="acts"><button class="bt2 w" type="submit">Agregar a mi agenda</button></div></form>' +
      (L.length ? '<ul class="olist">' + L.map((m, i) => "<li><span><b>" + X.esc(m.d) + "</b> · " + X.esc(m.t) + (m.x ? " · " + X.esc(m.x) : "") + '</span><button data-d="' + i + '" aria-label="Borrar">×</button></li>').join("") + "</ul>" : "<p class='note'>Tu agenda está vacía. Agrega tus eventos, charlas y reuniones de la semana.</p>"); };
    return { html: shell("Mi agenda", "Tus eventos, charlas y reuniones", '<div id="ag">' + body() + "</div>", "Se guarda solo en este dispositivo."),
      mount: ov => { const host = ov.querySelector("#ag"); const bind = () => { host.innerHTML = body(); host.querySelector("#af").onsubmit = e => { e.preventDefault(); const f = e.target, L = get(X, "agenda", []); L.push({ d: f.d.value, t: f.t.value, x: f.x.value.trim() }); set(X, "agenda", L); bind(); }; host.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { const L = get(X, "agenda", []).sort((a, b) => a.d.localeCompare(b.d)); L.splice(+b.dataset.d, 1); set(X, "agenda", L); bind(); }); }; bind(); } };
  }
  function reunion(X) {
    return { html: shell("Reunión con Jazz", "Agenda una conversación", "<p>Cuéntale a Jazz lo que necesitas: resultados de la semana, dudas o ideas.</p>" + '<div class="acts"><a class="bt2 w" target="_blank" rel="noopener" href="' + wa(X, "Hola Jazz, soy " + first(X) + " (asesora de " + X.cp().nombre + "). Quiero agendar una reunión.") + '">Escribirle a Jazz</a></div>') };
  }

  /* ---------- biblioteca (estantes) ---------- */
  function speech(X) {
    return { html: shell("Speech", "Lo que le dices a una mujer", "<h5 class='oh'>En 30 segundos</h5><p>“Código ML es un hotel virtual para mujeres. Tiene bienestar, comunidad, experiencias y boutiques de mujeres emprendedoras. Puedes entrar gratis a la comunidad, y si tienes una marca, puedes tener tu propia boutique dentro del hotel.”</p><h5 class='oh'>Recorrido de 10 minutos con una emprendedora</h5><ul class='oplan'>" + X.PLAN.map(x => "<li><b>" + x[0] + " · " + x[1] + "</b><br>" + x[2] + "</li>").join("") + "</ul>", "No prometas ventas ni ingresos. Habla de lo que la plataforma ofrece.") };
  }
  function entrenamiento() {
    const S = [["Qué es Código ML (historia y misión)", "Próximamente"], ["Recorrido de la app y de la sala", "Disponible: la sala de ventas"], ["Cómo inscribir a una mujer con tu código", "Próximamente"], ["Cómo cuidar a tus mujeres", "Disponible: Mis mujeres"], ["Cómo conversar sin presionar", "Próximamente"], ["Cómo mostrar boutiques y paquetes", "Disponible: Ventas y Premium"], ["Reglas del programa", "Disponible: Reglas y archivos"], ["Privacidad de los datos", "Próximamente"]];
    return { html: shell("Entrenamiento", "Tu ruta de formación", '<ol class="oplan">' + S.map(s => "<li><b>" + s[0] + "</b><br><small>" + s[1] + "</small></li>").join("") + "</ol>") };
  }
  function estrategia(X) {
    return { html: shell("Estrategia", "Campaña Primeras 50 fundadoras · Bogotá", list(["Inscripción hasta el 12 de diciembre; los premios se entregan el 15 de diciembre.", "Premios: ancheta navideña gourmet, 2 entradas al Jardín Botánico en Navidad y matcha para dos.", "Cada mujer completa su misión diaria (unos 5 minutos) y cada día completo es un boleto.", "Tú inscribes, le das la bienvenida y la cuidas para que regrese todos los días.", "Muéstrales la caja secreta y la colección de 5 elementos: es lo que más las anima."]), X.a && X.a.pais !== "co" ? "Esta campaña es solo para Bogotá. Pregúntale a Jazz por la de tu país." : "Los detalles de los premios pueden ajustarse; confirma siempre con Jazz.") };
  }
  const liderazgo = X => soon(X, "Liderazgo", "Liderar con cariño", "Cómo acompañar a otras mujeres y crecer como asesora.", ["Cómo ser un ejemplo para tu comunidad", "Cómo manejar los “no” sin desanimarte", "Cómo organizar tu semana"]);
  function marketing() {
    return { html: shell("Marketing", "Cómo compartir Código ML", "<h5 class='oh'>Sí</h5>" + list(["Invita a conocer la plataforma y la sala.", "Comparte el mensaje del día y la frase de hoy.", "Cuenta tu experiencia con respeto.", "Pide permiso antes de escribirle a alguien."]) + "<h5 class='oh'>No</h5>" + list(["Prometer ingresos, ventas o resultados.", "Dar precios que no estén en tu lista.", "Hablar de productos de afuera de Código ML.", "Enviar mensajes masivos o spam."]), "Más plantillas para publicaciones y mensajes: próximamente.") };
  }
  function ventas(X) { return { html: shell("Ventas", "Si te dicen…", X.OBJ.map(o => "<p><b>" + X.esc(o[0]) + "</b><br>" + X.esc(o[1]) + "</p>").join("")) }; }
  const bienestar = X => soon(X, "Bienestar", "El bienestar de Código ML", "Cómo contar el spa, la música, los mensajes del día y la comunidad.", ["Qué ofrece el spa y cómo mostrarlo", "Cómo invitar a una charla de bienestar", "Rutinas diarias suaves"]);
  const experiencias = X => soon(X, "Experiencias", "Tours y experiencias", "Cómo presentar los tours, cursos y planes de tu ciudad.", ["Tours y planes de Bogotá", "Cómo invitar a una amiga (No vayas sola)", "Planes de Navidad"]);
  function premium(X) {
    const c = X.cp(); if (!c || !c.p) return { html: shell("Premium", "Boutiques Gold, Platinum y Diamond", "<p>Todavía no hay lista de precios para tu país. Pregúntale a Jazz antes de dar un precio.</p>") };
    return { html: shell("Premium", "Tus paquetes · " + X.esc(c.nombre), '<table class="cmp"><thead><tr><th></th>' + X.C.paquetes.map(p => "<th>" + p.nombre + "</th>").join("") + "</tr></thead><tbody>" + [["Precio de feria", r => X.money(r.feria)], ["Separar hoy (" + Math.round(X.C.pago.separa * 100) + " %)", r => X.money(r.feria * X.C.pago.separa)], ["Mensualidad", r => X.money(r.mensual)]].map(([l, f]) => "<tr><td>" + l + "</td>" + X.C.paquetes.map(p => "<td>" + f(X.PR(p.id)) + "</td>").join("") + "</tr>").join("") + "</tbody></table>", "No menciones los precios de otro país. No prometas ventas.") };
  }

  /* ---------- tarjetas deslizables ---------- */
  const card = (t, inner, cls) => '<article class="dc' + (cls ? " " + cls : "") + '"><h4>' + t + "</h4>" + inner + "</article>";
  function deck(kick, title, cards, intro, foot, start) {
    return '<div class="kick">' + kick + "</div><h3>" + title + "</h3>" + (intro ? "<p>" + intro + "</p>" : "") + '<div class="deckw"><button class="dk l" data-d="-1" aria-label="Anterior">‹</button><div class="deck" tabindex="0">' + cards.join("") + '</div><button class="dk r" data-d="1" aria-label="Siguiente">›</button></div><div class="dots">' + cards.map((c, i) => "<i" + (i === (start || 0) ? ' class="on"' : "") + "></i>").join("") + "</div>" + (foot ? '<p class="note">' + foot + "</p>" : "") + '<p class="note sw">Desliza para ver más tarjetas →</p>';
  }
  function deckMount(ov, start) {
    const d = ov.querySelector(".deck"); if (!d) return;
    const dots = [...ov.querySelectorAll(".dots i")], cs = [...d.children], upd = () => { let k = 0, best = 1e9; cs.forEach((c, i) => { const x = Math.abs(c.offsetLeft - d.scrollLeft - (d.clientWidth - c.offsetWidth) / 2); if (x < best) { best = x; k = i; } }); dots.forEach((x, i) => x.classList.toggle("on", i === k)); };
    d.addEventListener("scroll", () => { clearTimeout(deckMount.t); deckMount.t = setTimeout(upd, 40); }, { passive: true });
    ov.querySelectorAll(".dk").forEach(b => b.onclick = () => d.scrollBy({ left: +b.dataset.d * d.clientWidth * .8, behavior: "smooth" }));
    if (start) setTimeout(() => { const c = cs[start]; if (c) d.scrollLeft = c.offsetLeft - (d.clientWidth - c.offsetWidth) / 2; upd(); }, 60);
  }
  const wrapDeck = (html, extra, start) => ({ html, mount: ov => { deckMount(ov, start); extra && extra(ov); } });
  const grp = (X, key) => get(X, "mujeres", []).length;

  /* ---------- incentivos: escalera de bonos ---------- */
  const HITOS = [50, 100, 150, 200];
  const bonoDe = n => { let t = 0; HITOS.forEach(h => { if (n >= h) t += h; }); if (n >= 300) t += 200 * (Math.floor(n / 100) - 2); return t; };
  const proximo = n => { const h = HITOS.find(x => x > n); if (h) return [h, h]; const k = (Math.floor(n / 100) + 1) * 100; return [k, 200]; };
  function incent2(X) {
    const n = grp(X), [nx, bn] = proximo(n);
    const prev = HITOS.filter(h => h <= n).pop() || 0, pct = Math.max(2, Math.min(100, Math.round((n - prev) / (nx - prev) * 100)));
    const steps = [["50 mujeres", "US$50"], ["100 mujeres", "US$100"], ["150 mujeres", "US$150"], ["200 mujeres", "US$200"]].map((r, i) => '<div class="stp' + (n >= HITOS[i] ? " ok" : "") + '"><b>' + r[0] + "</b><span>" + r[1] + "</span></div>").join("");
    const c = [
      card("Tu escalera de bonos", '<p>Cada vez que tus mujeres inscritas llegan a una meta, ganas un bono de Jazz. Entre más mujeres traes, más grande se vuelve.</p><div class="stps">' + steps + '</div><p class="hl">Después de las 200: <b>US$200 por cada 100 mujeres más</b> (300, 400, 500…).</p>', "gold"),
      card("Dónde vas hoy", '<p>Según tu lista de “Mis mujeres” llevas <b>' + n + "</b>. Te faltan <b>" + (nx - n) + "</b> para tu próximo bono de <b>US$" + bn + '</b>.</p><div class="obar"><i style="width:' + pct + '%"></i></div><p class="note">Bonos que llevas ganados según tu lista: US$' + bonoDe(n) + ". Jazz confirma el total con las mujeres verificadas.</p>"),
      card("Cómo se cuentan", list(["Cuentan las mujeres <b>inscritas con tu código</b>, verificadas y activas.", "Cada mujer cuenta una sola vez.", "El bono lo paga Jazz, en dólares (US$).", "Las metas son acumuladas: no empiezan de cero."])),
      card("Boutiques", '<table class="cmp"><tbody><tr><td><b>Venta de boutique</b></td><td>15 % de lo que la clienta pagó</td></tr><tr><td><b>Mensualidad</b></td><td>10 % durante 12 meses, mientras siga activa y pagando</td></tr></tbody></table>'),
      card("Empresas y negocios", '<table class="cmp"><tbody><tr><td><b>Paquete corporativo</b></td><td>10 %</td></tr><tr><td><b>Negocio en el ecosistema (US$20 al mes)</b></td><td>US$5 al mes mientras siga pagando</td></tr></tbody></table>'),
      card("Tú puedes 🌸", "<p>Cada mujer que inscribes ya cuenta. Una conversación honesta hoy puede ser tu próximo bono. Empieza con una sola.</p><p class='note'>Las comisiones se calculan sobre pagos efectivamente recibidos, sin impuestos, comisiones de pasarela ni reembolsos. No se promete ningún ingreso.</p>", "gold")
    ];
    return wrapDeck(deck("Incentivos", "Cómo ganas con Código ML", c), null);
  }

  /* ---------- plan semanal ---------- */
  function plan2(X) {
    const t = today(); let cur = 0; WEEKS.forEach((w, i) => { if (w[0] <= t) cur = i; });
    const c = WEEKS.map((w, i) => card(w[1] + (i === cur && t >= WEEKS[0][0] ? " · esta semana" : ""), '<p class="goal"><b>Meta de la semana</b><br>' + w[2] + "</p><p class='sug'><small>Actividades sugeridas</small></p>" + list(w[3]), i === cur && t >= WEEKS[0][0] ? "now" : ""));
    c.push(card("Cómo se cumple", list(["Tú decides cuándo y cómo hacer cada actividad.", "No hay horarios ni reportes diarios.", "Hay un cierre semanal de resultados con Jazz.", "El objetivo: 50 mujeres antes del 14 de diciembre."])));
    return wrapDeck(deck("Plan semanal", "Tus primeras cinco semanas", c, t < WEEKS[0][0] ? "Tu plan empieza el lunes 9 de noviembre." : "", "La meta es el resultado que buscamos; las actividades son sugerencias."), null, t >= WEEKS[0][0] ? cur : 0);
  }

  /* ---------- reglas ---------- */
  function reglas2() {
    const c = [
      card("Siempre", list(["La clienta paga siempre a Código ML, nunca a la asesora.", "Usa solo la lista de precios de tu país.", "Escríbeles solo a quienes aceptaron, con respeto.", "Cuida los datos: son de Código ML."])),
      card("Nunca", list(["No cambies precios ni hagas promesas fuera de las condiciones oficiales.", "No prometas ganancias, ventas ni resultados.", "No menciones los precios de otro país.", "No copies ni uses los datos para otra cosa."])),
      card("Pagos y comisiones", list(["Comisión solo por lo que tú vendes o inscribes; no por reclutar asesoras.", "Se paga sobre pagos efectivamente recibidos.", "Si hay reembolso, se descuenta.", "Las mujeres cuentan cuando están verificadas y activas."])),
      card("Tu trabajo", list(["Trabajas por cuenta propia: eliges tus horarios y tu forma de trabajar.", "Reglas completas y contrato: lo que vale es el documento firmado."]) + '<div class="acts"><a class="bt2 g" href="formulario.html" target="_blank" rel="noopener">Formulario de participación</a></div>')
    ];
    return wrapDeck(deck("Reglas del programa", "Lo que sí y lo que no", c, "", "Resumen. Pregúntale a Jazz si tienes dudas."), null);
  }

  /* ---------- speech y ventas ---------- */
  function speech2(X) {
    const c = [
      card("En 30 segundos", "<p>“Código ML es un hotel virtual para mujeres. Tiene bienestar, comunidad, experiencias y boutiques de mujeres emprendedoras. Puedes entrar gratis a la comunidad, y si tienes una marca, puedes tener tu propia boutique dentro del hotel.”</p>", "gold"),
      card("Cómo abrir la conversación", list(["“¿Cómo te sientes con tu negocio últimamente?”", "“¿Has pensado en vender a una comunidad de mujeres?”", "“¿Te cuento algo bonito que estamos creando?”"]) + "<p class='note'>Escucha primero. Habla después.</p>"),
      card("Recorrido de 10 minutos", "<ul class='oplan'>" + X.PLAN.map(x => "<li><b>" + x[0] + " · " + x[1] + "</b><br>" + x[2] + "</li>").join("") + "</ul>"),
      card("El cierre", list(["Pregunta: “¿Quieres separar tu cupo hoy?”", "Confirma paquete y país.", "Anota tu código de asesora en el formulario.", "Si dice “lo pienso”: agenda una fecha para escribirle."]))
    ];
    return wrapDeck(deck("Speech", "Lo que le dices a una mujer", c, "", "No prometas ventas ni ingresos. Habla de lo que la plataforma ofrece."), null);
  }
  function ventas2(X) {
    const c = X.OBJ.map(o => card("Si te dicen…", "<p class='q'>" + X.esc(o[0]) + "</p><p><b>Responde:</b> " + X.esc(o[1]) + "</p>"));
    return wrapDeck(deck("Ventas", "Responde con calma", c, "Las dudas más comunes y cómo contestarlas."), null);
  }
  function entrenamiento2() {
    const L = [["Qué es Código ML", ["Un hotel virtual hecho por mujeres, para mujeres.", "Cuatro mundos: bienestar, comunidad, experiencias y boutiques.", "Conecta · Vive · Crece."]],
      ["Recorrido de la app y de la sala", ["Mira la sala completa antes de presentarla.", "Practica el recorrido de 10 minutos.", "Conoce dónde está cada puerta."]],
      ["Cómo inscribir a una mujer", ["Explícale que es gratis entrar a la comunidad.", "Ayúdale a registrarse con tu código.", "Anótala en Mis mujeres."]],
      ["Cómo cuidar a tus mujeres", ["Escríbele el primer día, al tercero y a la semana.", "Usa los mensajes listos de Mis mujeres.", "Respeta si pide no recibir más mensajes."]],
      ["Cómo conversar sin presionar", ["Pregunta más de lo que hablas.", "Cuenta lo que ofreces, no lo que ganas.", "Acepta el “no” con una sonrisa."]],
      ["Cómo mostrar boutiques y paquetes", ["Muestra la boutique inaugural.", "Voltea cada tarjeta de paquete.", "Usa solo los precios de tu país."]],
      ["Reglas del programa", ["La clienta paga a Código ML.", "Cero promesas de ingresos.", "Comisiones sobre pagos recibidos."]],
      ["Privacidad de los datos", ["Los datos son de Código ML.", "No los compartas ni los uses para otra cosa.", "Pide permiso para escribir."]]];
    const c = L.map((l, i) => card("Lección " + (i + 1) + " · " + l[0], list(l[1])));
    return wrapDeck(deck("Entrenamiento", "Tu ruta de formación", c, "Ocho lecciones cortas. Desliza y léelas con calma."), null);
  }
  function marketing2(X) {
    const msgs = ["Hola, soy " + first(X) + " 🌸 Estoy invitando a mujeres a conocer Código ML, un hotel virtual hecho para nosotras. ¿Te cuento?", "Hoy abrí mi caja de motivación en Código ML y quise compartirte esta frase. ¿Quieres conocer el espacio?", "Si tienes una marca, en Código ML puedes tener tu propia boutique dentro de un hotel virtual. ¿Te muestro cómo es?"];
    const c = [card("Sí", list(["Invita a conocer la plataforma y la sala.", "Comparte tu frase de hoy.", "Cuenta tu experiencia con respeto.", "Pide permiso antes de escribirle a alguien."])),
      card("No", list(["Prometer ingresos, ventas o resultados.", "Dar precios que no estén en tu lista.", "Hablar de productos de afuera de Código ML.", "Enviar mensajes masivos o spam."])),
      ...msgs.map((m, i) => card("Mensaje listo " + (i + 1), "<p class='mtxt'>" + X.esc(m) + "</p><button class='bt2 g' data-cpm='" + i + "'>Copiar</button>"))];
    return wrapDeck(deck("Marketing", "Cómo compartir Código ML", c), ov => ov.querySelectorAll("[data-cpm]").forEach(b => b.onclick = () => copy(msgs[+b.dataset.cpm], X)));
  }
  function estrategia2(X) {
    const co = X.a && X.a.pais === "co";
    const c = co ? [
      card("Primeras 50 fundadoras · Bogotá", list(["Inscripción hasta el 12 de diciembre.", "Premios el 15 de diciembre.", "1.º: ancheta navideña gourmet.", "2.º: entradas al Jardín Botánico en Navidad.", "3.º: matcha para dos."]), "gold"),
      card("La misión diaria", list(["Cada mujer completa su misión (unos 5 minutos).", "Cada día completo es un boleto.", "Caja secreta y colección de 5 elementos."])),
      card("Tu papel", list(["Inscribes y das la bienvenida.", "La cuidas para que regrese todos los días.", "Le muestras la caja secreta: es lo que más las anima."]))
    ] : [
      card("Primeras 50 fundadoras", list(["Tu meta: inscribir mujeres con tu código.", "Ganas el bono por mujeres inscritas (mira Incentivos).", "Las condiciones de tu país te las confirma Jazz."]), "gold"),
      card("Tu papel", list(["Inscribes y das la bienvenida.", "La cuidas para que regrese todos los días.", "Usa los mensajes de Mis mujeres."]))
    ];
    return wrapDeck(deck("Estrategia", co ? "Campaña de Bogotá" : "Tu campaña de fundadoras", c), null);
  }

  /* ---------- baúl de motivación: una tarjeta nueva cada día ---------- */
  const FRASES = [
    "No naciste para mirar cómo otras cumplen sus sueños. Naciste para construir los tuyos.",
    "El éxito no llama a tu puerta. Reconoce a quienes se atreven a abrirla.",
    "No le pongas límites a tus sueños por el tamaño de tus circunstancias.",
    "Que tus resultados hagan ruido, no tus excusas.",
    "La mujer que se atreve a comenzar ya está un paso adelante de la que sigue esperando.",
    "No esperes que la vida cambie para actuar. Actúa para cambiar tu vida.",
    "Tu futuro no se adivina. Se construye, una decisión valiente a la vez.",
    "El miedo pregunta: ¿Y si fracaso? La valentía responde: ¿Y si lo logro?",
    "No necesitas que el mundo crea en ti para comenzar. Necesitas dejar de dudar de ti misma.",
    "No sueñes con una vida extraordinaria mientras repites hábitos ordinarios.",
    "Una mujer que conoce su valor no necesita perseguir oportunidades: aprende a crearlas.",
    "No vendes una membresía. Abres la puerta a una experiencia que puede enriquecer vidas.",
    "Cada NO es una respuesta. Nunca una sentencia sobre tu capacidad.",
    "La venta comienza con una pregunta inteligente, no con un discurso perfecto.",
    "No busques convencer a todo el mundo. Encuentra a quienes realmente puedes ayudar.",
    "Una buena vendedora cierra negocios. Una vendedora extraordinaria construye confianza.",
    "Tu próxima gran venta puede comenzar con una conversación que todavía no te has atrevido a iniciar.",
    "No temas hablar de precios. Aprende a demostrar valor.",
    "Quien vende con desesperación persigue. Quien vende con preparación inspira confianza.",
    "Una clienta satisfecha puede ser el comienzo de muchas puertas abiertas.",
    "La disciplina hace por tus sueños lo que la motivación no puede hacer todos los días.",
    "No confundas movimiento con progreso. Haz que cada acción tenga una dirección.",
    "La constancia convierte pequeños esfuerzos en grandes historias.",
    "No eres lo que prometes hacer mañana. Eres lo que decides hacer hoy.",
    "Los días difíciles no cancelan los sueños grandes. Los ponen a prueba.",
    "La diferencia entre querer ganar y aprender a ganar está en la preparación.",
    "Que el cansancio te invite a descansar, nunca a renunciar a tu propósito.",
    "Mientras tú dudas de tu potencial, alguien con menos experiencia ya se atrevió a comenzar.",
    "Los resultados extraordinarios se alimentan de decisiones que nadie aplaude.",
    "No cuentes solamente los días que trabajas. Haz que los días de trabajo cuenten.",
    "No trabajes únicamente por una comisión. Construye una trayectoria que te haga sentir orgullosa.",
    "La libertad financiera no empieza cuando ganas mucho. Empieza cuando aprendes a crear y administrar valor.",
    "Cada habilidad que desarrollas es una puerta que antes estaba cerrada.",
    "No esperes sentirte poderosa para actuar. Descubre tu poder actuando.",
    "Tu cuenta bancaria puede mostrar tu presente. Jamás debe definir el límite de tu futuro.",
    "Los negocios pueden comenzar pequeños. La visión no tiene por qué serlo.",
    "No necesitas conocer a mil personas. Necesitas aprender a conectar genuinamente con cada una.",
    "Que tu ambición sea grande, pero que tu integridad sea todavía mayor.",
    "Una mujer preparada no teme a la competencia. Sabe que su mayor desafío es superarse a sí misma.",
    "No persigas solamente ingresos. Construye habilidades, relaciones y oportunidades que puedan perdurar.",
    "Nunca apagues la luz de otra mujer para intentar que la tuya brille más.",
    "El verdadero liderazgo no consiste en tener seguidoras, sino en formar mujeres capaces de llegar más lejos.",
    "Cuando una mujer crece, puede abrir caminos para muchas otras.",
    "No seas solamente parte de una historia de éxito. Atrévete a escribir la tuya.",
    "Cada nueva mañana te entrega algo que el dinero no puede comprar: una oportunidad de comenzar mejor.",
    "No permitas que un capítulo difícil te convenza de que toda tu historia será igual.",
    "Tus sueños merecen más que tus ganas. Merecen tu compromiso.",
    "El éxito más valioso no es llegar sola a la cima, sino crecer sin perder tu esencia.",
    "Que algún día puedas mirar atrás y decir: tuve miedo, tuve dudas, tuve obstáculos… pero nunca dejé de avanzar.",
    "No viniste a este mundo solamente a ganarte la vida. Viniste a descubrir de qué eres capaz, construir tu propio camino y dejar una huella que inspire a otras mujeres."
  ];
  const dayNum = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };
  const dayKey = n => new Date(n * 864e5).toISOString().slice(0, 10);
  function frase(X) {
    const dn = dayNum(), idx = dn % FRASES.length, T = dayKey(dn);
    const body = () => { const h = get(X, "frases", {}), keys = Object.keys(h).sort(); let st = 0; for (let k = dn; h[dayKey(k)] !== undefined; k--) st++; if (h[T] === undefined && st === 0) { for (let k = dn - 1; h[dayKey(k)] !== undefined; k--) st++; }
      return '<div class="kick">Baúl de motivación</div><h3 id="fh">' + (h[T] !== undefined ? "Tu tarjeta de hoy" : "Toca el baúl") + '</h3><div class="chest" id="ch" role="button" tabindex="0" aria-label="Abrir el baúl"><div class="spk"></div><div class="fcard" id="cd"></div><div class="cbody"><i></i></div><div class="clid"></div></div><p class="note" id="fs" style="text-align:center"></p><div class="acts" id="fa" hidden style="justify-content:center"><button class="bt2 w" id="fc">Copiar frase</button><a class="bt2 g" id="fw" target="_blank" rel="noopener">Compartir por WhatsApp</a></div>' +
        (keys.length ? '<h5 class="oh">Tu colección · ' + keys.length + ' de ' + FRASES.length + (st > 1 ? " · racha " + st + " días" : "") + '</h5><div class="cgrid">' + keys.slice().reverse().map(k => '<button class="cmini" data-k="' + k + '"><small>' + k.slice(8) + "/" + k.slice(5, 7) + "</small><span>" + X.esc(FRASES[h[k]].slice(0, 46)) + "…</span></button>").join("") + "</div>" : "") + '<p class="note">Cada día, una tarjeta nueva. Vuelve mañana por la siguiente.</p>'; };
    return { html: '<div id="fz">' + body() + "</div>", mount: ov => {
      const host = ov.querySelector("#fz");
      const show = (i, anim, label) => { const ch = host.querySelector("#ch"), cd = host.querySelector("#cd"); cd.innerHTML = '<small>🌸 Tarjeta ' + (i + 1) + " de " + FRASES.length + '</small><p>“' + X.esc(FRASES[i]) + '”</p><em>Código Mujer Libre · Mentalidad de éxito</em>'; ch.classList.add("open"); if (!anim) ch.classList.add("still"); host.querySelector("#fa").hidden = false;
        host.querySelector("#fc").onclick = () => copy("“" + FRASES[i] + "” 🌸 Código ML", X); host.querySelector("#fw").href = "https://wa.me/?text=" + encodeURIComponent("“" + FRASES[i] + "” 🌸 Código Mujer Libre"); host.querySelector("#fs").textContent = label || ""; };
      const bind = () => { host.innerHTML = body(); const ch = host.querySelector("#ch"), h = get(X, "frases", {});
        if (h[T] !== undefined) show(h[T], false, "Vuelve mañana por tu siguiente tarjeta.");
        else { const open = () => { if (ch.classList.contains("open")) return; const hh = get(X, "frases", {}); hh[T] = idx; set(X, "frases", hh); host.querySelector("#fh").textContent = "Tu tarjeta de hoy"; show(idx, true, "Guárdala. Mañana habrá una nueva."); tonep(); }; ch.onclick = open; ch.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }; host.querySelector("#fs").textContent = "Toca el baúl para sacar tu tarjeta de hoy"; }
        host.querySelectorAll(".cmini").forEach(b => b.onclick = () => { const i = get(X, "frases", {})[b.dataset.k]; if (i !== undefined) { host.querySelector("#fh").textContent = "Tarjeta del " + b.dataset.k.slice(8) + "/" + b.dataset.k.slice(5, 7); show(i, false, ""); host.scrollIntoView({ behavior: "smooth", block: "start" }); } }); };
      const tonep = () => { try { X.tone && X.tone(); } catch (e) {} };
      bind(); } };
  }
  const R = { metas, plan: plan2, incent: incent2, saldo, mujeres, reglas: reglas2, agenda, reunion, speech: speech2, entrenamiento: entrenamiento2, estrategia: estrategia2, liderazgo, marketing: marketing2, ventas: ventas2, bienestar, experiencias, premium, frase };
  window.CMLO = { panel, render: (k, X) => R[k] ? R[k](X) : null };
})();
