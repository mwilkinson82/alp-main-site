import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, GraduationCap, ArrowRight, TrendingUp, Sparkles, Check, HardHat } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapStagger } from "@/hooks/use-gsap-scroll";
import FullAccessModal from "@/components/FullAccessModal";
import AdvisoryApplicationModal from "@/components/AdvisoryApplicationModal";

const advisoryPaths = [
  {
    title: "Strategy Session",
    price: "$1,000",
    badge: "BY APPLICATION" as string | undefined,
    badgeMuted: true,
    description: "A focused 60-minute systems intervention on your most pressing decision.",
    benefits: [
      "60-minute deep-dive on your biggest challenge",
      "Actionable takeaways you can implement immediately",
      "Follow-up summary with next steps",
    ],
    link: "/coaching",
    cta: "Book a Strategy Session",
    highlight: false,
  },
  {
    title: "Private Advisory",
    price: "$5,000",
    badge: "BY APPLICATION" as string | undefined,
    badgeMuted: false,
    description: "Private strategic access for operators managing high-consequence decisions and scale inflection points.",
    benefits: [
      "Six 1-hour sessions tailored to your business",
      "Direct text & Discord access between sessions",
      "Custom strategic scaling roadmap",
    ],
    link: "/coaching",
    cta: "Request Private Advisory",
    highlight: true,
  },
];

const programs = [
  {
    icon: Clock,
    title: "Power Hour",
    tagline: "Daily live execution room at 8am EST.",
    link: "/power-hour",
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing",
    tagline: "Weekly systems for lead flow, persuasion, and deal control.",
    link: "/sales-marketing-school",
  },
  {
    icon: GraduationCap,
    title: "ALP University",
    tagline: "Full video training library",
    link: "/alp-university",
  },
  {
    icon: HardHat,
    title: "Contractor School",
    tagline: "Weekly systems for contractors scaling real operations.",
    link: "/contractor-school",
  },
];

const bundles = [
  {
    title: "Power Hour",
    price: "$1,000",
    period: "for 1 month",
    description: "Daily live execution room at 8am EST. Mindset, strategy, and business best practices — every weekday.",
    link: "https://buy.stripe.com/7sYeVeaO52iGgMo4n8eQM0J",
    modal: null as null,
  },
  {
    title: "Full Access",
    price: "$10,000",
    period: "for 6 months",
    description: "All Live Rooms + 10 private advisory sessions per year. Maximum proximity.",
    link: null as null,
    modal: "full" as const,
  },
  {
    title: "Full Access (Annual)",
    price: "$15,000",
    period: "/year",
    description: "All live rooms + full community + 10 private advisory sessions annually. Maximum proximity. Maximum leverage.",
    link: null as null,
    modal: "full" as const,
  },
];

const Services = () => {
  const containerRef = useGsapStagger();
  const [fullOpen, setFullOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<"Strategy Session — $1,000" | "Private Advisory — $5,000">("Strategy Session — $1,000");

  const openApplication = (service: "Strategy Session — $1,000" | "Private Advisory — $5,000") => {
    setDefaultService(service);
    setAppModalOpen(true);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Direct Access Options</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Private engagements for operators who need execution clarity, leverage, and systems installed fast.
          </p>
        </header>

        {/* Tier 1: Advisory Paths */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Private Advisory Access</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {advisoryPaths.map((pkg, index) => (
              <Card
                key={index}
                className={`glass-card hover-lift relative ${pkg.highlight ? "border-primary/40" : ""}`}
              >
                {pkg.badge && (
                  <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-lg rounded-tr-xl ${
                    pkg.badgeMuted
                      ? "bg-muted border border-primary/30 text-primary"
                      : "bg-gradient-gold text-primary-foreground"
                  }`}>
                    {pkg.badge}
                  </div>
                )}
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div>
                    <h3 className="text-xl font-bold">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  </div>
                  <ul className="space-y-3">
                    {pkg.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={pkg.highlight ? "premium" : "default"}
                    size="lg"
                    className="w-full gap-2 min-h-[48px]"
                    onClick={() => openApplication(
                      pkg.title === "Private Advisory"
                        ? "Private Advisory — $5,000"
                        : "Strategy Session — $1,000"
                    )}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="link" className="text-primary gap-1" asChild>
              <Link to="/coaching">
                View all consulting options
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tier 2: Live Group Programs */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Live Group Programs</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Train Live. Execute Faster.</h3>
            <p className="text-muted-foreground text-sm">Daily and weekly live sessions built to sharpen decision-making and install scalable business systems.</p>
          </div>
          <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {programs.filter(p => p.title !== "ALP University").map((program, index) => {
              const Icon = program.icon;
              return (
                <Link key={index} to={program.link}>
                  <Card className="h-full glass-card hover-lift hover-glow group cursor-pointer">
                    <CardContent className="p-4 md:p-6 space-y-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-smooth" />
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                          {program.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-snug">
                          {program.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-primary font-medium pt-1">
                        Learn More
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-smooth" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* On-Demand Library: ALP University */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 text-sm mb-3">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">On-Demand Library</span>
            </div>
            <p className="text-muted-foreground text-sm">Recorded sessions &amp; full video training — available anytime</p>
          </div>
          <Link to="/alp-university">
            <Card className="glass-card hover-lift hover-glow group cursor-pointer max-w-3xl mx-auto">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-smooth">
                  <GraduationCap className="w-7 h-7 text-primary group-hover:scale-110 transition-smooth" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors">ALP University — The Operator's Archive</h4>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    Access every recorded Power Hour, Sales &amp; Marketing School, and Contractor School session — indexed and updated daily. This is where serious operators study the thinking.
                  </p>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed font-medium">5+ years of recorded execution breakdowns. Updated weekly.</p>
                  <p className="text-primary font-semibold text-sm mt-2">$197/month — Cancel anytime.</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    Enter the Archive
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                  </div>
                  <p className="text-xs text-muted-foreground italic text-right max-w-[160px]">If you can't attend live, you can still study the room.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tier 3: Bundles */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Full Access Membership</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Maximum Proximity.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {bundles.map((bundle, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <h4 className="text-xl font-bold">{bundle.title}</h4>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{bundle.price}</span>
                    <span className="text-muted-foreground text-sm">{bundle.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{bundle.description}</p>
                  {bundle.link ? (
                    <Button size="lg" className="w-full min-h-[48px] gap-2" asChild>
                      <a href={bundle.link} target="_blank" rel="noopener noreferrer">
                        Join Power Hour
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full min-h-[48px] gap-2"
                      onClick={() => setFullOpen(true)}
                    >
                      Choose Duration
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link to="/programs">
              View All Programs & Pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      
      <FullAccessModal open={fullOpen} onOpenChange={setFullOpen} />
      <AdvisoryApplicationModal
        open={appModalOpen}
        onOpenChange={setAppModalOpen}
        defaultService={defaultService}
      />
    </section>
  );
};

export default Services;
