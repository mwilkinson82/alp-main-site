// Pulls new recordings + Gemini transcripts from the shared Drive folder
// and inserts them into public.recordings. Idempotent: dedupes on video_ref.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GOOGLE_DRIVE_API_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Shared folder where Power Hour / Contractor School / Sales & Marketing
// recordings + Gemini transcript Docs land.
const DRIVE_FOLDER_ID = "1L6oYkecAzBPowfYfMZ82c8UF-Ctpgn2E";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
};

// Classify a filename to a class_type by prefix. Returns null for non-class files.
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

// Extract YYYY-MM-DD from filenames like "... - 2026/06/22 08:00 GMT-04:00 - Recording"
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

function makeTitle(classType: ClassType, isoDate: string, part?: number | null) {
  const d = new Date(isoDate + "T00:00:00");
  const human = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const base = `${CLASS_LABEL[classType]} — ${human}`;
  return part ? `${base} (Part ${part})` : base;
}

async function listFolder(folderId: string): Promise<DriveFile[]> {
  // Pull the last 30 days of items so a missed sync still backfills.
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed=false and modifiedTime > '${since}'`
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY || !GOOGLE_DRIVE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing Drive credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const files = await listFolder(DRIVE_FOLDER_ID);

    // Bucket files by (class, date)
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

    // Fetch existing rows for these dates to dedupe
    const { data: existing } = await supabase
      .from("recordings")
      .select("video_ref")
      .eq("video_source", "google_drive");
    const existingIds = new Set<string>();
    for (const r of existing ?? []) {
      const m = (r as { video_ref: string }).video_ref?.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m) existingIds.add(m[1]);
    }

    const inserted: Array<{ class_type: ClassType; date: string; part?: number }> = [];
    const skipped: Array<{ reason: string; name: string }> = [];

    for (const [key, b] of buckets) {
      const [cls, date] = key.split("|") as [ClassType, string];
      if (b.videos.length === 0) {
        skipped.push({ reason: "no_video", name: key });
        continue;
      }
      // Sort videos chronologically for stable part numbering
      b.videos.sort((a, c) => a.createdTime.localeCompare(c.createdTime));
      const total = b.videos.length;
      // Use the most recent doc as the transcript pair (Gemini may produce one combined doc)
      const transcript = b.docs.sort((a, c) =>
        c.createdTime.localeCompare(a.createdTime)
      )[0];
      const transcriptDocId = transcript?.id ?? null;

      for (let i = 0; i < b.videos.length; i++) {
        const v = b.videos[i];
        if (existingIds.has(v.id)) continue;
        const part = total > 1 ? i + 1 : null;
        const row = {
          title: makeTitle(cls, date, part),
          class_type: cls,
          recording_date: date,
          video_source: "google_drive" as const,
          video_ref: `https://drive.google.com/file/d/${v.id}/view?usp=sharing`,
          transcript_doc_id: transcriptDocId,
          part_number: part,
          part_total: total > 1 ? total : null,
          is_published: true,
        };
        const { error } = await supabase.from("recordings").insert(row);
        if (error) {
          skipped.push({ reason: `insert_error:${error.message}`, name: v.name });
        } else {
          inserted.push({ class_type: cls, date, part: part ?? undefined });
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-recordings error", e);
    return new Response(
      JSON.stringify({ error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
