// Orchestration with injectable store + drive so it can be tested without network/DB.
import { buildPlan, extractDriveId, FOLDER_MAP, summarize, type Access, type ClassType, type DriveFile, type ExistingPart, type PlanItem } from "./logic.ts";
import { BudgetExceeded, type DriveClient } from "./drive.ts";

export type ExistingRow = {
  cloudflare_video_id: string | null; video_ref: string | null; class_type: string; recording_date: string;
  part_number?: number | null; part_total?: number | null;
};

export type NewRow = {
  title: string; class_type: ClassType; recording_date: string; video_source: "google_drive";
  video_ref: string; cloudflare_video_id: string; transcript_doc_id: string | null;
  part_number: number | null; part_total: number | null; is_published: boolean;
};

/** All methods must throw on persistence failure (fail closed). */
export interface Store {
  loadExisting(): Promise<ExistingRow[]>;
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
  titleFor: (item: PlanItem) => Promise<string>;
  /** Admin backfill only: import nothing outside this exact Drive-ID allowlist. */
  allowIds?: Set<string>;
};

export class PersistenceError extends Error {}

function indexExisting(existing: ExistingRow[]) {
  const existingDriveIds = new Set<string>();
  const existingDays = new Map<string, ExistingPart[]>();
  for (const r of existing) {
    const id = r.cloudflare_video_id ?? extractDriveId(r.video_ref);
    if (r.cloudflare_video_id) existingDriveIds.add(r.cloudflare_video_id);
    const refId = extractDriveId(r.video_ref);
    if (refId) existingDriveIds.add(refId);
    const k = `${r.class_type}|${r.recording_date}`;
    existingDays.set(k, [...(existingDays.get(k) ?? []), { drive_id: id, part_number: r.part_number ?? null, part_total: r.part_total ?? null }]);
  }
  return { existingDriveIds, existingDays };
}

/** Groups import items into whole class/day groups so a batch never splits a multi-part day. */
export function selectBatch(items: PlanItem[], max: number): PlanItem[] {
  const groups = new Map<string, PlanItem[]>();
  for (const i of items) {
    const k = `${i.class_type}|${i.date}`;
    groups.set(k, [...(groups.get(k) ?? []), i]);
  }
  const out: PlanItem[] = [];
  for (const g of groups.values()) {
    if (out.length > 0 && out.length + g.length > max) break;
    out.push(...g); // first group always fits whole, even if larger than max
  }
  return out;
}

async function plan(drive: DriveClient, existing: ExistingRow[], o: SyncOpts) {
  const { existingDriveIds, existingDays } = indexExisting(existing);
  const folders: Record<string, DriveFile[]> = {};
  for (const folderId of Object.keys(FOLDER_MAP)) folders[folderId] = await drive.listFolder(folderId);
  const scanned = Object.values(folders).reduce((n, f) => n + f.length, 0);
  const prelim = buildPlan({ folders, existingDriveIds, existingDays, access: new Map(), dateFrom: o.dateFrom, dateTo: o.dateTo });
  const access = new Map<string, Access>();
  for (const it of prelim.items) {
    if (it.disposition === "already_imported" || it.disposition === "out_of_range") continue;
    access.set(it.drive_id, await drive.readAccess(it.drive_id)); // read-only
  }
  const { items, ignored } = buildPlan({ folders, existingDriveIds, existingDays, access, dateFrom: o.dateFrom, dateTo: o.dateTo });
  const report = {
    scanned,
    counts: summarize(items),
    ignored_count: ignored.length,
    ignored_reasons: ignored.reduce<Record<string, number>>((a, i) => ((a[i.reason] = (a[i.reason] ?? 0) + 1), a), {}),
  };
  return { items, ignored, report, scanned };
}

export async function runSync(drive: DriveClient, store: Store | null, o: SyncOpts) {
  if (!store) throw new Error("store required");

  if (o.mode === "dry_run") {
    // Read-only: fresh lookup, no lock row, no inserts, no permission mutations.
    const existing = await store.loadExisting();
    const { items, ignored, report } = await plan(drive, existing, o);
    return {
      ok: true, mode: "dry_run", date_from: o.dateFrom, date_to: o.dateTo, ...report,
      would_insert: items.filter((i) => i.disposition === "import").length,
      items: items.filter((i) => i.disposition !== "out_of_range"),
      ignored,
    };
  }

  // 1) Lock first, then load a fresh dedupe snapshot under the lock.
  const runId = await store.acquireRun({ mode: o.mode, triggered_by: o.triggeredBy, date_from: o.dateFrom, date_to: o.dateTo });
  if (!runId) return { ok: false, status: "locked", error: "Another sync run is in progress" };

  const errors: string[] = [];
  const insertedIds: string[] = [];
  try {
    const existing = await store.loadExisting(); // throws => run persisted as failed below
    const { items, report, scanned } = await plan(drive, existing, o);
    const toImport = items.filter((i) => i.disposition === "import" && (!o.allowIds || o.allowIds.has(i.drive_id)));
    const batch = selectBatch(toImport, o.maxInserts);

    let skippedDup = 0;
    for (const it of batch) {
      try {
        const title = await o.titleFor(it);
        const r = await store.insert({
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
      await store.heartbeat(runId, { inserted: insertedIds.length }); // throws => aborts run
    }
    const verified = insertedIds.length ? await store.countByDriveIds(insertedIds) : 0;
    if (verified !== insertedIds.length) errors.push(`verification mismatch: inserted ${insertedIds.length}, found ${verified}`);
    const held = items.filter((i) => i.disposition.startsWith("held_")).length;
    const remaining = toImport.length - insertedIds.length - skippedDup;
    const status = errors.length ? (insertedIds.length ? "partial" : "failed") : remaining > 0 ? "partial" : "completed";
    const summary = {
      status, scanned, planned: toImport.length, inserted: insertedIds.length, verified, held,
      skipped: skippedDup, remaining, error_count: errors.length,
      details: { ...report, errors, inserted_drive_ids: insertedIds, held_items: items.filter((i) => i.disposition.startsWith("held_")) },
    };
    try {
      await store.finishRun(runId, { ...summary, finished_at: new Date().toISOString() });
    } catch (e) {
      throw new PersistenceError(`Run ${runId} finished (${status}, inserted ${insertedIds.length}) but its record could not be saved: ${(e as Error).message}`);
    }
    return { ok: errors.length === 0, run_id: runId, mode: o.mode, ...summary };
  } catch (e) {
    if (e instanceof PersistenceError) throw e;
    const msg = (e as Error).message ?? String(e);
    try {
      await store.finishRun(runId, {
        status: insertedIds.length ? "partial" : "failed", inserted: insertedIds.length, error_count: errors.length + 1,
        details: { errors: [...errors, msg], inserted_drive_ids: insertedIds }, finished_at: new Date().toISOString(),
      });
    } catch (e2) {
      throw new PersistenceError(`${msg}; additionally the failed run record could not be saved: ${(e2 as Error).message}`);
    }
    throw e;
  }
}

/**
 * Admin-only: adds an anyone-reader link permission to an exact approved ID list.
 * Each ID is revalidated against the folder map/class/date plan and must be a full-length,
 * not-yet-imported video currently held only because it is not shared. Anything else is refused.
 */
export async function shareApproved(drive: DriveClient, store: Store, ids: string[], dateFrom: string, dateTo: string) {
  const existing = await store.loadExisting();
  const { items } = await plan(drive, existing, { mode: "dry_run", dateFrom, dateTo, maxInserts: 0, triggeredBy: "", titleFor: async () => "" });
  const byId = new Map(items.map((i) => [i.drive_id, i]));
  const results: Array<{ drive_id: string; class_type?: string; date?: string; result: string }> = [];
  for (const id of ids) {
    const it = byId.get(id);
    if (!it) { results.push({ drive_id: id, result: "refused_not_in_mapped_folders" }); continue; }
    const base = { drive_id: id, class_type: it.class_type, date: it.date };
    if (it.disposition === "import") { results.push({ ...base, result: "already_shared" }); continue; }
    if (it.disposition !== "held_not_shared") { results.push({ ...base, result: `refused_${it.disposition}` }); continue; }
    try { await drive.addAnyoneReader(id); results.push({ ...base, result: "shared" }); }
    catch (e) { results.push({ ...base, result: `error: ${(e as Error).message}` }); }
  }
  return results;
}
