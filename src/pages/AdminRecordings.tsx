import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import SEO from "@/components/SEO";
import { z } from "zod";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";
type VideoSource = "cloudflare" | "zoom_clip";

type Recording = {
  id: string;
  title: string;
  class_type: ClassType;
  recording_date: string;
  cloudflare_video_id: string;
  video_source: VideoSource;
  video_ref: string | null;
  description: string | null;
  is_published: boolean;
};

const classOptions: { value: ClassType; label: string }[] = [
  { value: "power_hour", label: "Power Hour" },
  { value: "contractor_school", label: "Contractor School" },
  { value: "sales_marketing_school", label: "Sales & Marketing School" },
];

const classLabelMap = Object.fromEntries(classOptions.map((o) => [o.value, o.label])) as Record<
  ClassType,
  string
>;

const recordingSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  class_type: z.enum(["power_hour", "contractor_school", "sales_marketing_school"]),
  recording_date: z.string().min(1, "Date is required"),
  video_source: z.enum(["cloudflare", "zoom_clip"]),
  video_ref: z
    .string()
    .trim()
    .min(1, "Video ID or embed URL is required")
    .max(1000),
  description: z.string().max(5000).optional(),
  is_published: z.boolean(),
});

type FormState = {
  id?: string;
  title: string;
  class_type: ClassType;
  recording_date: string;
  video_source: VideoSource;
  video_ref: string;
  description: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  title: "",
  class_type: "power_hour",
  recording_date: new Date().toISOString().slice(0, 10),
  video_source: "cloudflare",
  video_ref: "",
  description: "",
  is_published: true,
};

const AdminRecordings = () => {
  const { loading, isAdmin } = usePortalAuth({ requireAdmin: true });
  const [list, setList] = useState<Recording[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const refresh = async () => {
    setListLoading(true);
    const { data, error } = await supabase
      .from("recordings")
      .select("*")
      .order("recording_date", { ascending: false });
    if (error) {
      toast({ title: "Could not load recordings", description: error.message, variant: "destructive" });
    } else {
      setList((data as Recording[]) ?? []);
    }
    setListLoading(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const openCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (r: Recording) => {
    setForm({
      id: r.id,
      title: r.title,
      class_type: r.class_type,
      recording_date: r.recording_date,
      cloudflare_video_id: r.cloudflare_video_id,
      description: r.description ?? "",
      is_published: r.is_published,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const result = recordingSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: "Invalid input",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      class_type: form.class_type,
      recording_date: form.recording_date,
      cloudflare_video_id: form.cloudflare_video_id.trim(),
      description: form.description.trim() || null,
      is_published: form.is_published,
    };

    const { error } = form.id
      ? await supabase.from("recordings").update(payload).eq("id", form.id)
      : await supabase.from("recordings").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: form.id ? "Recording updated" : "Recording added" });
    setOpen(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recording? This cannot be undone.")) return;
    setDeletingId(id);
    const { error } = await supabase.from("recordings").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Recording deleted" });
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
      <SEO title="Manage Recordings | ALP Admin" description="Admin: manage class replay recordings." canonical="/admin/recordings" />
      <PortalLayout isAdmin>
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Admin</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Manage Recordings
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, publish, or remove class replay recordings.
              </p>
            </div>
            <Button onClick={openCreate} variant="premium">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Recording
            </Button>
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              {listLoading ? (
                <div className="p-8 text-sm text-muted-foreground">Loading…</div>
              ) : list.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-medium text-foreground">No recordings yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Add Recording" to create your first replay.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {classLabelMap[r.class_type]}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(r.recording_date + "T00:00:00").toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {r.is_published ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Recording" : "Add Recording"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Q2 Strategy Deep Dive"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class Type</Label>
                  <Select
                    value={form.class_type}
                    onValueChange={(v) => setForm({ ...form, class_type: v as ClassType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Recording Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.recording_date}
                    onChange={(e) => setForm({ ...form, recording_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cf">Cloudflare Stream Video ID</Label>
                <Input
                  id="cf"
                  value={form.cloudflare_video_id}
                  onChange={(e) => setForm({ ...form, cloudflare_video_id: e.target.value })}
                  placeholder="e.g. 31c9291ab41fac05471db4e73aa11717"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown to clients."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="published" className="text-base">Published</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Visible to active clients in the portal.
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={form.is_published}
                  onCheckedChange={(v) => setForm({ ...form, is_published: v })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="premium" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save Changes" : "Create Recording"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PortalLayout>
    </>
  );
};

export default AdminRecordings;
