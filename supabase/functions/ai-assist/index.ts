// Supabase Edge Function: ai-assist
// Admin-only AI helper for Código Mujer Libre.
//   action "discover": searches the live web for current events/places and returns structured options
//   action "polish":   rewrites / translates titles and descriptions (no web search)
//
// SECURITY
//  - The Anthropic key lives ONLY in the Supabase secret ANTHROPIC_API_KEY (never in the website code).
//  - Every call must carry a logged-in user's token AND that user must be admin/super_admin in `profiles`.
//  - A per-admin daily limit caps spending (see DAILY_LIMIT).
//  - Nothing here writes plans or publishes anything; the admin always reviews and approves in the app.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MODEL = Deno.env.get("AI_MODEL") ?? "claude-haiku-4-5";
// Web search tool version. If Anthropic retires this version, set AI_SEARCH_TOOL to the newer one.
const SEARCH_TOOL = Deno.env.get("AI_SEARCH_TOOL") ?? "web_search_20250305";
const DAILY_LIMIT = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "40");
const SEARCHES_PER_REQUEST = Number(Deno.env.get("AI_MAX_SEARCHES") ?? "5");
const AREA = Deno.env.get("AI_HOME_AREA") ?? "Orlando, Florida";

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

async function callClaude(system: string, user: string, useSearch: boolean) {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) throw Object.assign(new Error("not_configured"), { status: 503 });

  const messages: unknown[] = [{ role: "user", content: user }];
  const seenUrls = new Set<string>();
  let finalText = "";

  for (let turn = 0; turn < 3; turn++) {
    const body: Record<string, unknown> = { model: MODEL, max_tokens: 4096, system, messages };
    if (useSearch) {
      body.tools = [{
        type: SEARCH_TOOL, name: "web_search", max_uses: SEARCHES_PER_REQUEST,
        user_location: { type: "approximate", city: "Orlando", region: "Florida", country: "US" },
      }];
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("anthropic error", res.status, detail.slice(0, 500));
      throw Object.assign(new Error("upstream_error"), { status: res.status === 429 ? 429 : 502 });
    }
    const data = await res.json();
    for (const block of data.content ?? []) {
      if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        for (const r of block.content) if (r?.url) seenUrls.add(String(r.url));
      }
      if (block.type === "text" && typeof block.text === "string") finalText += block.text;
    }
    if (data.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: data.content });
      finalText = "";
      continue;
    }
    break;
  }
  return { text: finalText, seenUrls };
}

function extractJson(text: string): any {
  const tagged = text.match(/<json>([\s\S]*?)<\/json>/i);
  const raw = tagged ? tagged[1] : (text.match(/\{[\s\S]*\}/)?.[0] ?? "");
  try { return JSON.parse(raw); } catch { return null; }
}
const clean = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");
function urlIsFromSearch(url: string, seen: Set<string>): boolean {
  if (!url) return false;
  const norm = (u: string) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname).replace(/\/$/, ""); } catch { return ""; } };
  const target = norm(url);
  if (!target) return false;
  for (const s of seen) if (norm(s) === target) return true;
  return false;
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

    // 3a. Discover current options with live web search
    if (input.action === "discover") {
      const query = clean(input.query, 300);
      if (!query) return json({ error: "missing_query" }, 400);
      const code = CODES.includes(input.code) ? input.code : "";
      const prompt =
        `Administrator request: "${query}"${code ? `\nPreferred código: ${code}` : ""}\n\n` +
        `Use web search to find REAL, CURRENT options near ${AREA} that fit this request and the Código Mujer Libre categories. ` +
        `Only include things you actually found in search results; never invent venues, dates, prices or links. ` +
        `If a date, time or price is not clearly stated by the source, leave it empty rather than guessing. ` +
        `Prefer the official venue/event page as the url (it must be a page that appeared in your search results). ` +
        `Return up to 6 options as JSON inside <json></json> tags, exactly in this shape:\n` +
        `{"results":[{"kind":"event"|"trip","code":"one of ${CODES.join("|")}","title_es":"","title_en":"","desc_es":"1-2 warm sentences","desc_en":"1-2 warm sentences",` +
        `"date":"YYYY-MM-DD or empty","time":"e.g. 7:00 PM or empty","date_text":"tentative dates for trips or empty","location":"venue + city","price":"approximate, or empty","url":"official page"}],"note":"one short sentence on anything uncertain"}\n` +
        `Use kind "trip" only for multi-day getaway ideas. Write both Spanish and English versions.`;
      const { text, seenUrls } = await callClaude(system, prompt, true);
      const parsed = extractJson(text);
      const results = (Array.isArray(parsed?.results) ? parsed.results : []).slice(0, 6).map((r: any) => {
        const url = clean(r.url, 500);
        const verified = urlIsFromSearch(url, seenUrls);
        return {
          kind: r.kind === "trip" ? "trip" : "event",
          code: CODES.includes(r.code) ? r.code : "",
          title_es: clean(r.title_es, 140), title_en: clean(r.title_en, 140),
          desc_es: clean(r.desc_es, 600), desc_en: clean(r.desc_en, 600),
          date: /^\d{4}-\d{2}-\d{2}$/.test(r.date ?? "") ? r.date : "",
          time: clean(r.time, 60), date_text: clean(r.date_text, 80),
          location: clean(r.location, 200), price: clean(r.price, 80),
          url: verified ? url : "",          // links not seen in search results are dropped
          url_verified: verified,
        };
      }).filter((r: any) => r.title_es || r.title_en);
      return json({ results, note: clean(parsed?.note, 300) });
    }

    // 3b. Polish / translate / suggest code (no web search)
    if (input.action === "polish") {
      const f = {
        code: clean(input.code, 20), kind: clean(input.kind, 20),
        title_es: clean(input.title_es, 200), title_en: clean(input.title_en, 200),
        desc_es: clean(input.desc_es, 1500), desc_en: clean(input.desc_en, 1500),
      };
      const prompt =
        `Improve this event card for the app. Keep every fact exactly as given (do not add dates, prices, places or claims). ` +
        `Fill in whichever Spanish/English fields are empty by translating the other language; improve wording of the rest: short, warm, clear. ` +
        `If code is empty, suggest the best one of: ${CODES.join(", ")}.\n` +
        `Input: ${JSON.stringify(f)}\n` +
        `Return JSON inside <json></json>: {"code":"","title_es":"","title_en":"","desc_es":"","desc_en":""}`;
      const { text } = await callClaude(system, prompt, false);
      const out = extractJson(text) ?? {};
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
