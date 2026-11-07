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
  const R = { metas, plan, incent, saldo, mujeres, reglas, agenda, reunion, speech, entrenamiento, estrategia, liderazgo, marketing, ventas, bienestar, experiencias, premium };
  window.CMLO = { panel, render: (k, X) => R[k] ? R[k](X) : null };
})();
