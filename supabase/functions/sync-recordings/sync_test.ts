import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import { Budget, BudgetExceeded, fetchWithRetry, makeDrive, type FetchLike } from "./drive.ts";
import { buildPlan, FOLDER_MAP, type DriveFile } from "./logic.ts";
import { runSync, type NewRow, type Store } from "./sync.ts";

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
function fakeDrive(folders: Record<string, DriveFile[]>, publicIds: Set<string>, pageSize = 200) {
  const calls: string[] = [];
  const f: FetchLike = async (url, init) => {
    calls.push(`${init?.method ?? "GET"} ${url}`);
    const u = new URL(url);
    if (u.pathname.endsWith("/files")) {
      const folder = u.searchParams.get("q")!.match(/'([^']+)'/)![1];
      const all = folders[folder] ?? [];
      const start = Number(u.searchParams.get("pageToken") ?? 0);
      const files = all.slice(start, start + pageSize);
      const next = start + pageSize < all.length ? String(start + pageSize) : undefined;
      return Response.json({ files, nextPageToken: next });
    }
    const id = u.pathname.split("/files/")[1];
    return Response.json({ permissions: publicIds.has(id) ? [{ type: "anyone", role: "reader" }] : [{ type: "user", role: "owner" }] });
  };
  const budget = new Budget(Date.now() + 60_000);
  return { drive: makeDrive({}, { fetch: f, budget, ...noSleep }), calls };
}

function memStore(existing: Array<{ id: string; cls: string; date: string }> = [], opts: { failLookup?: boolean; locked?: boolean } = {}) {
  const rows: NewRow[] = [];
  const runs: Record<string, unknown>[] = [];
  let writes = 0;
  const store: Store = {
    async loadExisting() {
      if (opts.failLookup) throw new Error("db down");
      return existing.map((e) => ({ cloudflare_video_id: e.id, video_ref: `https://drive.google.com/file/d/${e.id}/view`, class_type: e.cls, recording_date: e.date }));
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
  assertEquals(r.items[0].disposition, "held_not_shared");
});

Deno.test("failed dedupe lookup fails closed before any Drive or DB write", async () => {
  const { drive, calls } = fakeDrive({ [PH]: [] }, new Set());
  const m = memStore([], { failLookup: true });
  await assertRejects(() => runSync(drive, m.store, { ...base, mode: "backfill" }), Error, "db down");
  assertEquals(calls.length, 0);
  assertEquals(m.writes(), 0);
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
