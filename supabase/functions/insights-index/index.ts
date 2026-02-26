import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://altitudelogicpressure.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, published_at, featured_image_url")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const articles = (posts || [])
    .map((p) => {
      const date = p.published_at
        ? new Date(p.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "";
      return `    <li>
      <h2><a href="${SITE_URL}/insights/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2>
      ${date ? `<time>${date}</time>` : ""}
      ${p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : ""}
    </li>`;
    })
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insights | Marshall Wilkinson</title>
  <meta name="description" content="Business insights, leadership strategies, and growth frameworks from Marshall Wilkinson — elite business coach and strategic consultant.">
  <link rel="canonical" href="${SITE_URL}/insights">

  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE_URL}/insights">
  <meta property="og:title" content="Insights | Marshall Wilkinson">
  <meta property="og:description" content="Business insights, leadership strategies, and growth frameworks from Marshall Wilkinson.">

  <style>
    body { font-family: Georgia, serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.7; color: #1a1a1a; }
    h1 { font-size: 2rem; margin-bottom: 1.5rem; }
    ul { list-style: none; padding: 0; }
    li { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #eee; }
    li:last-child { border-bottom: none; }
    h2 { font-size: 1.3rem; margin: 0 0 0.25rem; }
    h2 a { color: #1a1a1a; text-decoration: none; }
    h2 a:hover { text-decoration: underline; }
    time { color: #666; font-size: 0.85rem; }
    p { margin: 0.5rem 0 0; color: #444; }
  </style>
</head>
<body>
  <h1>Insights by Marshall Wilkinson</h1>
  <p>Business coaching insights, leadership strategies, and growth frameworks.</p>
  <ul>
${articles}
  </ul>
  <noscript><p>This is a pre-rendered index for crawlers. <a href="${SITE_URL}/insights">Visit the full page</a>.</p></noscript>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...corsHeaders,
    },
  });
});
