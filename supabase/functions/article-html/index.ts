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

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("<html><body><h1>400 — slug parameter required</h1></body></html>", {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    return new Response(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Article Not Found</title></head><body><h1>404 — Article not found</h1><p>The article "${escapeHtml(slug)}" does not exist or is not published.</p><p><a href="${SITE_URL}/insights">Browse all insights</a></p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders } }
    );
  }

  const title = escapeHtml(post.meta_title || post.title);
  const description = escapeHtml(post.meta_description || post.excerpt || "");
  const canonicalUrl = `${SITE_URL}/insights/${post.slug}`;
  const image = post.featured_image_url || `${SITE_URL}/og-image.jpg`;
  const publishedAt = post.published_at || post.created_at;
  const updatedAt = post.updated_at || publishedAt;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || "",
    url: canonicalUrl,
    datePublished: publishedAt,
    dateModified: updatedAt,
    image: image,
    author: {
      "@type": "Person",
      name: "Marshall Wilkinson",
      url: SITE_URL,
      jobTitle: "Business Coach, Strategic Consultant & Founder",
      sameAs: ["https://www.marshallwilkinson.com"],
    },
    publisher: {
      "@type": "Organization",
      name: "ALP - Altitude Logic Pressure",
      url: SITE_URL,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Marshall Wilkinson</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title} | Marshall Wilkinson">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${escapeHtml(image)}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title} | Marshall Wilkinson">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(image)}">

  <!-- JSON-LD -->
  <script type="application/ld+json">${jsonLd}</script>

  <style>
    body { font-family: Georgia, serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.7; color: #1a1a1a; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    .content img { max-width: 100%; height: auto; }
    a { color: #1a1a1a; }
    .back { margin-top: 3rem; font-size: 0.9rem; }
  </style>
</head>
<body>
  <article>
    <h1>${escapeHtml(post.title)}</h1>
    <p class="meta">By Marshall Wilkinson${publishedAt ? ` · ${new Date(publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : ""}</p>
    <div class="content">${post.content}</div>
  </article>
  <p class="back"><a href="${SITE_URL}/insights">← All Insights</a></p>
  <noscript><p>This is a pre-rendered version for crawlers. <a href="${canonicalUrl}">Visit the full page</a>.</p></noscript>
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
