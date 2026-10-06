// Home hero: very subtle, water-only shimmer over the official photo (hero-home.jpg).
// The photo itself never moves. We only size an overlay to the photo's real rendered area (object-fit: cover math)
// so the shimmer sits on the sea and the sun's path whatever the screen size. Skipped for any other hero photo.
(function () {
  "use strict";
  const NW = 1680, NH = 936;
  const hero = document.querySelector(".hero"), img = document.getElementById("heroImg");
  if (!hero || !img) return;
  const water = document.createElement("div");
  water.className = "hero-water"; water.setAttribute("aria-hidden", "true");
  water.innerHTML = '<div class="hw-piece hw-sea-l"><div class="hw-lines"></div></div>' +
    '<div class="hw-piece hw-sea-r"><div class="hw-lines"></div></div>' +
    '<div class="hw-piece hw-sun"><i></i></div>';
  img.insertAdjacentElement("afterend", water);
  function place() {
    const official = /hero-home\.jpg(\?|$)/.test(img.getAttribute("src") || "");
    const w = hero.clientWidth, h = hero.clientHeight;
    if (!official || !w || !h || img.hidden) return water.classList.remove("on");
    const s = Math.max(w / NW, h / NH), rw = NW * s, rh = NH * s;
    const pos = (getComputedStyle(img).objectPosition || "50% 50%").split(/\s+/);
    const px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] === undefined ? "50" : pos[1]) / 100;
    Object.assign(water.style, { width: rw + "px", height: rh + "px", left: (w - rw) * (isNaN(px) ? .5 : px) + "px", top: (h - rh) * (isNaN(py) ? .5 : py) + "px" });
    water.classList.add("on");
  }
  window.addEventListener("resize", place);
  img.addEventListener("load", place);
  new MutationObserver(place).observe(img, { attributes: true, attributeFilter: ["src", "hidden"] });
  if (window.ResizeObserver) new ResizeObserver(place).observe(hero);
  place();
})();
