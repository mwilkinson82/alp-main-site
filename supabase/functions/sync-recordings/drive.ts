// Drive gateway client with bounded timeouts, retries, backoff and a shared deadline.
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

export async function fetchWithRetry(url: string, init: RequestInit, o: RetryOpts): Promise<Response> {
  const retries = o.retries ?? 3;
  const base = o.baseDelayMs ?? 500;
  const sleep = o.sleep ?? defaultSleep;
  let lastErr = "";
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (o.budget.expired()) throw new BudgetExceeded(`Time budget exhausted (${lastErr || "before request"})`);
    const timeout = Math.max(1, Math.min(o.timeoutMs ?? 20_000, o.budget.remaining()));
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await o.fetch(url, { ...init, signal: ctrl.signal });
      if (res.status === 429 || res.status >= 500) {
        lastErr = `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
      } else {
        return res;
      }
    } catch (e) {
      lastErr = `network: ${(e as Error).message ?? e}`;
    } finally {
      clearTimeout(t);
    }
    if (attempt < retries) await sleep(base * 2 ** attempt);
  }
  throw new Error(`Request failed after ${retries + 1} attempts: ${lastErr}`);
}

export type DriveClient = ReturnType<typeof makeDrive>;

export function makeDrive(headers: Record<string, string>, o: RetryOpts) {
  const get = async (url: string) => {
    const res = await fetchWithRetry(url, { headers }, o);
    if (!res.ok) throw new Error(`Drive ${res.status}: ${(await res.text()).slice(0, 500)}`);
    return res;
  };

  return {
    /** Lists every direct child of a folder, following nextPageToken to the end. */
    async listFolder(folderId: string, maxPages = 50): Promise<DriveFile[]> {
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
        const json = await (await get(`${GATEWAY}/files?${p}`)).json();
        out.push(...((json.files ?? []) as DriveFile[]));
        token = json.nextPageToken;
        if (!token) return out;
      }
      throw new Error(`Folder ${folderId} exceeded ${maxPages} pages`);
    },

    /** Read-only: does the file already have an "anyone with link" reader permission? */
    async readAccess(fileId: string): Promise<Access> {
      try {
        const p = new URLSearchParams({ fields: "permissions(type,role)", supportsAllDrives: "true" });
        const res = await fetchWithRetry(`${GATEWAY}/files/${fileId}?${p}`, { headers }, o);
        if (!res.ok) { await res.text(); return "unknown"; }
        const json = await res.json();
        const perms = (json.permissions ?? []) as Array<{ type: string; role: string }>;
        if (!Array.isArray(json.permissions)) return "unknown";
        return perms.some((x) => x.type === "anyone" && ["reader", "commenter", "writer"].includes(x.role))
          ? "public_reader"
          : "not_public";
      } catch (e) {
        if (e instanceof BudgetExceeded) throw e;
        return "unknown";
      }
    },

    async exportText(docId: string): Promise<string | null> {
      try {
        const res = await fetchWithRetry(`${GATEWAY}/files/${docId}/export?mimeType=text/plain`, { headers }, o);
        if (!res.ok) { await res.text(); return null; }
        return (await res.text()).replace(/\r\n/g, "\n").trim() || null;
      } catch (e) {
        if (e instanceof BudgetExceeded) throw e;
        return null;
      }
    },
  };
}
