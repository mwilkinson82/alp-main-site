export const FOLDER_KEYS = ['legacy', 'power', 'school', 'sales'] as const;
// Deployment configuration, never caller-controlled. Real identifiers stay out of this public repo.
export function approvedFolders(raw: string | undefined): string[] {
  const config = JSON.parse(raw ?? '{}');
  if (!config || Object.keys(config).sort().join(',') !== [...FOLDER_KEYS].sort().join(',')) throw new Error('invalid_folder_configuration');
  const ids = FOLDER_KEYS.map(key => config[key]);
  if (ids.some(id => typeof id !== 'string' || !/^[a-zA-Z0-9_-]{10,}$/.test(id)) || new Set(ids).size !== 4) throw new Error('invalid_folder_configuration');
  return ids;
}
export type File = { id: string; name: string; mimeType: string; size?: string; parents: string[] };
export type Recording = { id: string; video_ref: string; transcript_doc_id: string | null };
export function driveId(ref: string): string | null {
  if (/^[\w-]{10,}$/.test(ref)) return ref;
  try {
    const u = new URL(ref);
    if (u.hostname !== 'drive.google.com') return null;
    return u.pathname.match(/\/d\/([\w-]+)/)?.[1] ?? u.searchParams.get('id');
  } catch { return null; }
}
export function session(name: string) {
  const m = name.trim().match(/^(ALP (?:Hardcore Power Hour|Power Hour|Contractor School|Sales and Marketing School|Sales & Marketing School|Sales Marketing School))\s*-\s*(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}) GMT([+-]\d{2}:\d{2})\s*-\s*(Recording|Notes by Gemini|Transcript)$/i);
  if (!m) return null;
  const date = `${m[2]}-${m[3]}-${m[4]}`;
  const instant = `${date}T${m[5]}:00${m[6]}`;
  if (!Number.isFinite(Date.parse(instant))) return null;
  const program = /power/i.test(m[1]) ? 'power_hour' : /contractor/i.test(m[1]) ? 'contractor_school' : 'sales_marketing_school';
  return { key: `${m[1].toLowerCase().replace(/\s+/g, ' ')}|${instant}`, date, program, kind: m[7].toLowerCase() };
}
export function plan(files: File[], existing: Recording[], start: string, end: string, folders: string[]) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start < '2026-08-21' || end <= start) throw new Error('invalid_session_bounds');
  const unique = [...new Map(files.filter(f => f.parents?.some(p => folders.includes(p))).map(f => [f.id, f])).values()];
  const videos = unique.filter(f => f.mimeType.startsWith('video/'));
  const docs = unique.filter(f => f.mimeType === 'application/vnd.google-apps.document');
  return videos.flatMap(v => {
    const s = session(v.name);
    if (s && (s.date < start || s.date >= end)) return [];
    const matches = s ? docs.filter(d => { const ds = session(d.name); return ds?.key === s.key && ds.kind === 'notes by gemini'; }) : [];
    const rows = existing.filter(r => driveId(r.video_ref) === v.id);
    const reasons: string[] = [];
    if (!s) reasons.push('unrecognized_session_title');
    if (v.size === undefined || !Number.isFinite(Number(v.size))) reasons.push('unknown_size');
    else if (Number(v.size) < 1_000_000) reasons.push('tiny_clip');
    if (matches.length !== 1) reasons.push(matches.length ? 'multiple_exact_notes' : 'no_exact_notes');
    if (rows.length > 1) reasons.push('duplicate_existing_drive_id');
    if (s && videos.filter(f => { const fs = session(f.name); return fs?.program === s.program && fs.date === s.date; }).length > 1) reasons.push('multiple_files_same_class_day');
    const old = rows[0];
    if (old?.transcript_doc_id && matches.length === 1 && old.transcript_doc_id !== matches[0].id) reasons.push('existing_artifact_conflict');
    return [{ video_file_id: v.id, session: s, recording_id: old?.id ?? null,
      note_id: matches.length === 1 ? matches[0].id : null,
      proposed_action: reasons.length ? 'review' : old ? old.transcript_doc_id ? 'unchanged' : 'refresh_artifact' : 'stage_unpublished',
      reasons, is_published: false, permissions_change: false }];
  });
}

// No mutation capability is accepted by this scanner. Empty pages still follow tokens.
export async function scan(read: (url: string) => Promise<{ files?: File[]; nextPageToken?: string; incompleteSearch?: boolean }>, deadline: number, folders: string[]) {
  const files: File[] = [];
  let pages = 0;
  for (const folder of folders) {
    let token = '';
    const seen = new Set<string>();
    do {
      if (Date.now() >= deadline || ++pages > 100) throw new Error('scan_budget_exceeded');
      const q = new URLSearchParams({ q: `'${folder}' in parents and trashed=false`, pageSize: '200', fields: 'nextPageToken,incompleteSearch,files(id,name,mimeType,size,parents)', ...(token ? { pageToken: token } : {}) });
      const page = await read(`https://connector-gateway.lovable.dev/google_drive/drive/v3/files?${q}`);
      if (page.incompleteSearch) throw new Error('incomplete_drive_search');
      files.push(...(page.files ?? []));
      token = page.nextPageToken ?? '';
      if (token && seen.has(token)) throw new Error('repeated_page_token');
      seen.add(token);
    } while (token);
  }
  return { files, pages };
}
