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
  thumbnail_url: string | null;
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
  thumbnail_url: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .refine((v) => !v || /^https?:\/\//i.test(v), {
      message: "Thumbnail must be a full URL starting with http(s)://",
    }),
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
  thumbnail_url: string;
  description: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  title: "",
  class_type: "power_hour",
  recording_date: new Date().toISOString().slice(0, 10),
  video_source: "cloudflare",
  video_ref: "",
  thumbnail_url: "",
  description: "",
  is_published: true,
};

// Extract a clean video reference from whatever the user pastes:
// - Full <iframe> embed code: pull the src
// - Full embed/share URL: keep as-is
// - Bare ID: keep as-is
const extractVideoRef = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // <iframe ... src="..."> — extract src attribute
  const iframeSrc = trimmed.match(/<iframe[^>]*\s+src=["']([^"']+)["']/i);
  if (iframeSrc) return iframeSrc[1].trim();
  // First http(s) URL anywhere in the string
  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];
  return trimmed;
};

// Extract a clean image URL from whatever the user pastes:
// - Full <a><img src="..."></a> block: pull the img src (last one wins — usually the actual thumbnail)
// - Bare URL: keep as-is
const extractThumbnailUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // <img ... src="..."> — extract last img src (handles nested anchor markup)
  const imgMatches = [...trimmed.matchAll(/<img[^>]*\s+src=["']([^"']+)["']/gi)];
  if (imgMatches.length > 0) {
    return imgMatches[imgMatches.length - 1][1].trim();
  }
  // First http(s) URL — but stop at any quote/space/angle-bracket
  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];
  return trimmed;
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
      video_source: r.video_source ?? "cloudflare",
      video_ref: r.video_ref ?? r.cloudflare_video_id ?? "",
      thumbnail_url: r.thumbnail_url ?? "",
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
    try {
      const trimmedRef = form.video_ref.trim();
      const trimmedThumb = form.thumbnail_url.trim();
      const payload = {
        title: form.title.trim(),
        class_type: form.class_type,
        recording_date: form.recording_date,
        video_source: form.video_source,
        video_ref: trimmedRef,
        thumbnail_url: trimmedThumb || null,
        // Keep cloudflare_video_id populated (NOT NULL legacy column).
        cloudflare_video_id: trimmedRef,
        description: form.description.trim() || null,
        is_published: form.is_published,
      };

      console.log("[AdminRecordings] saving", { id: form.id, payload });

      const { data, error } = form.id
        ? await supabase.from("recordings").update(payload).eq("id", form.id).select()
        : await supabase.from("recordings").insert(payload).select();

      console.log("[AdminRecordings] save result", { data, error });

      if (error) {
        toast({
          title: "Save failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({ title: form.id ? "Recording updated" : "Recording added" });
      setOpen(false);
      refresh();
    } catch (err: any) {
      console.error("[AdminRecordings] save threw", err);
      toast({
        title: "Unexpected error",
        description: err?.message ?? "Something went wrong saving the recording.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
                <Label>Video Source</Label>
                <Select
                  value={form.video_source}
                  onValueChange={(v) =>
                    setForm({ ...form, video_source: v as VideoSource })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloudflare">Cloudflare Stream</SelectItem>
                    <SelectItem value="zoom_clip">Zoom Clip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vref">
                  {form.video_source === "cloudflare"
                    ? "Cloudflare Stream Video ID"
                    : "Zoom Clip Embed URL or Clip ID"}
                </Label>
                <Input
                  id="vref"
                  value={form.video_ref}
                  onChange={(e) => setForm({ ...form, video_ref: e.target.value })}
                  placeholder={
                    form.video_source === "cloudflare"
                      ? "e.g. 31c9291ab41fac05471db4e73aa11717"
                      : "e.g. https://us06web.zoom.us/clips/embed/LNUa2qZkRHm_4pxQm7YErA"
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {form.video_source === "cloudflare"
                    ? "Paste just the video ID from Cloudflare Stream — not the full URL."
                    : "Paste the Zoom Clip embed URL, share URL, or just the clip ID — all work."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumb">Thumbnail URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  id="thumb"
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  placeholder="https://… (image or animated GIF)"
                />
                <p className="text-xs text-muted-foreground">
                  {form.video_source === "zoom_clip"
                    ? "Heads up: Zoom thumbnail GIF URLs (file.zoom.us/...) contain expiring tokens and may stop working after a few days. For a permanent thumbnail, save the GIF and host it elsewhere."
                    : "Cloudflare Stream tip: https://videodelivery.net/{VIDEO_ID}/thumbnails/thumbnail.gif?time=2s&duration=4s"}
                </p>
                {form.thumbnail_url && /^https?:\/\//i.test(form.thumbnail_url.trim()) && (
                  <div className="mt-2 aspect-video w-40 rounded-md overflow-hidden border border-border bg-muted">
                    <img
                      src={form.thumbnail_url.trim()}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
