// Orchestration with injectable store + drive so it can be tested without network/DB.
import { buildPlan, extractDriveId, FOLDER_MAP, summarize, type Access, type ClassType, type DriveFile, type PlanItem } from "./logic.ts";
import { BudgetExceeded, type DriveClient } from "./drive.ts";

export type ExistingRow = { cloudflare_video_id: string | null; video_ref: string | null; class_type: string; recording_date: string };

export type NewRow = {
  title: string; class_type: ClassType; recording_date: string; video_source: "google_drive";
  video_ref: string; cloudflare_video_id: string; transcript_doc_id: string | null;
  part_number: number | null; part_total: number | null; is_published: boolean;
};

export interface Store {
  loadExisting(): Promise<ExistingRow[]>; // must throw on error (fail closed)
  acquireRun(meta: Record<string, unknown>): Promise<string | null>; // null => another run active
  heartbeat(runId: string, patch: Record<string, unknown>): Promise<void>;
  finishRun(runId: string, patch: Record<string, unknown>): Promise<void>;
  insert(row: NewRow): Promise<{ ok: true } | { ok: false; duplicate: boolean; error: string }>;
  countByDriveIds(ids: string[]): Promise<number>;
}

export type SyncOpts = {
  mode: "dry_run" | "backfill" | "scheduled";
  dateFrom: string;
  dateTo: string;
  maxInserts: number;
  triggeredBy: string;
  titleFor: (item: PlanItem, transcript: string | null) => Promise<string>;
};

export async function runSync(drive: DriveClient, store: Store | null, o: SyncOpts) {
  const dry = o.mode === "dry_run";
  if (!dry && !store) throw new Error("store required for writes");

  // 1) Dedupe source of truth. Fail closed: any error aborts before planning.
  const existing = await (store ?? { loadExisting: () => Promise.reject(new Error("no store")) }).loadExisting();
  const existingDriveIds = new Set<string>();
  const existingDays = new Set<string>();
  for (const r of existing) {
    if (r.cloudflare_video_id) existingDriveIds.add(r.cloudflare_video_id);
    const id = extractDriveId(r.video_ref);
    if (id) existingDriveIds.add(id);
    existingDays.add(`${r.class_type}|${r.recording_date}`);
  }

  // 2) Concurrency lock (writes only).
  let runId: string | null = null;
  if (!dry) {
    runId = await store!.acquireRun({ mode: o.mode, triggered_by: o.triggeredBy, date_from: o.dateFrom, date_to: o.dateTo });
    if (!runId) return { ok: false, status: "locked", error: "Another sync run is in progress" };
  }

  const errors: string[] = [];
  try {
    const folders: Record<string, DriveFile[]> = {};
    for (const folderId of Object.keys(FOLDER_MAP)) folders[folderId] = await drive.listFolder(folderId);
    const scanned = Object.values(folders).reduce((n, f) => n + f.length, 0);

    // 3) Read-only access check for candidate (new, in-range) videos.
    const prelim = buildPlan({ folders, existingDriveIds, existingDays, access: new Map(), dateFrom: o.dateFrom, dateTo: o.dateTo });
    const access = new Map<string, Access>();
    for (const it of prelim.items) {
      if (it.disposition === "already_imported" || it.disposition === "out_of_range") continue;
      access.set(it.drive_id, await drive.readAccess(it.drive_id));
    }
    const { items, ignored } = buildPlan({ folders, existingDriveIds, existingDays, access, dateFrom: o.dateFrom, dateTo: o.dateTo });
    const toImport = items.filter((i) => i.disposition === "import");
    const report = {
      scanned,
      counts: summarize(items),
      ignored_count: ignored.length,
      ignored_reasons: ignored.reduce<Record<string, number>>((a, i) => ((a[i.reason] = (a[i.reason] ?? 0) + 1), a), {}),
    };

    if (dry) {
      return {
        ok: true, mode: "dry_run", date_from: o.dateFrom, date_to: o.dateTo, ...report,
        would_insert: toImport.length,
        items: items.filter((i) => i.disposition !== "out_of_range"),
        ignored,
      };
    }

    // 4) Bounded batch insert with per-row verification.
    const batch = toImport.slice(0, o.maxInserts);
    const insertedIds: string[] = [];
    let skippedDup = 0;
    for (const it of batch) {
      let transcript: string | null = null;
      try {
        const title = await o.titleFor(it, transcript);
        const r = await store!.insert({
          title, class_type: it.class_type, recording_date: it.date, video_source: "google_drive",
          video_ref: `https://drive.google.com/file/d/${it.drive_id}/view?usp=sharing`,
          cloudflare_video_id: it.drive_id, transcript_doc_id: it.transcript_doc_id,
          part_number: it.part_number, part_total: it.part_total, is_published: true,
        });
        if (r.ok) insertedIds.push(it.drive_id);
        else if (r.duplicate) skippedDup++;
        else errors.push(`${it.drive_id}: ${r.error}`);
      } catch (e) {
        if (e instanceof BudgetExceeded) { errors.push(`budget: ${e.message}`); break; }
        errors.push(`${it.drive_id}: ${(e as Error).message}`);
      }
      transcript = null;
      await store!.heartbeat(runId!, { inserted: insertedIds.length });
    }
    const verified = insertedIds.length ? await store!.countByDriveIds(insertedIds) : 0;
    if (verified !== insertedIds.length) errors.push(`verification mismatch: inserted ${insertedIds.length}, found ${verified}`);
    const held = items.filter((i) => i.disposition.startsWith("held_")).length;
    const remaining = toImport.length - insertedIds.length - skippedDup;
    const status = errors.length ? (insertedIds.length ? "partial" : "failed") : remaining > 0 ? "partial" : "completed";
    const summary = {
      status, scanned, planned: toImport.length, inserted: insertedIds.length, verified, held,
      skipped: skippedDup, remaining, error_count: errors.length,
      details: { ...report, errors, inserted_drive_ids: insertedIds,
        held_items: items.filter((i) => i.disposition.startsWith("held_")) },
    };
    await store!.finishRun(runId!, { ...summary, finished_at: new Date().toISOString() });
    return { ok: errors.length === 0, run_id: runId, mode: o.mode, ...summary };
  } catch (e) {
    const msg = (e as Error).message ?? String(e);
    if (runId) await store!.finishRun(runId, { status: "failed", error_count: errors.length + 1, details: { errors: [...errors, msg] }, finished_at: new Date().toISOString() });
    throw e;
  }
}
