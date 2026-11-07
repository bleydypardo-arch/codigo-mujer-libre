/* Mar vivo: mueve los píxeles reales del mar de la foto (olas), brillos del sol, fuego y faroles. Se activa solo en las salas que lo piden. */
(function () {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0, nodes = [], ripples = [], off = null;
  function stop() { cancelAnimationFrame(raf); raf = 0; nodes.forEach(n => n.remove()); nodes = []; ripples = []; if (off) { removeEventListener("pointerup", off); off = null; } }
  function start(layer, img, S, cfg) {
    stop();
    const dpr = Math.min(2, devicePixelRatio || 1), k = S * dpr, sea = cfg.sea;
    const mk = (x, y, w, h, blend, mask) => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k)); c.className = "live"; c.style.cssText = "position:absolute;pointer-events:none;left:" + x * S + "px;top:" + y * S + "px;width:" + w * S + "px;height:" + h * S + "px;" + (blend ? "mix-blend-mode:" + blend + ";" : "") + (mask ? "-webkit-mask-image:" + mask + ";mask-image:" + mask + ";" : ""); layer.insertBefore(c, layer.firstChild); nodes.push(c); return c; };
    const sc = mk(sea.x, sea.y, sea.w, sea.h, "", "linear-gradient(to bottom,transparent 0,#000 8%,#000 86%,transparent 100%)"), sx = sc.getContext("2d");
    const gl = cfg.glow, gc = gl && mk(gl.x, gl.y, gl.w, gl.h, "screen"), gx = gc && gc.getContext("2d");
    const sparks = Array.from({ length: 46 }, () => ({ u: Math.random(), v: Math.random(), p: Math.random() * 6.28, s: .6 + Math.random() * 1.6 }));
    let last = 0;
    function frame(ts) {
      raf = requestAnimationFrame(frame); if (document.hidden || ts - last < 33) return; last = ts; const t = ts / 1000;
      if (!img.complete || !img.naturalWidth) return;
      sx.clearRect(0, 0, sc.width, sc.height);
      for (let r = 0; r < sea.h; r++) {
        const f = r / sea.h, amp = .15 + f * f * 2.6;
        let dx = amp * (Math.sin(r * .85 + t * 1.25) + .55 * Math.sin(r * 2.3 - t * .9) + .3 * Math.sin(r * .31 + t * .5));
        ripples.forEach(p => { const age = t - p.t, dy = Math.abs(sea.y + r - p.y), dd = Math.abs(sea.x + sea.w / 2 - p.x); const wv = Math.exp(-age * .9) * Math.exp(-dy * dy / 260) * Math.exp(-dd * dd / 52000); if (wv > .01) dx += 4 * wv * Math.sin(dy * .5 - age * 7 + dd * .05); });
        sx.drawImage(img, sea.x - dx - 2, sea.y + r, sea.w + 4, 1, -2 * k, r * k, (sea.w + 4) * k, k + .6);
      }
      sx.globalCompositeOperation = "lighter";
      const sunX = (cfg.sun[0] - sea.x) * k;
      sparks.forEach(s => { const f = s.v, y = f * sea.h * k, spread = (.05 + f * .5) * sea.w * .5 * k, x = sunX + (s.u - .5) * 2 * spread * (Math.random() < .08 ? 3 : 1); const a = Math.max(0, Math.sin(t * (1.4 + s.s) + s.p)) ** 6 * (.75 - f * .3); if (a < .05) return; const rad = (1 + s.s * (.8 + f * 1.4)) * k; const g = sx.createRadialGradient(x, y, 0, x, y, rad * 2.2); g.addColorStop(0, "rgba(255,244,210," + a + ")"); g.addColorStop(1, "rgba(255,214,150,0)"); sx.fillStyle = g; sx.fillRect(x - rad * 2.2, y - rad * 2.2, rad * 4.4, rad * 4.4); });
      for (let i = 0; i < 3; i++) { const y = ((t * (.05 + i * .02) + i * .33) % 1) * sea.h * k, x = ((t * (14 + i * 6) * (i % 2 ? -1 : 1) + i * 150) % (sea.w + 120) + sea.w + 120) % (sea.w + 120) - 60; const g = sx.createLinearGradient((x - 60) * k, 0, (x + 60) * k, 0); g.addColorStop(0, "rgba(255,225,180,0)"); g.addColorStop(.5, "rgba(255,225,180,.10)"); g.addColorStop(1, "rgba(255,225,180,0)"); sx.fillStyle = g; sx.fillRect((x - 60) * k, y, 120 * k, 1.2 * k); }
      sx.globalCompositeOperation = "source-over";
      if (gx) { gx.clearRect(0, 0, gc.width, gc.height); (cfg.fire || []).concat(cfg.lamps || []).forEach((p, i) => { const fire = i < (cfg.fire || []).length, fl = fire ? .55 + .25 * Math.sin(t * 9 + 1) + .15 * Math.sin(t * 17) + .08 * Math.random() : .5 + .12 * Math.sin(t * 2.2 + i * 2), x = (p[0] - gl.x) * k, y = (p[1] - gl.y) * k, r = (fire ? 34 : 20) * k, g = gx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(255,170,70," + fl * (fire ? .55 : .34) + ")"); g.addColorStop(1, "rgba(255,120,30,0)"); gx.fillStyle = g; gx.fillRect(x - r, y - r, r * 2, r * 2); }); }
    }
    if (still) { frame(performance.now() + 100); cancelAnimationFrame(raf); raf = 0; } else raf = requestAnimationFrame(frame);
    off = e => { const vp = layer.parentElement, r = layer.getBoundingClientRect(), x = (e.clientX - r.left) / S, y = (e.clientY - r.top) / S; if (x > sea.x && x < sea.x + sea.w && y > sea.y - 6 && y < sea.y + sea.h + 10) { ripples.push({ x, y: Math.min(Math.max(y, sea.y + 2), sea.y + sea.h - 2), t: performance.now() / 1000 }); if (ripples.length > 6) ripples.shift(); } };
    addEventListener("pointerup", off);
  }
  window.CMLSea = { start, stop };
})();
