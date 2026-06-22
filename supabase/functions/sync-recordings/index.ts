// Pulls new recordings + Gemini transcripts from the shared Drive folder
// and inserts them into public.recordings. Idempotent: dedupes on video_ref.
// Also supports { mode: "retitle", recording_id } to regenerate a single title.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GOOGLE_DRIVE_API_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const DRIVE_FOLDER_ID = "1L6oYkecAzBPowfYfMZ82c8UF-Ctpgn2E";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
};

function classify(name: string): ClassType | null {
  const n = name.toLowerCase();
  if (n.startsWith("alp hardcore power hour") || n.startsWith("alp power hour")) {
    return "power_hour";
  }
  if (n.startsWith("alp contractor school")) return "contractor_school";
  if (
    n.startsWith("alp sales and marketing") ||
    n.startsWith("alp sales & marketing") ||
    n.startsWith("alp sales marketing")
  ) {
    return "sales_marketing_school";
  }
  return null;
}

function extractDate(name: string): string | null {
  const m = name.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function isVideo(f: DriveFile): boolean {
  return f.mimeType.startsWith("video/");
}
function isDoc(f: DriveFile): boolean {
  return f.mimeType === "application/vnd.google-apps.document";
}

const CLASS_LABEL: Record<ClassType, string> = {
  power_hour: "Power Hour",
  contractor_school: "Contractor School",
  sales_marketing_school: "Sales & Marketing School",
};

function formatHumanDate(isoDate: string) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function baseTitle(classType: ClassType, isoDate: string, part?: number | null) {
  const base = `${CLASS_LABEL[classType]} — ${formatHumanDate(isoDate)}`;
  return part ? `${base} (Part ${part})` : base;
}

function fullTitle(
  classType: ClassType,
  isoDate: string,
  topic: string | null,
  part?: number | null,
) {
  const base = baseTitle(classType, isoDate, part);
  if (!topic) return base;
  return `${base}: ${topic}`;
}

async function listFolder(folderId: string): Promise<DriveFile[]> {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed=false and modifiedTime > '${since}'`,
  );
  const url =
    `https://connector-gateway.lovable.dev/google_drive/drive/v3/files` +
    `?q=${q}&pageSize=200&fields=files(id,name,mimeType,createdTime)&orderBy=createdTime`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY!,
    },
  });
  if (!res.ok) {
    throw new Error(`Drive list failed ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return (json.files ?? []) as DriveFile[];
}

// Flatten a Google Docs document body to plain text.
async function fetchDocText(docId: string): Promise<string | null> {
  try {
    const url = `https://connector-gateway.lovable.dev/google_docs/v1/documents/${docId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY!,
      },
    });
    if (!res.ok) {
      console.warn("docs fetch failed", docId, res.status, await res.text());
      return null;
    }
    const doc = await res.json();
    const parts: string[] = [];
    for (const el of doc?.body?.content ?? []) {
      const p = el?.paragraph;
      if (!p) continue;
      for (const r of p.elements ?? []) {
        const t = r?.textRun?.content;
        if (t) parts.push(t);
      }
    }
    const text = parts.join("").replace(/\n{3,}/g, "\n\n").trim();
    return text || null;
  } catch (e) {
    console.warn("fetchDocText error", e);
    return null;
  }
}

// Ask Lovable AI for a short topical title. Returns null on any failure.
async function generateTopicTitle(
  classType: ClassType,
  transcript: string,
): Promise<string | null> {
  try {
    const excerpt = transcript.slice(0, 12_000);
    const className = CLASS_LABEL[classType];
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY!,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You write very short, specific session titles. Reply with ONLY the title text — no quotes, no punctuation at the end, no labels, no markdown. Max 8 words. Do NOT include the date or the class name.",
          },
          {
            role: "user",
            content:
              `This is a transcript / Gemini notes from a "${className}" session. ` +
              `Write a short, specific title (max 8 words) capturing the main topic discussed.\n\n` +
              `Transcript / notes:\n${excerpt}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.warn("ai title failed", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    let text: string | undefined = json?.choices?.[0]?.message?.content;
    if (!text || typeof text !== "string") return null;
    text = text.trim().replace(/^["'`]+|["'`]+$/g, "").replace(/[.!?]+$/, "").trim();
    // Sanity: drop if absurdly long or empty
    if (!text || text.length > 120) return null;
    return text;
  } catch (e) {
    console.warn("generateTopicTitle error", e);
    return null;
  }
}

async function retitleOne(
  supabase: ReturnType<typeof createClient>,
  recordingId: string,
) {
  const { data: rec, error } = await supabase
    .from("recordings")
    .select("id,class_type,recording_date,part_number,transcript_doc_id")
    .eq("id", recordingId)
    .single();
  if (error || !rec) throw new Error(error?.message ?? "Recording not found");
  if (!rec.transcript_doc_id) {
    throw new Error("No transcript on this recording yet — try again later.");
  }
  const text = await fetchDocText(rec.transcript_doc_id);
  if (!text) throw new Error("Could not read transcript from Drive.");
  const topic = await generateTopicTitle(rec.class_type as ClassType, text);
  if (!topic) throw new Error("AI did not return a usable title.");
  const newTitle = fullTitle(
    rec.class_type as ClassType,
    rec.recording_date as string,
    topic,
    (rec.part_number as number | null) ?? undefined,
  );
  const { error: upErr } = await supabase
    .from("recordings")
    .update({ title: newTitle })
    .eq("id", recordingId);
  if (upErr) throw new Error(upErr.message);
  return newTitle;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY || !GOOGLE_DRIVE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing Drive credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Optional body for single-recording retitle
    let body: { mode?: string; recording_id?: string } = {};
    if (req.method === "POST") {
      try { body = await req.json(); } catch { /* empty body ok */ }
    }

    if (body.mode === "retitle" && body.recording_id) {
      const title = await retitleOne(supabase, body.recording_id);
      return new Response(
        JSON.stringify({ ok: true, title }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const files = await listFolder(DRIVE_FOLDER_ID);

    type Bucket = { videos: DriveFile[]; docs: DriveFile[] };
    const buckets = new Map<string, Bucket>();
    for (const f of files) {
      const cls = classify(f.name);
      if (!cls) continue;
      const date = extractDate(f.name);
      if (!date) continue;
      const key = `${cls}|${date}`;
      const b = buckets.get(key) ?? { videos: [], docs: [] };
      if (isVideo(f)) b.videos.push(f);
      else if (isDoc(f) && /notes by gemini/i.test(f.name)) b.docs.push(f);
      buckets.set(key, b);
    }

    const { data: existing } = await supabase
      .from("recordings")
      .select("video_ref")
      .eq("video_source", "google_drive");
    const existingIds = new Set<string>();
    for (const r of existing ?? []) {
      const m = (r as { video_ref: string }).video_ref?.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m) existingIds.add(m[1]);
    }

    const inserted: Array<{ class_type: ClassType; date: string; part?: number; ai_title?: boolean }> = [];
    const skipped: Array<{ reason: string; name: string }> = [];

    for (const [key, b] of buckets) {
      const [cls, date] = key.split("|") as [ClassType, string];
      if (b.videos.length === 0) {
        skipped.push({ reason: "no_video", name: key });
        continue;
      }
      b.videos.sort((a, c) => a.createdTime.localeCompare(c.createdTime));
      const total = b.videos.length;
      const transcript = b.docs.sort((a, c) =>
        c.createdTime.localeCompare(a.createdTime)
      )[0];
      const transcriptDocId = transcript?.id ?? null;

      // Generate one AI topic per (class, date) — shared across parts.
      let aiTopic: string | null = null;
      const hasNewVideo = b.videos.some((v) => !existingIds.has(v.id));
      if (hasNewVideo && transcriptDocId) {
        const text = await fetchDocText(transcriptDocId);
        if (text) aiTopic = await generateTopicTitle(cls, text);
      }

      for (let i = 0; i < b.videos.length; i++) {
        const v = b.videos[i];
        if (existingIds.has(v.id)) continue;
        const part = total > 1 ? i + 1 : null;
        const row = {
          title: fullTitle(cls, date, aiTopic, part),
          class_type: cls,
          recording_date: date,
          video_source: "google_drive" as const,
          video_ref: `https://drive.google.com/file/d/${v.id}/view?usp=sharing`,
          cloudflare_video_id: v.id,
          transcript_doc_id: transcriptDocId,
          part_number: part,
          part_total: total > 1 ? total : null,
          is_published: true,
        };
        const { error } = await supabase.from("recordings").insert(row);
        if (error) {
          skipped.push({ reason: `insert_error:${error.message}`, name: v.name });
        } else {
          inserted.push({ class_type: cls, date, part: part ?? undefined, ai_title: !!aiTopic });
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        scanned: files.length,
        inserted_count: inserted.length,
        inserted,
        skipped,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("sync-recordings error", e);
    return new Response(
      JSON.stringify({ error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
