

## Pre-rendering Insights Pages for AI Crawler Discoverability

### The Problem
Your site is a client-side rendered (CSR) React SPA. When an AI crawler (ChatGPT, Perplexity, Claude) or a basic bot hits `/insights/capital-allocation-is-leadership`, it gets an empty `<div id="root"></div>` and must execute JavaScript to see the content. Google handles this fine, but many AI crawlers do not.

### Why NOT Full SSR
Full SSR would mean migrating from Vite + React Router to Next.js or a similar framework. That is a massive architectural rewrite — not worth it for this use case.

### Recommended Approach: Edge Function Pre-renderer
Create a backend function that serves fully-rendered HTML for each article when requested by a bot. This gives crawlers the complete content without changing your SPA architecture at all.

**How it works:**
1. A new backend function at `/functions/v1/article-html/:slug` queries the database for the article and returns a complete HTML page with all meta tags, structured data, Open Graph tags, and the full article content — no JavaScript required.
2. This is not a replacement for your SPA pages. It is a parallel endpoint specifically for crawlers and link previews (Facebook, LinkedIn, Slack, etc.).
3. You can submit these URLs to AI crawlers, or configure your domain's CDN/proxy to route bot traffic to these endpoints.

### Changes

**1. New backend function: `supabase/functions/article-html/index.ts`**
- Accepts a `slug` query parameter
- Queries `blog_posts` for the matching published post
- Returns a self-contained HTML document containing:
  - `<title>`, `<meta description>`, Open Graph tags, Twitter card tags
  - JSON-LD Article structured data (same schema as `BlogArticleSchema`)
  - The full article `content` rendered in the `<body>`
  - A canonical link pointing to `/insights/:slug`
  - A `<noscript>` note and redirect for human visitors
- Returns 404 HTML if the slug is not found

**2. New backend function: `supabase/functions/insights-index/index.ts`**
- Returns a pre-rendered HTML page listing all published articles (title, excerpt, link)
- Useful for AI crawlers to discover the full article index
- Includes canonical link to `/insights`

**3. Update `supabase/functions/sitemap/index.ts`**
- No changes needed — it already lists all `/insights/:slug` URLs correctly

### What This Does NOT Change
- Your existing SPA pages, routing, or user experience — zero impact
- No framework migration required
- No build step changes

### Technical Detail
The edge functions use the database client directly, so they have access to all published articles. The HTML they return is static, cacheable, and instantly parseable by any crawler. The `Cache-Control` header will be set to cache for 1 hour, keeping things fresh without hammering the database.

