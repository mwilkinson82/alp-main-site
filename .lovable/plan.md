
## Goal
Pull every ALP Power Hour, Sales & Marketing School, and Contractor School recording out of your Google Drive "Meet Recordings" folder, set each file's share link to "Anyone with the link → Viewer," and insert them into the portal's `recordings` table — skipping anything already there and fixing wrong dates on existing rows.

## Steps

1. **Reconnect Drive with write scope**
   Prompt a reconnect that grants the full `https://www.googleapis.com/auth/drive` scope so I can both read files and patch their share permissions. Until you approve this, nothing else runs.

2. **Locate the "Meet Recordings" folder**
   Query Drive for `name = 'Meet Recordings' and mimeType = 'application/vnd.google-apps.folder'` to get the folder ID.

3. **List candidate recordings**
   Page through files in that folder where the name starts with one of:
   - `ALP Hardcore Power Hour` / `ALP Power Hour` → `power_hour`
   - `ALP Sales and Marketing School` / `ALP Sales & Marketing School` → `sales_marketing_school`
   - `ALP Contractor School` / `ALP Contractors School` → `contractor_school`

4. **Parse recording date from filename**
   Meet names files like `ALP Hardcore Power Hour  - 2026/05/26 07:58 GMT-04:00 - Recording`. Pull the `YYYY/MM/DD` chunk and convert to `YYYY-MM-DD`. Skip any file where the date can't be parsed and report it back to you.

5. **Reconcile with the database**
   Fetch all existing `recordings` rows with a `drive.google.com` URL and extract their file IDs. For each Drive file:
   - **Already in DB, wrong date** → update that row's `recording_date` to the date in the filename.
   - **Already in DB, correct date** → leave alone.
   - **Not in DB** → insert a new row.

6. **Set sharing on each imported/updated file**
   For every file touched in step 5, `POST /files/{id}/permissions` with `{role: "reader", type: "anyone"}`. Idempotent — safe if already public.

7. **Insert new rows**
   Title: `Power Hour Session` / `Sales & Marketing School Session` / `Contractor School Session` (you can rename in admin later).
   `class_type`: per step 3 mapping.
   `recording_date`: per step 4.
   `video_source`: `google_drive`.
   `video_ref` and `cloudflare_video_id`: `https://drive.google.com/file/d/{id}/view?usp=sharing`.
   `is_published`: `true`.

8. **Report back**
   Counts per class type — added, re-dated, skipped, plus any filenames I couldn't parse so you can rename them in Drive.

## Technical notes
- Drive list call: `GET /files?q='{folderId}' in parents and trashed=false&fields=files(id,name,mimeType)&pageSize=1000&pageToken=...` with paging until done.
- Date regex: `/(\d{4})\/(\d{2})\/(\d{2})/`.
- Permission call: `POST /files/{id}/permissions?supportsAllDrives=true` with body `{role:"reader",type:"anyone"}`. Ignore 4xx errors that mean "already shared."
- Run as a one-shot ad-hoc script via `code--exec` using the gateway (`$LOVABLE_API_KEY` + `$GOOGLE_DRIVE_API_KEY`). No new edge function or UI — this is a one-time backfill.
- DB writes via the standard insert/update path (one batched insert + per-row updates for date fixes).

## Out of scope
- No changes to the admin UI or portal frontend.
- No renaming of existing recording titles (you can edit those in the admin panel).
- No deletion of any existing rows — only inserts and date updates.
