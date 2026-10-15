// Drive gateway client with bounded timeouts, retries, backoff and a shared deadline.
// Error messages are built only from allowlisted fields (operation, file ID, HTTP status, classification);
// provider response bodies and network exception text are never included.
import type { Access, DriveFile } from "./logic.ts";

export const GATEWAY = "https://connector-gateway.lovable.dev/google_drive/drive/v3";

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export class Budget {
  constructor(public deadline: number, private now: () => number = Date.now) {}
  remaining() { return this.deadline - this.now(); }
  expired() { return this.remaining() <= 0; }
}

export class BudgetExceeded extends Error {}

export type RetryOpts = {
  fetch: FetchLike;
  budget: Budget;
  timeoutMs?: number;
  retries?: number;
  baseDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Safe, actionable classification of an HTTP status. */
export function classifyStatus(status: number): string {
  if (status === 0) return "network_error";
  if (status === 401) return "auth_rejected";
  if (status === 403) return "permission_denied";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "provider_unavailable";
  return "request_rejected";
}

/** Drive call failed. Message contains only op / file ID / status / classification. */
export class DriveError extends Error {
  constructor(public op: string, public fileId: string | null, public status: number, detail?: string) {
    super(`Drive ${op} failed${fileId ? ` file=${fileId}` : ""} status=${status} class=${classifyStatus(status)}${detail ? ` ${detail}` : ""}`);
  }
}
/** Sharing change refused or not confirmed. status 403 = permission denied. */
export class ShareError extends DriveError {}

/** Last-resort scrubber for any message that might still reach logs. */
export function sanitize(t: string): string {
  return t
    .replace(/\bBearer\s+\S+/gi, "Bearer <redacted>")
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, "<jwt>")
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "<email>")
    .replace(/\b(api[_-]?key|key|token|secret|password)(["':=\s]+)\S+/gi, "$1$2<redacted>")
    .replace(/\s+/g, " ").slice(0, 300);
}

async function drain(res: Response) { try { await res.body?.cancel(); } catch { /* ignore */ } }

/**
 * GET-style retry for idempotent requests. Retries 429/5xx/network errors with backoff.
 * Throws DriveError(op, id, status) with no provider text.
 */
export async function fetchWithRetry(url: string, init: RequestInit, o: RetryOpts, op = "request", fileId: string | null = null): Promise<Response> {
  const retries = o.retries ?? 3;
  const base = o.baseDelayMs ?? 500;
  const sleep = o.sleep ?? defaultSleep;
  let lastStatus = 0;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (o.budget.expired()) throw new BudgetExceeded(`Time budget exhausted during ${op}`);
    const timeout = Math.max(1, Math.min(o.timeoutMs ?? 20_000, o.budget.remaining()));
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await o.fetch(url, { ...init, signal: ctrl.signal });
      if (res.status === 429 || res.status >= 500) { lastStatus = res.status; await drain(res); }
      else return res;
    } catch {
      lastStatus = 0;
    } finally {
      clearTimeout(t);
    }
    if (attempt < retries) await sleep(base * 2 ** attempt);
  }
  throw new DriveError(op, fileId, lastStatus, `after ${retries + 1} attempts`);
}

export type Perm = { id?: string; type: string; role: string; allowFileDiscovery?: boolean };
export type PermState = { access: Access; named: string[] };

/**
 * Exact policy: exactly one "anyone" permission, role reader, allowFileDiscovery === false.
 * Any anyone writer/commenter, discoverable anyone, or extra anyone entry => "broader_public".
 * Domain-wide entries are reported as broader too (owner approved link-reader only).
 */
export function classifyPerms(perms: unknown): Access {
  if (!Array.isArray(perms)) return "unknown";
  const ps = perms as Perm[];
  if (ps.some((p) => typeof p?.type !== "string" || typeof p?.role !== "string")) return "unknown";
  const anyone = ps.filter((p) => p.type === "anyone");
  const domain = ps.filter((p) => p.type === "domain");
  if (anyone.length === 0) return domain.length ? "broader_public" : "not_public";
  if (anyone.length > 1 || domain.length) return "broader_public";
  const a = anyone[0];
  if (a.role !== "reader") return "broader_public";
  if (a.allowFileDiscovery === false) return "public_reader";
  if (a.allowFileDiscovery === true) return "broader_public";
  return "unknown"; // policy not reported => fail closed
}

const namedKey = (ps: Perm[]) =>
  ps.filter((p) => p.type !== "anyone").map((p) => `${p.id ?? "?"}:${p.type}:${p.role}`).sort();

export type DriveClient = ReturnType<typeof makeDrive>;

export function makeDrive(headers: Record<string, string>, o: RetryOpts) {
  const sleep = o.sleep ?? defaultSleep;

  const listFolder = async (folderId: string, maxPages = 50): Promise<DriveFile[]> => {
    const out: DriveFile[] = [];
    let token: string | undefined;
    for (let page = 0; page < maxPages; page++) {
      const p = new URLSearchParams({
        q: `'${folderId}' in parents and trashed=false`,
        pageSize: "200",
        fields: "nextPageToken,files(id,name,mimeType,createdTime,size,videoMediaMetadata(durationMillis),parents)",
        orderBy: "createdTime",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true",
      });
      if (token) p.set("pageToken", token);
      const res = await fetchWithRetry(`${GATEWAY}/files?${p}`, { headers }, o, "list", folderId);
      if (!res.ok) { await drain(res); throw new DriveError("list", folderId, res.status); }
      const json = await res.json();
      out.push(...((json.files ?? []) as DriveFile[]));
      token = json.nextPageToken;
      if (!token) return out;
    }
    throw new DriveError("list", folderId, 0, `exceeded ${maxPages} pages`);
  };

  const readPerms = async (fileId: string): Promise<PermState> => {
    try {
      const p = new URLSearchParams({ fields: "permissions(id,type,role,allowFileDiscovery)", supportsAllDrives: "true" });
      const res = await fetchWithRetry(`${GATEWAY}/files/${fileId}?${p}`, { headers }, o, "read_permissions", fileId);
      if (!res.ok) { await drain(res); return { access: "unknown", named: [] }; }
      const json = await res.json();
      const access = classifyPerms(json.permissions);
      return { access, named: access === "unknown" ? [] : namedKey(json.permissions) };
    } catch (e) {
      if (e instanceof BudgetExceeded) throw e;
      return { access: "unknown", named: [] };
    }
  };
  const readAccess = async (fileId: string): Promise<Access> => (await readPerms(fileId)).access;

  /**
   * Idempotent: does nothing if the exact link-reader policy already exists. Refuses (reports) broader
   * or unknown sharing. Otherwise POSTs one anyone/reader/allowFileDiscovery=false permission — without
   * blind retry: after any ambiguous outcome (network, 429, 5xx) permissions are re-read before another
   * create. Confirms by read-back and that named permissions are unchanged.
   */
  const ensureAnyoneReader = async (fileId: string, maxCreates = 3): Promise<"already_present" | "added"> => {
    const before = await readPerms(fileId);
    if (before.access === "public_reader") return "already_present";
    if (before.access === "broader_public") throw new ShareError("share", fileId, 0, "existing sharing is broader than link-reader; left unchanged for review");
    if (before.access === "unknown") throw new ShareError("share", fileId, 0, "sharing unreadable; not changed");

    const p = new URLSearchParams({ supportsAllDrives: "true", fields: "id,type,role,allowFileDiscovery" });
    let lastStatus = 0;
    for (let attempt = 0; attempt < maxCreates; attempt++) {
      if (o.budget.expired()) throw new BudgetExceeded("Time budget exhausted during share");
      if (attempt > 0) {
        await sleep((o.baseDelayMs ?? 500) * 2 ** (attempt - 1));
        const mid = await readPerms(fileId); // did the previous (ambiguous) create land?
        if (mid.access === "public_reader") { lastStatus = 200; break; }
        if (mid.access !== "not_public") throw new ShareError("share", fileId, lastStatus, `ambiguous create; read-back ${mid.access}`);
      }
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), Math.max(1, Math.min(o.timeoutMs ?? 20_000, o.budget.remaining())));
      let res: Response | null = null;
      try {
        res = await o.fetch(`${GATEWAY}/files/${fileId}/permissions?${p}`, {
          method: "POST", headers: { ...headers, "Content-Type": "application/json" }, signal: ctrl.signal,
          body: JSON.stringify({ type: "anyone", role: "reader", allowFileDiscovery: false }),
        });
      } catch {
        res = null;
      } finally {
        clearTimeout(t);
      }
      if (!res) { lastStatus = 0; continue; }
      lastStatus = res.status;
      await drain(res);
      if (res.ok) break;
      if (res.status === 429 || res.status >= 500) continue;
      throw new ShareError("share", fileId, res.status); // 4xx: definitive, no retry
    }
    const after = await readPerms(fileId);
    if (after.access !== "public_reader") throw new ShareError("share", fileId, lastStatus, `not confirmed after create (read-back ${after.access})`);
    if (after.named.join("|") !== before.named.join("|")) throw new ShareError("share", fileId, lastStatus, "named permissions changed unexpectedly");
    return "added";
  };

  return {
    listFolder, readAccess, readPerms, ensureAnyoneReader,
    async exportText(docId: string): Promise<string | null> {
      try {
        const res = await fetchWithRetry(`${GATEWAY}/files/${docId}/export?mimeType=text/plain`, { headers }, o, "export", docId);
        if (!res.ok) { await drain(res); return null; }
        return (await res.text()).replace(/\r\n/g, "\n").trim() || null;
      } catch (e) {
        if (e instanceof BudgetExceeded) throw e;
        return null;
      }
    },
  };
}
