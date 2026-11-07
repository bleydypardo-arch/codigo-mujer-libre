/* Código ML Asesoras · app de trabajo para asesoras.
   Los datos se guardan en este teléfono (localStorage). Respaldo: Más › Mi cuenta › Descargar respaldo.
   Más adelante se conectará a Supabase para que Jazz vea todo en un solo lugar. */
(function () {
  const C = window.CMLV, D = window.CMLD, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = n => { n = +n || 0; return Number.isInteger(n) ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : n.toFixed(2).replace(".", ","); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => ymd(new Date());
  const MES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const DIA = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  const fdate = s => { if (!s) return ""; const [y, m, d] = s.split("-"); return +d + " " + MES[+m - 1].slice(0, 3) + (y !== String(new Date().getFullYear()) ? " " + y : ""); };
  let A = null;
  const KEY = n => "cml_of_" + A.codigo + "_" + n;
  const get = (n, d) => { try { const v = localStorage.getItem(KEY(n)); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const set = (n, v) => { try { localStorage.setItem(KEY(n), JSON.stringify(v)); } catch (e) { toast("No pude guardar en este teléfono. Revisa el espacio o el modo privado."); } };
  const cp = () => C.precios[A.pais] || C.precios.do;
  const money = n => { const c = cp(); return c.moneda + num(n) + c.sufijo; };
  const PR = id => cp().p ? cp().p[id] : null;
  const first = () => A.nombre.split("·")[0].trim().split(" ")[0];

  /* ---------- ventanas ---------- */
  function toast(t) { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 3000); }
  function modal(html, mount, wide) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="md' + (wide ? " wide" : "") + '" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar" type="button">×</button>' + html + "</div>"; document.body.appendChild(ov);
    const close = () => { ov.remove(); document.removeEventListener("keydown", esck); };
    const esck = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esck); ov.addEventListener("click", e => { if (e.target === ov) close(); }); $(".x", ov).addEventListener("click", close);
    $$("[data-m]", ov).forEach(b => b.addEventListener("click", () => { const m = b.dataset.m.split(":"); close(); if (m[0] === "of") openOf(m[1]); }));
    mount && mount(ov, close); return close;
  }
  function copy(txt) { const ok = () => toast("Copiado. Pégalo en WhatsApp."); try { navigator.clipboard.writeText(txt).then(ok, fall); } catch (e) { fall(); } function fall() { const t = document.createElement("textarea"); t.value = txt; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("Mantén pulsado el texto para copiarlo."); } t.remove(); } }
  const waLink = t => "https://wa.me/?text=" + encodeURIComponent(t);
  function confirmBox(msg, yes, label) { modal('<h3>' + esc(msg) + '</h3><div class="row2"><button class="bt2" type="button" data-n>Cancelar</button><button class="bt2 w" type="button" data-y>' + (label || "Sí, borrar") + "</button></div>", (ov, close) => { $("[data-n]", ov).onclick = close; $("[data-y]", ov).onclick = () => { close(); yes(); }; }); }

  /* contenido de la sala de oficina (metas, plan, incentivos, mujeres, reglas, frase…) */
  function openOf(key) {
    if (!window.CMLO) return;
    const X = { a: A, C, toast, esc, cp, money, PR, OBJ: D.OBJ, PLAN: D.PLAN, tone: () => {} }, r = CMLO.render(key, X); if (!r) return;
    modal(r.html, r.mount, true);
  }

  /* ---------- formularios genéricos ---------- */
  function field(f, v) {
    const val = v == null ? (f.def == null ? "" : f.def) : v, id = "f_" + f.k;
    if (f.type === "emoji") return '<label>' + esc(f.l) + '</label><input type="hidden" name="' + f.k + '" value="' + esc(val || D.EMO[0]) + '"><div class="emo">' + D.EMO.map(e => '<button type="button" class="' + (e === (val || D.EMO[0]) ? "on" : "") + '" data-e="' + e + '">' + e + "</button>").join("") + "</div>";
    if (f.type === "bool") return '<label class="chk"><input type="checkbox" name="' + f.k + '"' + (val ? " checked" : "") + "> " + esc(f.l) + "</label>";
    if (f.type === "select") return '<label for="' + id + '">' + esc(f.l) + '</label><select id="' + id + '" name="' + f.k + '">' + f.opts.map(o => { const ov = Array.isArray(o) ? o[0] : o, ol = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(ov) + '"' + (String(ov) === String(val) ? " selected" : "") + ">" + esc(ol) + "</option>"; }).join("") + "</select>";
    if (f.type === "textarea") return '<label for="' + id + '">' + esc(f.l) + '</label><textarea id="' + id + '" name="' + f.k + '" rows="3" placeholder="' + esc(f.ph || "") + '">' + esc(val) + "</textarea>";
    return '<label for="' + id + '">' + esc(f.l) + '</label><input id="' + id + '" name="' + f.k + '" type="' + (f.type || "text") + '"' + (f.type === "number" ? ' inputmode="decimal" step="any"' : "") + ' value="' + esc(val) + '" placeholder="' + esc(f.ph || "") + '"' + (f.req ? " required" : "") + ">";
  }
  function formModal(title, fields, vals, onSave, onDel) {
    vals = vals || {};
    modal("<h3>" + esc(title) + '</h3><form class="frm" novalidate>' + fields.map(f => field(f, vals[f.k])).join("") + '<div class="row2">' + (onDel ? '<button class="bt2 del" type="button" data-del>Borrar</button>' : "") + '<button class="bt2 w" type="submit">Guardar</button></div></form>', (ov, close) => {
      $$(".emo button", ov).forEach(b => b.onclick = () => { $$(".emo button", ov).forEach(x => x.classList.remove("on")); b.classList.add("on"); $('input[name="' + b.closest(".emo").previousElementSibling.name + '"]', ov).value = b.dataset.e; });
      $("form", ov).addEventListener("submit", e => {
        e.preventDefault(); const o = {};
        fields.forEach(f => { const el = $('[name="' + f.k + '"]', ov); o[f.k] = f.type === "bool" ? el.checked : f.type === "number" ? (el.value === "" ? 0 : +String(el.value).replace(",", ".")) : el.value.trim(); });
        const need = fields.find(f => f.req && !o[f.k]); if (need) { toast("Falta: " + need.l); return; }
        close(); onSave(o);
      });
      const d = $("[data-del]", ov); if (d) d.onclick = () => { close(); confirmBox("¿Borrar este registro?", onDel); };
    });
  }
  function csv(rows, name) {
    if (!rows.length) { toast("Todavía no hay registros."); return; }
    const cols = Object.keys(rows[0]), q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    save("﻿" + cols.join(",") + "\n" + rows.map(r => cols.map(c => q(typeof r[c] === "object" ? JSON.stringify(r[c]) : r[c])).join(",")).join("\n"), name + "-" + today() + ".csv", "text/csv");
  }
  function save(txt, name, type) { try { const u = URL.createObjectURL(new Blob([txt], { type: type + ";charset=utf-8" })), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); toast("Archivo descargado."); } catch (e) { toast("No se pudo descargar. Copia los datos manualmente."); } }

  /* ---------- pantalla de lista genérica ---------- */
  const main = $("#main");
  function lista(c) {
    const items = get(c.name, []);
    let fil = c.fil ? (lista.f[c.name] || "todos") : "todos";
    const vis = c.fil && fil !== "todos" ? items.filter(i => i[c.fil.k] === fil) : items;
    vis.sort(c.sort || ((a, b) => (b.fecha || "").localeCompare(a.fecha || "")));
    main.innerHTML = head(c.title, c.sub) + (c.sum ? '<div class="sumr">' + c.sum(items) + "</div>" : "") +
      (c.fil ? '<div class="chips">' + [["todos", "Todos"]].concat(c.fil.opts.map(o => Array.isArray(o) ? o : [o, o])).map(o => '<button type="button" class="' + (fil === o[0] ? "on" : "") + '" data-f="' + esc(o[0]) + '">' + esc(o[1]) + "</button>").join("") + "</div>" : "") +
      '<div class="lst">' + (vis.length ? vis.map(i => { const r = c.line(i); return '<button type="button" class="li" data-id="' + i.id + '"><i>' + (r.e || c.ico) + '</i><span><b>' + esc(r.t) + "</b><small>" + esc(r.s || "") + "</small></span>" + (r.r ? "<em>" + esc(r.r) + "</em>" : "") + "</button>"; }).join("") : '<div class="empty"><i>' + c.ico + "</i><p>" + esc(c.empty) + "</p></div>") + "</div>" +
      '<div class="bar"><button class="bt2 w" type="button" data-add>+ ' + esc(c.add) + '</button>' + (items.length ? '<button class="bt2" type="button" data-csv>Descargar Excel</button>' : "") + "</div>";
    $$(".chips [data-f]", main).forEach(b => b.onclick = () => { lista.f[c.name] = b.dataset.f; lista(c); });
    const edit = id => {
      const it = id ? items.find(x => x.id === id) : null;
      formModal(it ? "Editar" : c.add, c.fields, it || c.def, o => { const all = get(c.name, []); if (it) Object.assign(all.find(x => x.id === id), o); else all.push(Object.assign({ id: uid() }, o)); set(c.name, all); toast("Guardado."); lista(c); }, it ? () => { set(c.name, get(c.name, []).filter(x => x.id !== id)); lista(c); } : null);
    };
    $$(".li", main).forEach(b => b.onclick = () => c.open ? c.open(b.dataset.id, () => lista(c)) : edit(b.dataset.id));
    $("[data-add]", main).onclick = () => edit();
    const cs = $("[data-csv]", main); if (cs) cs.onclick = () => csv(items.map(({ id, ...r }) => r), c.name);
  }
  lista.f = {};
  const head = (t, s, back) => '<div class="ph"><button type="button" class="bk" data-go="' + (back || "inicio") + '" aria-label="Volver">‹</button><div><h2>' + t + "</h2>" + (s ? "<p>" + s + "</p>" : "") + "</div></div>";

  /* ---------- AGENDA PERSONAL (calendario con emojis) ---------- */
  const CAT = [["📞", "Llamada"], ["💬", "WhatsApp"], ["☕", "Reunión o café"], ["🎪", "Evento"], ["💄", "Boutique"], ["💰", "Cobro o pago"], ["🌿", "Personal"], ["📝", "Otra"]];
  const ag = { y: new Date().getFullYear(), m: new Date().getMonth(), sel: today() };
  function agenda() {
    const items = get("agenda_v2", []), first1 = new Date(ag.y, ag.m, 1), off = (first1.getDay() + 6) % 7, days = new Date(ag.y, ag.m + 1, 0).getDate();
    const by = {}; items.forEach(i => (by[i.fecha] = by[i.fecha] || []).push(i));
    let cells = ""; for (let i = 0; i < off; i++) cells += "<span></span>";
    for (let d = 1; d <= days; d++) { const k = ag.y + "-" + pad(ag.m + 1) + "-" + pad(d), l = by[k] || [], pend = l.filter(x => !x.hecho).length; cells += '<button type="button" class="dy' + (k === today() ? " hoy" : "") + (k === ag.sel ? " sel" : "") + '" data-d="' + k + '"><b>' + d + "</b><u>" + (l.length ? l.slice(0, 3).map(x => x.emoji).join("") : "") + "</u>" + (pend > 3 ? "<s>+" + (pend - 3) + "</s>" : "") + "</button>"; }
    const sel = (by[ag.sel] || []).slice().sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));
    const up = items.filter(i => !i.hecho && i.fecha >= today()).sort((a, b) => (a.fecha + (a.hora || "")).localeCompare(b.fecha + (b.hora || ""))).slice(0, 4);
    main.innerHTML = head("Mi agenda", "Escribe tus citas, llamadas y pendientes. Cada una con su emoji.") +
      '<div class="cal"><div class="calh"><button type="button" data-mm="-1" aria-label="Mes anterior">‹</button><b>' + MES[ag.m] + " " + ag.y + '</b><button type="button" data-mm="1" aria-label="Mes siguiente">›</button></div><div class="cw">' + DIA.map(x => "<i>" + x + "</i>").join("") + "</div><div class=\"cg\">" + cells + "</div></div>" +
      '<div class="dayh"><h4>' + (ag.sel === today() ? "Hoy" : fdate(ag.sel)) + '</h4><button type="button" class="bt2 w sm" data-new>+ Agregar</button></div>' +
      '<div class="lst">' + (sel.length ? sel.map(it).join("") : '<div class="empty s"><p>Nada anotado para este día. Toca “Agregar”.</p></div>') + "</div>" +
      (up.length ? '<h4 class="sh">Lo que viene</h4><div class="lst">' + up.map(it).join("") + "</div>" : "");
    function it(i) { return '<div class="li ag' + (i.hecho ? " done" : "") + '"><button type="button" class="ck" data-ck="' + i.id + '" aria-label="Marcar hecho">' + (i.hecho ? "✓" : "") + '</button><button type="button" class="tx" data-ed="' + i.id + '"><i>' + i.emoji + "</i><span><b>" + esc(i.t) + "</b><small>" + (i.hora ? esc(i.hora) + " · " : "") + esc(i.cat || "") + (i.nota ? " · " + esc(i.nota.slice(0, 40)) : "") + "</small></span></button></div>"; }
    $$("[data-mm]", main).forEach(b => b.onclick = () => { ag.m += +b.dataset.mm; if (ag.m < 0) { ag.m = 11; ag.y--; } if (ag.m > 11) { ag.m = 0; ag.y++; } agenda(); });
    $$(".dy", main).forEach(b => b.onclick = () => { ag.sel = b.dataset.d; agenda(); });
    $$("[data-ck]", main).forEach(b => b.onclick = () => { const a = get("agenda_v2", []), x = a.find(z => z.id === b.dataset.ck); x.hecho = !x.hecho; set("agenda_v2", a); agenda(); });
    const F = [{ k: "emoji", l: "Emoji", type: "emoji" }, { k: "t", l: "¿Qué vas a hacer?", req: 1, ph: "Ej. Llamar a Camila" }, { k: "fecha", l: "Día", type: "date", req: 1 }, { k: "hora", l: "Hora", type: "time" }, { k: "cat", l: "Tipo", type: "select", opts: CAT.map(c => c[1]) }, { k: "nota", l: "Notas", type: "textarea" }, { k: "hecho", l: "Ya lo hice", type: "bool" }];
    const edit = id => { const x = id ? get("agenda_v2", []).find(z => z.id === id) : null; formModal(x ? "Editar" : "Nueva cita", F, x || { emoji: "📞", fecha: ag.sel, cat: "Llamada" }, o => { const a = get("agenda_v2", []); if (x) Object.assign(a.find(z => z.id === id), o); else a.push(Object.assign({ id: uid() }, o)); set("agenda_v2", a); toast("Anotado."); agenda(); }, x ? () => { set("agenda_v2", get("agenda_v2", []).filter(z => z.id !== id)); agenda(); } : null); };
    $$("[data-ed]", main).forEach(b => b.onclick = () => edit(b.dataset.ed)); $("[data-new]", main).onclick = () => edit();
    $$("[name=cat]").forEach(() => {});
  }

  /* ---------- EVENTOS (agenda de eventos con tareas, invitados, proveedores y seguimiento) ---------- */
  const EST = ["Idea", "Planeado", "Confirmado", "Hecho", "Cancelado"];
  const EVF = [{ k: "emoji", l: "Emoji", type: "emoji", def: "🎪" }, { k: "t", l: "Nombre del evento", req: 1 }, { k: "fecha", l: "Día", type: "date", req: 1 }, { k: "hora", l: "Hora", type: "time" }, { k: "lugar", l: "Lugar (o enlace si es en línea)" }, { k: "estado", l: "Estado", type: "select", opts: EST }, { k: "cupos", l: "Cupos o personas esperadas", type: "number" }, { k: "notas", l: "Notas", type: "textarea" }];
  function evDetail(id, done) {
    const draw = () => {
      const all = get("eventos", []), e = all.find(x => x.id === id); if (!e) return;
      const T = e.tareas || [], I = e.invitados || [], P = e.provs || [], R = e.res || {};
      const tdone = T.filter(x => x.ok).length, conf = I.filter(x => x.ok).length, cost = P.reduce((s, x) => s + (+x.costo || 0), 0);
      const sec = (k, ttl, rows, ph) => '<h5 class="oh">' + ttl + '</h5><ul class="sli">' + rows + '</ul><div class="adr"><input data-in="' + k + '" placeholder="' + ph[0] + '">' + (ph[1] ? '<input data-in2="' + k + '" placeholder="' + ph[1] + '">' : "") + '<button type="button" class="bt2 w sm" data-ad="' + k + '">+</button></div>';
      const html = '<div class="kick">' + esc(e.estado || "") + "</div><h3>" + e.emoji + " " + esc(e.t) + "</h3><p>" + fdate(e.fecha) + (e.hora ? " · " + esc(e.hora) : "") + (e.lugar ? " · " + esc(e.lugar) : "") + "</p>" +
        '<div class="otiles"><div class="otile"><b>' + tdone + "/" + T.length + "</b><small>tareas listas</small></div><div class=\"otile\"><b>" + conf + "/" + I.length + "</b><small>invitadas confirmadas</small></div></div>" +
        sec("tareas", "Tareas y responsables", T.map((x, i) => '<li class="' + (x.ok ? "ok" : "") + '"><button type="button" class="ck" data-t="tareas:' + i + '">' + (x.ok ? "✓" : "") + "</button><span>" + esc(x.t) + (x.resp ? "<small>Responsable: " + esc(x.resp) + "</small>" : "") + '</span><button type="button" class="rm" data-r="tareas:' + i + '" aria-label="Quitar">×</button></li>').join(""), ["Tarea", "Responsable"]) +
        sec("invitados", "Invitadas", I.map((x, i) => '<li class="' + (x.ok ? "ok" : "") + '"><button type="button" class="ck" data-t="invitados:' + i + '">' + (x.ok ? "✓" : "") + "</button><span>" + esc(x.t) + (x.tel ? "<small>" + esc(x.tel) + "</small>" : "") + '</span><button type="button" class="rm" data-r="invitados:' + i + '" aria-label="Quitar">×</button></li>').join(""), ["Nombre", "Teléfono"]) +
        sec("provs", "Proveedores (costo " + money(cost) + ")", P.map((x, i) => "<li><span>" + esc(x.t) + "<small>" + (x.costo ? money(x.costo) : "sin costo") + '</small></span><button type="button" class="rm" data-r="provs:' + i + '" aria-label="Quitar">×</button></li>').join(""), ["Proveedor o servicio", "Costo"]) +
        '<h5 class="oh">Seguimiento y resultados</h5><label>Asistentes reales<input data-res="asist" inputmode="numeric" value="' + esc(R.asist || "") + '"></label><label>Mujeres nuevas inscritas<input data-res="nuevas" inputmode="numeric" value="' + esc(R.nuevas || "") + '"></label><label>Ventas generadas<input data-res="ventas" inputmode="decimal" value="' + esc(R.ventas || "") + '"></label><label>Qué salió bien y qué mejorar<textarea data-res="nota" rows="3">' + esc(R.nota || "") + "</textarea></label>" +
        '<div class="row2"><button class="bt2" type="button" data-edit>Editar datos</button><button class="bt2" type="button" data-inv>Texto de invitación</button></div>';
      return html;
    };
    let close;
    const mount = (ov, cl) => {
      close = cl;
      const wire = () => {
        const upd = f => { const all = get("eventos", []), e = all.find(x => x.id === id); f(e); set("eventos", all); const sc = ov.querySelector(".md").scrollTop; ov.querySelector(".md").innerHTML = '<button class="x" aria-label="Cerrar" type="button">×</button>' + draw(); ov.querySelector(".md").scrollTop = sc; $(".x", ov).onclick = () => { cl(); done && done(); }; wire(); };
        $$("[data-t]", ov).forEach(b => b.onclick = () => { const [k, i] = b.dataset.t.split(":"); upd(e => e[k][+i].ok = !e[k][+i].ok); });
        $$("[data-r]", ov).forEach(b => b.onclick = () => { const [k, i] = b.dataset.r.split(":"); upd(e => e[k].splice(+i, 1)); });
        $$("[data-ad]", ov).forEach(b => b.onclick = () => { const k = b.dataset.ad, a = $('[data-in="' + k + '"]', ov), s = $('[data-in2="' + k + '"]', ov); if (!a.value.trim()) { toast("Escribe algo primero."); return; } upd(e => { e[k] = e[k] || []; e[k].push(k === "tareas" ? { t: a.value.trim(), resp: s.value.trim(), ok: false } : k === "invitados" ? { t: a.value.trim(), tel: s.value.trim(), ok: false } : { t: a.value.trim(), costo: +String(s.value).replace(",", ".") || 0 }); }); });
        $$("[data-res]", ov).forEach(i => i.onchange = () => { const all = get("eventos", []), e = all.find(x => x.id === id); e.res = e.res || {}; e.res[i.dataset.res] = i.value; set("eventos", all); });
        $("[data-edit]", ov).onclick = () => { cl(); const e = get("eventos", []).find(x => x.id === id); formModal("Editar evento", EVF, e, o => { const all = get("eventos", []); Object.assign(all.find(x => x.id === id), o); set("eventos", all); done && done(); evDetail(id, done); }, () => { set("eventos", get("eventos", []).filter(x => x.id !== id)); done && done(); }); };
        $("[data-inv]", ov).onclick = () => { const e = get("eventos", []).find(x => x.id === id); const t = "🌷 Te invito a " + e.t + ", el " + fdate(e.fecha) + (e.hora ? " a las " + e.hora : "") + (e.lugar ? " en " + e.lugar : "") + ". " + (e.cupos ? "Cupos limitados (" + e.cupos + "). " : "") + "Responde “VOY” y te guardo tu lugar 💛"; copy(t); };
      };
      wire(); $(".x", ov).onclick = () => { cl(); done && done(); };
    };
    modal(draw(), mount, true);
  }
  const eventos = () => lista({ name: "eventos", title: "Agenda de eventos", sub: "Cada evento con lugar, tareas, responsables, invitadas, proveedores y resultados.", ico: "🎪", add: "Nuevo evento", empty: "Aún no tienes eventos. Crea el primero: lugar, fecha y quién hace qué.", fields: EVF, def: { emoji: "🎪", estado: "Planeado", fecha: today() }, sort: (a, b) => (a.fecha || "").localeCompare(b.fecha || ""), open: evDetail, fil: { k: "estado", opts: EST },
    line: e => { const T = e.tareas || []; return { e: e.emoji, t: e.t, s: fdate(e.fecha) + (e.lugar ? " · " + e.lugar : "") + " · " + T.filter(x => x.ok).length + "/" + T.length + " tareas", r: e.estado }; },
    sum: l => { const up = l.filter(e => e.fecha >= today() && e.estado !== "Cancelado").length; return "<div><b>" + up + "</b><small>próximos</small></div><div><b>" + l.filter(e => e.estado === "Hecho").length + "</b><small>hechos</small></div><div><b>" + l.reduce((s, e) => s + (+((e.res || {}).asist) || 0), 0) + "</b><small>asistentes</small></div>"; } });

  /* ---------- EN VIVO (eventos en vivo de tiendas) ---------- */
  const vivo = () => lista({ name: "vivo", title: "Eventos en vivo de tiendas", sub: "Coordina cada transmisión con la boutique y anota los resultados.", ico: "📺", add: "Nuevo en vivo", empty: "Cuando una tienda pida un evento en vivo, anótalo aquí: producto, hora, responsable y resultado.",
    fields: [{ k: "tienda", l: "Boutique o marca", req: 1 }, { k: "prod", l: "Producto o tema", ph: "Ej. Lanzamiento de velas" }, { k: "fecha", l: "Día", type: "date", req: 1 }, { k: "hora", l: "Hora", type: "time" }, { k: "resp", l: "Responsable de Código ML" }, { k: "estado", l: "Estado", type: "select", opts: ["Solicitado", "Confirmado", "Material recibido", "Transmitido", "Cancelado"] }, { k: "vistas", l: "Personas conectadas", type: "number" }, { k: "ventas", l: "Ventas reportadas por la tienda", type: "number" }, { k: "notas", l: "Notas y resultados", type: "textarea" }],
    def: { estado: "Solicitado", fecha: today() }, fil: { k: "estado", opts: ["Solicitado", "Confirmado", "Material recibido", "Transmitido"] }, sort: (a, b) => (a.fecha || "").localeCompare(b.fecha || ""),
    line: e => ({ e: "📺", t: e.tienda + (e.prod ? " · " + e.prod : ""), s: fdate(e.fecha) + (e.hora ? " " + e.hora : "") + (e.resp ? " · " + e.resp : "") + (e.vistas ? " · " + e.vistas + " conectadas" : ""), r: e.estado }),
    sum: l => "<div><b>" + l.filter(e => e.estado !== "Transmitido" && e.estado !== "Cancelado").length + "</b><small>por hacer</small></div><div><b>" + l.filter(e => e.estado === "Transmitido").length + "</b><small>transmitidos</small></div><div><b>" + l.reduce((s, e) => s + (+e.vistas || 0), 0) + "</b><small>conectadas</small></div>" });

  /* ---------- PRESUPUESTO Y GASTOS ---------- */
  const gastos = () => lista({ name: "gastos", title: "Presupuesto y gastos", sub: "Cotizaciones, publicidad y pagos a proveedores: quién aprobó, cuánto se pagó y la ganancia.", ico: "🧾", add: "Nuevo gasto o ingreso", empty: "Anota cada cotización, pago o ingreso. Verás cuánto queda de ganancia.",
    fields: [{ k: "t", l: "Concepto", req: 1, ph: "Ej. Publicidad en Instagram" }, { k: "tipo", l: "Tipo", type: "select", opts: ["Cotización", "Publicidad", "Proveedor", "Evento", "Otro gasto", "Ingreso"] }, { k: "fecha", l: "Fecha", type: "date" }, { k: "cot", l: "Monto cotizado o ingreso", type: "number" }, { k: "aprob", l: "Aprobación", type: "select", opts: ["Pendiente", "Aprobado", "Rechazado"] }, { k: "pagado", l: "Ya pagado", type: "number" }, { k: "prov", l: "Proveedor o quién cobra" }, { k: "nota", l: "Notas", type: "textarea" }],
    def: { tipo: "Cotización", aprob: "Pendiente", fecha: today() }, fil: { k: "tipo", opts: ["Cotización", "Publicidad", "Proveedor", "Evento", "Otro gasto", "Ingreso"] },
    line: g => ({ e: g.tipo === "Ingreso" ? "💰" : g.aprob === "Aprobado" ? "✅" : g.aprob === "Rechazado" ? "⛔" : "🕓", t: g.t, s: g.tipo + " · " + fdate(g.fecha) + (g.prov ? " · " + g.prov : "") + (g.tipo !== "Ingreso" && g.pagado ? " · pagado " + money(g.pagado) : ""), r: money(g.cot) }),
    sum: l => { const gs = l.filter(g => g.tipo !== "Ingreso" && g.aprob !== "Rechazado"), ing = l.filter(g => g.tipo === "Ingreso").reduce((s, g) => s + (+g.cot || 0), 0), pag = gs.reduce((s, g) => s + (+g.pagado || 0), 0), apr = gs.filter(g => g.aprob === "Aprobado").reduce((s, g) => s + (+g.cot || 0), 0); return "<div><b>" + money(apr) + "</b><small>aprobado</small></div><div><b>" + money(Math.max(0, apr - pag)) + "</b><small>por pagar</small></div><div><b>" + money(ing - pag) + "</b><small>ganancia (ingresos − pagado)</small></div>"; } });

  /* ---------- EMPRESAS (área comercial B2B) ---------- */
  const ETAPA = ["Prospecto", "Contactada", "Reunión", "Propuesta", "Ganada", "Perdida"];
  const empresas = () => lista({ name: "empresas", title: "Área comercial · Empresas", sub: "Bienestar corporativo. Va aparte de las boutiques: otro público, otro ritmo.", ico: "🏢", add: "Nueva empresa", empty: "Anota las empresas que quieras visitar: contacto, etapa y próximo paso.",
    fields: [{ k: "t", l: "Empresa", req: 1 }, { k: "contacto", l: "Persona de contacto" }, { k: "cargo", l: "Cargo", ph: "RR. HH., bienestar, gerencia…" }, { k: "tel", l: "Teléfono o correo" }, { k: "etapa", l: "Etapa", type: "select", opts: ETAPA }, { k: "mujeres", l: "Colaboradoras (aprox.)", type: "number" }, { k: "paso", l: "Próximo paso" }, { k: "fecha", l: "Fecha del próximo paso", type: "date" }, { k: "nota", l: "Notas", type: "textarea" }],
    def: { etapa: "Prospecto" }, fil: { k: "etapa", opts: ETAPA }, sort: (a, b) => ETAPA.indexOf(a.etapa) - ETAPA.indexOf(b.etapa),
    line: e => ({ e: "🏢", t: e.t, s: (e.contacto || "Sin contacto") + (e.paso ? " · " + e.paso : "") + (e.fecha ? " (" + fdate(e.fecha) + ")" : ""), r: e.etapa }),
    sum: l => ETAPA.slice(0, 5).map(x => "<div><b>" + l.filter(e => e.etapa === x).length + "</b><small>" + x.toLowerCase() + "</small></div>").join("").replace(/(<div>.*?<\/div>){0}/, "") });

  /* ---------- PROVEEDORES Y ALIANZAS ---------- */
  const provs = () => lista({ name: "provs", title: "Proveedores y alianzas", sub: "Lugares, catering, fotógrafas, spas, marcas aliadas.", ico: "🤝", add: "Nuevo proveedor o aliado", empty: "Guarda aquí a quien te ayuda a hacer los eventos: contacto, precio y cómo te atendió.",
    fields: [{ k: "t", l: "Nombre", req: 1 }, { k: "tipo", l: "Tipo", type: "select", opts: ["Lugar", "Catering", "Fotografía y video", "Decoración", "Spa o bienestar", "Marca aliada", "Publicidad", "Otro"] }, { k: "contacto", l: "Persona y teléfono" }, { k: "serv", l: "Qué ofrece" }, { k: "precio", l: "Precio o cotización", type: "number" }, { k: "estado", l: "Estado", type: "select", opts: ["Por contactar", "Cotizando", "Aliado", "Descartado"] }, { k: "nota", l: "Notas", type: "textarea" }],
    def: { tipo: "Lugar", estado: "Por contactar" }, fil: { k: "tipo", opts: ["Lugar", "Catering", "Fotografía y video", "Decoración", "Spa o bienestar", "Marca aliada", "Publicidad", "Otro"] }, sort: (a, b) => a.t.localeCompare(b.t),
    line: p => ({ e: "🤝", t: p.t, s: p.tipo + (p.contacto ? " · " + p.contacto : ""), r: p.estado }) });

  /* ---------- VENTAS Y COMISIONES ---------- */
  const TIPOS = [["Boutique", .15, "15 % del valor de la boutique"], ["Mensualidad", .10, "10 % de cada mensualidad, durante 12 meses"], ["Corporativo", .10, "10 % del contrato"], ["Negocio US$5", 0, "US$5 fijos por cada negocio inscrito"]];
  const comis = v => v.tipo === "Negocio US$5" ? 5 : (+v.monto || 0) * (TIPOS.find(t => t[0] === v.tipo) || [0, 0])[1];
  const ventas = () => lista({ name: "ventas", title: "Mis ventas y comisiones", sub: "Cálculo estimado según las reglas vigentes. El valor oficial lo confirma Código ML.", ico: "💰", add: "Registrar venta", empty: "Cuando cierres una venta, anótala aquí: verás tu comisión estimada.",
    fields: [{ k: "t", l: "Clienta o marca", req: 1 }, { k: "tipo", l: "Tipo de venta", type: "select", opts: TIPOS.map(t => t[0]) }, { k: "monto", l: "Valor de la venta", type: "number" }, { k: "fecha", l: "Fecha", type: "date" }, { k: "estado", l: "Estado", type: "select", opts: ["Separada", "Pagada completa", "Pendiente de pago"] }, { k: "nota", l: "Notas", type: "textarea" }],
    def: { tipo: "Boutique", fecha: today(), estado: "Separada" }, fil: { k: "tipo", opts: TIPOS.map(t => t[0]) },
    line: v => ({ e: "💰", t: v.t, s: v.tipo + " · " + fdate(v.fecha) + " · " + v.estado, r: money(comis(v)) }),
    sum: l => "<div><b>" + l.length + "</b><small>ventas</small></div><div><b>" + money(l.reduce((s, v) => s + comis(v), 0)) + "</b><small>comisión estimada</small></div><div><b>" + l.filter(v => v.estado === "Pendiente de pago").length + "</b><small>pendientes</small></div>" });

  /* ---------- HORAS ---------- */
  const horas = () => lista({ name: "horas", title: "Mis horas de trabajo", sub: "Anota cuándo trabajas. Tú decides tus horarios.", ico: "⏱️", add: "Anotar horas", empty: "Anota las horas que dedicas para ver tu semana y tu mes.",
    fields: [{ k: "fecha", l: "Día", type: "date", req: 1 }, { k: "h", l: "Horas", type: "number", req: 1 }, { k: "t", l: "En qué trabajaste", req: 1 }], def: { fecha: today() },
    line: h => ({ e: "⏱️", t: h.t, s: fdate(h.fecha), r: h.h + " h" }),
    sum: l => { const d = new Date(), mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const ms = ymd(mon), mm = today().slice(0, 7); return "<div><b>" + l.filter(x => x.fecha >= ms).reduce((s, x) => s + (+x.h || 0), 0) + "</b><small>esta semana</small></div><div><b>" + l.filter(x => (x.fecha || "").startsWith(mm)).reduce((s, x) => s + (+x.h || 0), 0) + "</b><small>este mes</small></div>"; } });

  /* ---------- DOCUMENTOS ---------- */
  const docs = () => lista({ name: "docs", title: "Mis documentos", sub: "Enlaces a contratos, cotizaciones, catálogos y presentaciones.", ico: "📎", add: "Guardar documento", empty: "Pega aquí el enlace de un documento (Drive, Dropbox…) para tenerlo a la mano.",
    fields: [{ k: "t", l: "Nombre", req: 1 }, { k: "url", l: "Enlace", type: "url", ph: "https://…" }, { k: "nota", l: "Notas", type: "textarea" }], def: {}, sort: (a, b) => a.t.localeCompare(b.t),
    line: d => ({ e: "📎", t: d.t, s: d.url || "Sin enlace" }), open: (id, redo) => { const d = get("docs", []).find(x => x.id === id); modal("<h3>" + esc(d.t) + "</h3>" + (d.nota ? "<p>" + esc(d.nota) + "</p>" : "") + (d.url && /^https?:\/\//i.test(d.url) ? '<a class="bt2 w" target="_blank" rel="noopener" href="' + esc(d.url) + '">Abrir documento</a>' : "") + '<div class="row2"><button class="bt2" type="button" data-b>Cerrar</button><button class="bt2 del" type="button" data-x>Borrar</button></div>', (ov, cl) => { $("[data-b]", ov).onclick = cl; $("[data-x]", ov).onclick = () => { cl(); confirmBox("¿Borrar este documento?", () => { set("docs", get("docs", []).filter(x => x.id !== id)); redo(); }); }; }); } });

  /* ---------- MARKETING POR MES ---------- */
  function mkt() {
    const ck = get("mkt", {}), now = today().slice(0, 7);
    main.innerHTML = head("Eventos y marketing por mes", "Lo que se hace cada mes. “Sugerido” = idea para decidir con Jazz.") + D.MESES.map(m => {
      const its = m.items, n = its.filter((x, i) => ck[m.id + i]).length;
      return '<section class="mes' + (m.id === now ? " now" : "") + '"><div class="mh"><h4>' + m.n + "</h4><small>" + esc(m.lema) + " · " + n + "/" + its.length + "</small></div>" + its.map((x, i) => '<button type="button" class="mi' + (ck[m.id + i] ? " ok" : "") + '" data-k="' + m.id + i + '"><span class="ck">' + (ck[m.id + i] ? "✓" : "") + "</span><span>" + esc(x.t) + "<small>" + (x.tag === "fijo" ? "Definido" : "Sugerido") + (x.co ? " · solo Colombia" : "") + "</small></span></button>").join("") + "</section>";
    }).join("") + '<p class="fine">Los premios y concursos aplican solo en Colombia. Para otros países, no los menciones.</p>';
    $$(".mi", main).forEach(b => b.onclick = () => { const c = get("mkt", {}); c[b.dataset.k] = !c[b.dataset.k]; set("mkt", c); const y = scrollY; mkt(); scrollTo(0, y); });
  }

  /* ---------- ACADEMIA ---------- */
  const acad = { cat: "Todos", q: "" };
  function academia() {
    const cats = ["Todos", "Mujeres", "Boutiques", "Eventos", "Empresas", "Seguimiento"];
    const l = D.SPEECH.filter(s => (acad.cat === "Todos" || s.cat === acad.cat) && (!acad.q || (s.t + s.txt).toLowerCase().includes(acad.q.toLowerCase())));
    main.innerHTML = head("Academia · Speeches", D.SPEECH.length + " mensajes listos para copiar y enviar por WhatsApp.") +
      '<div class="otiles three"><button type="button" class="otile" data-of="ventas"><i>🛍️</i><small>Objeciones</small></button><button type="button" class="otile" data-of="entrenamiento"><i>🎓</i><small>Entrenamiento</small></button><button type="button" class="otile" data-of="estrategia"><i>🎁</i><small>Premios y estrategia</small></button></div>' +
      '<input class="srch" type="search" placeholder="Buscar un speech…" value="' + esc(acad.q) + '" aria-label="Buscar">' +
      '<div class="chips">' + cats.map(c => '<button type="button" class="' + (acad.cat === c ? "on" : "") + '" data-c="' + c + '">' + c + "</button>").join("") + "</div>" +
      '<div class="lst">' + (l.length ? l.map(s => '<button type="button" class="li" data-s="' + s.id + '"><i>' + ({ Mujeres: "🌸", Boutiques: "🛍️", Eventos: "🎪", Empresas: "🏢", Seguimiento: "💬" })[s.cat] + "</i><span><b>" + esc(s.t) + "</b><small>" + esc(s.cuando) + "</small></span><em>" + s.cat + "</em></button>").join("") : '<div class="empty s"><p>No hay speeches con esa búsqueda.</p></div>') + "</div>" +
      '<button type="button" class="bt2 wide" data-rules>Reglas de oro de todo speech</button>';
    $$(".chips [data-c]", main).forEach(b => b.onclick = () => { acad.cat = b.dataset.c; academia(); });
    const sr = $(".srch", main); sr.oninput = () => { acad.q = sr.value; const p = sr.selectionStart; academia(); const n = $(".srch", main); n.focus(); n.setSelectionRange(p, p); };
    $$("[data-of]", main).forEach(b => b.onclick = () => openOf(b.dataset.of));
    $$("[data-s]", main).forEach(b => b.onclick = () => speech(b.dataset.s));
    $("[data-rules]", main).onclick = () => modal('<div class="kick">Antes de enviar</div><h3>Reglas de oro</h3><ul class="ck">' + D.REGLAS.map(r => "<li>" + esc(r) + "</li>").join("") + "</ul>");
  }
  function speech(id) {
    const s = D.SPEECH.find(x => x.id === id), mine = get("mis_speech_" + id, null), txt = mine == null ? s.txt : mine;
    modal('<div class="kick">' + s.cat + "</div><h3>" + esc(s.t) + '</h3><p class="note">' + esc(s.cuando) + '</p><label>Texto (puedes cambiarlo con tu estilo)<textarea id="spt" rows="9">' + esc(txt) + '</textarea></label><p class="note">Cambia lo que está entre [corchetes] antes de enviar.</p><div class="row2"><button class="bt2" type="button" data-cp>Copiar</button><a class="bt2 w" target="_blank" rel="noopener" data-wa>Enviar por WhatsApp</a></div><button type="button" class="lnk" data-rs>Volver al texto original</button>', (ov, cl) => {
      const t = $("#spt", ov), w = $("[data-wa]", ov), sync = () => { w.href = waLink(t.value); set("mis_speech_" + id, t.value === s.txt ? null : t.value); }; sync(); t.oninput = sync;
      $("[data-cp]", ov).onclick = () => copy(t.value); $("[data-rs]", ov).onclick = () => { t.value = s.txt; sync(); toast("Texto original."); };
    });
  }

  /* ---------- MI OFICINA Y RESULTADOS ---------- */
  function oficina() {
    const tile = (e, l, a) => '<button type="button" class="otile" data-' + a[0] + '="' + a[1] + '"><i>' + e + "</i><small>" + l + "</small></button>";
    main.innerHTML = head("Mi oficina y resultados", "Tus metas, comisiones, horas y documentos.") +
      '<h4 class="sh">Resultados</h4><div class="otiles three">' + tile("🎯", "Metas de hoy", ["of", "metas"]) + tile("🗓️", "Plan semanal", ["of", "plan"]) + tile("✦", "Incentivos", ["of", "incent"]) + tile("💰", "Ventas y comisiones", ["go", "ventas"]) + tile("◈", "Mi saldo", ["of", "saldo"]) + tile("⏱️", "Mis horas", ["go", "horas"]) + "</div>" +
      '<h4 class="sh">Mis mujeres y trabajo</h4><div class="otiles three">' + tile("💗", "Mis mujeres", ["of", "mujeres"]) + tile("📎", "Documentos", ["go", "docs"]) + tile("📑", "Reporte para Jazz", ["go", "reporte"]) + tile("📖", "Reglas y archivos", ["of", "reglas"]) + tile("🌟", "Liderazgo", ["of", "liderazgo"]) + tile("✨", "Mi frase de hoy", ["of", "frase"]) + "</div>";
  }
  function reporte() {
    const mm = today().slice(0, 7), V = get("ventas", []).filter(v => (v.fecha || "").startsWith(mm)), H = get("horas", []).filter(h => (h.fecha || "").startsWith(mm)), M = get("mujeres", []), E = get("eventos", []).filter(e => (e.fecha || "").startsWith(mm));
    const t = "REPORTE DE " + MES[new Date().getMonth()].toUpperCase() + " · " + A.nombre + "\n• Ventas registradas: " + V.length + " (comisión estimada " + money(V.reduce((s, v) => s + comis(v), 0)) + ")\n• Mujeres en mi lista: " + M.length + "\n• Eventos del mes: " + E.length + " (hechos: " + E.filter(e => e.estado === "Hecho").length + ")\n• Horas dedicadas: " + H.reduce((s, h) => s + (+h.h || 0), 0) + "\n• Pendientes de hoy: " + get("agenda_v2", []).filter(i => !i.hecho && i.fecha === today()).length;
    main.innerHTML = head("Reporte para Jazz", "Se arma solo con lo que anotaste este mes.", "oficina") + '<div class="omsg pre">' + esc(t) + '</div><div class="bar"><button type="button" class="bt2" data-cp>Copiar</button><a class="bt2 w" target="_blank" rel="noopener" href="' + waLink(t) + '">Enviar por WhatsApp</a></div>';
    $("[data-cp]", main).onclick = () => copy(t);
  }

  /* ---------- CENTRO DE CONTROL ---------- */
  function control() {
    const ag = get("agenda_v2", []), td = ag.filter(i => i.fecha === today()), ev = get("eventos", []).filter(e => e.fecha >= today() && e.estado !== "Cancelado" && e.estado !== "Hecho").sort((a, b) => a.fecha.localeCompare(b.fecha)), g = get("gastos", []), vi = get("vivo", []), em = get("empresas", []), ve = get("ventas", []), mu = get("mujeres", []);
    const pend = g.filter(x => x.tipo !== "Ingreso" && x.aprob === "Pendiente").length, porPagar = g.filter(x => x.tipo !== "Ingreso" && x.aprob === "Aprobado").reduce((s, x) => s + Math.max(0, (+x.cot || 0) - (+x.pagado || 0)), 0);
    const k = (e, n, l, go) => '<button type="button" class="kp" data-go="' + go + '"><i>' + e + "</i><b>" + n + "</b><small>" + l + "</small></button>";
    main.innerHTML = head("Centro de control", "Todo tu trabajo en una sola mirada.") +
      '<div class="kpis">' + k("📅", td.filter(x => !x.hecho).length, "pendientes hoy", "agenda") + k("🎪", ev.length, "eventos por venir", "eventos") + k("📺", vi.filter(x => x.estado !== "Transmitido" && x.estado !== "Cancelado").length, "en vivo por hacer", "vivo") + k("🧾", pend, "gastos sin aprobar", "gastos") + k("💗", mu.length, "mujeres en mi lista", "oficina") + k("💰", ve.length, "ventas registradas", "ventas") + k("🏢", em.filter(x => x.etapa !== "Ganada" && x.etapa !== "Perdida").length, "empresas en proceso", "empresas") + k("💳", money(porPagar), "aprobado por pagar", "gastos") + "</div>" +
      '<h4 class="sh">Hoy</h4><div class="lst">' + (td.length ? td.sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99")).map(i => '<div class="li ag' + (i.hecho ? " done" : "") + '"><span class="ck">' + (i.hecho ? "✓" : "") + '</span><span class="tx"><i>' + i.emoji + "</i><span><b>" + esc(i.t) + "</b><small>" + esc(i.hora || "") + "</small></span></span></div>").join("") : '<div class="empty s"><p>No tienes nada anotado para hoy.</p></div>') + "</div>" +
      (ev[0] ? '<h4 class="sh">Próximo evento</h4><div class="lst"><button type="button" class="li" data-go="eventos"><i>' + ev[0].emoji + "</i><span><b>" + esc(ev[0].t) + "</b><small>" + fdate(ev[0].fecha) + (ev[0].lugar ? " · " + esc(ev[0].lugar) : "") + "</small></span></button></div>" : "");
  }

  /* ---------- ADMINISTRACIÓN (solo Jazz) ---------- */
  const MODS = [["agenda", "Mi agenda"], ["eventos", "Agenda de eventos"], ["vivo", "Eventos en vivo"], ["gastos", "Presupuesto y gastos"], ["empresas", "Empresas"], ["provs", "Proveedores"], ["ventas", "Ventas y comisiones"], ["academia", "Academia"]];
  function admin() {
    if (!A.admin) { main.innerHTML = head("Administración", "Solo para la fundadora.") + '<div class="empty"><i>🔒</i><p>Esta sección es solo para Jazz.</p></div>'; return; }
    const P = (() => { try { return JSON.parse(localStorage.getItem("cml_admin_perm") || "{}"); } catch (e) { return {}; } })();
    main.innerHTML = head("Administración", "Usuarias, permisos y bloqueos.") +
      '<div class="warn"><b>Importante:</b> hoy cada teléfono guarda sus propios datos y los códigos viven en la app. Por eso los permisos y bloqueos de abajo son un tablero de planeación: para que de verdad bloqueen a alguien o te muestren las ventas de todas, hay que conectar la base de datos (Supabase). Es el siguiente paso.</div>' +
      '<h4 class="sh">Asesoras</h4><div class="lst">' + C.asesoras.map(a => '<div class="li"><i>' + (P["b" + a.codigo] ? "⛔" : "👩") + '</i><span><b>' + esc(a.nombre) + "</b><small>Código " + a.codigo + " · " + (C.precios[a.pais] || {}).nombre + (a.admin ? " · administradora" : "") + '</small></span>' + (a.admin ? "" : '<button type="button" class="bt2 sm" data-b="' + a.codigo + '">' + (P["b" + a.codigo] ? "Desbloquear" : "Bloquear") + "</button>") + "</div>").join("") + "</div>" +
      '<h4 class="sh">Permisos por módulo (planeación)</h4><div class="perm"><table class="cmp"><thead><tr><th></th>' + C.asesoras.map(a => "<th>" + a.codigo + "</th>").join("") + "</tr></thead><tbody>" + MODS.map(m => "<tr><td>" + m[1] + "</td>" + C.asesoras.map(a => '<td><input type="checkbox" data-p="' + m[0] + a.codigo + '" ' + (P["p" + m[0] + a.codigo] === false ? "" : "checked") + ' aria-label="' + m[1] + " " + a.codigo + '"></td>').join("") + "</tr>").join("") + "</tbody></table></div>" +
      '<h4 class="sh">Qué falta para que sea real</h4><ul class="ck"><li>Base de datos central (Supabase) para ver las mujeres, ventas y gastos de todas las asesoras.</li><li>Ingreso con correo y clave en vez de códigos de 4 dígitos.</li><li>Campo “código de asesora” en el registro de mujeres para atribuir cada una.</li><li>Pasarela de pago para cobrar las reservas y calcular comisiones solas.</li></ul>';
    $$("[data-b]", main).forEach(b => b.onclick = () => { P["b" + b.dataset.b] = !P["b" + b.dataset.b]; localStorage.setItem("cml_admin_perm", JSON.stringify(P)); admin(); });
    $$("[data-p]", main).forEach(i => i.onchange = () => { P["p" + i.dataset.p] = i.checked; localStorage.setItem("cml_admin_perm", JSON.stringify(P)); });
  }

  /* ---------- MI CUENTA, RESPALDO E INSTALACIÓN ---------- */
  function cuenta() {
    main.innerHTML = head("Mi cuenta", A.nombre) + '<div class="lst"><button type="button" class="li" data-inst><i>📲</i><span><b>Instalar en mi celular</b><small>Queda como una app con su icono</small></span></button><button type="button" class="li" data-bk><i>💾</i><span><b>Descargar respaldo</b><small>Guarda todos tus datos en un archivo</small></span></button><label class="li filebtn"><i>♻️</i><span><b>Recuperar respaldo</b><small>Carga el archivo que descargaste</small></span><input type="file" accept=".json,application/json" hidden></label><button type="button" class="li" data-out><i>🚪</i><span><b>Cerrar sesión</b><small>Tus datos quedan guardados en este teléfono</small></span></button></div><p class="fine">Tus datos viven solo en este teléfono. Descarga un respaldo de vez en cuando, sobre todo si cambias de celular.</p>';
    $("[data-inst]", main).onclick = installHelp;
    $("[data-bk]", main).onclick = () => { const o = {}, p = "cml_of_" + A.codigo + "_"; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(p)) o[k.slice(p.length)] = localStorage.getItem(k); } save(JSON.stringify({ app: "cml-asesoras", codigo: A.codigo, fecha: today(), datos: o }), "respaldo-asesoras-" + today() + ".json", "application/json"); };
    $(".filebtn input", main).onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); if (j.app !== "cml-asesoras" || j.codigo !== A.codigo) { toast("Ese respaldo es de otro código."); return; } Object.keys(j.datos).forEach(k => localStorage.setItem(KEY(k), j.datos[k])); toast("Respaldo recuperado."); } catch (x) { toast("No pude leer ese archivo."); } }; r.readAsText(f); };
    $("[data-out]", main).onclick = () => { try { localStorage.removeItem("cml_asesora"); sessionStorage.removeItem("cml_asesora"); } catch (e) {} A = null; location.hash = ""; start(); };
  }
  let ip = null; addEventListener("beforeinstallprompt", e => { e.preventDefault(); ip = e; });
  function installHelp() {
    if (ip) { ip.prompt(); ip.userChoice.finally(() => { ip = null; }); return; }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    modal('<div class="kick">Instalar</div><h3>Ponla en tu celular</h3>' + (ios ? '<ol class="oplan"><li>Abre esta página en <b>Safari</b> (no en el navegador de WhatsApp).</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li><li>Toca <b>Agregar</b>. Listo: ya tienes el icono.</li></ol>' : '<ol class="oplan"><li>Abre esta página en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</li><li>Confirma. Listo: ya tienes el icono.</li></ol>') + '<p class="note">Si ves “Instalar” arriba, también puedes tocarlo.</p>');
  }

  /* ---------- INICIO ---------- */
  const GRUPOS = [
    ["Hoy", [["📅", "Mi agenda", "agenda"], ["🎪", "Eventos", "eventos"], ["🧭", "Centro de control", "control"], ["✨", "Frase del día", "of:frase"]]],
    ["Vender", [["🌸", "Speeches", "academia"], ["🛍️", "Objeciones", "of:ventas"], ["🏢", "Empresas", "empresas"], ["🎓", "Entrenamiento", "of:entrenamiento"]]],
    ["Crecer", [["📆", "Marketing por mes", "mkt"], ["📺", "En vivo tiendas", "vivo"], ["🤝", "Proveedores", "provs"], ["🎁", "Premios", "of:estrategia"]]],
    ["Dinero y oficina", [["🧾", "Presupuesto", "gastos"], ["💰", "Ventas y comisión", "ventas"], ["🗂️", "Mi oficina", "oficina"], ["✦", "Incentivos", "of:incent"]]]
  ];
  const tileH = t => '<button type="button" class="gt" data-go="' + t[2] + '"><i>' + t[0] + "</i><span>" + t[1] + "</span></button>";
  function inicio() {
    const h = new Date().getHours(), sal = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
    const td = get("agenda_v2", []).filter(i => i.fecha === today() && !i.hecho).sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));
    main.innerHTML = '<div class="hero"><small>' + sal + "</small><h2>" + esc(first()) + ' 🌸</h2><p>' + (td.length ? "Tienes " + td.length + (td.length === 1 ? " pendiente" : " pendientes") + " hoy." : "Hoy no tienes pendientes anotados.") + "</p></div>" +
      (td.length ? '<div class="lst">' + td.slice(0, 3).map(i => '<button type="button" class="li" data-go="agenda"><i>' + i.emoji + "</i><span><b>" + esc(i.t) + "</b><small>" + esc(i.hora || "Sin hora") + "</small></span></button>").join("") + "</div>" : "") +
      GRUPOS.map(g => '<h4 class="sh">' + g[0] + '</h4><div class="grid">' + g[1].map(tileH).join("") + "</div>").join("") + (A.admin ? '<h4 class="sh">Administración</h4><div class="grid">' + tileH(["⚙️", "Administración", "admin"]) + tileH(["📲", "Instalar app", "cuenta"]) + "</div>" : "");
  }
  function mas() {
    main.innerHTML = head("Todo", "Todos los módulos de la app.") + GRUPOS.map(g => '<h4 class="sh">' + g[0] + '</h4><div class="grid">' + g[1].map(tileH).join("") + "</div>").join("") + '<h4 class="sh">Cuenta</h4><div class="grid">' + tileH(["👤", "Mi cuenta y respaldo", "cuenta"]) + tileH(["📲", "Instalar app", "cuenta"]) + (A.admin ? tileH(["⚙️", "Administración", "admin"]) : "") + "</div>";
  }

  /* ---------- rutas ---------- */
  const R = { inicio, agenda, eventos, vivo, gastos, empresas, provs, ventas, horas, docs, mkt, academia, oficina, reporte, control, admin, cuenta, mas };
  const NAV = { inicio: "inicio", agenda: "agenda", academia: "academia", gastos: "gastos", mas: "mas" };
  function route() {
    if (!A) return; const k = (location.hash || "#inicio").slice(1) || "inicio", fn = R[k] || inicio;
    const bl = (() => { try { return JSON.parse(localStorage.getItem("cml_admin_perm") || "{}")["b" + A.codigo]; } catch (e) { return false; } })();
    if (bl) { main.innerHTML = '<div class="empty"><i>⛔</i><p>Tu acceso está en pausa. Escríbele a Jazz.</p></div>'; return; }
    fn(); scrollTo(0, 0); $$("#nav button").forEach(b => b.classList.toggle("on", NAV[k] === b.dataset.go || (!NAV[k] && b.dataset.go === "mas" && false)));
  }
  addEventListener("hashchange", route);
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-go]"); if (!g || !A) return; const v = g.dataset.go;
    if (v.startsWith("of:")) { openOf(v.slice(3)); return; } e.preventDefault(); if (location.hash === "#" + v) route(); else location.hash = v;
  });

  /* ---------- ingreso ---------- */
  const find = c => C.asesoras.find(a => a.codigo === String(c).trim());
  function start() {
    const app = $("#app"), lg = $("#login");
    let k = null; try { k = localStorage.getItem("cml_asesora") || sessionStorage.getItem("cml_asesora"); } catch (e) {}
    const a = k && find(k);
    if (a) { A = a; lg.hidden = true; app.hidden = false; $("#who").textContent = first(); route(); return; }
    A = null; app.hidden = true; lg.hidden = false;
  }
  $("#lgForm").addEventListener("submit", e => {
    e.preventDefault(); const c = $("#lgCode").value, a = find(c);
    if (!a) { $("#lgErr").textContent = "Ese código no existe. Revísalo o pídele el tuyo a Jazz."; return; }
    try { localStorage.setItem("cml_asesora", a.codigo); } catch (x) {}
    $("#lgCode").value = ""; $("#lgErr").textContent = ""; location.hash = "inicio"; start();
  });
  $("#hInst").addEventListener("click", installHelp);
  $("#hAcc").addEventListener("click", () => { location.hash = "cuenta"; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#hInst").hidden = true;
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("../sw.js").catch(() => {}));
  start();
})();
