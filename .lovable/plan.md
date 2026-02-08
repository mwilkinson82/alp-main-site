
# Rename "Blog" to "Articles" Across the Site

## Overview
Rename all user-facing references from "Blog" to "Articles" for a more professional tone. The URL routes will change from `/blog` to `/articles`, and all navigation, labels, SEO metadata, and internal links will be updated accordingly.

## Changes Required

### 1. Routes (src/App.tsx)
- Change `/blog` route to `/articles`
- Change `/blog/:slug` route to `/articles/:slug`

### 2. Header Navigation (src/components/Header.tsx)
- Update desktop and mobile nav link text from "Blog" to "Articles"
- Update link paths from `/blog` to `/articles`
- Update `forceBlackTextPages` array: replace `/blog` with `/articles`
- Update the `startsWith('/blog/')` check to `startsWith('/articles/')`

### 3. Footer (src/components/Footer.tsx)
- Update link text from "Blog" to "Articles"
- Update path from `/blog` to `/articles`

### 4. Articles Listing Page (src/pages/Blog.tsx)
- Update SEO title/description/keywords to reference "Articles" instead of "Blog"
- Update canonical from `/blog` to `/articles`
- Update hero heading from "ALP Insights" (or add "Articles" context)
- Update card links from `/blog/${post.slug}` to `/articles/${post.slug}`

### 5. Individual Article Page (src/pages/BlogPost.tsx)
- Update all navigation links from `/blog` to `/articles`
- Update "Back to Blog" text to "Back to Articles"
- Update SEO fallback text from "ALP Blog" to "ALP Articles"
- Update canonical path from `/blog/${slug}` to `/articles/${slug}`

### 6. Structured Data (src/components/BlogArticleSchema.tsx)
- Update the URL template from `/blog/${slug}` to `/articles/${slug}`

### 7. Admin Dashboard (src/pages/Admin.tsx)
- Update "View Blog" link text to "View Articles"
- Update link path from `/blog` to `/articles`
- Update individual post preview links from `/blog/${post.slug}` to `/articles/${post.slug}`

### 8. Admin Post Editor (src/pages/AdminPostEditor.tsx)
- Update the URL preview text from `/blog/{slug}` to `/articles/{slug}`

### 9. Sitemap Edge Function (supabase/functions/sitemap/index.ts)
- Update static entry from `/blog` to `/articles`
- Update dynamic blog post URLs from `/blog/${post.slug}` to `/articles/${post.slug}`

## Notes
- File names (Blog.tsx, BlogPost.tsx, BlogAuthor.tsx, BlogArticleSchema.tsx) will remain as-is since they are internal references and renaming them adds risk with no user-facing benefit
- The database table `blog_posts` stays unchanged -- this is a backend concern only
- The storage bucket `blog-images` stays unchanged
