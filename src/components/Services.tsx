import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, GraduationCap, ArrowRight, HardHat, TrendingUp, Sparkles, Check, MessageCircle, Map, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapStagger } from "@/hooks/use-gsap-scroll";
import GrowthAcademyModal from "@/components/GrowthAcademyModal";
import FullAccessModal from "@/components/FullAccessModal";

const STRIPE_SINGLE = "https://buy.stripe.com/bJeaEYe0h9L8ao0g5QeQM0R";
const STRIPE_6SESSION = "https://buy.stripe.com/14A5kEf4l0ay7bOaLweQM0Q";

const coachingPackages = [
  {
    title: "Single Session",
    price: "$1,000",
    description: "One focused hour with Marshall",
    benefits: [
      "60-minute deep-dive on your biggest challenge",
      "Actionable takeaways you can implement immediately",
      "Follow-up summary with next steps",
    ],
    checkoutUrl: STRIPE_SINGLE,
    highlight: false,
  },
  {
    title: "6-Session Intensive",
    price: "$5,000",
    badge: "MOST POPULAR",
    description: "Your strategic advisor on speed dial",
    benefits: [
      "Six 1-hour sessions tailored to your business",
      "Direct text & Discord access between sessions",
      "Custom strategic scaling roadmap",
    ],
    checkoutUrl: STRIPE_6SESSION,
    highlight: true,
  },
];

const programs = [
  {
    icon: Clock,
    title: "Power Hour",
    tagline: "Daily live coaching at 8am EST",
    link: "/power-hour",
  },
  {
    icon: HardHat,
    title: "Contractor School",
    tagline: "Scale your construction business",
    link: "/contractor-school",
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing",
    tagline: "Close more deals, generate leads",
    link: "/sales-marketing-school",
  },
  {
    icon: GraduationCap,
    title: "ALP University",
    tagline: "Full video training library",
    link: "/alp-university",
  },
];

const bundles = [
  {
    title: "Growth Academy",
    price: "$2,000",
    period: "for 1 month",
    description: "All 4 group programs + community access",
    modal: "growth" as const,
  },
  {
    title: "Full Access",
    price: "$10,000",
    period: "for 6 months",
    description: "Everything + 1-on-1 coaching sessions",
    modal: "full" as const,
  },
];

const Services = () => {
  const containerRef = useGsapStagger();
  const [growthOpen, setGrowthOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Programs</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to unprecedented success
          </p>
        </header>

        {/* Tier 1: 1-on-1 Coaching */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Work With Marshall Directly</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {coachingPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`glass-card hover-lift relative ${pkg.highlight ? "border-primary/40" : ""}`}
              >
                {pkg.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg rounded-tr-xl">
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
                    asChild
                  >
                    <a href={pkg.checkoutUrl} target="_blank" rel="noopener noreferrer">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button variant="link" className="text-primary gap-1" asChild>
              <Link to="/coaching">
                View all coaching options
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tier 2: Group Programs */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Group Programs & Training</h3>
          <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {programs.map((program, index) => {
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

        {/* Tier 3: Bundles */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Get Everything</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Bundle & Save</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {bundles.map((bundle, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <h4 className="text-xl font-bold">{bundle.title}</h4>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{bundle.price}</span>
                    <span className="text-muted-foreground text-sm">{bundle.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{bundle.description}</p>
                  <Button
                    size="lg"
                    className="w-full min-h-[48px] gap-2"
                    onClick={() =>
                      bundle.modal === "growth" ? setGrowthOpen(true) : setFullOpen(true)
                    }
                  >
                    Choose Duration
                    <ArrowRight className="w-4 h-4" />
                  </Button>
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

      <GrowthAcademyModal open={growthOpen} onOpenChange={setGrowthOpen} />
      <FullAccessModal open={fullOpen} onOpenChange={setFullOpen} />
    </section>
  );
};

export default Services;
