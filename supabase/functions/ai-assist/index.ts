// Supabase Edge Function: ai-assist  (v2: Ticketmaster + Google Places + OpenAI)
// Admin-only helper for Código Mujer Libre.
//   action "discover": finds REAL options near the home area and prepares bilingual cards
//        sources: Ticketmaster Discovery API (events with real dates/links/prices/images)
//                 Google Places API (New) text search (venues/places)
//        OpenAI only WRITES the card text (Spanish + English) and picks a código.
//        Dates, times, prices, places, links and images come from the APIs, never from the model.
//   action "polish":   rewrites / translates titles and descriptions (OpenAI only)
//
// SECURITY
//  - All keys live ONLY in Supabase secrets (never in the website code):
//      OPENAI_API_KEY, TICKETMASTER_API_KEY, GOOGLE_PLACES_API_KEY
//  - Every call must carry a logged-in user's token AND that user must be admin/super_admin in `profiles`.
//  - A per-admin daily limit caps spending (AI_DAILY_LIMIT, default 40).
//  - Nothing here writes plans or publishes anything; the admin always reviews and approves in the app.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";
const DAILY_LIMIT = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "40");
const AREA = Deno.env.get("AI_HOME_AREA") ?? "Orlando, Florida";
const TM_CITY = Deno.env.get("AI_TM_CITY") ?? "Orlando";
const TM_STATE = Deno.env.get("AI_TM_STATE") ?? "FL";
const TM_RADIUS_MILES = Deno.env.get("AI_TM_RADIUS") ?? "40";
const MAX_TM = 10;
const MAX_PLACES = 8;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const CODES = ["Social", "Wellness", "Faith", "Adventure", "Family", "Connection", "Support", "Recharge"];

const BRAND = `Código Mujer Libre is a small, bilingual (Spanish/English) community app for women in workplace groups in the ${AREA} area. ` +
  `Its "códigos" (categories) are: Social (outings, happy hours, dinners), Wellness, Faith, Adventure (experiences, trips), Family, ` +
  `Connection (meeting people), Support, Recharge (rest, self-care). Tone: warm, simple, inclusive, never salesy.`;

const diag: string[] = [];
const clean = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// ---------- OpenAI ----------
async function openaiJson(system: string, user: string): Promise<any> {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw Object.assign(new Error("not_configured"), { status: 503 });
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 3000,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    console.error("openai error", res.status, (await res.text()).slice(0, 400));
    throw Object.assign(new Error("upstream_error"), { status: res.status === 429 ? 429 : 502 });
  }
  const data = await res.json();
  try { return JSON.parse(data.choices?.[0]?.message?.content ?? "{}"); } catch { return {}; }
}

// ---------- Ticketmaster Discovery ----------
type Candidate = {
  id: string; source: "ticketmaster" | "places";
  name: string; date: string; time: string; location: string; price: string;
  url: string; image_url: string; hint: string;
};

function to12h(t: string): string {
  const m = /^(\d{2}):(\d{2})/.exec(t || ""); if (!m) return "";
  let h = Number(m[1]); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return `${h}:${m[2]} ${ap}`;
}
const money = (n: number, cur: string) => (cur === "USD" ? "$" : "") + (Number.isInteger(n) ? n : n.toFixed(2)) + (cur === "USD" ? "" : " " + cur);

async function searchTicketmaster(keyword: string, from: string, to: string): Promise<Candidate[]> {
  const key = Deno.env.get("TICKETMASTER_API_KEY");
  if (!key) return [];
  const u = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  const p: Record<string, string> = {
    apikey: key, city: TM_CITY, stateCode: TM_STATE, radius: TM_RADIUS_MILES, unit: "miles",
    size: String(MAX_TM), sort: "date,asc", locale: "*",
    startDateTime: `${from}T00:00:00Z`,
  };
  if (to) p.endDateTime = `${to}T23:59:59Z`;
  if (keyword) p.keyword = keyword;
  for (const [k, v] of Object.entries(p)) u.searchParams.set(k, v);
  const res = await fetch(u);
  if (!res.ok) { console.error("ticketmaster", res.status, (await res.text()).slice(0, 200)); diag.push(`Ticketmaster error ${res.status}`); return []; }
  const data = await res.json();
  const events = data?._embedded?.events ?? [];
  diag.push(`Ticketmaster ${events.length} events`);
  return events.map((e: any, i: number): Candidate => {
    const v = e?._embedded?.venues?.[0];
    const pr = e?.priceRanges?.[0];
    const imgs = (e?.images ?? []).filter((x: any) => x?.url && x?.ratio === "16_9").sort((a: any, b: any) => (b.width ?? 0) - (a.width ?? 0));
    const img = imgs.find((x: any) => (x.width ?? 0) <= 1100) ?? imgs[0];
    const cls = e?.classifications?.[0];
    return {
      id: `tm${i}`, source: "ticketmaster",
      name: clean(e?.name, 160),
      date: /^\d{4}-\d{2}-\d{2}$/.test(e?.dates?.start?.localDate ?? "") ? e.dates.start.localDate : "",
      time: to12h(e?.dates?.start?.localTime ?? ""),
      location: [v?.name, v?.city?.name].filter(Boolean).join(", "),
      price: pr && typeof pr.min === "number"
        ? (pr.max && pr.max !== pr.min ? `${money(pr.min, pr.currency)}–${money(pr.max, pr.currency)}` : money(pr.min, pr.currency))
        : "",
      url: typeof e?.url === "string" && e.url.startsWith("https://") ? e.url : "",
      image_url: img?.url && String(img.url).startsWith("https://") ? img.url : "",
      hint: [cls?.segment?.name, cls?.genre?.name].filter((x: string) => x && x !== "Undefined").join(" / "),
    };
  }).filter((c: Candidate) => c.name);
}

// ---------- Google Places (New) ----------
async function searchPlaces(queries: string[]): Promise<Candidate[]> {
  const key = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!key || !queries.length) return [];
  const seen = new Set<string>();
  const out: Candidate[] = [];
  for (const q of queries.slice(0, 2)) {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", "X-Goog-Api-Key": key,
        // Only basic fields on purpose: keeps the cost on the cheapest tier.
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.primaryTypeDisplayName",
      },
      body: JSON.stringify({ textQuery: `${q} near ${AREA}`, maxResultCount: MAX_PLACES, languageCode: "en" }),
    });
    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      console.error("places", res.status, body);
      diag.push(`Google Places error ${res.status}: ${body.replace(/\s+/g, " ").slice(0, 160)}`);
      continue;
    }
    const data = await res.json();
    diag.push(`Google Places ${(data?.places ?? []).length} places`);
    for (const p of data?.places ?? []) {
      if (!p?.id || seen.has(p.id)) continue;
      seen.add(p.id);
      out.push({
        id: `pl${out.length}`, source: "places",
        name: clean(p?.displayName?.text, 160), date: "", time: "",
        location: clean(p?.formattedAddress, 200), price: "",
        url: typeof p?.googleMapsUri === "string" && p.googleMapsUri.startsWith("https://") ? p.googleMapsUri : "",
        image_url: "", hint: clean(p?.primaryTypeDisplayName?.text, 60),
      });
      if (out.length >= MAX_PLACES) break;
    }
  }
  return out.filter((c) => c.name);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    // 1. Who is calling? Must be a logged-in admin.
    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supaUrl, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const service = createClient(supaUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: prof } = await service.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!prof || !["admin", "super_admin"].includes(prof.role)) return json({ error: "forbidden" }, 403);

    // 2. Daily limit (cost control)
    const day = new Date().toISOString().slice(0, 10);
    const { data: usage } = await service.from("ai_usage").select("count").eq("user_id", user.id).eq("day", day).maybeSingle();
    const used = usage?.count ?? 0;
    if (used >= DAILY_LIMIT) return json({ error: "daily_limit" }, 429);
    await service.from("ai_usage").upsert({ user_id: user.id, day, count: used + 1 }, { onConflict: "user_id,day" });

    const input = await req.json().catch(() => ({}));
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const system = `${BRAND}\nToday's date in ${AREA} is ${today}. You help the administrator PREPARE content; a human reviews everything before it is published.`;

    // 3a. Discover real, current options
    if (input.action === "discover") {
      const query = clean(input.query, 300);
      if (!query) return json({ error: "missing_query" }, 400);
      const code = CODES.includes(input.code) ? input.code : "";

      // Step 1: turn the request into precise search terms
      const plan = await openaiJson(
        system,
        `Administrator request: "${query}"${code ? `\nPreferred código: ${code}` : ""}\n` +
        `Create search terms for two sources near ${AREA}. Return JSON: ` +
        `{"ticketmaster_keyword":"1-3 words for live events/shows/sports/festivals, or empty for any","places_queries":["up to 2 short place searches such as 'rooftop bar' or 'spa day'"],` +
        `"from":"YYYY-MM-DD earliest date (today or later)","to":"YYYY-MM-DD latest date or empty"}`,
      );
      const dateOk = (d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
      const from = dateOk(plan.from) && plan.from >= today ? plan.from : today;
      const to = dateOk(plan.to) && plan.to >= from ? plan.to : "";
      const placeQs = (Array.isArray(plan.places_queries) ? plan.places_queries : []).map((x: unknown) => clean(x, 80)).filter(Boolean);

      // Step 2: fetch real data
      diag.length = 0;
      const tmSearch = async () => {
        const first = await searchTicketmaster(clean(plan.ticketmaster_keyword, 60), from, to);
        return first.length || !plan.ticketmaster_keyword ? first : await searchTicketmaster("", from, to);
      };
      const [tm, pl] = await Promise.all([
        tmSearch().catch((e) => { diag.push("Ticketmaster failed: " + (e as Error).message); return [] as Candidate[]; }),
        searchPlaces(placeQs.length ? placeQs : [query]).catch((e) => { diag.push("Places failed: " + (e as Error).message); return [] as Candidate[]; }),
      ]);
      const candidates = [...tm.slice(0, MAX_TM), ...pl.slice(0, MAX_PLACES)];
      const configured = Boolean(Deno.env.get("TICKETMASTER_API_KEY")) || Boolean(Deno.env.get("GOOGLE_PLACES_API_KEY"));
      if (!candidates.length) {
        return json({ results: [], note: configured ? "No matches found. Try a broader request. (" + diag.join("; ") + ")" : "Search sources are not configured yet (Ticketmaster / Google Places keys)." });
      }

      // Step 3: OpenAI writes the cards, using ONLY the facts given
      const facts = candidates.map((c) => ({ id: c.id, source: c.source, name: c.name, type: c.hint, date: c.date, time: c.time, where: c.location, price: c.price }));
      const cards = await openaiJson(
        system,
        `Administrator request: "${query}"\n` +
        `Here are REAL candidates found through Ticketmaster and Google Places (JSON): ${JSON.stringify(facts)}\n\n` +
        `Pick up to 8 that best fit the request and the Código Mujer Libre audience, skipping anything unsuitable. ` +
        `For each, write warm 1-2 sentence descriptions in Spanish and English using ONLY the given facts. ` +
        `Never add dates, prices, venues, performers, or claims that are not in the data. ` +
        `Return JSON: {"results":[{"id":"candidate id","code":"one of ${CODES.join("|")}","title_es":"","title_en":"","desc_es":"","desc_en":"","kind":"event"}],"note":"one short sentence on anything uncertain"}`,
      );
      const byId = new Map(candidates.map((c) => [c.id, c]));
      const used_ids = new Set<string>();
      const results = (Array.isArray(cards?.results) ? cards.results : []).flatMap((r: any) => {
        const c = byId.get(String(r?.id));
        if (!c || used_ids.has(c.id)) return [];
        used_ids.add(c.id);
        return [{
          kind: "event",
          code: CODES.includes(r.code) ? r.code : (code || ""),
          title_es: clean(r.title_es, 140) || c.name, title_en: clean(r.title_en, 140) || c.name,
          desc_es: clean(r.desc_es, 600), desc_en: clean(r.desc_en, 600),
          date: c.date, time: c.time, date_text: "",
          location: c.location, price: c.price,
          url: c.url, url_verified: Boolean(c.url),     // links come straight from the APIs
          image_url: c.image_url,
          source: c.source === "ticketmaster" ? "Ticketmaster" : "Google Places",
        }];
      }).slice(0, 8);
      return json({ results, note: clean(cards?.note, 300) });
    }

    // 3b. Polish / translate / suggest code
    if (input.action === "polish") {
      const f = {
        code: clean(input.code, 20), kind: clean(input.kind, 20),
        title_es: clean(input.title_es, 200), title_en: clean(input.title_en, 200),
        desc_es: clean(input.desc_es, 1500), desc_en: clean(input.desc_en, 1500),
      };
      const out = await openaiJson(
        system,
        `Improve this event card for the app. Keep every fact exactly as given (do not add dates, prices, places or claims). ` +
        `Fill in whichever Spanish/English fields are empty by translating the other language; improve wording of the rest: short, warm, clear. ` +
        `If code is empty, suggest the best one of: ${CODES.join(", ")}.\n` +
        `Input: ${JSON.stringify(f)}\n` +
        `Return JSON: {"code":"","title_es":"","title_en":"","desc_es":"","desc_en":""}`,
      );
      return json({
        code: CODES.includes(out.code) ? out.code : "",
        title_es: clean(out.title_es, 140), title_en: clean(out.title_en, 140),
        desc_es: clean(out.desc_es, 600), desc_en: clean(out.desc_en, 600),
      });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (e) {
    const status = (e as { status?: number }).status ?? 500;
    console.error("ai-assist failed:", (e as Error).message);
    return json({ error: (e as Error).message || "error", status }, status === 429 ? 429 : status === 503 ? 503 : 500);
  }
});
