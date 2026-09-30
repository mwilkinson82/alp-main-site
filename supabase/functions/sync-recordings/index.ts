import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { plan, scan, approvedFolders, type Recording } from "../_shared/replay-plan.ts";
import { requestOptions, sourceDigest, stage, type Store } from "../_shared/replay-stage.ts";
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info' };
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const run_id = crypto.randomUUID();
  const started_at = new Date().toISOString();
  const deadline = Date.now() + 90_000;
  let mode = 'dry_run';
  const reply = (body: object, status = 200) => new Response(JSON.stringify({ run_id, started_at, completed_at: new Date().toISOString(), mode, writes: 0, ...body }), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  try {
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!key || req.headers.get('Authorization') !== `Bearer ${key}`) return reply({ outcome: 'rejected', error: 'Unauthorized' }, 401);
    if (!['POST', 'GET'].includes(req.method)) return reply({ outcome: 'rejected', error: 'GET or POST required' }, 405);
    const raw = req.method === 'POST' ? await req.text() : '';
    let body: Record<string, unknown>;
    try { body = raw.trim() ? JSON.parse(raw) : {}; } catch { return reply({ outcome: 'rejected', error: 'Invalid JSON' }, 400); }
    if (!body || Array.isArray(body) || typeof body !== 'object') return reply({ outcome: 'rejected', error: 'Object required' }, 400);
    const options = requestOptions(body);
    mode = options.mode;
    if (mode === 'stage' && Deno.env.get('REPLAY_STAGING_ENABLED') !== 'true') return reply({ outcome: 'rejected', error: 'Staging disabled' }, 403);
    console.log(JSON.stringify({ run_id, outcome: 'started', mode, started_at }));
    const folders = approvedFolders(Deno.env.get('REPLAY_APPROVED_FOLDERS'));
    plan([], [], options.start, options.end, folders);
    const signal = AbortSignal.timeout(90_000);
    const db = createClient(Deno.env.get('SUPABASE_URL')!, key, { global: { fetch: (url, init) => fetch(url, { ...init, signal }) } });
    const existing: Recording[] = [];
    for (let offset = 0; ; offset += 500) {
      if (Date.now() >= deadline || offset >= 50_000) throw new Error('database_read_budget_exceeded');
      const { data, error } = await db.from('recordings').select('id,video_ref,transcript_doc_id,is_published,part_number,part_total').eq('video_source', 'google_drive').order('id').range(offset, offset + 499);
      if (error) throw new Error('database_read_failed');
      existing.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    const result = await scan(async url => {
      const response = await fetch(url, { signal, headers: { Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`, 'X-Connection-Api-Key': Deno.env.get('GOOGLE_DRIVE_API_KEY')! } });
      if (!response.ok) throw new Error(`drive_read_http_${response.status}`);
      return await response.json();
    }, deadline, folders);
    const items = plan(result.files, existing, options.start, options.end, folders);
    const counts = Object.fromEntries(['stage_unpublished', 'refresh_artifact', 'review', 'unchanged'].map(action => [action, items.filter(i => i.proposed_action === action).length]));
    const approvedItems = await Promise.all(items.map(async item => ({ ...item, source_digest: await sourceDigest(item) })));
    const common = { bounds: { start: options.start, end_exclusive: options.end }, scanned_files: result.files.length, pages: result.pages, counts, errors: [], items: approvedItems };
    if (mode === 'dry_run') {
      console.log(JSON.stringify({ run_id, outcome: 'completed', mode, counts, writes: 0 }));
      return reply({ ...common, outcome: 'completed' });
    }
    const store: Store = {
      insert: async row => {
        const { error } = await db.from('recordings').insert(row);
        if (error?.code === '23505') return 'duplicate';
        if (error) throw new Error('stage_insert_failed');
        return 'inserted';
      },
      byId: async id => {
        const { data, error } = await db.from('recordings').select('id,video_ref,transcript_doc_id,is_published').eq('id', id).maybeSingle();
        if (error) throw new Error('stage_read_failed');
        return data;
      },
      refresh: async (record, noteId) => {
        const { data, error } = await db.from('recordings').update({ transcript_doc_id: noteId }).eq('id', record.id).eq('video_source', 'google_drive').eq('video_ref', record.video_ref).eq('is_published', false).is('transcript_doc_id', null).select('id');
        if (error) throw new Error('stage_refresh_failed');
        return data?.length === 1;
      },
    };
    const staged = await stage(items, existing, body.approvals as Parameters<typeof stage>[2], store, deadline);
    console.log(JSON.stringify({ run_id, mode, outcome: staged.outcome, writes: staged.writes, confirmed_writes: staged.confirmed_writes, statuses: staged.results.map(r => r.status) }));
    return reply({ ...common, ...staged, errors: staged.results.filter(r => r.status === 'indeterminate_reconcile').map(r => ({ code: r.status, video_file_id: r.video_file_id })) }, staged.outcome === 'indeterminate' ? 503 : 200);
  } catch (error) {
    const code = error instanceof Error && /^(invalid_folder_configuration|scan_budget_exceeded|database_read_budget_exceeded|database_read_failed|drive_read_http_\d+|incomplete_drive_search|repeated_page_token|invalid_session_bounds|invalid_mode|invalid_apply|explicit_stage_approval_required|invalid_approval_batch|stale_or_ambiguous_approval)$/.test(error.message) ? error.message : 'run_failed';
    const rejected = /^(invalid_|explicit_|stale_)/.test(code);
    console.error(JSON.stringify({ run_id, outcome: rejected ? 'rejected' : 'failed', code }));
    return reply({ outcome: rejected ? 'rejected' : 'failed', counts: null, errors: [code] }, rejected ? 400 : 500);
  }
});
