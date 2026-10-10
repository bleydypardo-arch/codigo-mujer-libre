// Código Mujer Libre — minimal service worker.
// Its only job is to let phones treat the site as an installable app.
// It does NOT cache anything and does NOT change how pages load: every request goes straight to the network.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { /* pass-through: the browser handles the request normally */ });
