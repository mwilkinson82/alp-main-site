import { Link } from "react-router-dom";
import liveRoomsHero from "@/assets/live-rooms-hero.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HardHat, TrendingUp, Video, ArrowRight, Monitor } from "lucide-react";

const programs = [
  {
    icon: Clock,
    title: "Power Hour",
    tagline: "Daily live execution room at 8am EST",
    description: "Morning strategy call for entrepreneurship, mindset, and business best practices. Recordings included.",
    link: "/power-hour",
    pricing: "$997/month",
  },
  {
    icon: HardHat,
    title: "Contractor School",
    tagline: "Systems for contractors scaling real operations",
    description: "Estimating, project management, legal, accounting, C-suite operations. Live Tuesdays at 7pm EST.",
    link: "/contractor-school",
    pricing: "$497/mo",
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing",
    tagline: "Lead flow, persuasion, and deal control",
    description: "Presentations, negotiations, traffic, retargeting, offline marketing. Live Wednesdays at 7pm EST.",
    link: "/sales-marketing-school",
    pricing: "$497/mo",
  },
];

const Programs = () => {
  return (
    <>
      <SEO
        title="Live Rooms — ALP Training Programs | Altitude Logic Pressure"
        description="Train live with Marshall Wilkinson. Power Hour, Contractor School, and Sales & Marketing School — daily and weekly execution rooms for operators who move fast."
        keywords="ALP live rooms, Power Hour, Contractor School, Sales Marketing School, Marshall Wilkinson programs, operator training"
        canonical="/programs"
      />
      <StructuredData type="organization" />

      <main className="min-h-screen">
        <Header />

        {/* Hero Image */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <img
            src={liveRoomsHero}
            alt="Marshall Wilkinson leading a live group session"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        </section>

        {/* Hero Content */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold">
                Train Live. <span className="text-gradient-gold">Execute Faster.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Daily and weekly live rooms built to sharpen decision-making, install scalable systems, and keep operators moving at pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="premium" size="lg" className="gap-2" asChild>
                  <a href="#programs">Explore Programs</a>
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
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Monitor className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">All sessions are virtual — delivered live through the ALP portal</span>
              </div>
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
                        <p className="text-xs md:text-sm font-semibold text-primary">{program.pricing}</p>
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
          </div>
        </section>

        {/* Weekly Schedule */}
        <WeeklySchedule />

        {/* Program Testimonials */}
        <ProgramTestimonials />

        <Footer />
      </main>
    </>
  );
};

export default Programs;