import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Calendar, Play } from "lucide-react";
import SEO from "@/components/SEO";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";

type Recording = {
  id: string;
  title: string;
  recording_date: string;
  description: string | null;
  class_type: ClassType;
  thumbnail_url: string | null;
};

type Props = {
  classType: ClassType;
  title: string;
  description: string;
  canonical: string;
};

const classLabel: Record<ClassType, string> = {
  power_hour: "Power Hour",
  contractor_school: "Contractor School",
  sales_marketing_school: "Sales & Marketing School",
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const PortalLibrary = ({ classType, title, description, canonical }: Props) => {
  const { loading, isAdmin, isActiveClient } = usePortalAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!isActiveClient) {
      setLoadingList(false);
      return;
    }
    supabase
      .from("recordings")
      .select("id,title,recording_date,description,class_type,thumbnail_url")
      .eq("class_type", classType)
      .eq("is_published", true)
      .order("recording_date", { ascending: false })
      .then(({ data }) => {
        setRecordings((data as Recording[]) ?? []);
        setLoadingList(false);
      });
  }, [classType, isActiveClient]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${title} Replays | ALP Client Portal`} description={description} canonical={canonical} />
      <PortalLayout isAdmin={isAdmin}>
        <section className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
          <div className="mb-6 md:mb-10">
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 md:mb-3">
              Replay Library
            </p>
            <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-foreground mb-2 md:mb-3">
              {title}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">{description}</p>
          </div>

          {loadingList ? (
            <div className="text-muted-foreground text-sm">Loading replays…</div>
          ) : recordings.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="py-12 text-center">
                <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-foreground font-medium">No replays available yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  New recordings will appear here as they are published.
                </p>
              </CardContent>
            </Card>
          ) : (
            // Mobile-first: stacked cards w/ large thumbnail. 2-up only on lg+ screens.
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {recordings.map((r) => (
                <Link
                  key={r.id}
                  to={`/portal/replay/${r.id}`}
                  className="group block rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-elegant active:scale-[0.99] touch-manipulation"
                >
                  {/* Large 16:9 thumbnail */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {r.thumbnail_url ? (
                      <img
                        src={r.thumbnail_url}
                        alt={r.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/20 transition-colors">
                      <div className="bg-primary/90 rounded-full p-3.5 md:p-4 shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" fill="currentColor" />
                      </div>
                    </div>
                    {/* Class chip */}
                    <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase text-primary-foreground bg-primary/90 backdrop-blur px-2 py-0.5 rounded-full">
                      {classLabel[r.class_type]}
                    </span>
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      {formatDate(r.recording_date)}
                    </div>
                    {r.description && (
                      <p className="text-sm text-muted-foreground/90 mt-2 line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </PortalLayout>
    </>
  );
};

export default PortalLibrary;
