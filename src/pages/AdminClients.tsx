import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
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
import { Mail, UserPlus, Send } from "lucide-react";
import SEO from "@/components/SEO";
import { getPublicSiteUrl } from "@/lib/site-url";

type ClientRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  status: "active" | "inactive";
  created_at: string;
  is_admin: boolean;
};

type InviteResult = {
  email: string;
  status: "invited" | "reinvited" | "exists_active" | "error";
  message?: string;
};

const AdminClients = () => {
  const { loading, isAdmin } = usePortalAuth({ requireAdmin: true });
  const [emails, setEmails] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<InviteResult[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const { toast } = useToast();

  const refresh = async () => {
    setListLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id,email,full_name,status,created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);

    const adminIds = new Set(
      (roles ?? [])
        .filter((r: { role: string }) => r.role === "admin")
        .map((r: { user_id: string }) => r.user_id),
    );

    setClients(
      ((profiles as Omit<ClientRow, "is_admin">[]) ?? []).map((p) => ({
        ...p,
        is_admin: adminIds.has(p.user_id),
      })),
    );
    setListLoading(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Manage Clients | ALP Admin"
        description="Admin: invite and manage client portal access."
        canonical="/admin/clients"
      />
      <PortalLayout isAdmin>
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Manage Clients
            </h1>
            <p className="text-muted-foreground mt-2">
              Invite new clients and manage who has access to the portal.
            </p>
          </div>

          {/* Invite card */}
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
                    Also gives these users access to /admin/recordings and /admin/clients.
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

          {/* Clients list */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> All Clients
              </CardTitle>
              <CardDescription>
                Toggle status to instantly grant or revoke portal access. Inactive clients cannot
                view any replays.
              </CardDescription>
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
                      <TableHead className="text-right">Active</TableHead>
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
                        <TableCell className="text-right">
                          <Switch
                            checked={c.status === "active"}
                            onCheckedChange={() => toggleStatus(c)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </PortalLayout>
    </>
  );
};

export default AdminClients;
