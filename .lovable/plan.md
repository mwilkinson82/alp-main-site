## Automated daily Drive sync

Build a scheduled job that pulls new recordings from the shared Google Drive folder every day at 12:00 PM Eastern, matches each video with its paired Gemini transcript Doc, and inserts a published recording into the portal automatically.

### How it works

1. **New edge function `sync-recordings`** (uses the existing Google Drive connector — no new secrets).
   - Lists every file in the shared Drive folder modified in the last ~7 days (safety window so a missed day still backfills).
   - Classifies each filename by prefix:
     - `ALP Power Hour…` → `power_hour`
     - `ALP Contractor School…` → `contractor_school`
     - `ALP Sales and Marketing…` → `sales_marketing_school`
   - Extracts the date from the filename (Gemini's standard `YYYY-MM-DD` or `YYYY/MM/DD` pattern).
   - Splits results into two buckets:
     - **Videos** (`video/*` or `application/vnd.google-apps.video` MIME)
     - **Transcript Docs** (`application/vnd.google-apps.document`)
   - Pairs them by `(class_type, date)`. If two videos share a date → part 1 / part 2 (sorted by createdTime).
   - For each pair not already in `recordings` (de-duped by `video_ref` = Drive file ID), inserts a row with:
     - `video_source = 'google_drive'`, `video_ref` = file ID
     - `transcript_doc_id` = paired Doc ID (null if no transcript yet)
     - `recording_date`, `class_type`, `part_number`/`part_total`
     - `title` = generic placeholder ("Power Hour — June 22, 2026")
     - `is_published = true`
   - Returns a summary `{ inserted: N, skipped: N, unmatched: [...] }`.

2. **Daily cron at 12:00 PM ET** via `pg_cron` + `pg_net` calling the function. (12 PM ET = 17:00 UTC during EDT, 16:00 UTC during EST — I'll set it to `0 17 * * *` and note that during EST it runs at 11am local. If you want strict 12pm year-round we can switch to two cron rows.)

3. **Manual "Sync now" button** in the admin Recordings panel (`src/components/admin/RecordingsPanel.tsx`) that calls the same function and toasts the result. Useful for pulling today's call in immediately after it ends instead of waiting for noon.

### What you need to provide
The **Drive folder URL or ID** for the shared folder where all three classes' recordings + Gemini transcripts land. I'll paste it as a constant in the function.

### Files
- `supabase/functions/sync-recordings/index.ts` (new)
- `src/components/admin/RecordingsPanel.tsx` (add "Sync now" button + result toast)
- One `supabase--insert` SQL call to schedule the pg_cron job (kept out of migrations per the cron-scheduling rule)

### Out of scope
- Auto-generating smarter titles from the transcript (current placeholder is fine; can layer AI titles later)
- Backfilling old recordings (only pulls last ~7 days each run — but a one-time backfill button can be added if you want)
- Notifications when a new recording lands
