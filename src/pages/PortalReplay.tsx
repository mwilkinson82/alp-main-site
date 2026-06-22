import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";
type VideoSource = "cloudflare" | "zoom_clip" | "google_drive";

type Recording = {
  id: string;
  title: string;
  recording_date: string;
  description: string | null;
  class_type: ClassType;
  cloudflare_video_id: string;
  video_source: VideoSource | null;
  video_ref: string | null;
  transcript_doc_id: string | null;
  part_number: number | null;
  part_total: number | null;
};

const classLabel: Record<ClassType, string> = {
  power_hour: "Power Hour",
  contractor_school: "Contractor School",
  sales_marketing_school: "Sales & Marketing School",
};

const classRoute: Record<ClassType, string> = {
  power_hour: "/portal/power-hour",
  contractor_school: "/portal/contractor-school",
  sales_marketing_school: "/portal/sales-marketing-school",
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const extractDriveId = (ref: string): string | null => {
  const fileMatch = ref.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
  if (fileMatch) return fileMatch[1];
  const idParam = ref.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (idParam) return idParam[1];
  const folderlessOpen = ref.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  if (folderlessOpen) return folderlessOpen[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(ref)) return ref;
  return null;
};

const resolveEmbedSrc = (r: Recording): string => {
  const ref = (r.video_ref ?? r.cloudflare_video_id ?? "").trim();
  const source = r.video_source ?? "cloudflare";

  if (source === "zoom_clip") {
    if (/\/clips\/embed\//i.test(ref)) return ref;
    const shareMatch = ref.match(/^(https?:\/\/[^/]*zoom\.us)\/clips\/share\/([^?#/]+)/i);
    if (shareMatch) return `${shareMatch[1]}/clips/embed/${shareMatch[2]}`;
    if (/^https?:\/\//i.test(ref)) return ref;
    return `https://us06web.zoom.us/clips/embed/${ref}`;
  }

  if (source === "google_drive") {
    const id = extractDriveId(ref);
    if (id) return `https://drive.google.com/file/d/${id}/preview`;
    return ref;
  }

  if (/^https?:\/\//i.test(ref)) return ref;
  return `https://iframe.videodelivery.net/${ref}`;
};

const PortalReplay = () => {
  const { id } = useParams();
  const { loading, isAdmin, isActiveClient } = usePortalAuth();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);

  // Transcript state
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptHtml, setTranscriptHtml] = useState<string | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isActiveClient) {
      setLoadingRec(false);
      return;
    }
    supabase
      .from("recordings")
      .select(
        "id,title,recording_date,description,class_type,cloudflare_video_id,video_source,video_ref,transcript_doc_id,part_number,part_total",
      )
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setRecording((data as Recording) ?? null);
        setLoadingRec(false);
      });
  }, [id, isActiveClient]);

  // Reset transcript when recording changes
  useEffect(() => {
    setTranscriptOpen(false);
    setTranscriptHtml(null);
    setTranscriptError(null);
  }, [recording?.id]);

  const loadTranscript = async () => {
    if (!recording?.transcript_doc_id) return;
    setTranscriptOpen(true);
    if (transcriptHtml || transcriptLoading) return;
    setTranscriptLoading(true);
    setTranscriptError(null);
    try {
      const { data, error } = await supabase.functions.invoke("get-transcript", {
        body: { docId: recording.transcript_doc_id },
      });
      if (error) throw error;
      if ((data as any)?.html) {
        setTranscriptHtml((data as any).html as string);
      } else {
        setTranscriptError("Transcript unavailable.");
      }
    } catch (e: any) {
      setTranscriptError(e?.message ?? "Failed to load transcript.");
    } finally {
      setTranscriptLoading(false);
    }
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
        title={recording ? `${recording.title} | ALP Client Portal` : "Replay | ALP Client Portal"}
        description="ALP class replay."
        canonical={`/portal/replay/${id}`}
      />
      <PortalLayout isAdmin={isAdmin}>
        <section className="container mx-auto px-0 sm:px-4 py-4 sm:py-10 md:py-14 max-w-5xl">
          {loadingRec ? (
            <div className="text-muted-foreground text-sm px-4">Loading replay…</div>
          ) : !recording ? (
            <div className="text-center py-20 px-4">
              <p className="text-foreground font-medium mb-2">Replay not found</p>
              <p className="text-sm text-muted-foreground mb-6">
                This recording may have been removed or unpublished.
              </p>
              <Button asChild variant="outline">
                <Link to="/portal/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="px-4 sm:px-0">
                <Button asChild variant="ghost" size="sm" className="mb-4 sm:mb-6 -ml-3">
                  <Link to={classRoute[recording.class_type]}>
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to {classLabel[recording.class_type]}
                  </Link>
                </Button>
              </div>

              <div className="aspect-video sm:rounded-xl overflow-hidden bg-black sm:shadow-premium sm:border sm:border-border/60">
                <iframe
                  src={resolveEmbedSrc(recording)}
                  title={recording.title}
                  loading="lazy"
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>

              <div className="mt-5 sm:mt-6 px-4 sm:px-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {classLabel[recording.class_type]}
                  </span>
                  {recording.part_number && recording.part_total && recording.part_total > 1 && (
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      Part {recording.part_number} of {recording.part_total}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-foreground mt-3 leading-snug">
                  {recording.title}
                </h1>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Calendar className="w-4 h-4 mr-1.5 shrink-0" />
                  {formatDate(recording.recording_date)}
                </div>
                {recording.description && (
                  <p className="text-sm sm:text-base text-foreground/80 mt-4 sm:mt-5 leading-relaxed whitespace-pre-line">
                    {recording.description}
                  </p>
                )}

                {/* Transcript section */}
                {recording.transcript_doc_id && (
                  <div className="mt-8 border-t border-border/60 pt-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">
                          Session Notes & Transcript
                        </h2>
                      </div>
                      <Button
                        size="sm"
                        variant={transcriptOpen ? "ghost" : "outline"}
                        onClick={() =>
                          transcriptOpen ? setTranscriptOpen(false) : loadTranscript()
                        }
                      >
                        {transcriptOpen ? "Hide" : "Show transcript"}
                      </Button>
                    </div>

                    {transcriptOpen && (
                      <div className="mt-4 rounded-xl border border-border/60 bg-card/40 p-4 sm:p-6">
                        {transcriptLoading && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading transcript…
                          </div>
                        )}
                        {transcriptError && (
                          <p className="text-sm text-destructive">{transcriptError}</p>
                        )}
                        {transcriptHtml && (
                          <div
                            className="transcript-content prose prose-invert max-w-none prose-sm sm:prose-base prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                            // Content comes from a trusted Google Doc fetched server-side via our auth-gated edge function.
                            dangerouslySetInnerHTML={{ __html: transcriptHtml }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </PortalLayout>
    </>
  );
};

export default PortalReplay;
