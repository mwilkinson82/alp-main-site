

## Fix Favicon for Non-SPA Pages (robots.txt, sitemap, etc.)

### The Problem
When visiting static files like `/robots.txt` directly, the browser does not load `index.html`, so the `<link rel="icon">` tag never applies. The browser falls back to looking for `/favicon.ico` at the root. Since no such file exists in `public/`, the hosting platform's default (Lovable) favicon is shown.

### The Fix
Add a `favicon.ico` file to the `public/` directory. This is the universal browser fallback that works for every page on the domain, including non-HTML files.

### Changes

**1. `public/favicon.ico`**
- Download the existing favicon image (currently hosted at `https://storage.googleapis.com/gpt-engineer-file-uploads/6iWXmZqL0lNraTpN5woUupsc9OB3/uploads/1761039211774-ALP LOGO MOUNTAIN.png`) and save it as `public/favicon.ico`
- Since the source is a PNG, we will reference it as `public/favicon.png` and update the fallback path accordingly
- Alternatively, add a simple HTML redirect or copy the hosted image into `public/` so browsers can find it at the root

**Concrete approach:** Copy the remote favicon URL into a local `public/favicon.png` file, then add a secondary `<link rel="icon">` in `index.html` pointing to `/favicon.png` (which is already effectively done). The real fix is ensuring a file exists at exactly `/favicon.ico` — the path browsers check automatically.

**Simplest implementation:**
- Update `index.html` to add a shortcut icon link: `<link rel="shortcut icon" href="https://storage.googleapis.com/gpt-engineer-file-uploads/6iWXmZqL0lNraTpN5woUupsc9OB3/uploads/1761039211774-ALP LOGO MOUNTAIN.png">`
- More importantly, replace the existing `public/favicon.ico` file with your ALP logo. The current `public/favicon.ico` likely contains the default Lovable favicon. We will overwrite it by fetching your logo and saving it there.

### What This Changes
- The favicon shown when visiting `/robots.txt`, `/sitemap.xml`, or any non-SPA route will display your ALP mountain logo instead of the Lovable logo
- No impact on SPA pages (they already use the correct favicon via `index.html`)

