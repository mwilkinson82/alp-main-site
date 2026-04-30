import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { useRef } from "react";
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

const extractVideoRef = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const iframeSrc = trimmed.match(/<iframe[^>]*\s+src=["']([^"']+)["']/i);
  if (iframeSrc) return iframeSrc[1].trim();
  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];
  return trimmed;
};

const extractThumbnailUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const imgMatches = [...trimmed.matchAll(/<img[^>]*\s+src=["']([^"']+)["']/gi)];
  if (imgMatches.length > 0) {
    return imgMatches[imgMatches.length - 1][1].trim();
  }
  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];
  return trimmed;
};

// Build an animated GIF thumbnail URL from a Cloudflare Stream video reference.
// Accepts:
//   - customer subdomain URL: https://customer-{sub}.cloudflarestream.com/{id}/iframe?...
//   - generic iframe URL: https://iframe.videodelivery.net/{id}
//   - bare video ID
// Returns "" if we can't confidently derive one.
const buildCloudflareGifThumbnail = (videoRef: string): string => {
  const ref = videoRef.trim();
  if (!ref) return "";

  // Customer-subdomain URL — preferred, keeps the same subdomain
  const customerMatch = ref.match(
    /https?:\/\/(customer-[a-z0-9]+\.cloudflarestream\.com)\/([a-f0-9]{20,})/i
  );
  if (customerMatch) {
    const [, host, id] = customerMatch;
    return `https://${host}/${id}/thumbnails/thumbnail.gif?time=3s&duration=4s&height=600`;
  }

  // Generic videodelivery.net URL
  const genericMatch = ref.match(
    /https?:\/\/(?:iframe\.)?videodelivery\.net\/([a-f0-9]{20,})/i
  );
  if (genericMatch) {
    return `https://videodelivery.net/${genericMatch[1]}/thumbnails/thumbnail.gif?time=3s&duration=4s&height=600`;
  }

  // Bare ID (32-char hex is typical for Cloudflare Stream)
  if (/^[a-f0-9]{20,}$/i.test(ref)) {
    return `https://videodelivery.net/${ref}/thumbnails/thumbnail.gif?time=3s&duration=4s&height=600`;
  }

  return "";
};

export const RecordingsPanel = () => {
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
    refresh();
  }, []);

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
      const trimmedRef = extractVideoRef(form.video_ref);
      let trimmedThumb = extractThumbnailUrl(form.thumbnail_url);

      // Auto-derive an animated GIF thumbnail from the Cloudflare embed when blank
      if (!trimmedThumb && form.video_source === "cloudflare") {
        trimmedThumb = buildCloudflareGifThumbnail(trimmedRef);
      }

      const payload = {
        title: form.title.trim(),
        class_type: form.class_type,
        recording_date: form.recording_date,
        video_source: form.video_source,
        video_ref: trimmedRef,
        thumbnail_url: trimmedThumb || null,
        cloudflare_video_id: trimmedRef,
        description: form.description.trim() || null,
        is_published: form.is_published,
      };

      const { error } = form.id
        ? await supabase.from("recordings").update(payload).eq("id", form.id).select()
        : await supabase.from("recordings").insert(payload).select();

      if (error) {
        toast({ title: "Save failed", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: form.id ? "Recording updated" : "Recording added" });
      setOpen(false);
      refresh();
    } catch (err: any) {
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

  return (
    <>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-muted-foreground text-sm">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{form.id ? "Edit Recording" : "Add Recording"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 px-6 overflow-y-auto flex-1 min-h-0">
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
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="thumb">Thumbnail URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
                {form.video_source === "cloudflare" && (() => {
                  const auto = buildCloudflareGifThumbnail(extractVideoRef(form.video_ref));
                  if (!auto) return null;
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setForm({ ...form, thumbnail_url: auto })}
                    >
                      Use auto thumbnail
                    </Button>
                  );
                })()}
              </div>
              <Input
                id="thumb"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                placeholder={
                  form.video_source === "cloudflare"
                    ? "Leave blank to auto-generate an animated GIF from the video"
                    : "https://… (image or animated GIF)"
                }
              />
              <p className="text-xs text-muted-foreground">
                {form.video_source === "zoom_clip"
                  ? "Heads up: Zoom thumbnail GIF URLs (file.zoom.us/...) contain expiring tokens and may stop working after a few days. For a permanent thumbnail, save the GIF and host it elsewhere."
                  : "Leave blank — we'll auto-generate an animated GIF preview from the Cloudflare video on save. Or paste your own URL to override."}
              </p>
              {(() => {
                const manual = form.thumbnail_url.trim();
                const preview = manual && /^https?:\/\//i.test(manual)
                  ? manual
                  : (form.video_source === "cloudflare"
                      ? buildCloudflareGifThumbnail(extractVideoRef(form.video_ref))
                      : "");
                if (!preview) return null;
                return (
                  <div className="mt-2 space-y-1">
                    <div className="aspect-video w-40 rounded-md overflow-hidden border border-border bg-muted">
                      <img
                        src={preview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!manual && (
                      <p className="text-[11px] text-muted-foreground">
                        Auto-generated preview (saved on submit).
                      </p>
                    )}
                  </div>
                );
              })()}
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

          <DialogFooter className="px-6 py-4 border-t border-border shrink-0 bg-background">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="premium" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : form.id ? "Save Changes" : "Create Recording"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordingsPanel;
