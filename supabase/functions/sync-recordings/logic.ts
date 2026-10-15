// Pure planning logic for sync-recordings (no I/O). Unit-tested in logic_test.ts.

export type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";

// Explicit folder -> class mapping. NEVER scan the parent meetings folder
// (1ljdJTWo6CBRn2mQOe7Xuxb9CE_EBgx6Q); it holds private/unrelated meetings.
export const FOLDER_MAP: Record<string, ClassType> = {
  "1w3T_y09cILdUORwtXi9114CVp7liXymo": "power_hour",
  "1mDB9Q94Bod2AyiOtqCPWHI4Q4uR_zyoH": "contractor_school",
  "19mjrFh3F5psK0c1AWlYygQN8A3EE2Szo": "sales_marketing_school",
};
// Audit-only: the legacy sync folder holds older published replays mixed with private meetings.
// It is listed only to validate rows already published from it; it is never an import source.
export const LEGACY_AUDIT_FOLDERS: Record<string, true> = { "1L6oYkecAzBPowfYfMZ82c8UF-Ctpgn2E": true };
export const FORBIDDEN_FOLDERS = new Set(["1ljdJTWo6CBRn2mQOe7Xuxb9CE_EBgx6Q"]);

// Clips shorter than this are held for manual review (aborted starts).
export const MIN_DURATION_MS = 5 * 60_000;

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: string;
  videoMediaMetadata?: { durationMillis?: string };
  parents?: string[];
};

export type Access = "public_reader" | "not_public" | "unknown";

export type Disposition =
  | "import"
  | "import_needs_share" // qualified; link-reader must be added and read back before publishing
  | "already_imported"
  | "held_not_shared"
  | "held_access_unknown"
  | "held_short_clip"
  | "held_no_duration"
  | "held_day_partially_imported"
  | "out_of_range";

export type PlanItem = {
  drive_id: string;
  name: string;
  class_type: ClassType;
  date: string;
  session_time: string | null;
  size_bytes: number | null;
  duration_ms: number | null;
  access: Access;
  disposition: Disposition;
  transcript_doc_id: string | null;
  transcript_match: "exact_session" | "only_doc_on_day" | "none" | "ambiguous";
  part_number: number | null;
  part_total: number | null;
};

export type Ignored = { drive_id: string; name: string; folder: string; reason: string };

export function classify(name: string): ClassType | null {
  const n = name.toLowerCase();
  if (n.startsWith("alp hardcore power hour") || n.startsWith("alp power hour")) return "power_hour";
  if (n.startsWith("alp contractor school")) return "contractor_school";
  if (
    n.startsWith("alp sales and marketing") || n.startsWith("alp sales & marketing") ||
    n.startsWith("alp sales marketing")
  ) return "sales_marketing_school";
  return null;
}

/** Session date + start time from the Meet file name: "... - 2026/09/30 18:53 GMT-04:00 - ..." */
export function parseSession(name: string): { date: string; time: string | null } | null {
  const m = name.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const time = m[4] ? `${m[4].padStart(2, "0")}:${m[5]}` : null;
  return { date: `${m[1]}-${m[2]}-${m[3]}`, time };
}

export const isVideo = (f: DriveFile) => f.mimeType.startsWith("video/");
export const isNotesDoc = (f: DriveFile) =>
  f.mimeType === "application/vnd.google-apps.document" && /notes by gemini/i.test(f.name);
export const isShortcut = (f: DriveFile) => f.mimeType === "application/vnd.google-apps.shortcut";

export type ExistingPart = { drive_id: string | null; part_number: number | null; part_total: number | null };

export type PlanInput = {
  folders: Record<string, DriveFile[]>; // folderId -> files
  existingDriveIds: Set<string>;
  // `${class}|${date}` -> rows already stored for that day
  existingDays: Map<string, ExistingPart[]>;
  access: Map<string, Access>; // drive id -> access (videos only)
  dateFrom: string;
  dateTo: string;
};

export function buildPlan(input: PlanInput): { items: PlanItem[]; ignored: Ignored[] } {
  const ignored: Ignored[] = [];
  type Entry = { f: DriveFile; cls: ClassType; date: string; time: string | null };
  const videos: Entry[] = [];
  const docs: Entry[] = [];

  for (const [folder, files] of Object.entries(input.folders)) {
    if (FORBIDDEN_FOLDERS.has(folder)) throw new Error(`Refusing to scan forbidden folder ${folder}`);
    const folderCls = FOLDER_MAP[folder];
    if (!folderCls) throw new Error(`Unmapped folder ${folder}`);
    for (const f of files) {
      if (isShortcut(f)) { ignored.push({ drive_id: f.id, name: f.name, folder, reason: "shortcut" }); continue; }
      const cls = classify(f.name);
      if (!cls) { ignored.push({ drive_id: f.id, name: f.name, folder, reason: "unknown_prefix" }); continue; }
      if (cls !== folderCls) { ignored.push({ drive_id: f.id, name: f.name, folder, reason: "class_folder_mismatch" }); continue; }
      const s = parseSession(f.name);
      if (!s) { ignored.push({ drive_id: f.id, name: f.name, folder, reason: "no_date" }); continue; }
      const e = { f, cls, date: s.date, time: s.time };
      if (isVideo(f)) videos.push(e);
      else if (isNotesDoc(f)) docs.push(e);
    }
  }

  // Group videos by class/day; parts ordered by session start time then createdTime.
  const byDay = new Map<string, Entry[]>();
  for (const v of videos) {
    const k = `${v.cls}|${v.date}`;
    byDay.set(k, [...(byDay.get(k) ?? []), v]);
  }

  const items: PlanItem[] = [];
  for (const [key, list] of byDay) {
    list.sort((a, b) =>
      (a.time ?? "").localeCompare(b.time ?? "") || a.f.createdTime.localeCompare(b.f.createdTime)
    );
    const dayDocs = docs.filter((d) => `${d.cls}|${d.date}` === key);
    // Aborted/short starts don't count toward "Part N of M".
    const isShort = (v: Entry) => {
      const d = Number(v.f.videoMediaMetadata?.durationMillis);
      return Number.isFinite(d) && d < MIN_DURATION_MS;
    };
    const real = list.filter((v) => !isShort(v));
    const total = real.length;
    // A day with stored rows may only receive more parts when it is a safe resume:
    // every stored row is one of this day's planned parts with identical numbering.
    const stored = input.existingDays.get(key) ?? [];
    const resumable = stored.every((r) => {
      const v = real.find((x) => x.f.id === r.drive_id);
      if (!v) return false;
      const pn = total > 1 ? real.indexOf(v) + 1 : null;
      const pt = total > 1 ? total : null;
      return (r.part_number ?? null) === pn && (r.part_total ?? null) === pt;
    });
    const dayBlocked = stored.length > 0 && !resumable;

    list.forEach((v) => {
      // Transcript pairing: exact session start time first; else the single doc for the day.
      let doc: Entry | undefined;
      let match: PlanItem["transcript_match"] = "none";
      const exact = dayDocs.filter((d) => d.time && d.time === v.time);
      if (exact.length >= 1) {
        doc = exact.sort((a, b) => b.f.createdTime.localeCompare(a.f.createdTime))[0];
        match = "exact_session";
      } else if (dayDocs.length === 1) {
        doc = dayDocs[0];
        match = "only_doc_on_day";
      } else if (dayDocs.length > 1) {
        match = "ambiguous";
      }

      const dur = v.f.videoMediaMetadata?.durationMillis;
      const durationMs = dur != null ? Number(dur) : null;
      const access = input.access.get(v.f.id) ?? "unknown";
      let disposition: Disposition;
      if (input.existingDriveIds.has(v.f.id)) disposition = "already_imported";
      else if (v.date < input.dateFrom || v.date > input.dateTo) disposition = "out_of_range";
      else if (durationMs == null || !Number.isFinite(durationMs)) disposition = "held_no_duration";
      else if (durationMs < MIN_DURATION_MS) disposition = "held_short_clip";
      else if (access === "unknown") disposition = "held_access_unknown";
      else if (dayBlocked) disposition = "held_day_partially_imported";
      else if (access !== "public_reader") disposition = "import_needs_share";
      else disposition = "import";

      items.push({
        drive_id: v.f.id,
        name: v.f.name,
        class_type: v.cls,
        date: v.date,
        session_time: v.time,
        size_bytes: v.f.size != null ? Number(v.f.size) : null,
        duration_ms: durationMs,
        access,
        disposition,
        transcript_doc_id: doc?.f.id ?? null,
        transcript_match: match,
        part_number: total > 1 && !isShort(v) ? real.indexOf(v) + 1 : null,
        part_total: total > 1 && !isShort(v) ? total : null,
      });
    });
  }
  items.sort((a, b) => a.date.localeCompare(b.date) || a.class_type.localeCompare(b.class_type) ||
    (a.part_number ?? 0) - (b.part_number ?? 0));
  return { items, ignored };
}

export function summarize(items: PlanItem[]) {
  const counts: Record<string, number> = {};
  for (const i of items) counts[i.disposition] = (counts[i.disposition] ?? 0) + 1;
  return counts;
}

export function extractDriveId(ref: string | null | undefined): string | null {
  return ref?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? null;
}

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function timingSafeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

/** True only when the dedicated cron secret is configured, is not a public key, and matches exactly. */
export function cronAuthorized(header: string | null, secret: string, publicKeys: string[]): boolean {
  if (!secret || secret.length < 32 || publicKeys.includes(secret)) return false;
  if (!header) return false;
  return timingSafeEqual(header, secret);
}
