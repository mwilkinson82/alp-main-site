## AI-generated titles from the Gemini transcript

Right now the sync inserts a generic title like *"Power Hour — June 22, 2026"*. I'll upgrade the sync to read the paired Gemini Doc and ask Lovable AI to write a short, specific title based on what was actually covered.

### How it will work

1. In `supabase/functions/sync-recordings/index.ts`, after pairing a video with its transcript Doc:
   - Fetch the Doc's text via the Google Docs gateway (`/google_docs/v1/documents/{id}`) and flatten the body to plain text.
   - Call Lovable AI (`google/gemini-3-flash-preview`) with a tight prompt:
     > *"Write a short, specific title (max 8 words, no quotes, no date, no class name) summarizing the main topic of this {Power Hour | Contractor School | Sales & Marketing School} session. Transcript: …"*
   - Final title format: **`Power Hour — June 22, 2026: Pricing Objections & Follow-Up Cadence`** (class + date + AI topic). Part numbering preserved when a day has 2 videos.

2. **Graceful fallback** — if the Doc isn't ready yet, AI call fails, rate-limits (429), or runs out of credits (402), insert with the existing date-only title. Sync never blocks on AI.

3. **Backfill today's row** — after deploying, I'll run the function once to rewrite the June 22 title in place (update where `title` still matches the generic pattern, so we don't clobber any titles you've hand-edited).

4. **Admin retitle button (small add)** — in `RecordingsPanel.tsx`, add a "Regenerate title" action on each row that re-runs the AI step for that single recording. Useful if you ever want a different title than what AI picked.

### Files
- `supabase/functions/sync-recordings/index.ts` (add Docs fetch + AI title step)
- `src/components/admin/RecordingsPanel.tsx` (per-row "Regenerate title" button)
- One `supabase--insert` call to update the existing June 22 row's title after deploy

### Out of scope
- Generating descriptions/summaries (titles only for now — say the word and I'll add a one-line description too)
- Re-titling old already-edited recordings
