import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";
import InvestmentTable from "@/components/InvestmentTable";
import FullAccessModal from "@/components/FullAccessModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HardHat, TrendingUp, Video, Check, Crown, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Clock,
    title: "Power Hour",
    tagline: "Daily live execution room at 8am EST",
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
    tagline: "Systems for contractors scaling real operations",
    description: "Estimating, project management, legal, accounting, C-suite operations. Live Tuesdays at 7pm EST.",
    link: "/contractor-school",
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing",
    tagline: "Lead flow, persuasion, and deal control",
    description: "Presentations, negotiations, traffic, retargeting, offline marketing. Live Wednesdays at 7pm EST.",
    link: "/sales-marketing-school",
  },
  {
    icon: Video,
    title: "ALP University",
    tagline: "On-demand archive of every session",
    description: "Access the full archive of Power Hours, Contractor School, and Sales & Marketing School recordings.",
    link: "/alp-university",
  },
];

const fullAccessFeatures = [
  "All Live Rooms — Power Hour, Contractor School, Sales & Marketing",
  "10 private 1:1 sessions with Marshall",
  "Direct group text chat access",
  "Priority support & private elite community",
  "Every recording included — archive grows weekly",
];

const Programs = () => {
  const [fullAccessModalOpen, setFullAccessModalOpen] = useState(false);

  return (
    <>
      <SEO
        title="Live Rooms — ALP Training Programs | Altitude Logic Pressure"
        description="Train live with Marshall Wilkinson. Power Hour, Contractor School, and Sales & Marketing School — daily and weekly execution rooms for operators who move fast."
        keywords="ALP live rooms, Power Hour, Contractor School, Sales Marketing School, ALP Full Access, Marshall Wilkinson programs, operator training"
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
                Train Live. <span className="text-gradient-gold">Execute Faster.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Daily and weekly live rooms built to sharpen decision-making, install scalable systems, and keep operators moving at pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="premium" size="lg" className="gap-2" asChild>
                  <a href="#programs">Live Rooms</a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href="#full-access">Full Access</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Group Programs */}
        <section id="programs" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Group Programs & Training</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Live group sessions and a complete training archive — built for operators who execute, not just learn.
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
                        The only live room available as a standalone purchase. Daily execution sessions at 8am EST.
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

        {/* Full Access */}
        <section id="full-access" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Maximum Proximity</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="text-gradient-gold">ALP Full Access</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything — all live rooms, all recordings, plus 10 private advisory sessions with Marshall. The highest-leverage way to operate inside the ALP ecosystem.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="rounded-xl border-2 border-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <CardContent className="p-6 md:p-10 space-y-6 relative">
                  <ul className="space-y-3">
                    {fullAccessFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 border-t border-border pt-6">
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

        {/* Program Testimonials */}
        <ProgramTestimonials />

        <Footer />

        <FullAccessModal open={fullAccessModalOpen} onOpenChange={setFullAccessModalOpen} />
      </main>
    </>
  );
};

export default Programs;
