## Branded per-class thumbnails

Generate three high-quality 16:9 branded thumbnail images — one for each class type — and serve them automatically for every recording that doesn't have a custom `thumbnail_url`.

### Visual direction
All three share the ALP dark/navy + gold visual system (Space Grotesk display), differentiated by accent treatment and label so they're instantly distinguishable in the library grid:

1. **Power Hour** — deep navy gradient, gold lightning/altitude motif, large "POWER HOUR" wordmark, "ALP Hardcore" eyebrow.
2. **Contractor School** — navy with architectural blueprint grid texture, gold accent, "CONTRACTOR SCHOOL" wordmark.
3. **Sales & Marketing School** — navy with subtle upward-trend/graph motif, gold accent, "SALES & MARKETING" wordmark.

Each thumbnail is rendered once at 1600×900, saved to `src/assets/`, uploaded via `lovable-assets` so it's CDN-hosted.

### Implementation
1. Generate the 3 images with `imagegen` (premium quality — they contain typography).
2. Externalize each via `lovable-assets` → `.asset.json` pointers in `src/assets/`.
3. Add a small helper `src/lib/recordingThumbnail.ts` that returns the right fallback URL by `class_type` (`power_hour` | `contractor_school` | `sales_marketing`).
4. Update `src/pages/PortalLibrary.tsx` and `src/pages/PortalReplay.tsx` (anywhere a thumbnail is shown) so that when `r.thumbnail_url` is null, it falls back to the branded image for that class instead of the empty PlayCircle placeholder.
5. The date overlay is **not** baked into the image (would require re-rendering per recording). Instead, the date already shows on the card itself, so the branded thumbnail stays generic per class.

### What doesn't change
- DB schema (no migration needed — `thumbnail_url` stays as optional override).
- Admin still has the ability to upload a custom thumbnail later if desired; the branded one is just the default.
- No edge functions, no extra runtime cost.

### Out of scope
- Per-recording date overlay
- Admin upload UI (can add later if you want)
- Pulling frames from Drive videos
