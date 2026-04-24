import { Link } from "react-router-dom";
import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, Megaphone, ArrowRight, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";

const libraries = [
  {
    to: "/portal/power-hour",
    title: "Power Hour",
    description: "Daily 8am EST high-impact strategy sessions. Replays of every weekday call.",
    icon: Clock,
  },
  {
    to: "/portal/contractor-school",
    title: "Contractor School",
    description: "Tuesday night deep-dives on contracting systems, ops, and operational discipline.",
    icon: GraduationCap,
  },
  {
    to: "/portal/sales-marketing-school",
    title: "Sales and Marketing School",
    description: "Wednesday night sessions on sales, marketing, and revenue growth.",
    icon: Megaphone,
  },
];

const PortalDashboard = () => {
  const { loading, isAdmin, isActiveClient, profile } = usePortalAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading portal…</div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Client Portal Dashboard | ALP" description="Your ALP client portal dashboard." canonical="/portal/dashboard" />
      <PortalLayout isAdmin={isAdmin}>
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="mb-10 md:mb-14">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Welcome to the Client Portal
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Access your current class replay libraries below.
            </p>
          </div>

          {!isActiveClient && (
            <Card className="border-destructive/40 bg-destructive/5 mb-8">
              <CardContent className="py-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Your account is not active.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please contact <a href="mailto:support@altitudelogicpressure.com" className="underline hover:text-primary">support@altitudelogicpressure.com</a> to activate your portal access.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {libraries.map((lib) => {
              const Icon = lib.icon;
              return (
                <Card
                  key={lib.to}
                  className="group border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{lib.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{lib.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full" disabled={!isActiveClient}>
                      <Link to={lib.to}>
                        View Replays
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {profile?.full_name && (
            <p className="mt-10 text-xs text-muted-foreground">
              Signed in as <span className="text-foreground/80">{profile.email}</span>
            </p>
          )}
        </section>
      </PortalLayout>
    </>
  );
};

export default PortalDashboard;
