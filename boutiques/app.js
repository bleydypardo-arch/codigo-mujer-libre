(function () {
  const D = window.CMLB, I = window.CMLI, app = document.getElementById("app");
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LOGO = "../lobby/logo-club-2.webp", HOTEL_IMG = "../lobby/home.webp";
  /* ---- estado local (solo en este navegador; demo) ---- */
  const KEY = "cml_boutiques_demo";
  let S = { reg: false, name: "", stamps: [], entry: "" };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const stamp = id => { if (!S.stamps.includes(id)) { S.stamps.push(id); save(); } };
  const money = (v, cur) => new Intl.NumberFormat(cur === "COP" ? "es-CO" : cur === "EUR" ? "es-ES" : "en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v);
  const by = slug => D.boutiques.find(b => b.slug === slug);
  const toast = m => { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3800); };

  /* ---- arte de producto y decoraciones (sin fotos: se reemplazan por fotos reales de cada marca) ---- */
  const art = (b, it, i) => {
    const a = b.pal, ang = 120 + i * 23;
    return '<div class="art" style="background:linear-gradient(' + ang + 'deg,' + a.soft + ',#fff 85%)">' +
      '<svg viewBox="0 0 200 160" style="position:absolute;inset:0;width:100%;height:100%;opacity:.55"><circle cx="' + (40 + i * 28 % 120) + '" cy="40" r="70" fill="' + a.accent + '" opacity=".18"/><circle cx="170" cy="140" r="60" fill="' + a.deep + '" opacity=".1"/></svg>' +
      '<span class="ic" style="display:contents">' + I(it.ic).replace("<svg ", '<svg class="ic" ') + "</span>" +
      (it.tag ? '<span class="tag">' + esc(it.tag) + "</span>" : "") + '<span class="ph">FOTO DE LA MARCA</span></div>';
  };
  const deco = m => {
    const s = {
      leaf: '<path d="M0 220C80 80 220 30 380 40c-10 140-130 210-300 190" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M620 0c-60 90-60 190 20 270 90-70 80-190-20-270z" fill="currentColor" opacity=".35"/>',
      lines: [0, 1, 2, 3, 4, 5, 6].map(n => '<path d="M0 ' + (60 + n * 38) + 'C200 ' + (20 + n * 30) + ' 400 ' + (140 + n * 20) + ' 800 ' + (60 + n * 38) + '" fill="none" stroke="currentColor" stroke-width="1"/>').join(""),
      waves: [0, 1, 2, 3, 4].map(n => '<path d="M0 ' + (170 + n * 26) + 'q50-30 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0" fill="none" stroke="currentColor" stroke-width="1.3"/>').join("") + '<circle cx="640" cy="90" r="46" fill="currentColor" opacity=".4"/>',
      rings: '<circle cx="640" cy="80" r="130" fill="none" stroke="currentColor"/><circle cx="640" cy="80" r="90" fill="none" stroke="currentColor"/><circle cx="640" cy="80" r="50" fill="currentColor" opacity=".35"/><circle cx="90" cy="250" r="70" fill="none" stroke="currentColor"/>',
      arch: '<path d="M80 320V160a100 100 0 0 1 200 0v160" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M110 320V165a70 70 0 0 1 140 0v155" fill="currentColor" opacity=".3"/><path d="M520 320V190a80 80 0 0 1 160 0v130" fill="none" stroke="currentColor" stroke-width="1.4"/>',
      petal: [0, 1, 2, 3, 4, 5].map(n => '<ellipse cx="640" cy="120" rx="26" ry="82" transform="rotate(' + n * 60 + ' 640 120)" fill="currentColor" opacity=".3"/>').join("") + '<circle cx="640" cy="120" r="12" fill="currentColor"/>'
    }[m] || "";
    return '<div class="deco"><svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice">' + s + "</svg></div>";
  };

  /* ---- vistas ---- */
  function home() {
    const cats = [...new Set(D.boutiques.map(b => b.cat))];
    app.innerHTML =
      '<nav class="nav"><a class="brand" href="#/"><img src="' + LOGO + '" alt=""><span>CÓDIGO ML</span></a><a class="link" href="#/empezar">Quiero mi boutique</a></nav>' +
      '<header class="hero"><img src="' + HOTEL_IMG + '" alt=""><div class="hero-in"><div class="kicker">Hotel digital de bienestar para mujeres</div><h1>Galería de boutiques</h1>' +
      '<p>Marcas de mujeres, con su propia identidad, dentro de un hotel de experiencias. Entra a una boutique, descubre su mundo y recorre el hotel.</p>' +
      '<div class="row"><a class="btn gold" href="entrada.html">Vivir la experiencia</a><a class="btn ghost" style="color:#fff;border-color:#fff8" href="#galeria">Ver galería</a><a class="btn ghost" style="color:#fff;border-color:#fff8" href="#/empezar">Quiero mi boutique virtual</a></div></div></header>' +
      '<section><div class="kicker" style="color:var(--gold-d)">El hotel</div><h2>Un lugar donde tus clientas se quedan</h2><p class="lead">Código ML reúne spa virtual, café matcha, atelier de esencias, viajes y conversaciones. Cada boutique es una puerta de entrada a todo eso, y cada visita construye comunidad para tu marca.</p>' +
      '<div class="spaces">' + D.spaces.map(s => '<a class="space" href="' + D.hotelUrl + '" target="_blank" rel="noopener" data-sp="' + s.id + '">' + I(s.ic) + "<b>" + s.n + "</b><small>" + s.d + "</small></a>").join("") + "</div></section>" +
      '<section id="galeria"><div class="kicker" style="color:var(--gold-d)">Galería</div><h2>Boutiques de demostración</h2><p class="lead">Seis ejemplos de tiendas muy distintas con la misma plantilla: productos, servicios, formación, viajes y belleza.</p>' +
      '<div class="filters"><input id="fq" type="search" placeholder="Buscar por nombre"><select id="fc"><option value="">Todas las ciudades</option>' + D.cities.map(c => "<option>" + c.name + "</option>").join("") + '</select><select id="fp"><option value="">Todos los países</option>' + [...new Set(D.cities.map(c => c.country))].map(c => "<option>" + c + "</option>").join("") + '</select><select id="fk"><option value="">Todas las categorías</option>' + cats.map(c => "<option>" + c + "</option>").join("") + '</select></div><div class="grid" id="grid"></div></section>' +
      '<section><div class="kicker" style="color:var(--gold-d)">Cómo funciona</div><h2>Tu boutique en tres pasos</h2><div class="steps">' +
      '<div class="step"><b>1. Diseñamos tu espacio</b><span>Tu logo, tus colores, tus fotos y un lobby de bienvenida con tu marca.</span></div>' +
      '<div class="step"><b>2. Compartes tu enlace</b><span>Un enlace propio para Instagram, TikTok y WhatsApp. Tus seguidoras llegan directo a tu boutique.</span></div>' +
      '<div class="step"><b>3. Vendes a tu manera</b><span>Tus botones llevan a tu tienda (Shopify, WooCommerce, reservas o tu pago). El dinero es tuyo.</span></div></div></section>' +
      '<section><div class="kicker" style="color:var(--gold-d)">Tu panel</div><h2>Ves cómo crece tu comunidad</h2><p class="lead">Ejemplo de lo que verás de tu boutique (cifras ficticias).</p><div class="panel"><div class="stat"><b>1.284</b><span>mujeres entraron por tu enlace</span></div><div class="stat"><b>312</b><span>se inscribieron en Código ML</span></div><div class="stat"><b>97</b><span>clics a tu tienda</span></div><div class="stat"><b>3</b><span>meses de renta ganados</span></div></div></section>' +
      '<section class="dark" id="oferta"><div class="wrap offer"><div><div class="kicker">Tu marca. Tu boutique. Tu propio espacio en Código ML.</div><h2>Entra como boutique fundadora</h2><p class="lead">Cupos fundadores limitados por ciudad y categoría. Te acompañamos desde el primer día y creces con la marca.</p><div class="slots">' + D.cities.map(c => "<span>" + c.name + " · " + c.slots + " cupos</span>").join("") + '</div></div>' +
      '<div class="priceCard"><div class="kicker" style="color:var(--gold-d)">Piloto fundadora</div><div class="big">USD ' + D.price.intro + '</div><div style="font-size:14px;color:var(--mute)">el primer mes · luego USD ' + D.price.monthly + ' al mes</div><ul><li>Boutique propia con tu identidad</li><li>Enlace exclusivo para tus redes</li><li>Panel con tus visitas e inscripciones</li><li>Beneficios por cada mujer que se une</li></ul><button class="btn wine" id="want" style="width:100%">Quiero mi boutique virtual</button></div></div></section>' +
      '<footer>Código ML · Código Mujer Libre — Demo comercial. Los precios y condiciones pueden cambiar.</footer>';
    const draw = () => {
      const q = $("#fq").value.trim().toLowerCase(), c = $("#fc").value, p = $("#fp").value, k = $("#fk").value;
      const list = D.boutiques.filter(b => (!q || b.name.toLowerCase().includes(q)) && (!c || b.city === c) && (!p || b.country === p) && (!k || b.cat === k));
      $("#grid").innerHTML = list.length ? list.map(b => {
        const a = b.pal;
        return '<a class="bcard" href="#/b/' + b.slug + '" style="font-family:\'' + b.font + '\',serif"><div class="cover" style="background:' + a.bg + ";color:" + a.deep + '">' + deco(b.motif).replace('class="deco"', 'class="deco" style="position:absolute;inset:0;opacity:.25"') + '<div class="mono" style="color:' + a.accent + '">' + esc(b.name[0]) + '</div></div><div class="body"><h3 style="color:' + a.deep + '">' + esc(b.name) + '</h3><div class="meta">' + esc(b.city) + " · " + esc(b.country) + '</div><div class="meta" style="font-family:Inter,sans-serif">' + esc(b.tagline) + '</div><span class="chip" style="font-family:Inter,sans-serif">' + esc(b.cat) + "</span></div></a>";
      }).join("") : '<div class="empty">No hay boutiques con esos filtros todavía. ¡Tu marca podría ser la primera!</div>';
    };
    ["fq", "fc", "fp", "fk"].forEach(id => $("#" + id).addEventListener("input", draw)); draw();
    $("#want").addEventListener("click", interest);
    app.querySelectorAll("[data-sp]").forEach(a => a.addEventListener("click", () => stamp("hotel:" + a.dataset.sp)));
  }

  function boutique(slug) {
    const b = by(slug); if (!b) { location.hash = "#/"; return; }
    if (!S.entry) { S.entry = slug; save(); } else if (S.entry !== slug) stamp("b:" + slug);
    const a = b.pal;
    const prods = b.items.map((it, i) => '<article class="prod">' + art(b, it, i) + '<div class="pb"><h3>' + esc(it.n) + "</h3><p>" + esc(it.d) + '</p><div class="row"><span class="price">' + money(it.p, b.cur) + '</span><button class="btn" data-i="' + i + '">' + b.cta + "</button></div></div></article>").join("");
    app.innerHTML =
      '<div class="bp" style="--bg:#fff;--ink:' + a.ink + ";--accent:" + a.accent + ";--soft:" + a.bg + ";--deep:" + a.deep + ";font-family:'" + b.font + "',serif\">" +
      '<div class="topline" style="font-family:Inter,sans-serif"><a href="#/">← Galería Código ML</a><a href="' + D.hotelUrl + '" target="_blank" rel="noopener" id="toHotel">Entrar al hotel</a></div>' +
      '<header class="bhero">' + deco(b.motif) + '<div class="mono">' + esc(b.name[0]) + '</div><small style="font-family:Inter,sans-serif">Bienvenida a la boutique de ' + esc(b.owner) + "</small><h1>" + esc(b.name) + "</h1><p style=\"font-family:Inter,sans-serif\">" + esc(b.tagline) + '</p><a class="btn" href="#catalogo" style="font-family:Inter,sans-serif">Entrar a la boutique</a><div class="bstats" style="font-family:Inter,sans-serif">' + b.stats.map(s => "<span>" + esc(s) + "</span>").join("") + "</div></header>" +
      '<section class="bsec" id="catalogo"><h2>' + esc(b.kind) + '</h2><div class="prods" style="font-family:Inter,sans-serif">' + prods + "</div></section>" +
      '<section class="bsec"><div class="about"><div><h2>Sobre ' + esc(b.owner) + '</h2><p style="font-family:Inter,sans-serif;margin-top:12px">' + esc(b.about) + '</p></div><div class="pass" style="margin:0" id="pass"></div></div></section>' +
      '<div class="back-hotel" style="font-family:Inter,sans-serif"><p style="opacity:.7;margin-bottom:12px">Esta boutique vive dentro del hotel Código ML.</p><a class="btn" href="' + D.hotelUrl + '" target="_blank" rel="noopener">Conocer el hotel</a> <a class="btn" style="background:transparent;color:var(--deep);border:1px solid var(--deep)" href="#/">Ver otras boutiques</a></div>' +
      "</div>" +
      '<footer>Demo · productos ficticios · Código ML</footer>';
    passCard(b);
    $("#toHotel").addEventListener("click", () => { stamp("hotel:visit"); passCard(b); });
    app.querySelectorAll(".prod .btn").forEach(btn => btn.addEventListener("click", () => buy(b, b.items[+btn.dataset.i])));
    window.scrollTo(0, 0);
  }

  function passCard(b) {
    const n = Math.min(3, S.stamps.length), el = $("#pass"); if (!el) return;
    el.innerHTML = '<h3>Tu pasaporte del hotel</h3><p style="font-family:Inter,sans-serif;font-size:14px;opacity:.8">Visita 3 espacios del hotel Código ML y desbloquea un regalo de ' + esc(b.owner) + ".</p><div class=\"stamps\">" + [0, 1, 2].map(i => '<div class="stamp' + (i < n ? " on" : "") + '">' + (i < n ? "✓" : i + 1) + "</div>").join("") + '</div><div style="font-family:Inter,sans-serif;font-size:14px">' + (n >= 3 ? "Regalo desbloqueado: <b>10 % de descuento</b> con el código <b>" + code(b) + "</b>" : "Llevas " + n + " de 3 sellos.") + "</div>";
  }
  const code = b => b.slug.split("-")[0].toUpperCase() + "10";

  /* ---- compra: registro gratis -> pausa en el lobby -> continuar ---- */
  function modal(html, onMount) {
    const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">×</button>' + html + "</div>";
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    $(".x", ov).addEventListener("click", close);
    onMount && onMount(ov, close); return { ov, close };
  }
  function buy(b, it) {
    if (!S.reg) return register(b, it);
    pause(b, it);
  }
  function register(b, it) {
    modal('<h3>Crea tu cuenta gratis</h3><p>Para continuar con tu ' + (b.cta === "Reservar" ? "reserva" : b.cta === "Inscribirme" ? "inscripción" : "compra") + ' entra a Código ML. Es un paso rápido y te abre las puertas del hotel.</p><label>Tu nombre<input id="rn" autocomplete="given-name"></label><label>Tu correo<input id="re" type="email" autocomplete="email"></label><div class="acts"><button class="btn wine" id="rg">Crear mi cuenta</button></div><p class="note">Demostración: no se guarda ningún dato real.</p>', (ov, close) => {
      $("#rg", ov).addEventListener("click", () => { S.reg = true; S.name = $("#rn", ov).value.trim(); save(); close(); toast("Cuenta creada" + (S.name ? ", " + S.name : "") + ". Bienvenida al hotel."); pause(b, it); });
    });
  }
  function pause(b, it) {
    const others = D.boutiques.filter(x => x.slug !== b.slug).slice(0, 3);
    const n = Math.min(3, S.stamps.length);
    modal('<h3>Un momento en el lobby</h3><p>Estás en Código ML. Antes de continuar con <b>' + esc(it.n) + "</b>, mira lo que hay en el hotel:</p>" +
      '<div class="mini">' + D.spaces.slice(0, 3).map(s => '<a href="' + D.hotelUrl + '" target="_blank" rel="noopener" data-sp="' + s.id + '">' + I(s.ic) + esc(s.n) + "</a>").join("") + others.map(x => '<a href="#/b/' + x.slug + '" data-go="1">' + I("heart") + esc(x.name) + "</a>").join("") + "</div>" +
      '<div class="gift">' + (n >= 3 ? "<b>Regalo desbloqueado:</b> usa el código <b>" + code(b) + "</b> para un 10 % de descuento." : "Llevas <b>" + n + " de 3</b> sellos. Con 3 desbloqueas un regalo de " + esc(b.owner) + ".") + '</div><div class="acts"><button class="btn wine" id="go">Continuar a mi ' + (b.cta === "Reservar" ? "reserva" : b.cta === "Inscribirme" ? "inscripción" : "compra") + '</button></div><p class="note">Puedes continuar cuando quieras: el recorrido nunca bloquea tu compra.</p>', (ov, close) => {
      ov.querySelectorAll("[data-sp]").forEach(a => a.addEventListener("click", () => { stamp("hotel:" + a.dataset.sp); }));
      ov.querySelectorAll("[data-go]").forEach(a => a.addEventListener("click", close));
      $("#go", ov).addEventListener("click", () => { close(); modal('<h3>Aquí se abre tu tienda</h3><p>En una boutique real, este botón lleva a la tienda de ' + esc(b.owner) + ' (Shopify, WooCommerce, agenda de reservas o su propio pago) en una pestaña nueva. El pago y la entrega los gestiona ella.</p><p class="note">Demostración: no se realiza ninguna compra.</p><div class="acts"><button class="btn ghost" id="ok">Entendido</button></div>', (o, c) => $("#ok", o).addEventListener("click", () => { c(); passCard(b); })); });
    });
  }

  /* ---- formulario de interés ---- */
  function interest() {
    modal('<h3>Quiero mi boutique virtual</h3><p>Cuéntanos de tu marca. Te escribimos con una propuesta para tu espacio.</p>' +
      '<label>Tu nombre<input id="in" autocomplete="name"></label><label>Nombre de tu marca<input id="ib"></label><label>Instagram o TikTok<input id="is" placeholder="@tumarca"></label><label>Ciudad y país<input id="ic"></label><label>¿Qué vendes?<select id="it"><option>Productos físicos</option><option>Conferencias, cursos o servicios</option><option>Viajes y experiencias</option><option>Belleza o cabello</option><option>Otro</option></select></label><label>Tu correo o WhatsApp<input id="ie"></label><div class="acts"><button class="btn wine" id="send">Enviar mi interés</button></div><p class="note">Se abrirá tu correo con el mensaje listo para enviar a Código ML. Tus datos no se publican.</p>', (ov, close) => {
      $("#send", ov).addEventListener("click", () => {
        const v = id => $("#" + id, ov).value.trim();
        if (!v("in") || !v("ie")) { toast("Falta tu nombre y un medio de contacto."); return; }
        const body = ["Quiero mi boutique virtual en Código ML.", "", "Nombre: " + v("in"), "Marca: " + v("ib"), "Redes: " + v("is"), "Ciudad y país: " + v("ic"), "Vendo: " + v("it"), "Contacto: " + v("ie")].join("\n");
        try { localStorage.setItem(KEY + "_interest", JSON.stringify({ at: Date.now(), body })); } catch (e) {}
        close(); toast("¡Gracias! Se abrió tu correo para enviar el mensaje.");
        location.href = "mailto:" + D.email + "?subject=" + encodeURIComponent("Quiero mi boutique virtual · " + (v("ib") || v("in"))) + "&body=" + encodeURIComponent(body);
      });
    });
  }

  function route() {
    const h = location.hash;
    if (h === "#/empezar") { location.hash = "#/"; setTimeout(() => $("#oferta") && $("#oferta").scrollIntoView(), 80); return; }
    const m = h.match(/^#\/b\/([\w-]+)/);
    if (m) boutique(m[1]); else if (h === "#galeria" || h === "#catalogo") return; else { home(); window.scrollTo(0, 0); }
  }
  window.addEventListener("hashchange", route); route();
})();
