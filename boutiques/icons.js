/* Iconos de línea (viewBox 64) para los productos de demostración. */
window.CMLI = (function () {
  const P = {
    jar: '<rect x="18" y="26" width="28" height="26" rx="6"/><rect x="21" y="16" width="22" height="10" rx="3"/><path d="M24 36h16M24 42h10"/>',
    bottle: '<path d="M27 12h10v8H27z"/><path d="M29 20v6l-7 8v16a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V34l-7-8v-6"/><path d="M26 40h12"/>',
    candle: '<path d="M32 10c5 5 5 9 0 12-5-3-5-7 0-12z"/><rect x="22" y="26" width="20" height="26" rx="4"/><path d="M32 22v4M22 36h20"/>',
    tea: '<path d="M16 28h28v10a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z"/><path d="M44 31h4a5 5 0 0 1 0 10h-4"/><path d="M24 12c-3 3 3 5 0 8M32 12c-3 3 3 5 0 8M40 12c-3 3 3 5 0 8"/>',
    box: '<rect x="12" y="26" width="40" height="26" rx="3"/><rect x="10" y="18" width="44" height="8" rx="2"/><path d="M32 18v34"/><path d="M32 18c-6-8-14-4-10 0M32 18c6-8 14-4 10 0"/>',
    mic: '<rect x="25" y="10" width="14" height="26" rx="7"/><path d="M18 30a14 14 0 0 0 28 0M32 44v10M24 54h16"/>',
    laptop: '<rect x="14" y="16" width="36" height="24" rx="3"/><path d="M8 48h48l-4-8H12z"/>',
    book: '<path d="M12 14h16a4 4 0 0 1 4 4v32a4 4 0 0 0-4-4H12z"/><path d="M52 14H36a4 4 0 0 0-4 4v32a4 4 0 0 1 4-4h16z"/>',
    heart: '<path d="M32 52S12 40 12 25a10 10 0 0 1 20-4 10 10 0 0 1 20 4c0 15-20 27-20 27z"/>',
    ticket: '<path d="M10 20h44v8a4 4 0 0 0 0 8v8H10v-8a4 4 0 0 0 0-8z"/><path d="M40 20v24" stroke-dasharray="3 4"/>',
    sun: '<circle cx="32" cy="32" r="10"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"/>',
    leaf: '<path d="M14 50C14 28 28 14 52 12c0 24-14 38-34 38z"/><path d="M14 50 40 24"/>',
    wine: '<path d="M22 10h20c1 14-2 24-10 24S21 24 22 10z"/><path d="M32 34v18M24 54h16M22 20h20"/>',
    vase: '<path d="M26 10h12M28 10v8c-10 4-14 12-14 20a14 14 0 0 0 14 14h8a14 14 0 0 0 14-14c0-8-4-16-14-20v-8"/><path d="M20 38h24"/>',
    plane: '<path d="M8 36 54 14 40 52l-10-12-8 6 2-12z"/><path d="M30 40 54 14"/>',
    tub: '<rect x="16" y="20" width="32" height="32" rx="5"/><rect x="18" y="12" width="28" height="8" rx="3"/><circle cx="32" cy="36" r="7"/>',
    bar: '<rect x="10" y="24" width="44" height="16" rx="8" transform="rotate(-20 32 32)"/><path d="M22 34l4-6M30 36l4-6M38 38l4-6"/>',
    dress: '<path d="M26 10h12l2 12-6 4h-4l-6-4z"/><path d="M26 26 14 54h36L38 26"/><path d="M24 36h16"/>',
    bag: '<path d="M14 24h36l3 28H11z"/><path d="M24 24v-4a8 8 0 0 1 16 0v4"/><path d="M26 36a6 6 0 0 0 12 0"/>',
    ring: '<circle cx="32" cy="38" r="14"/><path d="M26 22l6-10 6 10z"/>',
    lipstick: '<rect x="22" y="34" width="20" height="18" rx="3"/><rect x="25" y="22" width="14" height="12"/><path d="M25 22l14-8v8"/>',
    brush: '<path d="M44 8 24 34"/><path d="M24 34c-6 0-10 4-10 10 0 4-2 6-4 8 10 2 22-2 22-12z"/>',
    scissors: '<circle cx="18" cy="46" r="7"/><circle cx="18" cy="18" r="7"/><path d="M24 22 54 42M24 42 54 22"/>'
  };
  return (n, c) => '<svg viewBox="0 0 64 64" fill="none" stroke="' + (c || "currentColor") + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.leaf) + "</svg>";
})();
