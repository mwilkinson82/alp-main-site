import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Calendar } from "lucide-react";
import SEO from "@/components/SEO";

type ClassType = "power_hour" | "contractor_school" | "sales_marketing_school";

type Recording = {
  id: string;
  title: string;
  recording_date: string;
  description: string | null;
  class_type: ClassType;
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
      .select("id,title,recording_date,description,class_type")
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
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              Replay Library
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              {title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{description}</p>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((r) => (
                <Card
                  key={r.id}
                  className="group border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-elegant flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {classLabel[r.class_type]}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-snug">{r.title}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1.5">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {formatDate(r.recording_date)}
                    </div>
                    {r.description && (
                      <CardDescription className="mt-2 line-clamp-3">
                        {r.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/portal/replay/${r.id}`}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch Replay
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </PortalLayout>
    </>
  );
};

export default PortalLibrary;
