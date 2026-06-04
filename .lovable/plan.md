## Goal

Let you hand me Google Drive recording links (Meet recordings saved to Drive) and have me create Power Hour / Contractor School / Sales & Marketing School entries that play inside the portal.

## How it will work for you

Same flow as Zoom clips. You give me:
- The Drive link (any of: `/file/d/{id}/view`, `/file/d/{id}/preview`, `open?id={id}`)
- Which class it's for
- Title
- Date (or "after the last one" / "today")

I insert it into the recordings table and it shows up in the portal.

## One important prerequisite for each Drive file

The file must be shared as **"Anyone with the link → Viewer"** in Google Drive. Without that, the embedded player will show a sign-in screen for your clients. Google Meet recordings saved to Drive default to "restricted" — you'll need to change sharing on each one (or set it as a default at the folder level).

If you'd rather keep them restricted, the alternative is to download each recording and re-upload to Cloudflare Stream, which is more work per video.

## What I'll build

1. **Database** — add `google_drive` to the `video_source` enum (migration).
2. **Portal player** (`src/pages/PortalReplay.tsx`) — extend `resolveEmbedSrc` so when source is `google_drive`, it converts any Drive URL to `https://drive.google.com/file/d/{id}/preview` for the iframe.
3. **Admin panel** (`src/components/admin/RecordingsPanel.tsx`) —
   - Add "Google Drive" to the Video Source dropdown
   - Update the field label + placeholder + helper text for that source
   - Update the Zod enum + TS types
4. **Replay page types** — add `google_drive` to the `VideoSource` union.
5. **Thumbnails** — Drive doesn't expose a clean public thumbnail URL, so for Drive recordings the existing class-specific fallback thumbnail in the library view will be used unless you upload one manually (same as Zoom clips today).

## Technical details

- Enum migration: `ALTER TYPE public.video_source ADD VALUE IF NOT EXISTS 'google_drive';`
- Drive ID extraction regex handles `/file/d/{id}`, `id={id}`, and bare IDs (25+ alphanumeric/`_-`).
- Embed URL: `https://drive.google.com/file/d/{id}/preview` — works in `<iframe>` with the existing `allow` attributes and `allowFullScreen`.
- No RLS changes; no new tables; no new columns.

## What stays the same

Cloudflare and Zoom Clip sources keep working exactly as they do now. This is purely additive.

## After it ships

Send me the Drive links + class/title/date and I'll populate them.
