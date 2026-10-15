import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import { Budget, BudgetExceeded, fetchWithRetry, makeDrive, type FetchLike } from "./drive.ts";
import { buildPlan, cronAuthorized, FOLDER_MAP, type DriveFile } from "./logic.ts";
import { auditSharing, PersistenceError, runSync, selectBatch, shareApproved, type NewRow, type Store } from "./sync.ts";

const PH = "1w3T_y09cILdUORwtXi9114CVp7liXymo";
const CS = "1mDB9Q94Bod2AyiOtqCPWHI4Q4uR_zyoH";
const SM = "19mjrFh3F5psK0c1AWlYygQN8A3EE2Szo";
const LONG = String(60 * 60_000);

const vid = (id: string, name: string, dur: string | null = LONG, created = "2026-09-01T00:00:00Z"): DriveFile => ({
  id, name, mimeType: "video/mp4", createdTime: created, size: "900000000",
  videoMediaMetadata: dur === null ? undefined : { durationMillis: dur },
});
const doc = (id: string, name: string): DriveFile => ({ id, name, mimeType: "application/vnd.google-apps.document", createdTime: "2026-09-01T00:00:00Z" });

const noSleep = { sleep: async () => {} };

// ---------- Fake Drive over a fake fetch ----------
type FakeOpts = { postStatus?: Record<string, number>; transient?: Record<string, number>; ignorePost?: Set<string>; readFail?: Set<string> };
const posts = (c: string[]) => c.filter((x) => x.startsWith("POST"));
function fakeDrive(folders: Record<string, DriveFile[]>, publicIds: Set<string>, pageSize = 200, fo: FakeOpts = {}) {
  const calls: string[] = [];
  const perms = new Map<string, Array<{ type: string; role: string }>>();
  const f: FetchLike = async (url, init) => {
    calls.push(`${init?.method ?? "GET"} ${url}`);
    const u = new URL(url);
    if (init?.method === "POST" && u.pathname.endsWith("/permissions")) {
      const id = u.pathname.split("/files/")[1].split("/")[0];
      if ((fo.transient?.[id] ?? 0) > 0) { fo.transient![id]--; return new Response("busy", { status: 503 }); }
      const st = fo.postStatus?.[id];
      if (st) return new Response(`{"error":"denied for owner@example.com"}`, { status: st });
      if (!fo.ignorePost?.has(id)) publicIds.add(id);
      return Response.json({ id: "anyoneWithLink", type: "anyone", role: "reader" });
    }
    if (u.pathname.endsWith("/files")) {
      const folder = u.searchParams.get("q")!.match(/'([^']+)'/)![1];
      const all = folders[folder] ?? [];
      const start = Number(u.searchParams.get("pageToken") ?? 0);
      const files = all.slice(start, start + pageSize);
      const next = start + pageSize < all.length ? String(start + pageSize) : undefined;
      return Response.json({ files, nextPageToken: next });
    }
    const id = u.pathname.split("/files/")[1];
    if (fo.readFail?.has(id)) return new Response("nope", { status: 404 });
    const named = perms.get(id) ?? [{ type: "user", role: "owner" }, { type: "user", role: "writer" }];
    perms.set(id, named);
    return Response.json({ permissions: publicIds.has(id) ? [...named, { type: "anyone", role: "reader" }] : named });
  };
  const budget = new Budget(Date.now() + 60_000);
  return { drive: makeDrive({}, { fetch: f, budget, ...noSleep }), calls, publicIds };
}

function memStore(existing: Array<{ id: string; cls: string; date: string; pub?: boolean }> = [], opts: { failLookup?: boolean; locked?: boolean } = {}) {
  const rows: NewRow[] = [];
  const runs: Record<string, unknown>[] = [];
  let writes = 0;
  const store: Store = {
    async loadExisting() {
      if (opts.failLookup) throw new Error("db down");
      return existing.map((e) => ({ cloudflare_video_id: e.id, video_ref: `https://drive.google.com/file/d/${e.id}/view`, class_type: e.cls, recording_date: e.date, is_published: e.pub ?? true, video_source: "google_drive" }));
    },
    async acquireRun(m) { writes++; if (opts.locked) return null; runs.push({ ...m }); return "run1"; },
    async heartbeat() { writes++; },
    async finishRun(_id, p) { writes++; Object.assign(runs[0], p); },
    async insert(r) { writes++; rows.push(r); return { ok: true }; },
    async countByDriveIds(ids) { return rows.filter((r) => ids.includes(r.cloudflare_video_id)).length; },
  };
  return { store, rows, runs, writes: () => writes };
}

const titleFor = async () => "t";
const base = { dateFrom: "2026-01-01", dateTo: "2026-12-31", maxInserts: 25, triggeredBy: "test", titleFor };

Deno.test("pagination follows nextPageToken past 200 files", async () => {
  const files = Array.from({ length: 450 }, (_, i) => vid(`v${i}`, `ALP Power Hour - 2026/08/${String((i % 28) + 1).padStart(2, "0")} 12:00 GMT-04:00 - Recording`));
  const { drive, calls } = fakeDrive({ [PH]: files }, new Set());
  const out = await drive.listFolder(PH);
  assertEquals(out.length, 450);
  assertEquals(calls.length, 3);
});

Deno.test("folder mismatch, unknown prefix and shortcuts are ignored; forbidden parent refused", () => {
  const { items, ignored } = buildPlan({
    folders: {
      [PH]: [
        vid("a", "ALP Contractor School - 2026/09/01 10:00 GMT-04:00 - Recording"),
        vid("b", "Private call with Bob - 2026/09/01 - Recording"),
        { id: "c", name: "ALP Power Hour - 2026/09/01 - Recording", mimeType: "application/vnd.google-apps.shortcut", createdTime: "x" },
        vid("d", "ALP Power Hour - 2026/09/01 12:00 GMT-04:00 - Recording"),
      ],
    },
    existingDriveIds: new Set(), existingDays: new Map(), access: new Map([["d", "public_reader"]]), dateFrom: "2026-01-01", dateTo: "2026-12-31",
  });
  assertEquals(items.map((i) => i.drive_id), ["d"]);
  assertEquals(ignored.map((i) => i.reason).sort(), ["class_folder_mismatch", "shortcut", "unknown_prefix"]);
  let threw = false;
  try { buildPlan({ folders: { "1ljdJTWo6CBRn2mQOe7Xuxb9CE_EBgx6Q": [] }, existingDriveIds: new Set(), existingDays: new Map(), access: new Map(), dateFrom: "a", dateTo: "z" }); } catch { threw = true; }
  assert(threw);
  assertEquals(Object.keys(FOLDER_MAP).length, 3);
});

Deno.test("old backfill dates import regardless of modifiedTime window", async () => {
  const { drive } = fakeDrive({ [PH]: [vid("old", "ALP Power Hour - 2025/03/04 12:00 GMT-05:00 - Recording")] }, new Set(["old"]));
  const m = memStore();
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill", dateFrom: "2025-01-01", dateTo: "2025-12-31" });
  assertEquals(r.inserted, 1);
  assertEquals(m.rows[0].recording_date, "2025-03-04");
});

Deno.test("dry run performs zero writes and zero permission mutations", async () => {
  const { drive, calls } = fakeDrive({ [PH]: [vid("x", "ALP Power Hour - 2026/09/02 12:00 GMT-04:00 - Recording")] }, new Set());
  const m = memStore();
  const r: any = await runSync(drive, m.store, { ...base, mode: "dry_run" });
  assertEquals(m.writes(), 0);
  assert(calls.every((c) => c.startsWith("GET ")));
  assertEquals(r.items[0].disposition, "import_needs_share");
});

Deno.test("lock is acquired before dedupe lookup; failed lookup persists a failed run and touches no Drive/rows", async () => {
  const { drive, calls } = fakeDrive({ [PH]: [] }, new Set());
  const order: string[] = [];
  const m = memStore([], { failLookup: true });
  const acq = m.store.acquireRun, load = m.store.loadExisting;
  m.store.acquireRun = (x) => { order.push("lock"); return acq(x); };
  m.store.loadExisting = () => { order.push("load"); return load(); };
  await assertRejects(() => runSync(drive, m.store, { ...base, mode: "backfill" }), Error, "db down");
  assertEquals(order, ["lock", "load"]);
  assertEquals(calls.length, 0);
  assertEquals(m.rows.length, 0);
  assertEquals(m.runs[0].status, "failed");
});

Deno.test("existing Drive IDs are never re-inserted", async () => {
  const { drive } = fakeDrive({ [PH]: [vid("dup", "ALP Power Hour - 2026/08/20 12:00 GMT-04:00 - Recording")] }, new Set(["dup"]));
  const m = memStore([{ id: "dup", cls: "power_hour", date: "2026-08-20" }]);
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill" });
  assertEquals(m.rows.length, 0);
  assertEquals(r.status, "completed");
});

Deno.test("concurrent run is refused while lock is held", async () => {
  const { drive, calls } = fakeDrive({ [PH]: [] }, new Set());
  const m = memStore([], { locked: true });
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill" });
  assertEquals(r.status, "locked");
  assertEquals(calls.length, 0);
});

Deno.test("retry with backoff then success; persistent 500 errors; budget stops", async () => {
  let n = 0;
  const flaky: FetchLike = async () => (++n < 3 ? new Response("boom", { status: 503 }) : new Response("ok"));
  const res = await fetchWithRetry("u", {}, { fetch: flaky, budget: new Budget(Date.now() + 10_000), ...noSleep });
  assertEquals(await res.text(), "ok");
  assertEquals(n, 3);
  const dead: FetchLike = async () => new Response("x", { status: 500 });
  await assertRejects(() => fetchWithRetry("u", {}, { fetch: dead, budget: new Budget(Date.now() + 10_000), retries: 2, ...noSleep }), Error, "after 3 attempts");
  await assertRejects(() => fetchWithRetry("u", {}, { fetch: dead, budget: new Budget(Date.now() - 1), ...noSleep }), BudgetExceeded);
  const hang: FetchLike = (_u, init) => new Promise((_r, rej) => init!.signal!.addEventListener("abort", () => rej(new Error("aborted"))));
  await assertRejects(() => fetchWithRetry("u", {}, { fetch: hang, budget: new Budget(Date.now() + 5_000), timeoutMs: 20, retries: 1, ...noSleep }), Error, "aborted");
});

Deno.test("bounded batch reports partial + remaining, verification counted", async () => {
  const files = [1, 2, 3].map((d) => vid(`p${d}`, `ALP Power Hour - 2026/09/0${d} 12:00 GMT-04:00 - Recording`));
  const { drive } = fakeDrive({ [PH]: files }, new Set(files.map((f) => f.id)));
  const m = memStore();
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill", maxInserts: 2 });
  assertEquals([r.status, r.inserted, r.verified, r.remaining], ["partial", 2, 2, 1]);
  assertEquals(m.runs[0].status, "partial");
});

Deno.test("multipart day pairs each part with its own session notes; short/no-duration clips held", () => {
  const { items } = buildPlan({
    folders: {
      [CS]: [
        vid("s1", "ALP Contractor School - 2026/09/10 18:00 GMT-04:00 - Recording", String(90_000), "2026-09-10T23:00:00Z"),
        vid("s2", "ALP Contractor School - 2026/09/10 18:05 GMT-04:00 - Recording", LONG, "2026-09-10T23:10:00Z"),
        vid("s3", "ALP Contractor School - 2026/09/10 19:30 GMT-04:00 - Recording", null, "2026-09-11T00:40:00Z"),
        doc("n2", "ALP Contractor School - 2026/09/10 18:05 GMT-04:00 - Notes by Gemini"),
        doc("n3", "ALP Contractor School - 2026/09/10 19:30 GMT-04:00 - Notes by Gemini"),
      ],
      [SM]: [],
    },
    existingDriveIds: new Set(), existingDays: new Map(),
    access: new Map([["s1", "public_reader"], ["s2", "public_reader"], ["s3", "public_reader"]]),
    dateFrom: "2026-01-01", dateTo: "2026-12-31",
  });
  const by = Object.fromEntries(items.map((i) => [i.drive_id, i]));
  assertEquals(by.s1.disposition, "held_short_clip");
  assertEquals(by.s1.transcript_match, "ambiguous");
  assertEquals([by.s2.disposition, by.s2.transcript_doc_id, by.s2.part_number, by.s2.part_total], ["import", "n2", 1, 2]);
  assertEquals([by.s3.disposition, by.s3.transcript_doc_id], ["held_no_duration", "n3"]);
});

Deno.test("new day on an already-imported day is held, not appended", () => {
  const { items } = buildPlan({
    folders: { [PH]: [vid("z", "ALP Power Hour - 2026/08/20 15:00 GMT-04:00 - Recording")] },
    existingDriveIds: new Set(), existingDays: new Map([["power_hour|2026-08-20", [{ drive_id: "other", part_number: null, part_total: null }]]]),
    access: new Map([["z", "public_reader"]]), dateFrom: "2026-01-01", dateTo: "2026-12-31",
  });
  assertEquals(items[0].disposition, "held_day_partially_imported");
});

Deno.test("batch never splits a multi-part day", async () => {
  const files = [
    vid("a1", "ALP Power Hour - 2026/09/01 08:00 GMT-04:00 - Recording"),
    vid("b1", "ALP Power Hour - 2026/09/02 08:00 GMT-04:00 - Recording"),
    vid("b2", "ALP Power Hour - 2026/09/02 09:00 GMT-04:00 - Recording"),
  ];
  const { drive } = fakeDrive({ [PH]: files }, new Set(files.map((f) => f.id)));
  const m = memStore();
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill", maxInserts: 2 });
  assertEquals(m.rows.map((x) => x.cloudflare_video_id), ["a1"]); // b1+b2 deferred together
  assertEquals([r.status, r.remaining], ["partial", 2]);
  // first group larger than max still goes whole
  const big = selectBatch([{ class_type: "power_hour", date: "d" }, { class_type: "power_hour", date: "d" }, { class_type: "power_hour", date: "d" }] as any, 2);
  assertEquals(big.length, 3);
});

Deno.test("interrupted multi-part day resumes only when stored parts match plan; mismatched old rows stay held", () => {
  const f = [vid("p1", "ALP Power Hour - 2026/09/03 08:00 GMT-04:00 - Recording"), vid("p2", "ALP Power Hour - 2026/09/03 09:00 GMT-04:00 - Recording")];
  const mk = (part: number | null, total: number | null) => buildPlan({
    folders: { [PH]: f }, existingDriveIds: new Set(["p1"]),
    existingDays: new Map([["power_hour|2026-09-03", [{ drive_id: "p1", part_number: part, part_total: total }]]]),
    access: new Map([["p2", "public_reader"]]), dateFrom: "2026-01-01", dateTo: "2026-12-31",
  }).items.find((i) => i.drive_id === "p2")!;
  const ok = mk(1, 2);
  assertEquals([ok.disposition, ok.part_number, ok.part_total], ["import", 2, 2]);
  assertEquals(mk(null, null).disposition, "held_day_partially_imported");
});

Deno.test("heartbeat failure aborts and is surfaced; finish failure throws PersistenceError", async () => {
  const files = [vid("h1", "ALP Power Hour - 2026/09/04 08:00 GMT-04:00 - Recording")];
  const { drive } = fakeDrive({ [PH]: files }, new Set(["h1"]));
  const m = memStore();
  m.store.heartbeat = () => Promise.reject(new Error("hb down"));
  await assertRejects(() => runSync(drive, m.store, { ...base, mode: "backfill" }), Error, "hb down");
  assertEquals(m.runs[0].status, "partial");
  const m2 = memStore();
  m2.store.finishRun = () => Promise.reject(new Error("finish down"));
  await assertRejects(() => runSync(fakeDrive({ [PH]: files }, new Set(["h1"])).drive, m2.store, { ...base, mode: "backfill" }), PersistenceError, "finish down");
});

Deno.test("cron auth: missing secret, public key, wrong or absent header all fail closed", () => {
  const S = "s".repeat(40), ANON = "anon-public-key-".repeat(4);
  assertEquals(cronAuthorized(S, "", [ANON]), false);
  assertEquals(cronAuthorized(ANON, ANON, [ANON]), false);
  assertEquals(cronAuthorized("short", "short", [ANON]), false);
  assertEquals(cronAuthorized(null, S, [ANON]), false);
  assertEquals(cronAuthorized(S + "x", S, [ANON]), false);
  assertEquals(cronAuthorized(S, S, [ANON]), true);
});

Deno.test("backfill allowlist imports only exact approved IDs; others stay unimported", async () => {
  const files = [1, 2, 3].map((d) => vid(`p${d}`, `ALP Power Hour - 2026/09/0${d} 12:00 GMT-04:00 - Recording`));
  const { drive } = fakeDrive({ [PH]: files }, new Set(files.map((f) => f.id)));
  const m = memStore();
  const r: any = await runSync(drive, m.store, { ...base, mode: "backfill", allowIds: new Set(["p2"]) });
  assertEquals(m.rows.map((x) => x.cloudflare_video_id), ["p2"]);
  assertEquals([r.planned, r.inserted, r.status], [1, 1, "completed"]);
});

Deno.test("shareApproved adds anyone-reader only to approved held_not_shared videos; refuses short/unmapped/imported", async () => {
  const files = [
    vid("a", "ALP Power Hour - 2026/09/01 12:00 GMT-04:00 - Recording"),
    vid("b", "ALP Power Hour - 2026/09/02 12:00 GMT-04:00 - Recording", String(60_000)),
    vid("c", "ALP Power Hour - 2026/09/03 12:00 GMT-04:00 - Recording"),
    vid("d", "ALP Power Hour - 2026/09/04 12:00 GMT-04:00 - Recording"),
  ];
  const { drive, calls } = fakeDrive({ [PH]: files }, new Set());
  const m = memStore([{ id: "c", cls: "power_hour", date: "2026-09-03" }]);
  const res = await shareApproved(drive, m.store, ["a", "b", "c", "zzz"], "2026-01-01", "2026-12-31");
  assertEquals(res.map((x) => x.result), ["shared", "refused_held_short_clip", "refused_already_imported", "refused_not_in_mapped_folders"]);
  assert(calls.some((c) => c.startsWith("GET") && c.includes("/files/a?")));
  const posts = calls.filter((c) => c.startsWith("POST"));
  assertEquals(posts.length, 1);
  assert(posts[0].includes("/files/a/permissions"));
  assertEquals(m.writes(), 0);
});

// ---------- Link-sharing on publish ----------
const day = (d: number) => `ALP Power Hour - 2026/09/${String(d).padStart(2, "0")} 12:00 GMT-04:00 - Recording`;

Deno.test("publish: unshared qualified video gets anyone-reader, read back, then inserted", async () => {
  const fd = fakeDrive({ [PH]: [vid("n1", day(1))] }, new Set());
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals([r.status, r.inserted], ["completed", 1]);
  assertEquals(r.details.shared_drive_ids, ["n1"]);
  assertEquals(posts(fd.calls).length, 1);
  const body = fd.calls.find((c) => c.startsWith("POST"))!;
  assert(body.includes("/files/n1/permissions"));
  assertEquals(m.rows[0].is_published, true);
});

Deno.test("publish: already-shared video is verified with no permission write", async () => {
  const fd = fakeDrive({ [PH]: [vid("s1", day(2))] }, new Set(["s1"]));
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals([r.inserted, r.details.shared_drive_ids.length, posts(fd.calls).length], [1, 0, 0]);
});

Deno.test("publish: 403 denial fails closed, nothing inserted, run stops with actionable sanitized error", async () => {
  const fd = fakeDrive({ [PH]: [vid("d1", day(3)), vid("d2", day(4))] }, new Set(), 200, { postStatus: { d1: 403 } });
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals(m.rows.length, 0);
  assertEquals(r.status, "failed");
  assert(r.details.errors.some((e: string) => e.includes("403") && !e.includes("@example.com")));
  assert(r.details.errors.some((e: string) => e.includes("edit rights")));
  assertEquals(posts(fd.calls).length, 1); // d2 never attempted
});

Deno.test("publish: transient 503 on share is retried then succeeds", async () => {
  const fd = fakeDrive({ [PH]: [vid("t1", day(5))] }, new Set(), 200, { transient: { t1: 2 } });
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals([r.inserted, posts(fd.calls).length], [1, 3]);
});

Deno.test("publish: read-back not confirming access blocks insert", async () => {
  const fd = fakeDrive({ [PH]: [vid("r1", day(6))] }, new Set(), 200, { ignorePost: new Set(["r1"]) });
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals(m.rows.length, 0);
  assert(r.details.errors[0].includes("not confirmed"));
});

Deno.test("publish: short clips, unreadable access and other folders' files are never shared", async () => {
  const fd = fakeDrive({
    [PH]: [vid("sh", day(7), String(9_000)), vid("un", day(8)), vid("cs", "ALP Contractor School - 2026/09/09 19:00 GMT-04:00 - Recording")],
  }, new Set(), 200, { readFail: new Set(["un"]) });
  const m = memStore();
  const r: any = await runSync(fd.drive, m.store, { ...base, mode: "backfill" });
  assertEquals(m.rows.length, 0);
  assertEquals(posts(fd.calls).length, 0);
  assertEquals(r.details.held_items.map((i: any) => [i.drive_id, i.disposition]).sort(), [["sh", "held_short_clip"], ["un", "held_access_unknown"]]);
});

Deno.test("audit: repairs only validated published rows; held/unrelated/short untouched; dry audit writes nothing", async () => {
  const LEG = "1L6oYkecAzBPowfYfMZ82c8UF-Ctpgn2E";
  const folders = {
    [PH]: [vid("p_url", day(17)), vid("p_ok", day(10)), vid("p_shared", day(11)), vid("p_short", day(12), String(9_000)), vid("held", day(13), String(9_000))],
    [CS]: [], [SM]: [],
    [LEG]: [vid("leg", "ALP Sales and Marketing School - 2026/07/08 19:00 GMT-04:00 - Recording"), vid("priv", "1 on 1 with Marshall - 2026/08/19 13:00 GMT-04:00 - Recording")],
  };
  const rows = [
    { id: "p_ok", cls: "power_hour", date: "2026-09-10" }, { id: "p_shared", cls: "power_hour", date: "2026-09-11" },
    { id: "p_short", cls: "power_hour", date: "2026-09-12" }, { id: "leg", cls: "sales_marketing_school", date: "2026-07-08" },
    { id: "priv", cls: "power_hour", date: "2026-08-19" }, { id: "gone", cls: "power_hour", date: "2026-09-01" },
    { id: "unpub", cls: "power_hour", date: "2026-09-14", pub: false },
    { id: "https://drive.google.com/file/d/p_url/view?usp=sharing", cls: "power_hour", date: "2026-09-17" },
  ];
  const dry = fakeDrive(folders, new Set(["p_shared"]));
  const a: any = await auditSharing(dry.drive, memStore(rows).store, false);
  assertEquals(posts(dry.calls).length, 0);
  assertEquals(a.counts, { needs_repair: 3, ok_already_shared: 1, skipped_short_or_no_duration: 1, skipped_class_mismatch: 1, skipped_not_in_source_folders: 1 });
  const live = fakeDrive(folders, new Set(["p_shared"]));
  const b: any = await auditSharing(live.drive, memStore(rows).store, true);
  assertEquals(b.counts.repaired, 3);
  assertEquals(posts(live.calls).map((c) => c.split("/files/")[1].split("/")[0]).sort(), ["leg", "p_ok", "p_url"]);
  for (const id of ["held", "p_short", "priv", "unpub"]) assert(!live.publicIds.has(id));
});

Deno.test("audit: stops at first 403 and reports the rest as not attempted", async () => {
  const folders = { [PH]: [vid("x1", day(15)), vid("x2", day(16))], [CS]: [], [SM]: [], "1L6oYkecAzBPowfYfMZ82c8UF-Ctpgn2E": [] };
  const fd = fakeDrive(folders, new Set(), 200, { postStatus: { x1: 403 } });
  const r: any = await auditSharing(fd.drive, memStore([{ id: "x1", cls: "power_hour", date: "2026-09-15" }, { id: "x2", cls: "power_hour", date: "2026-09-16" }]).store, true);
  assertEquals([r.ok, r.denied, r.counts.error, r.counts.not_attempted_after_denial], [false, true, 1, 1]);
});
