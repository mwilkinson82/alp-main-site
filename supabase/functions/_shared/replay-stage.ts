import { driveId, type Recording, type plan } from './replay-plan.ts';
export type Item = ReturnType<typeof plan>[number];
export type Approval = { video_file_id: string; source_digest: string };
export type StageRow = { id: string; title: string; class_type: string; recording_date: string; video_source: 'google_drive'; video_ref: string; cloudflare_video_id: string; transcript_doc_id: string; is_published: false; part_number: number | null; part_total: number | null };
export type Store = {
  insert: (row: StageRow) => Promise<'inserted' | 'duplicate'>;
  byId: (id: string) => Promise<Recording | null>;
  refresh: (record: Recording, noteId: string) => Promise<boolean>;
};
export function requestOptions(body: Record<string, unknown>, now = new Date()) {
  const mode = body.mode ?? 'dry_run';
  if (mode !== 'dry_run' && mode !== 'stage') throw new Error('invalid_mode');
  if (mode === 'dry_run' && body.apply === true) throw new Error('invalid_apply');
  const tomorrow = new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10);
  const start = body.start ?? '2026-08-21';
  const end = body.end ?? tomorrow;
  if (typeof start !== 'string' || typeof end !== 'string') throw new Error('invalid_session_bounds');
  if (mode === 'stage' && (body.apply !== true || !body.start || !body.end)) throw new Error('explicit_stage_approval_required');
  return { mode, start, end };
}
async function hash(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(b => b.toString(16).padStart(2, '0')).join('');
}
// Source-only approval survives idempotent retries but expires when source metadata changes.
export async function sourceDigest(item: Item) {
  return hash(JSON.stringify([item.video_file_id, item.session?.key, item.note_id, item.source_version, item.part_number, item.part_total]));
}
export async function stagingId(videoId: string) {
  const h = await hash(`alp-replay-staging-v1:${videoId}`);
  return `${h.slice(0,8)}-${h.slice(8,12)}-8${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}
export async function stage(items: Item[], existing: Recording[], approvals: Approval[], store: Store, deadline: number) {
  if (!Array.isArray(approvals) || !approvals.length || approvals.length > 25 || new Set(approvals.map(a => a.video_file_id)).size !== approvals.length) throw new Error('invalid_approval_batch');
  const selected: Item[] = [];
  // Validate the entire approval set before the first mutation.
  for (const approval of approvals) {
    const item = items.find(i => i.video_file_id === approval.video_file_id);
    if (!item || item.reasons.length || !item.session || !item.note_id || await sourceDigest(item) !== approval.source_digest) throw new Error('stale_or_ambiguous_approval');
    selected.push(item);
  }
  const results: Array<{ video_file_id: string; status: string }> = [];
  let writes = 0;
  for (const item of selected) {
    if (Date.now() >= deadline) {
      results.push({ video_file_id: item.video_file_id, status: 'not_attempted_budget' });
      continue;
    }
    try {
      let record = existing.find(r => driveId(r.video_ref) === item.video_file_id);
      if (!record) {
        const id = await stagingId(item.video_file_id);
        const inserted = await store.insert({ id, title: `${item.session!.program.replaceAll('_', ' ')} — ${item.session!.date}${item.part_number ? ` (Part ${item.part_number})` : ''}`, class_type: item.session!.program, recording_date: item.session!.date, video_source: 'google_drive', video_ref: `https://drive.google.com/file/d/${item.video_file_id}/view`, cloudflare_video_id: item.video_file_id, transcript_doc_id: item.note_id!, is_published: false, part_number: item.part_number, part_total: item.part_total });
        if (inserted === 'inserted') {
          writes++;
          results.push({ video_file_id: item.video_file_id, status: 'staged' });
          continue;
        }
        // Deterministic PK handles concurrent/repeated requests without upserting over a row.
        record = await store.byId(id) ?? undefined;
        if (!record || driveId(record.video_ref) !== item.video_file_id) throw new Error('identity_conflict');
      }
      if (record.transcript_doc_id === item.note_id) {
        results.push({ video_file_id: item.video_file_id, status: 'unchanged' });
      } else if (record.transcript_doc_id) {
        results.push({ video_file_id: item.video_file_id, status: 'artifact_conflict' });
      } else if (record.is_published !== false) {
        // Staging permission never modifies a published replay or unknown publication state.
        results.push({ video_file_id: item.video_file_id, status: 'published_refresh_review' });
      } else {
        const changed = await store.refresh(record, item.note_id!);
        if (changed) writes++;
        results.push({ video_file_id: item.video_file_id, status: changed ? 'artifact_refreshed' : 'concurrent_change_review' });
      }
    } catch {
      // A network timeout may occur after commit. Never claim zero effects or blindly replay.
      results.push({ video_file_id: item.video_file_id, status: 'indeterminate_reconcile' });
      for (const remaining of selected.slice(results.length)) results.push({ video_file_id: remaining.video_file_id, status: 'not_attempted_after_error' });
      break;
    }
  }
  const uncertain = results.some(r => r.status === 'indeterminate_reconcile');
  const pending = results.some(r => !['staged', 'unchanged', 'artifact_refreshed'].includes(r.status));
  return { outcome: uncertain ? 'indeterminate' : pending ? 'completed_with_review' : 'completed', writes: uncertain ? null : writes, confirmed_writes: writes, result_counts: Object.fromEntries([...new Set(results.map(r => r.status))].map(status => [status, results.filter(r => r.status === status).length])), results };
}
