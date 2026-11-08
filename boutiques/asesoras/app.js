/* Código ML Asesoras · app de trabajo para asesoras.
   Los datos se guardan en este teléfono (localStorage). Respaldo: Más › Mi cuenta › Descargar respaldo.
   Más adelante se conectará a Supabase para que Jazz vea todo en un solo lugar. */
(function () {
  const EMB = /[?&]emb=1/.test(location.search); if (EMB) document.documentElement.classList.add("emb");
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
  const vista = () => { try { return (A.admin && sessionStorage.getItem("cml_vista")) || A.pais; } catch (e) { return A.pais; } };
  const cp = () => C.precios[vista()] || C.precios.do;
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

  /* ---------- DOCUMENTOS IMPORTANTES: cartas, propuestas, informes; se envían a Jazz por correo o WhatsApp ---------- */
  const firma = o => esc0(A.nombre.split("·")[0].trim()) + "\nAsesora · Código Mujer Libre" + (o.ciudad ? "\n" + o.ciudad : "") + "\n" + fdate(today());
  const esc0 = s => String(s);
  const CIU = { k: "ciudad", l: "Ciudad", ph: "Bogotá, Santo Domingo…" };
  const PAQ = ["Gold", "Platinum", "Diamond"];
  const PLANT = [
    { id: "carta_emp", e: "🏢", n: "Carta de presentación a una empresa", f: [CIU, { k: "empresa", l: "Empresa", req: 1 }, { k: "contacto", l: "Nombre de la persona", req: 1 }, { k: "cargo", l: "Cargo" }],
      b: o => "Asunto: Bienestar para las mujeres de " + o.empresa + "\n\nEstimada " + o.contacto + (o.cargo ? " (" + o.cargo + ")" : "") + ":\n\nReciba un cordial saludo. Le escribo de parte de Código Mujer Libre, una plataforma de bienestar y comunidad hecha para mujeres: pausas de 5 minutos, eventos, beneficios y una sala de maternidad que acompaña el regreso al trabajo.\n\nMe gustaría presentarle una demostración de 15 minutos y conversar sobre un piloto para las colaboradoras de " + o.empresa + ". Los precios, el contrato y las condiciones los envía directamente Código Mujer Libre.\n\n¿Qué día de esta semana le queda bien?\n\nAtentamente,\n" + firma(o) },
    { id: "propuesta", e: "💼", n: "Propuesta o cotización", f: [CIU, { k: "cliente", l: "Clienta o empresa", req: 1 }, { k: "serv", l: "Qué se ofrece", type: "select", opts: ["Boutique Gold", "Boutique Platinum", "Boutique Diamond", "Bienestar corporativo", "Otro"] }, { k: "valor", l: "Valor", type: "number" }, { k: "vig", l: "Válida hasta", type: "date" }, { k: "nota", l: "Condiciones o detalles", type: "textarea" }],
      b: o => "PROPUESTA · " + o.serv + "\nPara: " + o.cliente + "\n\nValor: " + money(o.valor) + "\n" + (o.vig ? "Vigencia: hasta el " + fdate(o.vig) + "\n" : "") + (o.nota ? "\nDetalles:\n" + o.nota + "\n" : "") + "\nEsta propuesta es un borrador sujeto a la confirmación oficial de Código Mujer Libre. El pago se realiza únicamente a Código Mujer Libre por los canales oficiales.\n\n" + firma(o) },
    { id: "reserva", e: "🌸", n: "Confirmación de reserva de boutique", f: [CIU, { k: "clienta", l: "Clienta o marca", req: 1 }, { k: "paq", l: "Paquete", type: "select", opts: PAQ }, { k: "valor", l: "Valor total", type: "number" }, { k: "sep", l: "Valor separado", type: "number" }, { k: "lim", l: "Fecha límite del saldo", type: "date" }],
      b: o => "CONFIRMACIÓN DE RESERVA\n\nClienta: " + o.clienta + "\nPaquete: " + o.paq + "\nValor total: " + money(o.valor) + "\nSeparado: " + money(o.sep) + "\nSaldo: " + money(Math.max(0, (+o.valor || 0) - (+o.sep || 0))) + (o.lim ? "\nFecha límite del saldo: " + fdate(o.lim) : "") + "\nEntrega estimada: " + C.entrega + "\n\nLa política de reembolso se entrega por escrito con el pago de la reserva. Los pagos se hacen solo por los canales oficiales de Código Mujer Libre.\n\n" + firma(o) },
    { id: "gasto", e: "🧾", n: "Solicitud de aprobación de gasto", f: [CIU, { k: "concepto", l: "Concepto", req: 1 }, { k: "monto", l: "Monto", type: "number" }, { k: "prov", l: "Proveedor" }, { k: "just", l: "¿Por qué es necesario?", type: "textarea" }],
      b: o => "SOLICITUD DE APROBACIÓN DE GASTO\n\nConcepto: " + o.concepto + "\nMonto: " + money(o.monto) + (o.prov ? "\nProveedor: " + o.prov : "") + "\n\nJustificación:\n" + (o.just || "—") + "\n\nQuedo atenta a su aprobación antes de realizar cualquier pago.\n\n" + firma(o) },
    { id: "informe", e: "📋", n: "Informe de evento", f: [CIU, { k: "evento", l: "Evento", req: 1 }, { k: "fecha", l: "Fecha", type: "date" }, { k: "asist", l: "Asistentes", type: "number" }, { k: "nuevas", l: "Mujeres nuevas inscritas", type: "number" }, { k: "ventas", l: "Ventas generadas", type: "number" }, { k: "nota", l: "Qué salió bien y qué mejorar", type: "textarea" }],
      b: o => "INFORME DE EVENTO\n\nEvento: " + o.evento + (o.fecha ? "\nFecha: " + fdate(o.fecha) : "") + "\nAsistentes: " + (o.asist || 0) + "\nMujeres nuevas inscritas: " + (o.nuevas || 0) + "\nVentas generadas: " + money(o.ventas) + "\n\nObservaciones:\n" + (o.nota || "—") + "\n\n" + firma(o) },
    { id: "carta_prov", e: "🤝", n: "Carta a proveedor o aliado", f: [CIU, { k: "prov", l: "Proveedor o aliado", req: 1 }, { k: "contacto", l: "Persona de contacto" }, { k: "prop", l: "Qué le propones", type: "textarea" }],
      b: o => "Asunto: Alianza con Código Mujer Libre\n\nEstimado equipo de " + o.prov + (o.contacto ? ", " + o.contacto : "") + ":\n\nLe escribo de parte de Código Mujer Libre, una comunidad internacional de mujeres. " + (o.prop || "Nos gustaría conversar sobre una posible alianza.") + "\n\nQuedo atenta para coordinar una conversación.\n\nAtentamente,\n" + firma(o) },
    { id: "libre", e: "✉️", n: "Carta o nota libre", f: [CIU, { k: "asunto", l: "Asunto", req: 1 }, { k: "texto", l: "Escribe tu carta", type: "textarea" }],
      b: o => "Asunto: " + o.asunto + "\n\n" + (o.texto || "") + "\n\n" + firma(o) },
    { id: "enlace", e: "📎", n: "Guardar enlace a un documento", f: [{ k: "nombre", l: "Nombre", req: 1 }, { k: "url", l: "Enlace", type: "url", ph: "https://…" }, { k: "nota", l: "Notas", type: "textarea" }],
      b: o => o.nombre + (o.url ? "\n" + o.url : "") + (o.nota ? "\n\n" + o.nota : "") }
  ];
  function docs() {
    const L = get("documentos", []).concat(get("docs", []).map(d => ({ id: d.id, tipo: "enlace", e: "📎", t: d.t, texto: d.t + (d.url ? "\n" + d.url : "") + (d.nota ? "\n\n" + d.nota : ""), fecha: today(), viejo: 1 })));
    main.innerHTML = head("Documentos importantes", "Crea cartas, propuestas e informes y envíalos a Jazz con un toque.", "inicio") +
      '<h4 class="sh">Crear un documento</h4><div class="lst">' + PLANT.map(t => '<button type="button" class="li" data-t="' + t.id + '"><i>' + t.e + "</i><span><b>" + t.n + "</b></span></button>").join("") + "</div>" +
      '<h4 class="sh">Mis documentos (' + L.length + ')</h4><div class="lst">' + (L.length ? L.slice().sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "")).map(d => '<button type="button" class="li" data-d="' + d.id + '"><i>' + (d.e || "📄") + "</i><span><b>" + esc(d.t) + "</b><small>" + fdate(d.fecha) + (d.enviado ? " · enviado a Jazz" : "") + "</small></span></button>").join("") : '<div class="empty s"><p>Aquí aparecerán los documentos que crees.</p></div>') + "</div>" +
      '<p class="fine">“Enviar a Jazz” abre tu correo con el documento listo; tú solo tocas enviar. Los documentos se guardan en este teléfono: descarga un respaldo en Mi cuenta.</p>';
    $$("[data-t]", main).forEach(b => b.onclick = () => {
      const t = PLANT.find(x => x.id === b.dataset.t), last = get("ciudad", "");
      formModal(t.n, t.f, { ciudad: last }, o => {
        if (o.ciudad) set("ciudad", o.ciudad);
        const d = { id: uid(), tipo: t.id, e: t.e, t: (o.empresa || o.cliente || o.clienta || o.concepto || o.evento || o.prov || o.asunto || o.nombre || t.n) + " · " + t.n.split(" ").slice(0, 3).join(" "), texto: t.b(o), url: o.url || "", fecha: today() };
        const all = get("documentos", []); all.push(d); set("documentos", all); docs(); docView(d.id);
      });
    });
    $$("[data-d]", main).forEach(b => b.onclick = () => docView(b.dataset.d));
  }
  function docView(id) {
    const d = get("documentos", []).find(x => x.id === id) || get("docs", []).map(x => ({ id: x.id, t: x.t, texto: x.t + (x.url ? "\n" + x.url : ""), url: x.url, viejo: 1 })).find(x => x.id === id); if (!d) return;
    modal('<div class="kick">Documento</div><h3>' + esc(d.t) + '</h3><label>Texto (puedes editarlo)<textarea id="dtx" rows="12">' + esc(d.texto) + '</textarea></label><div class="row2"><a class="bt2 w" data-mail>✉️ Enviar a Jazz</a></div><div class="row2"><a class="bt2" target="_blank" rel="noopener" data-wa>WhatsApp</a><button class="bt2" type="button" data-cp>Copiar</button></div><div class="row2"><button class="bt2" type="button" data-dl>Descargar</button><button class="bt2 del" type="button" data-x>Borrar</button></div><p class="note">Si el correo no abre, usa “Copiar” y pégalo en tu email.</p>', (ov, cl) => {
      const t = $("#dtx", ov), up = () => { const m = $("[data-mail]", ov); m.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(d.t + " · " + first()) + "&body=" + encodeURIComponent(t.value); $("[data-wa]", ov).href = waLink(t.value); };
      up(); t.oninput = () => { up(); if (!d.viejo) { const all = get("documentos", []), x = all.find(z => z.id === id); if (x) { x.texto = t.value; set("documentos", all); } } };
      $("[data-mail]", ov).addEventListener("click", () => { if (!d.viejo) { const all = get("documentos", []), x = all.find(z => z.id === id); if (x) { x.enviado = true; set("documentos", all); } } });
      $("[data-cp]", ov).onclick = () => copy(t.value);
      $("[data-dl]", ov).onclick = () => save(t.value, d.t.replace(/[^\wáéíóúñ ]+/gi, "").trim().replace(/ +/g, "-") + ".txt", "text/plain");
      $("[data-x]", ov).onclick = () => { cl(); confirmBox("¿Borrar este documento?", () => { set("documentos", get("documentos", []).filter(z => z.id !== id)); set("docs", get("docs", []).filter(z => z.id !== id)); docs(); }); };
    });
  }

  /* ---------- CONVERTIDOR DE MONEDA (tasa en vivo) ---------- */
  const MON = [["USD", "Dólar (US$)"], ["COP", "Peso colombiano"], ["DOP", "Peso dominicano"], ["EUR", "Euro"]];
  function moneda() {
    const saved = (() => { try { return JSON.parse(localStorage.getItem("cml_tasas") || "null"); } catch (e) { return null; } })();
    let T = saved && saved.r ? saved : null;
    const draw = () => {
      const st = get("mon", { m: 100, de: "USD", a: "COP" });
      main.innerHTML = head("Convertidor de moneda", "Cuánto vale el dólar hoy en pesos. Se actualiza solo cuando hay internet.", "inicio") +
        '<div class="calc"><label>Monto<input id="mm" inputmode="decimal" value="' + esc(st.m) + '"></label><div class="adr"><select id="md">' + MON.map(x => '<option value="' + x[0] + '"' + (st.de === x[0] ? " selected" : "") + ">" + x[1] + '</option>').join("") + '</select><button type="button" class="bt2 sm" id="msw" aria-label="Cambiar">⇄</button><select id="ma">' + MON.map(x => '<option value="' + x[0] + '"' + (st.a === x[0] ? " selected" : "") + ">" + x[1] + "</option>").join("") + '</select></div><div class="res" id="mr"></div><p class="note" id="mt"></p></div>' +
        '<h4 class="sh">Tabla rápida · desde dólares</h4><table class="cmp"><thead><tr><th>US$</th><th>COP</th><th>DOP</th><th>EUR</th></tr></thead><tbody id="mtb"></tbody></table>' +
        '<h4 class="sh">Si no hay internet</h4><label>Escribe tú la tasa: 1 US$ = ? <input id="mman" inputmode="decimal" placeholder="Ej. COP"></label><select id="mmc" class="srch"><option>COP</option><option>DOP</option><option>EUR</option></select><button type="button" class="bt2 wide" id="mset">Usar esta tasa</button>';
      const rate = (de, a) => T && T.r[de] && T.r[a] ? T.r[a] / T.r[de] : null, fm = n => n.toLocaleString("es-CO", { maximumFractionDigits: n < 10 ? 4 : 2 });
      const upd = () => {
        const m = +String($("#mm").value).replace(",", ".") || 0, de = $("#md").value, a = $("#ma").value; set("mon", { m: $("#mm").value, de, a });
        const r = rate(de, a); $("#mr").textContent = r ? fm(m * r) + " " + a : "Sin tasa todavía";
        $("#mt").textContent = T ? "1 " + de + " = " + (r ? fm(r) : "—") + " " + a + " · tasa del " + T.f + (T.manual ? " (escrita por ti)" : "") : "Conéctate a internet o escribe la tasa abajo.";
        $("#mtb").innerHTML = [1, 5, 10, 50, 100, 500].map(u => "<tr><td>" + u + "</td>" + ["COP", "DOP", "EUR"].map(c => "<td>" + (rate("USD", c) ? fm(u * rate("USD", c)) : "—") + "</td>").join("") + "</tr>").join("");
      };
      ["mm", "md", "ma"].forEach(i => $("#" + i).oninput = upd); $("#msw").onclick = () => { const d = $("#md").value; $("#md").value = $("#ma").value; $("#ma").value = d; upd(); };
      $("#mset").onclick = () => { const v = +String($("#mman").value).replace(",", "."), c = $("#mmc").value; if (!v) { toast("Escribe un número."); return; } T = { r: Object.assign({ USD: 1 }, T ? T.r : {}, { [c]: v }), f: fdate(today()), manual: true }; try { localStorage.setItem("cml_tasas", JSON.stringify(T)); } catch (e) {} upd(); toast("Tasa guardada."); };
      upd();
    };
    draw();
    fetch("https://open.er-api.com/v6/latest/USD").then(r => r.json()).then(j => { if (j && j.rates) { T = { r: j.rates, f: fdate(today()) }; try { localStorage.setItem("cml_tasas", JSON.stringify(T)); } catch (e) {} if (location.hash === "#moneda") draw(); } }).catch(() => {});
  }

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
  function adminLegacy() {
    if (!A.admin) { main.innerHTML = head("Administración", "Solo para la fundadora.") + '<div class="empty"><i>🔒</i><p>Esta sección es solo para Jazz.</p></div>'; return; }
    const P = (() => { try { return JSON.parse(localStorage.getItem("cml_admin_perm") || "{}"); } catch (e) { return {}; } })();
    main.innerHTML = head("Administración", "Usuarias, permisos y bloqueos.") +
      '<div class="warn"><b>Cómo se bloquea a alguien hoy:</b> el ingreso dura solo mientras la app está abierta y se vuelve a pedir el código después de 5 minutos fuera. Para sacar a una persona definitivamente, su código se agrega a la lista de bloqueados (archivo acceso.json) y deja de entrar en todos sus dispositivos. Pídeme que lo haga y queda en 2 minutos. La versión con usuarios y claves propios (Supabase) es el paso siguiente.</div>' +
      '<h4 class="sh">Ver todo como país</h4><select id="vsel" class="srch">' + Object.keys(C.precios).map(k => '<option value="' + k + '"' + (vista() === k ? ' selected' : '') + '>' + C.precios[k].nombre + '</option>').join('') + '</select><p class="note">Cambia los precios y la moneda que ves en la app y en la Sala. Tu código entra a todos los países.</p><h4 class="sh">Asesoras</h4><div class="lst">' + C.asesoras.map(a => '<div class="li"><i>' + (P["b" + a.codigo] ? "⛔" : "👩") + '</i><span><b>' + esc(a.nombre) + "</b><small>Código " + a.codigo + " · " + (C.precios[a.pais] || {}).nombre + (a.admin ? " · administradora" : "") + '</small></span>' + (a.admin ? "" : '<button type="button" class="bt2 sm" data-b="' + a.codigo + '">' + (P["b" + a.codigo] ? "Desbloquear" : "Bloquear") + "</button>") + "</div>").join("") + "</div>" +
      '<h4 class="sh">Permisos por módulo (planeación)</h4><div class="perm"><table class="cmp"><thead><tr><th></th>' + C.asesoras.map(a => "<th>" + a.codigo + "</th>").join("") + "</tr></thead><tbody>" + MODS.map(m => "<tr><td>" + m[1] + "</td>" + C.asesoras.map(a => '<td><input type="checkbox" data-p="' + m[0] + a.codigo + '" ' + (P["p" + m[0] + a.codigo] === false ? "" : "checked") + ' aria-label="' + m[1] + " " + a.codigo + '"></td>').join("") + "</tr>").join("") + "</tbody></table></div>" +
      '<h4 class="sh">Qué falta para que sea real</h4><ul class="ck"><li>Base de datos central (Supabase) para ver las mujeres, ventas y gastos de todas las asesoras.</li><li>Ingreso con correo y clave en vez de códigos de 4 dígitos.</li><li>Campo “código de asesora” en el registro de mujeres para atribuir cada una.</li><li>Pasarela de pago para cobrar las reservas y calcular comisiones solas.</li></ul>';
    $("#vsel", main).onchange = e => { try { sessionStorage.setItem("cml_vista", e.target.value); } catch (x) {} toast("Ahora ves los precios de " + C.precios[e.target.value].nombre + "."); };
    $$("[data-b]", main).forEach(b => b.onclick = () => { P["b" + b.dataset.b] = !P["b" + b.dataset.b]; localStorage.setItem("cml_admin_perm", JSON.stringify(P)); admin(); });
    $$("[data-p]", main).forEach(i => i.onchange = () => { P["p" + i.dataset.p] = i.checked; localStorage.setItem("cml_admin_perm", JSON.stringify(P)); });
  }

  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  const rnd = () => String(Math.floor(100000 + Math.random() * 900000));
  const PAISES = [["co", "Colombia"], ["do", "República Dominicana"], ["es", "España"], ["us", "Estados Unidos"]];
  function admin() {
    if (!A.admin) { main.innerHTML = head("Administración", "Solo para la fundadora.") + '<div class="empty"><i>🔒</i><p>Esta sección es solo para Jazz.</p></div>'; return; }
    if (A.legacy) { adminLegacy(); return; }
    main.innerHTML = head("Administración", "Personas, códigos, vencimientos y bloqueos.") + '<div class="empty s"><p>Cargando…</p></div>';
    CMLACC.admin("admin_list").then(L => adminDraw(L)).catch(() => { main.innerHTML = head("Administración", "") + '<div class="empty"><i>⚠️</i><p>No pude cargar la lista. Revisa tu internet e inténtalo otra vez.</p></div>'; });
  }
  function adminDraw(L) {
    const hoy = today(), est = p => !p.activo ? ["Bloqueada", "bad"] : p.valid_from > hoy ? ["Empieza " + fdate(p.valid_from), "wait"] : p.valid_to && p.valid_to < hoy ? ["Vencida", "bad"] : p.valid_to ? ["Vence " + fdate(p.valid_to), "ok"] : ["Sin vencimiento", "ok"];
    main.innerHTML = head("Administración", "Personas, códigos, vencimientos y bloqueos.") +
      '<h4 class="sh">Ver todo como país</h4><select id="vsel" class="srch">' + Object.keys(C.precios).map(k => '<option value="' + k + '"' + (vista() === k ? " selected" : "") + ">" + C.precios[k].nombre + "</option>").join("") + '</select><p class="note">Cambia los precios y la moneda que ves en la app y en la Sala. Tu código entra a todo.</p>' +
      '<h4 class="sh">Personas con acceso (' + L.length + ')</h4><div class="lst">' + L.map(p => { const e = est(p); return '<div class="pc"><div class="pt"><b>' + esc(p.nombre) + '</b><span class="bd ' + e[1] + '">' + e[0] + '</span></div><small>' + esc(p.ciudad || "—") + " · " + (C.precios[p.pais] || {}).nombre + " · " + ({ admin: "administradora", lider: "líder", asesora: "asesora" })[p.rol] + (p.last_login ? " · última vez " + fdate(p.last_login.slice(0, 10)) : "") + '</small><div class="cd"><code data-c="' + p.code + '">••••••</code><button type="button" data-sh="' + p.id + '">Ver código</button></div><div class="pb"><button type="button" data-ed="' + p.id + '">Editar</button><button type="button" data-rn="' + p.id + '">Renovar 30 días</button>' + (p.id === A.codigo ? "" : '<button type="button" class="' + (p.activo ? "dn" : "up") + '" data-bl="' + p.id + '">' + (p.activo ? "Bloquear" : "Activar") + "</button>") + "</div></div>"; }).join("") + "</div>" +
      '<div class="bar"><button type="button" class="bt2 w" data-nw>+ Nueva persona</button></div><p class="fine">Los códigos viven en la base de datos, no en los archivos de la app. Al bloquear a alguien, deja de entrar en todos sus dispositivos.</p>';
    const byId = id => L.find(x => x.id === id), redo = () => admin();
    $("#vsel", main).onchange = e => { try { sessionStorage.setItem("cml_vista", e.target.value); } catch (x) {} toast("Ahora ves los precios de " + C.precios[e.target.value].nombre + "."); };
    $$("[data-sh]", main).forEach(b => b.onclick = () => { const c = b.previousElementSibling, on = c.textContent.includes("•"); c.textContent = on ? c.dataset.c : "••••••"; b.textContent = on ? "Ocultar" : "Ver código"; });
    $$("[data-bl]", main).forEach(b => b.onclick = () => { const p = byId(b.dataset.bl), q = p.activo ? "¿Bloquear a " + p.nombre + "? Dejará de entrar al instante." : "¿Volver a activar a " + p.nombre + "?"; confirmBox(q, () => CMLACC.admin("admin_set_active", { p_id: p.id, p_activo: !p.activo }).then(r => { toast(r && r.ok ? (p.activo ? "Bloqueada." : "Activada.") : "No se pudo."); redo(); }).catch(() => toast("No se pudo. Revisa tu internet.")), p.activo ? "Sí, bloquear" : "Sí, activar"); });
    const save = (p, o, done) => CMLACC.admin("admin_save", { p_id: p ? p.id : null, p_code: o.code, p_nombre: o.nombre, p_ciudad: o.ciudad, p_pais: o.pais, p_rol: o.rol, p_from: o.desde || null, p_to: o.hasta || null }).then(r => { if (r && r.ok) { done && done(); redo(); } else toast(r && r.error === "codigo_repetido" ? "Ese código ya lo tiene otra persona. Usa otro." : "No se pudo guardar."); }).catch(() => toast("No se pudo guardar. Revisa tu internet."));
    const F = [{ k: "nombre", l: "Nombre", req: 1 }, { k: "ciudad", l: "Ciudad", ph: "Bogotá, Santo Domingo…" }, { k: "pais", l: "País (para precios)", type: "select", opts: PAISES }, { k: "rol", l: "Rol", type: "select", opts: [["asesora", "Asesora"], ["lider", "Líder de ciudad"], ["admin", "Administradora"]] }, { k: "code", l: "Código (6 números)", type: "text", req: 1, ph: "Toca “Generar” abajo" }, { k: "desde", l: "Sirve desde", type: "date" }, { k: "hasta", l: "Sirve hasta (vacío = sin vencimiento)", type: "date" }];
    const form = (p) => { const v = p ? { nombre: p.nombre, ciudad: p.ciudad, pais: p.pais, rol: p.rol, code: p.code, desde: p.valid_from, hasta: p.valid_to || "" } : { pais: "co", rol: "asesora", code: rnd(), desde: hoy, hasta: addDays(30) };
      formModal(p ? "Editar a " + p.nombre : "Nueva persona", F, v, o => { if (!/^\d{6}$/.test(o.code)) { toast("El código debe tener 6 números."); return; } save(p, o, () => toast("Guardado.")); });
      setTimeout(() => { const f = $(".ov .frm"); if (f) { const g = document.createElement("button"); g.type = "button"; g.className = "lnk"; g.textContent = "Generar un código nuevo al azar"; g.onclick = () => { $('[name="code"]', f).value = rnd(); }; $('[name="code"]', f).insertAdjacentElement("afterend", g); } }, 30); };
    $("[data-nw]", main).onclick = () => form(null);
    $$("[data-ed]", main).forEach(b => b.onclick = () => form(byId(b.dataset.ed)));
    $$("[data-rn]", main).forEach(b => b.onclick = () => { const p = byId(b.dataset.rn), nc = rnd(), hasta = addDays(30);
      modal('<div class="kick">Renovar</div><h3>' + esc(p.nombre) + '</h3><p>Su acceso quedará activo hasta el <b>' + fdate(hasta) + '</b>.</p><label class="chk"><input type="checkbox" id="rnn" checked> Darle un código nuevo (recomendado)</label><div class="row2"><button class="bt2 w" type="button" id="rok">Renovar</button></div>', (ov, cl) => { $("#rok", ov).onclick = () => { const code = $("#rnn", ov).checked ? nc : p.code; cl(); save(p, { code, nombre: p.nombre, ciudad: p.ciudad, pais: p.pais, rol: p.rol, desde: hoy, hasta }, () => { const t = "Hola " + p.nombre.split(" ")[0] + " 🌸 Tu código de Código ML Asesoras es " + code + ". Sirve hasta el " + fdate(hasta) + ". No lo compartas con nadie."; modal('<div class="kick">Listo</div><h3>Mensaje para ' + esc(p.nombre) + '</h3><div class="omsg pre">' + esc(t) + '</div><div class="row2"><button class="bt2" type="button" data-cp>Copiar</button><a class="bt2 w" target="_blank" rel="noopener" href="' + waLink(t) + '">WhatsApp</a></div>', o2 => { $("[data-cp]", o2).onclick = () => copy(t); }); }); }; }); });
  }

  /* ---------- MI CUENTA, RESPALDO E INSTALACIÓN ---------- */
  function cuenta() {
    main.innerHTML = head("Mi cuenta", A.nombre) + '<div class="lst"><button type="button" class="li" data-inst><i>📲</i><span><b>Instalar en mi celular</b><small>Queda como una app con su icono</small></span></button><button type="button" class="li" data-bk><i>💾</i><span><b>Descargar respaldo</b><small>Guarda todos tus datos en un archivo</small></span></button><label class="li filebtn"><i>♻️</i><span><b>Recuperar respaldo</b><small>Carga el archivo que descargaste</small></span><input type="file" accept=".json,application/json" hidden></label><button type="button" class="li" data-out><i>🚪</i><span><b>Cerrar sesión</b><small>Para volver a entrar necesitas tu código</small></span></button></div><p class="fine">Tus datos viven solo en este teléfono. Descarga un respaldo de vez en cuando, sobre todo si cambias de celular.</p>';
    $("[data-inst]", main).onclick = installHelp;
    $("[data-bk]", main).onclick = () => { const o = {}, p = "cml_of_" + A.codigo + "_"; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(p)) o[k.slice(p.length)] = localStorage.getItem(k); } save(JSON.stringify({ app: "cml-asesoras", codigo: A.codigo, fecha: today(), datos: o }), "respaldo-asesoras-" + today() + ".json", "application/json"); };
    $(".filebtn input", main).onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); if (j.app !== "cml-asesoras" || j.codigo !== A.codigo) { toast("Ese respaldo es de otro código."); return; } Object.keys(j.datos).forEach(k => localStorage.setItem(KEY(k), j.datos[k])); toast("Respaldo recuperado."); } catch (x) { toast("No pude leer ese archivo."); } }; r.readAsText(f); };
    $("[data-out]", main).onclick = () => logout();
  }
  let ip = null; addEventListener("beforeinstallprompt", e => { e.preventDefault(); ip = e; });
  function installHelp() {
    if (ip) { ip.prompt(); ip.userChoice.finally(() => { ip = null; }); return; }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), pc = !/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    if (pc) { modal('<div class="kick">Instalar en el computador</div><h3>Ponla como app</h3><ol class="oplan"><li>En <b>Chrome</b>, mira la barra donde está la dirección. A la derecha hay un icono de <b>pantalla con una flecha hacia abajo</b>. Tócalo y elige <b>Instalar</b>.</li><li>Si no lo ves: toca los <b>tres puntos ⋮</b> arriba a la derecha → <b>Transmitir, guardar y compartir</b> → <b>Instalar página como aplicación</b>.</li><li>Se abre en su propia ventana, con el icono de la orquídea. Búscalo en el menú de inicio de Windows y fíjalo a la barra de tareas.</li></ol>'); return; }
    modal('<div class="kick">Instalar</div><h3>Ponla en tu celular</h3>' + (ios ? '<ol class="oplan"><li>Abre esta página en <b>Safari</b> (no en el navegador de WhatsApp).</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li><li>Toca <b>Agregar</b>. Listo: ya tienes el icono.</li></ol>' : '<ol class="oplan"><li>Abre esta página en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</li><li>Confirma. Listo: ya tienes el icono.</li></ol>') + '<p class="note">Si ves “Instalar” arriba, también puedes tocarlo.</p>');
  }

  /* ---------- INICIO ---------- */
  const TI = n => "asesoras/img/t" + String(n).padStart(2, "0") + (window.CMLI && CMLI.lang === "en" ? "-en" : "") + ".webp";
  const GRUPOS = [
    ["Gestión personal", [["Mi agenda", "agenda"], ["Eventos", "eventos"], ["Centro de control", "control"], ["Frase del día", "of:frase"]]],
    ["Venta consultiva", [["Speeches", "academia"], ["Objeciones", "of:ventas"], ["Empresas", "empresas"], ["Entrenamiento", "of:entrenamiento"]]],
    ["Expansión de negocio", [["Marketing por mes", "mkt"], ["En vivo tiendas", "vivo"], ["Proveedores", "provs"], ["Premios", "of:estrategia"]]],
    ["Finanzas y operación", [["Presupuesto", "gastos"], ["Ventas y comisión", "ventas"], ["Mi oficina", "oficina"], ["Incentivos", "of:incent"]]]
  ];
  function inicio() {
    const td = get("agenda_v2", []).filter(i => i.fecha === today() && !i.hecho);
    let n = 0;
    main.innerHTML = '<div class="banner"><img src="asesoras/img/bienvenida' + (window.CMLI && CMLI.lang === "en" ? "-en" : "") + '.webp" alt="Bienvenida al área comercial">' + (EMB ? "" : '<button type="button" class="bgo" data-go="url:ventas.html" aria-label="Entrar a la sala"></button>') + '</div>' +
      '<p class="hoyl">' + (td.length ? "Tienes " + td.length + (td.length === 1 ? " pendiente" : " pendientes") + " hoy." : "Hoy no tienes pendientes anotados.").replace(/^/, esc(first()) + " · ") + "</p>" +
      (EMB ? "" : '<button type="button" class="sala" data-go="url:ventas.html"><span class="sg"></span><i>🚪</i><b>Entrar a la sala</b></button>') + '<button type="button" class="docb" data-go="docs"><i>📄</i><span><b>Documentos importantes</b><small>Cartas, propuestas e informes · envío a Jazz</small></span></button>' +
      GRUPOS.map(g => '<h4 class="gh">' + g[0] + '</h4><div class="tg">' + g[1].map(t => { n++; return '<button type="button" class="tl" data-go="' + t[1] + '" aria-label="' + t[0] + '"><img src="' + TI(n) + '" alt="' + t[0] + '" loading="lazy"></button>'; }).join("") + "</div>").join("") +
      '<div class="mini">' + (A.admin ? '<button type="button" data-go="admin">⚙️ Administración</button>' : "") + '<button type="button" data-go="moneda">💱 Dólar y monedas</button><button type="button" data-go="cuenta">👤 Mi cuenta y respaldo</button><button type="button" data-inst>📲 Instalar app</button></div>';
    const ib = $("[data-inst]", main); if (ib) ib.onclick = installHelp;
  }

  /* ---------- rutas ---------- */
  const R = { inicio, moneda, mas: inicio, agenda, eventos, vivo, gastos, empresas, provs, ventas, horas, docs, mkt, academia, oficina, reporte, control, admin, cuenta };
  const NAV = { inicio: "inicio", agenda: "agenda", academia: "academia", gastos: "gastos" };
  function route() {
    if (!A) return; const k = (location.hash || "#inicio").slice(1) || "inicio", fn = R[k] || inicio;
    const bl = (() => { try { return JSON.parse(localStorage.getItem("cml_admin_perm") || "{}")["b" + A.codigo]; } catch (e) { return false; } })();
    if (bl) { main.innerHTML = '<div class="empty"><i>⛔</i><p>Tu acceso está en pausa. Escríbele a Jazz.</p></div>'; return; }
    document.body.classList.toggle("home", k === "inicio" || k === "mas" || !R[k]); fn(); scrollTo(0, 0); $$("#nav button").forEach(b => b.classList.toggle("on", NAV[k] === b.dataset.go || (!NAV[k] && b.dataset.go === "mas" && false)));
  }
  addEventListener("hashchange", route);
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-go]"); if (!g || !A) return; const v = g.dataset.go;
    if (v.startsWith("url:")) { location.href = v.slice(4); return; } if (v.startsWith("of:")) { openOf(v.slice(3)); return; } e.preventDefault(); if (location.hash === "#" + v) route(); else location.hash = v;
  });

  /* ---------- ingreso ---------- */
  /* El ingreso dura solo mientras la app está abierta y se vuelve a pedir tras 5 minutos fuera. Los códigos viven en Supabase (se activan, vencen y bloquean desde Administración).
     Mientras Supabase no esté activado, se usan los códigos de prueba de config.js y la lista asesoras/acceso.json. */
  const find = c => (C.asesoras || []).find(a => a.codigo === String(c).trim());
  const blocked = c => fetch("asesoras/acceso.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.json()).then(j => (j.bloqueados || []).map(String).includes(String(c))).catch(() => false);
  const mk = s => ({ codigo: s.id || s.codigo, nombre: s.nombre, pais: s.pais, ciudad: s.ciudad || "", rol: s.rol, admin: s.rol === "admin", token: s.token, legacy: !!s.legacy });
  const sesion = () => { const s = CMLACC.sesion(); if (s) return s; let k = null; try { k = sessionStorage.getItem("cml_asesora"); } catch (e) {} const a = k && find(k); return a ? { legacy: true, id: a.codigo, nombre: a.nombre, pais: a.pais, rol: a.admin ? "admin" : "asesora" } : null; };
  const logout = msg => { CMLACC.salir(); A = null; location.hash = ""; start(); if (msg) $("#lgErr").textContent = msg; };
  const MSG = { invalido: "Ese código no existe. Revísalo o pídele el tuyo a Jazz.", bloqueado: "Tu acceso está desactivado. Escríbele a Jazz.", vencido: "Tu código venció. Pídele a Jazz el código nuevo.", demasiados: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.", sin_conexion: "No hay internet. Conéctate para entrar." };
  function vigilar() {
    if (!A) return; const id = A.codigo;
    if (A.legacy) { blocked(A.codigo).then(b => { if (b && A && A.codigo === id) logout(MSG.bloqueado); }); return; }
    CMLACC.check().then(r => { if (r && r.ok === false && A && A.codigo === id) logout("Tu acceso ya no está activo. Escríbele a Jazz."); });
  }
  function start() {
    const app = $("#app"), lg = $("#login"); try { localStorage.removeItem("cml_asesora"); } catch (e) {}
    const s = sesion();
    if (s) { A = mk(s); lg.hidden = true; app.hidden = false; $("#who").textContent = first(); route(); vigilar(); return; }
    A = null; app.hidden = true; lg.hidden = false;
  }
  let hiddenAt = 0; document.addEventListener("visibilitychange", () => { if (document.hidden) hiddenAt = Date.now(); else if (A) { if (hiddenAt && Date.now() - hiddenAt > 5 * 60 * 1000) logout("Por seguridad, vuelve a entrar con tu código."); else vigilar(); } });
  let code = "", busy = false;
  const dots = () => $$("#lgDots i").forEach((d, i) => d.classList.toggle("on", i < code.length));
  const bad = m => { $("#lgErr").textContent = m; const d = $("#lgDots"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake"); code = ""; setTimeout(dots, 350); };
  function tryCode() {
    if (busy || code.length < 4) return; busy = true; const c = code;
    CMLACC.login(c).then(r => {
      busy = false;
      if (r && r.ok) return enter();
      if (r && r.error === "sin_backend") { const a = find(c); if (!a) return bad(MSG.invalido); return blocked(a.codigo).then(b => { if (b) return bad(MSG.bloqueado); try { sessionStorage.setItem("cml_asesora", a.codigo); } catch (x) {} enter(); }); }
      bad(MSG[(r && r.error) || "invalido"] || MSG.invalido);
    });
  }
  /* Música de entrada: arpa suave con eco, generada en el aparato (sin archivos) */
  let AC = null;
  function nota(f, t, dur, vol) {
    const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain();
    o.type = "sine"; o2.type = "triangle"; o.frequency.value = f; o2.frequency.value = f * 2; o2.detune.value = 6;
    const g2 = AC.createGain(); g2.gain.value = .12; o2.connect(g2); g2.connect(g); o.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    g.connect(AC.eco); o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
  }
  function musica(tipo) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      if (!AC.eco) {
        const m = AC.createGain(); m.gain.value = .5; m.connect(AC.destination);
        const d = AC.createDelay(); d.delayTime.value = .32; const fb = AC.createGain(); fb.gain.value = .38;
        const fl = AC.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = 2600;
        d.connect(fl); fl.connect(fb); fb.connect(d); fl.connect(m);
        const ent = AC.createGain(); ent.connect(m); ent.connect(d); AC.eco = ent;
      }
      const t0 = AC.currentTime + .05;
      const E = [293.66, 369.99, 440, 587.33, 739.99, 880, 1108.73, 1174.66]; // Re mayor, ascendente
      if (tipo === "abrir") E.forEach((f, i) => nota(f, t0 + i * .22, 2.6, .16));
      else { [587.33, 739.99, 880, 1174.66].forEach((f, i) => nota(f, t0 + i * .09, 3.2, .18)); nota(293.66, t0, 3.4, .2); }
    } catch (e) {}
  }
  function enter() {
    musica("entrar");
    $("#lgErr").textContent = ""; $("#login").classList.add("bloom"); setTimeout(() => { $("#login").classList.remove("bloom", "open"); code = ""; dots(); location.hash = "inicio"; start(); }, 1100);
  }
  function key(k) {
    if ($("#login").hidden || !$("#login").classList.contains("open")) return;
    $("#lgErr").textContent = "";
    if (k === "b") code = code.slice(0, -1); else if (k === "e") tryCode(); else if (/^\d$/.test(k) && code.length < 6) code += k;
    dots(); if (code.length === 6 && k !== "e") setTimeout(tryCode, 200);
  }
  $$("#lgPad .keys button").forEach(b => b.addEventListener("click", () => key(b.dataset.k)));
  addEventListener("keydown", e => { if (/^\d$/.test(e.key)) key(e.key); else if (e.key === "Backspace") key("b"); else if (e.key === "Enter") key("e"); });
  $("#orq").addEventListener("click", () => { if (!$("#login").classList.contains("open")) musica("abrir"); $("#login").classList.add("open"); });
  $("#hInst").addEventListener("click", installHelp); $("#lgInst").addEventListener("click", installHelp); if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#lgInst").hidden = true;
  $("#hAcc").addEventListener("click", () => { location.hash = "cuenta"; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) $("#hInst").hidden = true;
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("../sw.js").catch(() => {}));
  start();
})();
