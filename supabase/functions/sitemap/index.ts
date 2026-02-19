import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/xml",
  "Cache-Control": "public, max-age=3600",
};

const SITE_URL = "https://altitudelogicpressure.com";

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/programs", changefreq: "weekly", priority: "0.9" },
  { loc: "/power-hour", changefreq: "weekly", priority: "0.9" },
  { loc: "/coaching", changefreq: "weekly", priority: "0.9" },
  { loc: "/ask-marshall", changefreq: "weekly", priority: "0.9" },
  { loc: "/alp-university", changefreq: "weekly", priority: "0.9" },
  { loc: "/contractor-school", changefreq: "weekly", priority: "0.8" },
  { loc: "/sales-marketing-school", changefreq: "weekly", priority: "0.8" },
  { loc: "/handbook-special", changefreq: "monthly", priority: "0.7" },
  { loc: "/insights", changefreq: "daily", priority: "0.8" },
  { loc: "/privacy-policy", changefreq: "monthly", priority: "0.3" },
  { loc: "/terms-of-service", changefreq: "monthly", priority: "0.3" },
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const today = new Date().toISOString().split("T")[0];

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const staticEntries = staticPages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const blogEntries = (posts || [])
    .map(
      (post) => `  <url>
    <loc>${SITE_URL}/insights/${post.slug}</loc>
    <lastmod>${(post.updated_at || post.published_at || today).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
