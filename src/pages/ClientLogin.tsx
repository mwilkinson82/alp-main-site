import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, PlayCircle, ArrowRight, ExternalLink } from "lucide-react";

const LEGACY_KAJABI_URL = "https://example.com/legacy-kajabi-library";

const ClientLogin = () => {
  return (
    <>
      <SEO
        title="Client Replay Access | Altitude Logic Pressure"
        description="Access your ALP class replay libraries. Choose between the Legacy Library (2023 – April 2026) and the Current Client Portal (April 26, 2026 onward)."
        canonical="/client-login"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4">
                Members Only
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                Client Replay Access
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                You have access to two replay libraries. Choose the one that holds the recordings
                you're looking for.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Legacy */}
              <Card className="group relative overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-elegant">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Archive className="w-6 h-6 text-foreground/70" />
                  </div>
                  <CardTitle className="text-2xl">Legacy Replay Library</CardTitle>
                  <CardDescription className="text-base mt-2">
                    All recordings from 2023 through April 2026, hosted on our previous platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="text-sm text-muted-foreground space-y-1.5 mb-6">
                    <li>• 3+ years of class archives</li>
                    <li>• Hosted on Kajabi</li>
                    <li>• Use your existing Kajabi credentials</li>
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={LEGACY_KAJABI_URL} target="_blank" rel="noopener noreferrer">
                      Access Legacy Library
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Current */}
              <Card className="group relative overflow-hidden border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-gold bg-gradient-subtle">
                <div className="absolute top-4 right-4 text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">
                  New
                </div>
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                    <PlayCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Current Client Portal</CardTitle>
                  <CardDescription className="text-base mt-2">
                    All new recordings from April 26, 2026 onward, in our redesigned portal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="text-sm text-muted-foreground space-y-1.5 mb-6">
                    <li>• Power Hour replays</li>
                    <li>• Contractor School replays</li>
                    <li>• Sales & Marketing School replays</li>
                  </ul>
                  <Button variant="premium" className="w-full" asChild>
                    <Link to="/portal/login">
                      Access Current Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-10">
              Trouble logging in? Email{" "}
              <a href="mailto:support@altitudelogicpressure.com" className="underline hover:text-primary">
                support@altitudelogicpressure.com
              </a>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ClientLogin;
