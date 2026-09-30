# Replay repair: review and release gates

This is a preparation-only change for Lovable project d5d995bb-85ad-4c1b-b601-a214c4a121a0, based on commit 37436a04e529f7661551ea9e13c28ca58a2be1a8. Do not merge or deploy as an unattended importer.

## Implemented

- Four server-configured direct-parent folders only, with Drive pagination, repeated-token/incomplete-search detection, 100-page and 90-second budgets. No recursion or private-folder discovery.
- Explicit session-date bounds: start >= 2026-08-21, end exclusive. Scan metadata without a modified-time cutoff so late artifacts can be paired with older videos within the requested session window.
- Exact normalized meeting title, date, time and GMT offset matching. No class/day fallback. Drive-ID dedup supports raw IDs and common Drive URLs.
- Metadata-only proposed unpublished staging, artifact refresh, unchanged and review actions. Existing IDs/links never change. Missing notes, conflicting notes, duplicate records, unknown sizes, tiny clips and multiple same-class/day files enter review.
- Completion/failure outcomes, run IDs, counts and sanitized error codes. Failed scans return no actionable partial manifest. No DB writes, exports, AI calls, sharing calls or publication paths exist in the dry-run endpoint.
- Shared header cleaner removes contact metadata while preserving teaching tables and transcript structure. This intentionally retains the transcript section that the old notes-only renderer cut off. Test with sanitized representative exports before release.

## Deliberate preparation limitations

The endpoint now accepts only explicit service-authorized POST dry runs. Retitle and automatic daily imports are not implemented in this preparation build. Deploying it unchanged would stop the prior write behavior and reject the current empty-body cron invocation; coordinate this change explicitly. No production deployment or cron invocation occurred during preparation.

Late artifact refresh is a PROPOSAL by existing recording ID, not a performed update. Same-doc content edits are served by the existing on-demand export (client cache can last one hour); no content snapshot is stored here. The bounded scan fails closed at its budget; if the approved scope outgrows the budget, implement persisted per-folder/page checkpoints with aggregation before enabling imports. A failure must not be interpreted as a complete inventory.

The supplied audit has 38 missing files (25 Power Hour, 7 Contractor School, 6 Sales/Marketing), 37 exact note matches, 4 files under 1 MB. The conservative offline plan yields 26 stage candidates and 12 review files, including all same-day multi-file groups. These are file counts, not verified sessions. Smaller non-tiny files also warrant duration/content inspection. Real IDs and inventory stay in local private-artifacts; do not commit them to this public repository.

## Required approval gates before production

1. Verify server-side REPLAY_APPROVED_FOLDERS has exactly legacy, power, school and sales keys mapped to the four locally approved IDs. No caller can supply folder IDs. Configuration is currently absent and must be separately approved; no live configuration was changed. Review code and synthetic tests. Approve a staging/test deployment separately; this draft does not authorize deployment. Verify sanitized representative Google exports, including notes-only, transcript-only, contact tables and no-header documents.
2. Refresh all four folder inventories and all existing recording IDs through authorized read-only access. Re-run the explicit range `2026-08-21` to `2026-10-01` (exclusive). Record a completed run ID and reconcile counts. No sweep outside the allowlist. Confirm session date vs Drive creation date, including late-August school recording created the following day.
3. Human-review ambiguous/restart clips and determine sessions/parts without renumbering existing records. In particular, do not attach the 07:59 note to the 07:58 Power Hour clip on September 10. Approve exact video/note mappings and any replacement of an existing note separately.
4. Implement and review a separate idempotent staging writer, including a DB-enforced unique stable Drive-ID key, dry-run manifest digest/preconditions, transaction/concurrency tests, replayable checkpoints, existing-row snapshots and an update allowlist. Verify RLS prevents clients from reading unpublished staging rows. No migration or DB write is authorized by this draft.
5. Approve the exact unpublished insert/update set, then separately authorize production import. Recheck source and DB state immediately before writes. Preserve existing recording IDs, titles, video links, publication state and part numbers. Late-note changes target only approved artifact fields.
6. Review sanitized client previews and playback access. Publication and any Drive permission changes require their own explicit approval. No automatic anyone-with-link fallback. Restore daily cron only after its body/auth, bounded work and outcome capture are reviewed and approved.
7. Observe actual completed application outcomes and reconcile inserted/updated/review/error counts. SQL enqueue success is not import completion; an HTTP timeout does not prove the worker stopped. Prevent overlapping runs and verify DB state before retry. Roll back only approved new staged rows/field updates from snapshots, never existing replay IDs or shared links. Deletions require separate approval.

## Separate security scope

`get-transcript` authenticates active clients but exports an arbitrary caller-supplied docId. It does not bind the document to a replay the caller can access. This is an existing object-authorization issue; repairing that access model is a separate approval scope. Header cleaning is not an authorization control or a general HTML/XSS sanitizer. Resolve this scope before treating unpublished note IDs as protected client content.

Folder audit evidence shows new sibling folders were created. It does not identify who created/renamed anything. Do not attribute an actor without audit evidence.

## Verification

Run `node --test tests/replay.test.mjs` with Node 24 (native TypeScript stripping). No live secrets, Drive calls or database are needed. Edge runtime/deployment checks remain gated.

References: https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list and https://supabase.com/docs/guides/functions/limits . Drive requires following nextPageToken; incompleteSearch is not a complete result. Runtime wall-clock and request timeouts are distinct from queue success.
