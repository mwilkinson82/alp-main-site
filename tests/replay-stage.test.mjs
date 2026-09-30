import test from 'node:test';
import assert from 'node:assert/strict';
import { plan } from '../supabase/functions/_shared/replay-plan.ts';
import { stage, sourceDigest, stagingId, requestOptions } from '../supabase/functions/_shared/replay-stage.ts';
const folder='synthetic_folder_123';
const video={id:'synthetic_video_123',name:'ALP Power Hour - 2026/09/10 07:59 GMT-04:00 - Recording',mimeType:'video/mp4',parents:[folder],size:'177151',modifiedTime:'2026-09-10T14:00:00Z'};
const note={...video,id:'synthetic_note_123',name:video.name.replace('Recording','Notes by Gemini'),mimeType:'application/vnd.google-apps.document'};
const makePlan=(rows=[])=>plan([video,note],rows,'2026-08-21','2026-10-01',[folder]);
const approvals=async items=>Promise.all(items.map(async i=>({video_file_id:i.video_file_id,source_digest:await sourceDigest(i)})));
function memory(initial=[]) {
 const rows=new Map(initial.map(r=>[r.id,{...r}]));
 const calls=[];
 const store={
  async insert(row){calls.push(['insert',row]);if(rows.has(row.id))return 'duplicate';rows.set(row.id,{...row});return 'inserted';},
  async byId(id){return rows.get(id)??null;},
  async refresh(old,noteId){calls.push(['refresh',old.id]);const r=rows.get(old.id);if(!r || r.is_published!==false || r.transcript_doc_id!==null || r.video_ref!==old.video_ref)return false;r.transcript_doc_id=noteId;return true;}
 };
 return {rows,calls,store};
}
test('cron defaults are read-only with bounded session dates; stage requires explicit flags',()=>{
 assert.deepEqual(requestOptions({},new Date('2026-09-30T22:00:00Z')),{mode:'dry_run',start:'2026-08-21',end:'2026-10-01'});
 assert.throws(()=>requestOptions({mode:'stage'}));
 assert.throws(()=>requestOptions({mode:'dry_run',apply:true}));
 assert.throws(()=>requestOptions({mode:'publish'}));
});
test('staging inserts only unpublished metadata with deterministic ID, no transcript body',async()=>{
 const items=makePlan(), db=memory();
 const result=await stage(items,[],await approvals(items),db.store,Date.now()+1000);
 assert.equal(result.outcome,'completed');assert.equal(result.writes,1);
 const row=[...db.rows.values()][0];
 assert.equal(row.is_published,false);assert.equal(row.id,await stagingId(video.id));
 assert.equal(row.transcript_doc_id,note.id);assert.ok(!('transcript_content' in row));
});
test('retries and concurrent stale plans create one row without overwrite',async()=>{
 const items=makePlan(), db=memory(), approved=await approvals(items);
 const runs=await Promise.all([stage(items,[],approved,db.store,Date.now()+1000),stage(items,[],approved,db.store,Date.now()+1000)]);
 assert.equal(db.rows.size,1);assert.equal(runs.reduce((n,r)=>n+r.confirmed_writes,0),1);
 const existing=[...db.rows.values()];
 const retry=await stage(makePlan(existing),existing,approved,db.store,Date.now()+1000);
 assert.equal(retry.writes,0);assert.equal(retry.results[0].status,'unchanged');
});
test('late notes only refresh unpublished rows and preserve identity, title, links and parts',async()=>{
 const old={id:'original-id',video_ref:`https://drive.google.com/open?id=${video.id}`,transcript_doc_id:null,is_published:false,title:'Original title',part_number:null,part_total:null};
 const db=memory([old]),items=makePlan([old]);
 const result=await stage(items,[old],await approvals(items),db.store,Date.now()+1000);
 assert.equal(result.results[0].status,'artifact_refreshed');
 assert.deepEqual(db.rows.get(old.id),{...old,transcript_doc_id:note.id});
});
test('published late notes stay held; staging cannot update live content',async()=>{
 const old={id:'published',video_ref:video.id,transcript_doc_id:null,is_published:true};
 const db=memory([old]),items=makePlan([old]);
 const result=await stage(items,[old],await approvals(items),db.store,Date.now()+1000);
 assert.equal(result.results[0].status,'published_refresh_review');assert.equal(result.writes,0);assert.equal(db.calls.length,0);
});
test('source changes, unapproved IDs and ambiguous notes fail before any mutation',async()=>{
 const items=makePlan(),db=memory(),approved=await approvals(items);
 const changed=plan([{...video,modifiedTime:'2026-09-11T00:00:00Z'},note],[],'2026-08-21','2026-10-01',[folder]);
 await assert.rejects(stage(changed,[],approved,db.store,Date.now()+1000));
 await assert.rejects(stage(items,[],[...approved,{video_file_id:'not-approved',source_digest:'bad'}],db.store,Date.now()+1000));
 const ambiguous=plan([video],[],'2026-08-21','2026-10-01',[folder]);
 await assert.rejects(stage(ambiguous,[],await approvals(ambiguous),db.store,Date.now()+1000));
 assert.equal(db.calls.length,0);
});
test('timeout after commit reports indeterminate; retry reconciles without duplicate',async()=>{
 const db=memory(),items=makePlan(),approved=await approvals(items);
 const uncertain={...db.store,async insert(row){await db.store.insert(row);throw Error('timeout after commit');}};
 const first=await stage(items,[],approved,uncertain,Date.now()+1000);
 assert.equal(first.outcome,'indeterminate');assert.equal(first.writes,null);
 const retry=await stage(items,[],approved,db.store,Date.now()+1000);
 assert.equal(retry.results[0].status,'unchanged');assert.equal(db.rows.size,1);
});
test('budget exhaustion attempts no writes and reports pending work',async()=>{
 const db=memory(),items=makePlan();
 const result=await stage(items,[],await approvals(items),db.store,Date.now()-1);
 assert.equal(result.outcome,'completed_with_review');assert.equal(result.results[0].status,'not_attempted_budget');assert.equal(db.calls.length,0);
});
test('concurrent publication or note edit blocks conditional refresh',async()=>{
 const old={id:'original',video_ref:video.id,transcript_doc_id:null,is_published:false};
 const db=memory([{...old,is_published:true}]),items=makePlan([old]);
 const result=await stage(items,[old],await approvals(items),db.store,Date.now()+1000);
 assert.equal(result.results[0].status,'concurrent_change_review');assert.equal(result.writes,0);
});
