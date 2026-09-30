# Replay repair and backfill release review

Prepared for Lovable project d5d995bb-85ad-4c1b-b601-a214c4a121a0. No deployment, live writes, cron invocation, sharing change, credential change or publication has been performed.

## Final behavior

Empty authenticated POST, `{}`, and authenticated GET are compatible cron requests. They default to dry-run, with session dates from 2026-08-21 through tomorrow UTC (exclusive). Explicit backfill uses `start: "2026-08-21", end: "2026-10-01"`. Dry-run performs only paginated DB/Drive reads and emits no content bodies, AI calls, inserts, updates or permission changes. Existing service-role Authorization is required; verify the actual cron header at release without exposing its value.

The four direct-parent folders come only from server-side `REPLAY_APPROVED_FOLDERS`, an object with exactly `legacy`, `power`, `school`, `sales` keys. Real IDs remain in the local audit. Configuration is not caller-controlled. No recursive scan or private-folder discovery exists. Missing/invalid configuration fails closed; provision/verify it only at the approved release gate.

Drive reads follow nextPageToken, including empty pages. Repeated tokens, incompleteSearch, 100 pages or the 90-second deadline fail closed before staging. DB reads paginate in batches of 500. The scan intentionally includes all metadata in the four folders so old videos can acquire late notes; filtering uses session dates, not modified dates. A larger future inventory that exceeds these bounds requires checkpointed scanning before expanding the budget.

## Multipart sessions and notes

User-confirmed convention: same-program/day recordings are interrupted calls and restarts. Preserve each video, assign Part 1/2/etc by actual start time, and pair each part to its own exact meeting title/date/time/GMT-offset note. A small file is informational, not a reason to discard or hold it. No video concatenation occurs. A duplicate start time, missing/multiple exact note, conflicting existing artifact, duplicate existing Drive ID or existing part-number/total conflict remains held. Existing recording IDs, titles, links and parts are never silently replaced or renumbered.

The revised local audit manifest has 38 files: 25 Power Hour, 7 Contractor School, 6 Sales/Marketing; 32 September and 6 late August. There are 37 staging candidates and one hold: the September 10 Power Hour 07:58 recording has no exact note. Do not attach the 07:59 part's note to it. Four tiny clips are preserved. Counts are files, not independent meeting/session counts.

## Explicit unpublished staging

The writer is implemented, but disabled by default. It requires all of:

- Existing service-role authorization.
- Server-side `REPLAY_STAGING_ENABLED=true`, separately enabled at release.
- POST body `mode: "stage", apply: true`, explicit start/end dates.
- `approvals: [{ video_file_id, source_digest }]` for 1–25 unique files. Copy exact digests from a fresh completed dry-run after reviewing it.

All approvals are checked before any write. Digests bind video ID, exact session, note ID, source size/modification metadata and part numbering. New rows use a deterministic UUID derived from the stable Drive ID, the existing primary-key uniqueness constraint, and insert-only behavior. Concurrent retries through this writer insert at most one row; a duplicate PK is read and identity-checked instead of overwriting it. Every insert explicitly sets `is_published=false`. No transcript body is stored, and no sharing or publication code exists.

Late notes can fill `transcript_doc_id` only when it is still NULL and the row is still unpublished, using conditional ID/source/link/publication filters. All other columns remain unchanged. Published/unknown-publication rows are returned as `published_refresh_review`; changing published artifacts requires a separate approved operation. Existing matching notes are no-ops. Conflicting or concurrently edited rows remain held.

Idempotence covers retries/concurrency of this writer. It cannot prevent a different legacy/admin writer concurrently inserting the same Drive file with a random UUID; the release must ensure a single import writer and reconcile existing duplicates. No schema migration is required by this patch. A broader multi-writer system should add a reviewed DB-level unique normalized Drive-ID constraint separately, after auditing existing data.

## Outcome and cron integration

Every run logs `started` and a terminal `completed`, `completed_with_review`, `failed`, `rejected`, or `indeterminate` outcome with a run ID. Responses include planned counts, actual staging result counts, confirmed writes and errors. Log entries contain counts/statuses, not document bodies or emails. A timeout after a possible commit returns `writes: null` plus `confirmed_writes` and `indeterminate_reconcile`, stops further writes, and requires read reconciliation. Budget-exhausted items are explicitly not attempted. Batches are at most 25 and can be retried by stable ID after reconciliation.

Keep the current cron schedule and empty request body: it will run dry-run only after release. SQL enqueue success is not importer completion. The observed 5-second HTTP client timeout may expire while the bounded worker continues; correlate invocation/start/terminal logs and never infer that timeout means rollback or worker termination. If changing the caller timeout is later approved, set it against the measured bounded request budget, not as a substitute for these outcomes. This patch does not invoke, reschedule or enable a cron.

## Privacy and separate security scope

Shared header cleanup removes participant/contact preambles and continuation emails while preserving teaching tables, headings and transcript content. Synthetic fixtures cover notes, transcripts, no-header documents and contact tables. The old renderer's blanket table deletion and transcript truncation are removed. Representative sanitized Google exports should be checked in a non-production environment before release.

`get-transcript` currently authorizes active clients but accepts arbitrary caller-supplied docId without binding it to an accessible recording. That existing object-authorization issue is separately scoped; header removal is not an authorization control or a general XSS sanitizer. Do not treat unpublished note IDs as protected client content until this separate scope is resolved. Repo RLS restricts client recording reads to published rows, but current deployed policy equivalence still needs verification.

## Human release gates

1. Review this code and tests, then approve a non-production deployment/test separately. Verify folder configuration against the four locally approved IDs, actual cron Authorization, deployed schema/RLS and representative sanitized exports. No secrets or real IDs belong in the public PR.
2. Refresh authorized Drive and DB state; obtain a completed dry-run for the explicit backfill range. The saved audit manifest is offline evidence, not an apply authorization. Review the one unmatched clip and any new conflicts. Multipart ordering is already user-authorized; keep each part's exact notes.
3. Approve the exact source-digest selections and production unpublished staging operation, then separately approve deployment/configuration enablement. Ensure only this import writer is active. Snapshot existing artifact fields for any approved unpublished refresh. Stage in batches of at most 25; reconcile counts and IDs between batches.
4. Review unpublished client/admin previews and playback access. Publication, published-row artifact updates, and any Drive sharing change each require separate explicit approval. There is no automatic anyone-with-link fallback.
5. On uncertain outcomes, reconcile stable IDs before retrying. Restore changed artifact fields only from reviewed snapshots; any row deletion or other rollback mutation needs separate authorization. Observe actual terminal outcomes, not queue success.

Folder evidence establishes creation of new sibling folders, not who created or renamed them. Do not attribute an actor without audit evidence.

## Verification

`node --test tests/replay.test.mjs tests/replay-stage.test.mjs` uses Node 24 native TypeScript stripping. Tests cover cron compatibility, dry-run non-mutation, explicit staging gates, adapter filters, deterministic retries/concurrency, late notes, timeout reconciliation, multipart ordering/per-part notes, privacy and pagination failures. Tests use mocks/synthetic IDs; no live DB/Drive or deployment test occurred.

References: https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list ; https://supabase.com/docs/guides/functions/limits ; https://supabase.com/docs/reference/javascript/insert ; https://supabase.com/docs/reference/javascript/update .
