// Fetches a Gemini meeting-notes Google Doc as HTML via the Lovable connector
// gateway. Auth-gated: only active clients (or admins) can read transcripts.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GOOGLE_DRIVE_API_KEY = Deno.env.get("GOOGLE_DRIVE_API_KEY");

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function cleanHtml(raw: string): string {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : raw;

  // Strip Google's class/id/style noise but keep structural tags.
  body = body.replace(/\sclass="[^"]*"/g, "");
  body = body.replace(/\sid="[^"]*"/g, "");
  body = body.replace(/\sstyle="[^"]*"/g, "");
  body = body.replace(/<span>([\s\S]*?)<\/span>/g, "$1");

  // Drop everything before the first "Summary" heading. The preamble (title,
  // "Invited ..." attendee list with emails, Attachments, Meeting records) all
  // lives above Summary and varies in structure (sometimes tables, sometimes
  // plain paragraphs), so anchoring on Summary is the most reliable cut.
  const summaryRe = /<h[1-6][^>]*>\s*Summary\s*<\/h[1-6]>/i;
  const summaryMatch = body.match(summaryRe);
  if (summaryMatch && summaryMatch.index !== undefined) {
    body = body.slice(summaryMatch.index);
  } else {
    // Fallback: at least strip any tables (older docs sometimes wrap the
    // attendee block in a table).
    body = body.replace(/<table[\s\S]*?<\/table>/gi, "");
  }

  // Cut everything from the verbatim transcript section onward. The transcript
  // section starts at an <h2> whose own text ends with "Transcript" (e.g.
  // "ALP Hardcore Power Hour - Transcript"). We iterate every <h2> and slice at
  // the first one whose text matches — this avoids greedy regex pulling in the
  // word "Transcript" from elsewhere.
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  let cutIdx = -1;
  while ((m = h2Re.exec(body)) !== null) {
    const text = stripTags(m[1]);
    if (/transcript/i.test(text)) {
      cutIdx = m.index;
      break;
    }
  }
  if (cutIdx >= 0) {
    body = body.slice(0, cutIdx);
  } else {
    // Fallback: cut from the first timestamp-style heading (00:00:12).
    const tsHeading = body.match(/<h3[^>]*>\s*\d{1,2}:\d{2}:\d{2}\s*<\/h3>/);
    if (tsHeading && tsHeading.index !== undefined) {
      body = body.slice(0, tsHeading.index);
    }
  }

  // Drop the leading "📝 Notes" stub line.
  body = body.replace(/<p>\s*(?:&#128221;|📝)\s*Notes\s*<\/p>/i, "");

  // Collapse empty paragraphs.
  body = body.replace(/<p>\s*(?:&nbsp;|\s)*\s*<\/p>/g, "");

  return body.trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Must be an active client (or admin) — reuse existing security-definer fn.
    const { data: allowed } = await supabase.rpc("is_active_client", {
      _user_id: user.id,
    });
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const docId: string | undefined = body?.docId;
    if (!docId || !/^[a-zA-Z0-9_-]{10,}$/.test(docId)) {
      return new Response(JSON.stringify({ error: "Invalid docId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LOVABLE_API_KEY || !GOOGLE_DRIVE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Drive connector not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${docId}/export?mimeType=text/html`;
    const driveRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY,
      },
    });

    if (!driveRes.ok) {
      const text = await driveRes.text();
      return new Response(
        JSON.stringify({ error: "Drive export failed", status: driveRes.status, detail: text.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const raw = await driveRes.text();
    const html = cleanHtml(raw);

    return new Response(JSON.stringify({ html }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
