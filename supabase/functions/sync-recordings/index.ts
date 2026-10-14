// sync-recordings: imports class recordings from the three mapped Drive folders.
// Modes (POST JSON body):
//   {}                                   scheduled (cron). Imports only if recording_sync_settings.scheduled_import_enabled.
//   { mode:"dry_run", date_from, date_to }   admin only. Read-only: no DB writes, no permission changes.
//   { mode:"backfill", date_from, date_to, max_inserts? }  admin only. Bounded batch import.
//   { mode:"retitle", recording_id }     admin only.
// Never creates or modifies Drive sharing; files not already link-shared are held.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { Budget, makeDrive } from "./drive.ts";
import { ISO_DATE, type ClassType, type PlanItem } from "./logic.ts";
import { PersistenceError, runSync, type Store } from "./sync.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GOOGLE_DRIVE_API_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
// Private shared secret for the cron caller. Not configured yet => scheduled calls from cron fail closed.
const CRON_SECRET = Deno.env.get("SYNC_RECORDINGS_CRON_SECRET") ?? "";
const CRON_HEADER = "x-sync-cron-secret";

function timingSafeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

/** True only when the dedicated cron secret is configured, is not a public key, and matches exactly. */
export function cronAuthorized(header: string | null, secret: string, publicKeys: string[]): boolean {
  if (!secret || secret.length < 32 || publicKeys.includes(secret)) return false;
  if (!header) return false;
  return timingSafeEqual(header, secret);
}

const TOTAL_BUDGET_MS = 110_000;
const STALE_RUN_MS = 10 * 60_000;
const DEFAULT_MAX_INSERTS = 15;

const CLASS_LABEL: Record<ClassType, string> = {
  power_hour: "Power Hour",
  contractor_school: "Contractor School",
  sales_marketing_school: "Sales & Marketing School",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function humanDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
function fullTitle(cls: ClassType, date: string, topic: string | null, part?: number | null) {
  const base = `${CLASS_LABEL[cls]} — ${humanDate(date)}${part ? ` (Part ${part})` : ""}`;
  return topic ? `${base}: ${topic}` : base;
}

async function generateTopic(cls: ClassType, transcript: string, budget: Budget): Promise<string | null> {
  if (budget.remaining() < 20_000) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15_000);
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY!, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You write very short, specific session titles. Reply with ONLY the title text — no quotes, no trailing punctuation, no labels, no markdown. Max 8 words. Do NOT include the date or the class name." },
          { role: "user", content: `Transcript / Gemini notes from a "${CLASS_LABEL[cls]}" session. Write a short specific title (max 8 words).\n\n${transcript.slice(0, 12_000)}` },
        ],
      }),
    }).finally(() => clearTimeout(t));
    if (!res.ok) { await res.text(); return null; }
    let text: string | undefined = (await res.json())?.choices?.[0]?.message?.content;
    if (typeof text !== "string") return null;
    text = text.trim().replace(/^["'`]+|["'`]+$/g, "").replace(/[.!?]+$/, "").trim();
    return text && text.length <= 120 ? text : null;
  } catch {
    return null;
  }
}

function supabaseStore(sb: any): Store {
  return {
    async loadExisting() {
      const out: any[] = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await sb.from("recordings")
          .select("cloudflare_video_id,video_ref,class_type,recording_date,part_number,part_total").range(from, from + 999);
        if (error) throw new Error(`Dedupe lookup failed: ${error.message}`);
        out.push(...(data ?? []));
        if (!data || data.length < 1000) return out;
      }
    },
    async acquireRun(meta) {
      // Expire abandoned runs (crash/timeout) so the lock can't wedge forever.
      const { error: staleErr } = await sb.from("recording_sync_runs").update({ status: "abandoned", finished_at: new Date().toISOString() })
        .eq("status", "running").lt("heartbeat_at", new Date(Date.now() - STALE_RUN_MS).toISOString());
      if (staleErr) throw new Error(`Could not check stale runs: ${staleErr.message}`);
      const { data, error } = await sb.from("recording_sync_runs").insert({ ...meta, status: "running" }).select("id").single();
      if (error) {
        if (error.code === "23505") return null;
        throw new Error(`Could not start run: ${error.message}`);
      }
      return data.id as string;
    },
    async heartbeat(id, patch) {
      const { error } = await sb.from("recording_sync_runs").update({ ...patch, heartbeat_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(`Run heartbeat failed: ${error.message}`);
    },
    async finishRun(id, patch) {
      const { error } = await sb.from("recording_sync_runs").update(patch).eq("id", id);
      if (error) throw new Error(`Run finish failed: ${error.message}`);
    },
    async insert(row) {
      const { error } = await sb.from("recordings").insert(row);
      if (!error) return { ok: true };
      return { ok: false, duplicate: error.code === "23505", error: error.message };
    },
    async countByDriveIds(ids) {
      const { count, error } = await sb.from("recordings").select("id", { count: "exact", head: true })
        .eq("video_source", "google_drive").in("cloudflare_video_id", ids);
      if (error) throw new Error(`Verification failed: ${error.message}`);
      return count ?? 0;
    },
  };
}

async function isAdminCaller(req: Request, admin: any): Promise<{ admin: boolean; userId?: string }> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token === SUPABASE_ANON_KEY) return { admin: false };
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: auth } } });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user) return { admin: false };
  const { data: ok } = await admin.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return { admin: ok === true, userId: data.user.id };
}

const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  if (!LOVABLE_API_KEY || !GOOGLE_DRIVE_API_KEY) return json({ error: "Missing Drive credentials" }, 500);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body = scheduled */ }
  const mode = (body.mode as string | undefined) ?? "scheduled";

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const caller = await isAdminCaller(req, sb);

  if (mode !== "scheduled" && !caller.admin) return json({ error: "Admin authentication required" }, 401);
  if (mode === "scheduled" && !caller.admin) {
    if (!CRON_SECRET) {
      console.warn("scheduled call rejected: SYNC_RECORDINGS_CRON_SECRET not configured");
      return json({ ok: false, status: "blocked_configuration", error: "Scheduled sync is not configured (cron secret missing)" }, 503);
    }
    if (!cronAuthorized(req.headers.get(CRON_HEADER), CRON_SECRET, [SUPABASE_ANON_KEY])) {
      return json({ error: "Unauthorized" }, 401);
    }
    if (Object.keys(body).length > 0) return json({ error: "Parameters not allowed for scheduled runs" }, 400);
  }

  const budget = new Budget(Date.now() + TOTAL_BUDGET_MS);
  const drive = makeDrive(
    { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY },
    { fetch, budget, timeoutMs: 20_000, retries: 3, baseDelayMs: 750 },
  );
  const titleFor = async (it: PlanItem) => {
    const text = it.transcript_doc_id ? await drive.exportText(it.transcript_doc_id) : null;
    const topic = text ? await generateTopic(it.class_type, text, budget) : null;
    return fullTitle(it.class_type, it.date, topic, it.part_number);
  };

  try {
    if (mode === "retitle") {
      const id = body.recording_id;
      if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "recording_id required" }, 400);
      const { data: rec, error } = await sb.from("recordings")
        .select("id,class_type,recording_date,part_number,transcript_doc_id").eq("id", id).single();
      if (error || !rec) return json({ error: error?.message ?? "Recording not found" }, 404);
      if (!rec.transcript_doc_id) return json({ error: "No transcript on this recording yet." }, 400);
      const text = await drive.exportText(rec.transcript_doc_id);
      if (!text) return json({ error: "Could not read transcript from Drive." }, 502);
      const topic = await generateTopic(rec.class_type, text, budget);
      if (!topic) return json({ error: "AI did not return a usable title." }, 502);
      const title = fullTitle(rec.class_type, rec.recording_date, topic, rec.part_number);
      const { error: upErr } = await sb.from("recordings").update({ title }).eq("id", id);
      if (upErr) return json({ error: upErr.message }, 500);
      return json({ ok: true, title });
    }

    if (mode === "dry_run" || mode === "backfill") {
      const from = body.date_from, to = body.date_to;
      if (typeof from !== "string" || typeof to !== "string" || !ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) {
        return json({ error: "date_from and date_to (YYYY-MM-DD, from <= to) are required" }, 400);
      }
      const maxInserts = Math.min(Math.max(Number(body.max_inserts ?? DEFAULT_MAX_INSERTS) || DEFAULT_MAX_INSERTS, 1), 25);
      const result = await runSync(drive, supabaseStore(sb), {
        mode, dateFrom: from, dateTo: to, maxInserts, triggeredBy: `admin:${caller.userId}`, titleFor,
      });
      return json(result, result.ok === false && (result as any).status === "locked" ? 409 : 200);
    }

    if (mode !== "scheduled") return json({ error: `Unknown mode ${mode}` }, 400);

    // Scheduled: answer the cron immediately (pg_net times out at 5s) and finish in the background.
    const { data: settings, error: sErr } = await sb.from("recording_sync_settings").select("scheduled_import_enabled").eq("id", true).maybeSingle();
    if (sErr) return json({ error: sErr.message }, 500);
    if (!settings?.scheduled_import_enabled) {
      const { error: logErr } = await sb.from("recording_sync_runs").insert({ mode: "scheduled", status: "skipped_disabled", triggered_by: caller.admin ? `admin:${caller.userId}` : "cron", finished_at: new Date().toISOString() });
      return json({
        ok: false, status: "paused", inserted_count: 0,
        error: "Automatic recording imports are paused pending review. Nothing was imported." +
          (logErr ? ` (Also failed to record this run: ${logErr.message})` : ""),
      }, 409);
    }
    const work = runSync(drive, supabaseStore(sb), {
      mode: "scheduled", dateFrom: isoDaysAgo(30), dateTo: isoDaysAgo(-1), maxInserts: DEFAULT_MAX_INSERTS,
      triggeredBy: caller.admin ? `admin:${caller.userId}` : "cron", titleFor,
    }).catch((e) => console.error("scheduled sync failed", e));
    // @ts-ignore EdgeRuntime is provided by the Supabase runtime
    if (typeof EdgeRuntime !== "undefined") { EdgeRuntime.waitUntil(work); return json({ ok: true, status: "accepted" }, 202); }
    return json(await work);
  } catch (e) {
    console.error("sync-recordings error", e);
    return json({ ok: false, status: e instanceof PersistenceError ? "persistence_failed" : "failed", error: String((e as Error).message ?? e) }, 500);
  }
});
