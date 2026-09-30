import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedFolders, driveId, plan, scan } from '../supabase/functions/_shared/replay-plan.ts';
import { cleanReplayHtml } from '../supabase/functions/_shared/replay-privacy.ts';
const FOLDERS = ['fixture_legacy_123', 'fixture_power_123', 'fixture_school_123', 'fixture_sales_123'];
const name = 'ALP Hardcore Power Hour - 2026/09/10 07:59 GMT-04:00 - ';
const video = { id: 'video_fixture_123', name: name + 'Recording', mimeType: 'video/mp4', size: '2000000', parents: [FOLDERS[1]] };
const note = { id: 'note_fixture_123', name: name + 'Notes by Gemini', mimeType: 'application/vnd.google-apps.document', parents: [FOLDERS[1]] };
const run = (files, existing = []) => plan(files, existing, '2026-08-21', '2026-10-01', FOLDERS);
test('exact title/time matching and Drive-ID dedup', () => {
  const [item] = run([video, video, note]);
  assert.equal(item.proposed_action, 'stage_unpublished');
  assert.equal(run([video, video, note]).length, 1);
  assert.equal(item.is_published, false);
  assert.equal(item.permissions_change, false);
});
test('late note proposes update preserving recording identity', () => {
  const [item] = run([video, note], [{ id: 'existing', video_ref: `https://drive.google.com/open?id=${video.id}`, transcript_doc_id: null }]);
  assert.equal(item.proposed_action, 'refresh_artifact');
  assert.equal(item.recording_id, 'existing');
});
test('same-day note at different minute never paired', () => {
  const [item] = run([video, { ...note, name: note.name.replace('07:59', '07:58') }]);
  assert.equal(item.note_id, null);
  assert.ok(item.reasons.includes('no_exact_notes'));
});
test('tiny, multiple exact notes, existing conflicts and duplicate rows held', () => {
  assert.ok(run([{ ...video, size: '177151' }, note])[0].reasons.includes('tiny_clip'));
  assert.ok(run([video, note, { ...note, id: 'other' }])[0].reasons.includes('multiple_exact_notes'));
  const row = { id: 'old', video_ref: video.id, transcript_doc_id: 'different' };
  assert.ok(run([video, note], [row])[0].reasons.includes('existing_artifact_conflict'));
  assert.ok(run([video, note], [row, row])[0].reasons.includes('duplicate_existing_drive_id'));
});
test('multiple recordings same class/day need session review', () => {
  assert.ok(run([video, note, { ...video, id: 'restart', name: video.name.replace('07:59', '08:55') }])[0].reasons.includes('multiple_files_same_class_day'));
});
test('allowlist, exclusive session-date bounds, invalid bounds', () => {
  assert.equal(run([{ ...video, parents: ['private-one-to-one'] }]).length, 0);
  assert.equal(run([{ ...video, name: video.name.replace('2026/09/10', '2026/08/20') }]).length, 0);
  assert.equal(run([{ ...video, name: video.name.replace('2026/09/10', '2026/10/01') }]).length, 0);
  assert.throws(() => plan([], [], '2026-08-20', '2026-10-01', FOLDERS));
  assert.equal(driveId('https://evil.test/file/d/video_fixture_123'), null);
});
test('scan paginates empty pages and only approved direct parents', async () => {
  const urls = [];
  const result = await scan(async url => { urls.push(url); return urls.length === 1 ? { files: [], nextPageToken: 'next' } : { files: [video] }; }, Date.now() + 5000, FOLDERS);
  assert.equal(result.pages, 5);
  assert.equal(new URL(urls[1]).searchParams.get('pageToken'), 'next');
  for (const url of urls) assert.ok(FOLDERS.some(id => new URL(url).searchParams.get('q').startsWith(`'${id}' in parents`)));
});
test('incomplete, repeated-token and deadline failures cannot become completed manifests', async () => {
  await assert.rejects(scan(async () => ({ incompleteSearch: true }), Date.now() + 5000, FOLDERS));
  await assert.rejects(scan(async () => ({ nextPageToken: 'same' }), Date.now() + 5000, FOLDERS));
  await assert.rejects(scan(async () => ({}), Date.now() - 1, FOLDERS));
});
const fixtures = [
  ['notes', '<p>Invited Alice alice@example.test</p><h2>Summary</h2><p>Teach scheduling.</p><table><tr><td>Duration</td></tr></table>'],
  ['transcript', '<table><tr><td>Participants</td><td>alice@example.test</td></tr></table><h2>ALP - Transcript</h2><p>00:00:12 Coach: Keep the critical path.</p>'],
  ['continuation', '<p>Attendees:</p><p>Alice alice@example.test</p><h2>Details</h2><ul><li>Teach estimates.</li></ul>'],
];
for (const [label, input] of fixtures) test(`privacy ${label}`, () => {
  const output = cleanReplayHtml(input);
  assert.ok(!output.includes('alice@example.test'));
  assert.ok(output.includes(label === 'transcript' ? 'Keep the critical path' : label === 'notes' ? 'Teach scheduling' : 'Teach estimates'));
});
test('no-header teaching content and structure remain unchanged', () => {
  const html = '<h2>Summary</h2><p>Email support@example.test for the exercise.</p><table><tr><td>Cost</td></tr></table><h2>Transcript</h2><p>00:00:12 Teacher: Example.</p>';
  assert.equal(cleanReplayHtml(html), html);
});
test('no-heading contact block removed without stripping teaching tables', () => {
  assert.equal(cleanReplayHtml('<p>Contacts: alice@example.test</p><p>Lesson</p><table><tr><td>Cost</td></tr></table>'), '<p>Lesson</p><table><tr><td>Cost</td></tr></table>');
});
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
test('endpoint read-only integration reports completed and DB failure correctly', async () => {
  const source = readFileSync(new URL('../supabase/functions/sync-recordings/index.ts', import.meta.url), 'utf8');
  assert.ok(!/\.insert\(|\.update\(|\/permissions/.test(source));
  const { stripTypeScriptTypes } = await import('node:module');
  let handler;
  let dbFails = false;
  const originalFetch = globalThis.fetch;
  globalThis.Deno = { env: { get: name => name === 'REPLAY_APPROVED_FOLDERS' ? JSON.stringify(Object.fromEntries(['legacy','power','school','sales'].map((key,i)=>[key,FOLDERS[i]]))) : name === 'SUPABASE_SERVICE_ROLE_KEY' ? 'synthetic-key' : 'synthetic' }, serve: fn => { handler = fn; } };
  globalThis.__testClient = () => ({ from: () => ({ select: () => ({ eq: () => ({ order: () => ({ range: async () => dbFails ? { error: new Error('private detail') } : { data: [] } }) }) }) }) });
  globalThis.fetch = async (url, init) => {
    assert.equal(init?.method ?? 'GET', 'GET');
    return Response.json({ files: [video, note] });
  };
  try {
    const rewritten = source.replace(/import \{ createClient \} from [^;]+;/, 'const createClient = globalThis.__testClient;').replace('"../_shared/replay-plan.ts"', JSON.stringify(pathToFileURL(resolve('supabase/functions/_shared/replay-plan.ts')).href));
    await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(rewritten)).toString('base64'));
    const req = () => new Request('https://test.local', { method: 'POST', headers: { Authorization: 'Bearer synthetic-key' }, body: JSON.stringify({ mode: 'dry_run', start: '2026-08-21', end: '2026-10-01' }) });
    const success = await (await handler(req())).json();
    assert.equal(success.outcome, 'completed');
    assert.equal(success.writes, 0);
    assert.equal(success.counts.stage_unpublished, 1);
    dbFails = true;
    const failed = await (await handler(req())).json();
    assert.equal(failed.outcome, 'failed');
    assert.equal(failed.counts, null);
    assert.ok(!JSON.stringify(failed).includes('private detail'));
    const unauthorized = await handler(new Request('https://test.local', { method: 'POST' }));
    assert.equal(unauthorized.status, 401);
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.Deno;
    delete globalThis.__testClient;
  }
});
test('no-header document without headings preserves teaching email and table', () => {
  const html = '<p>Use teacher@example.test in this exercise.</p><table><tr><td>Cost</td></tr></table>';
  assert.equal(cleanReplayHtml(html), html);
});

test('allowlist config requires exactly four named unique server-side IDs', () => {
 assert.throws(() => approvedFolders(undefined));
 assert.throws(() => approvedFolders(JSON.stringify({legacy:'fixture_only_123'})));
 assert.deepEqual(approvedFolders(JSON.stringify(Object.fromEntries(['legacy','power','school','sales'].map((key,i)=>[key,FOLDERS[i]])))), FOLDERS);
});
