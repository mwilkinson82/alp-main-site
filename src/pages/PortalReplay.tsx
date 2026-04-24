import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import SEO from "@/components/SEO";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";
type VideoSource = "cloudflare" | "zoom_clip";

type Recording = {
  id: string;
  title: string;
  recording_date: string;
  description: string | null;
  class_type: ClassType;
  cloudflare_video_id: string;
  video_source: VideoSource | null;
  video_ref: string | null;
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

// Resolve the iframe src based on video source.
// - cloudflare: use the video ID with Cloudflare Stream's iframe player
// - zoom_clip: accept any of:
//     • full embed URL: https://us06web.zoom.us/clips/embed/{clipId}
//     • full share URL: https://us06web.zoom.us/clips/share/{clipId}
//     • just the clip ID
const resolveEmbedSrc = (r: Recording): string => {
  const ref = (r.video_ref ?? r.cloudflare_video_id ?? "").trim();
  const source = r.video_source ?? "cloudflare";

  if (source === "zoom_clip") {
    // Already an embed URL — use as-is
    if (/\/clips\/embed\//i.test(ref)) return ref;
    // Share URL — convert to embed URL
    const shareMatch = ref.match(/^(https?:\/\/[^/]*zoom\.us)\/clips\/share\/([^?#/]+)/i);
    if (shareMatch) return `${shareMatch[1]}/clips/embed/${shareMatch[2]}`;
    // Some other URL we don't recognize — return it raw
    if (/^https?:\/\//i.test(ref)) return ref;
    // Bare clip ID — default to us06web subdomain
    return `https://us06web.zoom.us/clips/embed/${ref}`;
  }

  // Cloudflare Stream
  if (/^https?:\/\//i.test(ref)) return ref;
  return `https://iframe.videodelivery.net/${ref}`;
};

const PortalReplay = () => {
  const { id } = useParams();
  const { loading, isAdmin, isActiveClient } = usePortalAuth();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);

  useEffect(() => {
    if (!id || !isActiveClient) {
      setLoadingRec(false);
      return;
    }
    supabase
      .from("recordings")
      .select("id,title,recording_date,description,class_type,cloudflare_video_id,video_source,video_ref")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setRecording((data as Recording) ?? null);
        setLoadingRec(false);
      });
  }, [id, isActiveClient]);

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

              {/* Edge-to-edge video on mobile, rounded card on larger screens */}
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
                <span className="text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {classLabel[recording.class_type]}
                </span>
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
              </div>
            </>
          )}
        </section>
      </PortalLayout>
    </>
  );
};

export default PortalReplay;
