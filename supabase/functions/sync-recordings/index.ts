import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { plan, scan, approvedFolders, type Recording } from "../_shared/replay-plan.ts";
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info' };
// Preparation-only endpoint: no inserts, updates, AI calls, exports or permission writes.
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const run_id = crypto.randomUUID();
  const started_at = new Date().toISOString();
  const deadline = Date.now() + 90_000;
  const reply = (body: object, status = 200) => new Response(JSON.stringify({ run_id, started_at, completed_at: new Date().toISOString(), mode: 'dry_run', writes: 0, ...body }), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  try {
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    // Restrict this administrative inventory to the existing service credential.
    if (!key || req.headers.get('Authorization') !== `Bearer ${key}`) return reply({ outcome: 'rejected', error: 'Unauthorized' }, 401);
    if (req.method !== 'POST') return reply({ outcome: 'rejected', error: 'POST required' }, 405);
    const body = await req.json();
    if (body.mode !== 'dry_run' || !body.start || !body.end) return reply({ outcome: 'rejected', error: 'Explicit dry_run and session-date start/end required' }, 400);
    const folders = approvedFolders(Deno.env.get('REPLAY_APPROVED_FOLDERS'));
    plan([], [], body.start, body.end, folders);
    const signal = AbortSignal.timeout(90_000);
    const db = createClient(Deno.env.get('SUPABASE_URL')!, key, { global: { fetch: (url, init) => fetch(url, { ...init, signal }) } });
    const existing: Recording[] = [];
    for (let offset = 0; ; offset += 500) {
      if (Date.now() >= deadline || offset >= 50_000) throw new Error('database_read_budget_exceeded');
      const { data, error } = await db.from('recordings').select('id,video_ref,transcript_doc_id').eq('video_source', 'google_drive').order('id').range(offset, offset + 499);
      if (error) throw new Error('database_read_failed');
      existing.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    const result = await scan(async url => {
      const response = await fetch(url, { signal, headers: { Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`, 'X-Connection-Api-Key': Deno.env.get('GOOGLE_DRIVE_API_KEY')! } });
      if (!response.ok) throw new Error(`drive_read_http_${response.status}`);
      return await response.json();
    }, deadline, folders);
    const items = plan(result.files, existing, body.start, body.end, folders);
    const counts = Object.fromEntries(['stage_unpublished', 'refresh_artifact', 'review', 'unchanged'].map(action => [action, items.filter(i => i.proposed_action === action).length]));
    const outcome = { outcome: 'completed', bounds: { start: body.start, end_exclusive: body.end }, scanned_files: result.files.length, pages: result.pages, counts, errors: [], items };
    console.log(JSON.stringify({ run_id, outcome: 'completed', counts, pages: result.pages }));
    return reply(outcome);
  } catch (error) {
    // Error bodies/doc contents are intentionally never logged or returned.
    const code = error instanceof Error && /^(invalid_folder_configuration|scan_budget_exceeded|database_read_budget_exceeded|database_read_failed|drive_read_http_\d+|incomplete_drive_search|repeated_page_token|invalid_session_bounds)$/.test(error.message) ? error.message : 'run_failed';
    console.error(JSON.stringify({ run_id, outcome: 'failed', code }));
    return reply({ outcome: 'failed', counts: null, errors: [code] }, 500);
  }
});
