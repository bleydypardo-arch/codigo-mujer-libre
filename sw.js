// Código Mujer Libre — minimal service worker.
// It lets phones treat the site as an installable app, and makes sure the installed app never shows an old copy:
// every request for our own files asks the server first ("no-cache" = check for a newer version, usually a tiny "unchanged" reply).
// Nothing is stored offline. Other sites (Supabase, fonts) are untouched.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r, { cache: "no-cache" }).catch(() => fetch(r)));
});
