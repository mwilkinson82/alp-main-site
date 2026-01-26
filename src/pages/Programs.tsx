import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";
import InvestmentTable from "@/components/InvestmentTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HardHat, TrendingUp, Video, Check, Users, Sparkles, Crown, ArrowRight } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      title: "Power Hour",
      tagline: "Start every day with momentum.",
      description: "A morning call for entrepreneurship, inspiration, mindset, and business best practices. Realign yourself every morning to go out and be a high-performing entrepreneur. Includes full recording library.",
      schedule: "Live Daily at 8am EST",
      icon: Clock,
      link: "/power-hour"
    },
    {
      title: "Contractor School",
      tagline: "Scale your construction company the right way.",
      description: "Everything you need to scale: estimating, project management, legal and contracts, accounting, C-suite activities, taxes, and operations. Recordings included.",
      schedule: "Live Tuesdays at 7pm EST",
      icon: HardHat,
      link: "/contractor-school"
    },
    {
      title: "Sales & Marketing School",
      tagline: "Generate leads. Close deals. Grow revenue.",
      description: "Learn how to make presentations, negotiate and close deals, drive traffic to websites and landing pages, run retargeting campaigns, offline marketing, and get attention for your business to generate leads. Recordings included.",
      schedule: "Live Wednesdays at 7pm EST",
      icon: TrendingUp,
      link: "/sales-marketing-school"
    },
    {
      title: "ALP University",
      tagline: "Learn at your own pace.",
      description: "Access to the full archive of Power Hours, Contractor School, and Sales & Marketing School. New recordings added daily.",
      schedule: "Recordings Only",
      icon: Video,
      link: "/alp-university",
      price: "$197/mo"
    }
  ];

  const growthAcademyFeatures = [
    "20+ live sessions per month with Marshall",
    "7 live coaching sessions across 5 days per week",
    "Daily morning strategy calls",
    "Every recording included",
    "Group Discord community",
    "Designed for entrepreneurs who want acceleration, not excuses"
  ];

  const fullAccessFeatures = [
    "Everything in ALP Growth Academy (20+ live sessions/month)",
    "10 private 1:1 sessions with Marshall",
    "Direct group text chat access",
    "Priority support",
    "Private elite community"
  ];

  return (
    <>
      <SEO 
        title="ALP Programs - All Live Training & Coaching Packages | Marshall Wilkinson"
        description="Explore Marshall Wilkinson's complete program offerings: Power Hour, Contractor School, Sales & Marketing School, ALP University, Growth Academy, and Full Access bundles."
        keywords="Marshall Wilkinson programs, ALP programs, business coaching programs, contractor training, sales training, Power Hour, Growth Academy, Full Access"
        canonical="/programs"
      />
      <StructuredData type="organization" />
      
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                The Four <span className="text-gradient-gold">ALP Programs</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Power Hour, Contractor School, and Sales & Marketing School are bundled in our Growth Academy and Full Access packages.
              </p>
            </div>
          </div>
        </section>

        {/* Individual Programs Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <Link to={program.link} key={index} className="group">
                      <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
                        <CardContent className="p-6 space-y-4">
                          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs">
                            <Icon className="w-3 h-3 text-primary" />
                            <span className="text-primary">{program.schedule}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                              {program.title}
                              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-primary font-medium mb-3">{program.tagline}</p>
                            <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                          </div>

                          {program.price ? (
                            <div className="pt-4 border-t border-border">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary">{program.price}</span>
                                <span className="text-sm text-muted-foreground">Holiday Special</span>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span>Included in ALP Growth Academy</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Schedule */}
        <WeeklySchedule />

        {/* Growth Academy Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="border-2 border-primary/30 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">Hero Tier</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold">
                        The ALP Growth Academy
                      </h2>
                      
                      <p className="text-xl text-primary font-medium">
                        All live programs. One ecosystem. Maximum momentum.
                      </p>
                      
                      <p className="text-muted-foreground">
                        Power Hour (Daily 8am EST) + Contractor School (Tuesdays 7pm EST) + Sales & Marketing School (Wednesdays 7pm EST) + full recordings.
                      </p>

                      <ul className="space-y-3">
                        {growthAcademyFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <Card className="bg-background border-2 border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                          HOLIDAY SPECIAL
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <p className="text-sm text-muted-foreground">Holiday Pricing — Ends December 31</p>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">1 Month</p>
                                <p className="text-xs text-muted-foreground">20+ live sessions included</p>
                              </div>
                              <p className="text-2xl font-bold">$2,000</p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-border pt-3">
                              <div>
                                <p className="font-medium">6 Months</p>
                                <p className="text-xs text-primary">Save $4,000</p>
                              </div>
                              <p className="text-2xl font-bold text-primary">$8,000</p>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-border pt-3">
                              <div>
                                <p className="font-medium">Annual</p>
                                <p className="text-xs text-primary">Save $10,000 — Best Value</p>
                              </div>
                              <p className="text-2xl font-bold text-primary">$14,000</p>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-border">
                            <p className="text-sm text-center">
                              <span className="text-primary font-semibold">7x live sessions per week</span>
                              <span className="text-muted-foreground"> vs recordings-only with ALP University — for serious entrepreneurs ready to accelerate.</span>
                            </p>
                          </div>
                          
                          <Button asChild variant="premium" size="lg" className="w-full">
                            <a href="https://buy.stripe.com/growth-academy" target="_blank" rel="noopener noreferrer">
                              Choose Your Package
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Full Access Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                
                <CardContent className="p-8 md:p-12 relative">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 text-sm">
                      <Crown className="w-4 h-4 text-primary" />
                      <span className="text-primary font-medium">Elite Tier</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold">
                      <span className="text-gradient-gold">ALP Full Access</span>
                    </h2>

                    <p className="text-xl text-foreground">
                      For entrepreneurs who want direct access and high-level mentorship.
                    </p>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Includes everything in the ALP Growth Academy, plus 10 private one-on-one sessions with Marshall.
                    </p>

                    {/* $10,000 value callout */}
                    <div className="inline-flex items-center gap-3 bg-primary/10 border-2 border-primary/40 rounded-lg px-6 py-4">
                      <Users className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="text-3xl font-bold text-primary">$10,000</p>
                        <p className="text-sm text-muted-foreground">in private 1:1 sessions included</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                      {fullAccessFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Group chat callout */}
                    <p className="text-muted-foreground">
                      💬 Direct group text chat with Marshall and elite members
                    </p>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8">
                      <Card className="border-2 border-primary/50 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                          HOLIDAY SPECIAL
                        </div>
                        <CardContent className="p-6 text-center">
                          <p className="font-medium mb-2">6 Months</p>
                          <p className="text-4xl font-bold text-primary mb-2">$10,000</p>
                          <p className="text-sm text-primary">Save $5,000</p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-primary/50 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                          BEST VALUE
                        </div>
                        <CardContent className="p-6 text-center">
                          <p className="font-medium mb-2">Annual</p>
                          <p className="text-4xl font-bold text-primary mb-2">$15,000</p>
                          <p className="text-sm text-primary">Save $15,000</p>
                        </CardContent>
                      </Card>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Just <span className="text-primary font-semibold">$1,000 more</span> than Growth Academy Annual — includes <span className="text-primary font-semibold">$10,000</span> in private 1:1 coaching sessions.
                    </p>

                    <Button asChild variant="premium" size="lg" className="px-12">
                      <a href="https://buy.stripe.com/full-access" target="_blank" rel="noopener noreferrer">
                        Get Full ALP Access
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Investment Table */}
        <InvestmentTable />

        {/* Testimonials */}
        <ProgramTestimonials />

        <Footer />
      </main>
    </>
  );
};

export default Programs;
