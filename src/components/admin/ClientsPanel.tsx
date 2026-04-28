import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserPlus, Send, RotateCw, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getPublicSiteUrl } from "@/lib/site-url";

type ClientRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  status: "active" | "inactive";
  created_at: string;
  is_admin: boolean;
  last_sign_in_at: string | null;
};

const formatLastSignIn = (iso: string | null): string => {
  if (!iso) return "Never";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

type InviteResult = {
  email: string;
  status: "invited" | "reinvited" | "exists_active" | "error";
  message?: string;
};

export const ClientsPanel = () => {
  const [emails, setEmails] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<InviteResult[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const { toast } = useToast();

  const refresh = async () => {
    setListLoading(true);
    const [{ data: profiles }, { data: roles }, { data: signIns }] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id,email,full_name,status,created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
      supabase.rpc("admin_get_last_sign_ins"),
    ]);

    const adminIds = new Set(
      (roles ?? [])
        .filter((r: { role: string }) => r.role === "admin")
        .map((r: { user_id: string }) => r.user_id),
    );

    const signInMap = new Map<string, string | null>(
      ((signIns as { user_id: string; last_sign_in_at: string | null }[]) ?? []).map((s) => [
        s.user_id,
        s.last_sign_in_at,
      ]),
    );

    setClients(
      ((profiles as Omit<ClientRow, "is_admin" | "last_sign_in_at">[]) ?? []).map((p) => ({
        ...p,
        is_admin: adminIds.has(p.user_id),
        last_sign_in_at: signInMap.get(p.user_id) ?? null,
      })),
    );
    setListLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSendInvites = async () => {
    const list = emails
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast({ title: "Add at least one email", variant: "destructive" });
      return;
    }
    setSending(true);
    setResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("invite-clients", {
        body: {
          emails: list,
          asAdmin,
          redirectTo: getPublicSiteUrl(),
        },
      });
      if (error) throw error;
      const r = (data?.results ?? []) as InviteResult[];
      setResults(r);
      const ok = r.filter((x) => x.status === "invited" || x.status === "reinvited").length;
      const errs = r.filter((x) => x.status === "error").length;
      toast({
        title: `${ok} invite${ok === 1 ? "" : "s"} sent`,
        description: errs > 0 ? `${errs} failed — see details below.` : "All invites delivered.",
        variant: errs > 0 ? "destructive" : "default",
      });
      if (ok > 0) {
        setEmails("");
        refresh();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Invite failed", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const sendInvitesTo = async (
    list: string[],
    asAdminFlag = false,
    label = "invite",
    template: "invite" | "apology" = "invite",
  ) => {
    if (list.length === 0) return;
    try {
      const { data, error } = await supabase.functions.invoke("invite-clients", {
        body: {
          emails: list,
          asAdmin: asAdminFlag,
          redirectTo: getPublicSiteUrl(),
          template,
        },
      });
      if (error) throw error;
      const r = (data?.results ?? []) as InviteResult[];
      const ok = r.filter((x) => x.status === "invited" || x.status === "reinvited").length;
      const errs = r.filter((x) => x.status === "error").length;
      toast({
        title: `${ok} ${label}${ok === 1 ? "" : "s"} sent`,
        description: errs > 0 ? `${errs} failed.` : "All emails delivered.",
        variant: errs > 0 ? "destructive" : "default",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast({ title: "Send failed", description: msg, variant: "destructive" });
    }
  };

  const [resendingId, setResendingId] = useState<string | null>(null);
  const resendOne = async (c: ClientRow) => {
    setResendingId(c.user_id);
    await sendInvitesTo([c.email], c.is_admin, "reset link");
    setResendingId(null);
  };

  const [resendingAll, setResendingAll] = useState(false);
  const resendAllActive = async () => {
    setResendingAll(true);
    const active = clients.filter((c) => c.status === "active").map((c) => c.email);
    await sendInvitesTo(active, false, "reset link");
    setResendingAll(false);
  };

  const toggleStatus = async (c: ClientRow) => {
    const next = c.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("profiles")
      .update({ status: next })
      .eq("user_id", c.user_id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${c.email} → ${next}` });
    refresh();
  };

  return (
    <>
      <Card className="border-border/60 mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Invite Clients
          </CardTitle>
          <CardDescription>
            Paste one or more email addresses (separated by commas, spaces, or new lines).
            Each person will receive a branded email with a one-click link to set their password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">Email addresses</Label>
            <Textarea
              id="emails"
              rows={5}
              placeholder={"jane@example.com\njohn@example.com"}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="asadmin" className="text-base">Grant admin access</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Also gives these users access to the admin hub.
              </p>
            </div>
            <Switch id="asadmin" checked={asAdmin} onCheckedChange={setAsAdmin} />
          </div>
          <Button onClick={handleSendInvites} variant="premium" disabled={sending}>
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending…" : "Send Invites"}
          </Button>

          {results.length > 0 && (
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
              {results.map((r) => (
                <div key={r.email} className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs text-foreground/80">{r.email}</span>
                  <span
                    className={
                      r.status === "error"
                        ? "text-destructive text-xs"
                        : "text-primary text-xs"
                    }
                  >
                    {r.status === "invited" && "✓ invited"}
                    {r.status === "reinvited" && "✓ reset link sent"}
                    {r.status === "exists_active" && "already active"}
                    {r.status === "error" && `error: ${r.message}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> All Clients
            </CardTitle>
            <CardDescription className="mt-1.5">
              Toggle status to instantly grant or revoke portal access. Inactive clients cannot
              view any replays.
            </CardDescription>
          </div>
          {clients.some((c) => c.status === "active") && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={resendingAll}>
                  <Users className="w-4 h-4 mr-2" />
                  {resendingAll ? "Sending…" : "Resend to all active"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resend portal links to all active clients?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send a fresh password-setup email to every active client
                    ({clients.filter((c) => c.status === "active").length} people). Use this
                    if a previous batch had broken links. Each recipient gets a new one-time
                    link to set their password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resendAllActive}>
                    Yes, resend to all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {listLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : clients.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No clients yet. Send your first invite above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last sign-in</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.user_id}>
                    <TableCell className="font-medium">{c.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.full_name || "—"}
                    </TableCell>
                    <TableCell>
                      {c.is_admin ? (
                        <Badge variant="default">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">Client</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.status === "active" ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell
                      className="text-muted-foreground text-sm whitespace-nowrap"
                      title={c.last_sign_in_at ? new Date(c.last_sign_in_at).toLocaleString() : "Never signed in"}
                    >
                      {formatLastSignIn(c.last_sign_in_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={c.status === "active"}
                        onCheckedChange={() => toggleStatus(c)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={resendingId === c.user_id}
                        onClick={() => resendOne(c)}
                      >
                        <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${resendingId === c.user_id ? "animate-spin" : ""}`} />
                        {resendingId === c.user_id ? "Sending…" : "Resend link"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ClientsPanel;
