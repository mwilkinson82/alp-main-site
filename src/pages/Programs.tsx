import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";
import InvestmentTable from "@/components/InvestmentTable";
import GrowthAcademyModal from "@/components/GrowthAcademyModal";
import FullAccessModal from "@/components/FullAccessModal";
import CoachingTestimonials from "@/components/CoachingTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HardHat, TrendingUp, Video, Check, Users, Sparkles, Crown, ArrowRight, MessageCircle, Map } from "lucide-react";

const STRIPE_SINGLE = "https://buy.stripe.com/bJeaEYe0h9L8ao0g5QeQM0R";
const STRIPE_6SESSION = "https://buy.stripe.com/14A5kEf4l0ay7bOaLweQM0Q";

const coachingPackages = [
  {
    title: "Single Session",
    price: "$1,000",
    description: "One focused hour with Marshall — bring your biggest challenge and leave with a clear plan.",
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
    description: "Your strategic advisor on speed dial for the decisions that matter most.",
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
    description: "Morning strategy call for entrepreneurship, mindset, and business best practices. Recordings included.",
    link: "/power-hour",
    pricing: {
      monthly: "$1,000",
      sixMonth: "$5,000",
      monthlyLink: "https://buy.stripe.com/7sYeVeaO52iGgMo4n8eQM0J",
      sixMonthLink: "https://buy.stripe.com/bJe6oI8FX2iG9jW4n8eQM0I",
    },
  },
  {
    icon: HardHat,
    title: "Contractor School",
    tagline: "Scale your construction company",
    description: "Estimating, project management, legal, accounting, C-suite operations. Live Tuesdays at 7pm EST.",
    link: "/contractor-school",
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing",
    tagline: "Close more deals, generate leads",
    description: "Presentations, negotiations, traffic, retargeting, offline marketing. Live Wednesdays at 7pm EST.",
    link: "/sales-marketing-school",
  },
  {
    icon: Video,
    title: "ALP University",
    tagline: "Full video training library",
    description: "Access the full archive of Power Hours, Contractor School, and Sales & Marketing School recordings.",
    link: "/alp-university",
  },
];

const growthAcademyFeatures = [
  "20+ live sessions per month with Marshall",
  "Daily morning strategy calls (Power Hour)",
  "Contractor School & Sales & Marketing School",
  "Every recording included",
  "Group Discord community",
];

const fullAccessFeatures = [
  "Everything in Growth Academy",
  "10 private 1:1 sessions with Marshall",
  "Direct group text chat access",
  "Priority support & private elite community",
];

const Programs = () => {
  const [growthModalOpen, setGrowthModalOpen] = useState(false);
  const [fullAccessModalOpen, setFullAccessModalOpen] = useState(false);

  return (
    <>
      <SEO
        title="ALP Programs - All Training & Coaching Packages | Marshall Wilkinson"
        description="Explore Marshall Wilkinson's complete program offerings: 1-on-1 Coaching, Power Hour, Contractor School, Sales & Marketing School, ALP University, Growth Academy, and Full Access bundles."
        keywords="Marshall Wilkinson programs, ALP programs, business coaching programs, 1-on-1 coaching, contractor training, sales training, Power Hour, Growth Academy, Full Access"
        canonical="/programs"
      />
      <StructuredData type="organization" />

      <main className="min-h-screen">
        <Header />

        {/* Hero */}
        <section className="pt-24 pb-12 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                Every Way to <span className="text-gradient-gold">Work With Marshall</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you want Marshall on speed dial for your biggest decisions, daily group coaching to build momentum, or a complete training library — there's a path built for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="premium" size="lg" className="gap-2" asChild>
                  <a href="#coaching">1-on-1 Coaching</a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href="#programs">Group Programs</a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href="#bundles">Bundles</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tier 1: 1-on-1 Coaching */}
        <section id="coaching" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Work With Marshall Directly</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">1-on-1 Coaching</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Not everyone wants a daily group call. Some entrepreneurs need Marshall on speed dial — available to peel off an hour when a high-stakes decision demands it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {coachingPackages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative rounded-xl border hover:shadow-md transition-shadow ${
                    pkg.highlight ? "border-primary/40" : "border-border"
                  }`}
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
                  Learn more about 1-on-1 coaching
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tier 2: Group Programs */}
        <section id="programs" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Group Programs & Training</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Live group sessions and a complete training library — build momentum with a community of driven entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {programs.map((program, index) => {
                const Icon = program.icon;
                return (
                  <Link key={index} to={program.link}>
                    <Card className="h-full rounded-xl border-border hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                      <CardContent className="p-4 md:p-6 space-y-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:scale-110 transition-transform" />
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
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Power Hour standalone pricing */}
            <div className="max-w-3xl mx-auto mt-12">
              <Card className="rounded-xl border-primary/30 border-2">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="text-primary">Available Standalone</span>
                      </div>
                      <h3 className="text-xl font-bold">Power Hour</h3>
                      <p className="text-sm text-muted-foreground">
                        The only group program available as a standalone purchase. Daily live coaching at 8am EST.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="lg" className="min-h-[48px]" asChild>
                        <a href="https://buy.stripe.com/7sYeVeaO52iGgMo4n8eQM0J" target="_blank" rel="noopener noreferrer">
                          $1,000 for 1 month
                        </a>
                      </Button>
                      <Button variant="premium" size="lg" className="min-h-[48px]" asChild>
                        <a href="https://buy.stripe.com/bJe6oI8FX2iG9jW4n8eQM0I" target="_blank" rel="noopener noreferrer">
                          $5,000 for 6 months
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Weekly Schedule */}
        <WeeklySchedule />

        {/* Tier 3: Bundles */}
        <section id="bundles" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Get Everything</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">Bundle & Save</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Combine all group programs into one package — or go all-in with private coaching included.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Growth Academy */}
              <Card className="rounded-xl border-2 border-primary/30">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-xs">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-primary font-medium">Hero Tier</span>
                    </div>
                    <h3 className="text-2xl font-bold">ALP Growth Academy</h3>
                    <p className="text-muted-foreground text-sm">
                      All 4 live programs + recordings + community. 20+ sessions per month.
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {growthAcademyFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">1 Month</span>
                      <span className="text-xl font-bold">$2,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">6 Months</span>
                      <span className="text-xl font-bold text-primary">$8,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Annual</span>
                      <span className="text-xl font-bold text-primary">$14,000</span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="w-full min-h-[48px] gap-2"
                    onClick={() => setGrowthModalOpen(true)}
                  >
                    Choose Duration
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Full Access */}
              <Card className="rounded-xl border-2 border-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <CardContent className="p-6 md:p-8 space-y-6 relative">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-3 py-1 text-xs">
                      <Crown className="w-3 h-3 text-primary" />
                      <span className="text-primary font-medium">Elite Tier</span>
                    </div>
                    <h3 className="text-2xl font-bold">
                      <span className="text-gradient-gold">ALP Full Access</span>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Everything in Growth Academy + 10 private 1-on-1 sessions with Marshall.
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {fullAccessFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">6 Months</span>
                      <span className="text-xl font-bold text-primary">$10,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">Annual</span>
                        <span className="text-xs text-primary ml-2">Best Value</span>
                      </div>
                      <span className="text-xl font-bold text-primary">$15,000</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Just <span className="text-primary font-semibold">$1,000 more</span> than Growth Academy Annual — includes <span className="text-primary font-semibold">$10,000</span> in private coaching.
                  </p>

                  <Button
                    variant="premium"
                    size="lg"
                    className="w-full min-h-[48px] gap-2"
                    onClick={() => setFullAccessModalOpen(true)}
                  >
                    Get Full Access
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Investment Table */}
        <InvestmentTable />

        {/* Coaching Testimonials */}
        <CoachingTestimonials />

        {/* Program Testimonials */}
        <ProgramTestimonials />

        <Footer />

        <GrowthAcademyModal open={growthModalOpen} onOpenChange={setGrowthModalOpen} />
        <FullAccessModal open={fullAccessModalOpen} onOpenChange={setFullAccessModalOpen} />
      </main>
    </>
  );
};

export default Programs;
