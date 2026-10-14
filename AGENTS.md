# AGENTS.md

- Recording sync (`supabase/functions/sync-recordings`) reads only the explicit per-class folder map in `logic.ts` and requires the file name prefix to match the folder's class; never scan the parent meetings folder — it holds private meetings.
- Recording sync never changes Drive sharing on its own; the only exception is admin `share_approved`, which adds anyone-reader to an exact approved ID list after revalidation, and admin backfill may take an `allow_ids` allowlist; videos not already link-shared, or shorter than the review threshold, are held and reported instead of published — avoids silently widening access or publishing broken replays.
- Recording sync writes go through `recording_sync_runs` (one running row = lock, persisted counts); scheduled imports run only when `recording_sync_settings.scheduled_import_enabled` is true — makes runs auditable and lets imports be paused without touching cron.
- Dry-run, backfill and retitle modes require an admin session; only the parameterless scheduled mode accepts the cron's public key — cron has no private credential yet.
- Sync planning logic is pure and covered by `sync_test.ts` (`deno test supabase/functions/sync-recordings/sync_test.ts`); keep I/O in `drive.ts`/`index.ts`.
