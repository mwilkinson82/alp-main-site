import { useState } from "react";
import marshallCasual from "@/assets/marshall-casual.jpg";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Video, Users, ArrowRight, Monitor } from "lucide-react";
import CustomPricingForm from "@/components/CustomPricingForm";
import CoachingTestimonials from "@/components/CoachingTestimonials";
import AdvisoryApplicationModal from "@/components/AdvisoryApplicationModal";

const Coaching = () => {
  const [customPricingOpen, setCustomPricingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<"Strategy Session — $1,000" | "Private Advisory — $5,000">("Strategy Session — $1,000");

  const openApplication = (service: "Strategy Session — $1,000" | "Private Advisory — $5,000") => {
    setDefaultService(service);
    setAppModalOpen(true);
  };

  const openCustomPricingForm = (packageName: string) => {
    setSelectedPackage(packageName);
    setCustomPricingOpen(true);
  };

  const packages = [
    {
      name: "Strategy Session",
      subtitle: "Single-session intensive",
      price: "$1,000",
      duration: "1 Hour",
      features: [
        "Deep dive into your specific challenges",
        "Actionable strategies and solutions",
        "Recorded session with lifetime access",
        "Personalized guidance and recommendations",
        "Follow-up resources and materials"
      ],
      cta: "Apply for Private Advisory",
      premium: false,
    },
    {
      name: "6-Session Intensive",
      subtitle: "ALP's Premier Advisory Experience",
      price: "$5,000",
      duration: "Six 1-Hour Sessions",
      features: [
        "Six dedicated 1-on-1 sessions with Marshall",
        "Direct access to Marshall between sessions via text & Discord",
        "Real-time guidance as challenges arise during your day",
        "Recorded sessions with lifetime access",
        "Strategic scaling roadmap tailored to your business",
        "Risk mitigation and decision-making support"
      ],
      cta: "Apply for Private Advisory",
      premium: true
    },
    {
      name: "Ongoing Support",
      subtitle: "Daily, Weekly, or Monthly",
      price: "Custom Pricing",
      duration: "Flexible Terms",
      features: [
        "Regular accountability and guidance",
        "Continuous strategy refinement",
        "All single session benefits",
        "Priority scheduling",
        "Direct messaging access between sessions"
      ],
      cta: "Discuss Your Needs"
    }
  ];

  return (
    <>
      <SEO 
        title="Marshall Wilkinson - Private Advisory | 1-on-1 Strategic Sessions"
        description="Apply for Private Advisory with Marshall Wilkinson. Single-session and 6-session intensive engagements — virtual via Zoom. Built for operators who need execution systems and decision leverage installed fast."
        keywords="Marshall Wilkinson private advisory, Marshall Wilkinson 1-on-1, strategic advisory, business advisory, executive advisory, ALP private advisory, strategy session, 6-session intensive"
        canonical="/coaching"
      />
      <StructuredData 
        type="service" 
        data={{
          serviceType: "1-on-1 Business Coaching",
          description: "Personalized coaching sessions with lifetime recording access",
          price: "1000",
          offers: {
            "@type": "AggregateOffer",
            "lowPrice": "1000",
            "highPrice": "10000",
            "priceCurrency": "USD"
          }
        }}
      />
      <main className="min-h-screen">
        <Header />

        {/* Hero Image Section */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${marshallCasual})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </section>

        {/* Content Section */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-gradient-gold">Private Advisory</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Private strategic engagements for operators and founders who need execution systems, decision leverage, and real accountability installed fast.
              </p>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-sm mx-auto">
                <Video className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-primary font-medium text-center leading-snug">
                  All sessions conducted virtually via Zoom<br className="sm:hidden" />
                  <span className="hidden sm:inline"> — </span>1-on-1 with Marshall
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="bg-gradient-gold hover:shadow-glow text-primary-foreground font-semibold text-lg px-8 h-12"
                  asChild
                >
                  <a href="#intensive">See the 6-Session Intensive</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 h-12"
                  asChild
                >
                  <a href="#packages">View All Packages</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

      {/* What's Included */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              What You Get in Every Session
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              One hour that could change everything
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Deep Dive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We'll thoroughly examine your specific challenges, identify root causes, and develop targeted solutions tailored to your situation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Lifetime Recording Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every session is recorded and yours forever. Review insights, strategies, and action items whenever you need them.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Personalized Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get expert advice customized to your business, industry, and goals. No generic solutions—just what works for you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Session Intensive Feature Section */}
      <section id="intensive" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                ALP's Flagship Coaching Package
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The 6-Session Intensive
              </h2>
            </div>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-6 text-center">
              <p className="text-xl leading-relaxed">
                Scaling a business is one of the most high-stakes endeavors you'll ever undertake. Every decision carries weight—hiring, pricing, operations, client acquisition—and the cost of getting it wrong compounds fast. That's why the 6-Session Intensive exists.
              </p>
              <p className="text-lg leading-relaxed">
                This is ALP's top-tier coaching service, designed for founders and operators who need more than a single conversation. Over six dedicated sessions, Marshall works alongside you to build a strategic roadmap tailored to your business—addressing the real challenges you're facing in real time.
              </p>
              <p className="text-lg leading-relaxed">
                But the value doesn't stop when the call ends. Between sessions, you have <strong className="text-foreground">direct access to Marshall via text and Discord</strong>—so when a critical decision lands on your desk, you're not guessing. You have an experienced advisor in your corner helping you mitigate risk, seize opportunities, and move with confidence.
              </p>
              <p className="text-lg leading-relaxed">
                Most clients find this is the format that fits. It gives you enough time to implement, adjust, and come back with results—while keeping the momentum and accountability that drives real transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Choose Your Investment
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Flexible options to match your commitment level
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`relative ${pkg.premium ? 'border-primary border-2 shadow-lg' : ''}`}
                >
                  {pkg.premium && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    {pkg.subtitle && (
                      <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
                    )}
                    <div className="mt-4">
                      <div className="text-4xl font-bold">{pkg.price}</div>
                      <div className="text-sm text-muted-foreground mt-1">{pkg.duration}</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="w-full" 
                      variant={pkg.premium ? "default" : "outline"}
                      onClick={() => {
                        if (pkg.price === "Custom Pricing") {
                          openCustomPricingForm(pkg.name);
                        } else if (pkg.premium) {
                          openApplication("Private Advisory — $5,000");
                        } else {
                          openApplication("Strategy Session — $1,000");
                        }
                      }}
                      size="lg"
                    >
                      {pkg.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-8 text-sm">
              * Custom packages are priced based on frequency, duration, and specific needs. 
              Book a consultation to discuss the perfect plan for you.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              A simple process designed around your schedule
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">1</div>
                <h3 className="text-xl font-semibold">Submit Your Application</h3>
                <p className="text-muted-foreground">Complete the short advisory application so Marshall can understand your business and determine if there's a fit.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">2</div>
                <h3 className="text-xl font-semibold">Marshall Reviews & Reaches Out</h3>
                <p className="text-muted-foreground">Marshall reviews every application personally. If there's a fit, he'll reach out within 48 hours to schedule your sessions.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">3</div>
                <h3 className="text-xl font-semibold">Start Transforming</h3>
                <p className="text-muted-foreground">Get on the call, dive deep into your business challenges, and walk away with actionable strategies you can implement immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <CoachingTestimonials />

      {/* Ask Marshall Callout */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/20 bg-muted/30">
              <CardContent className="p-8 md:p-10 text-center space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">Prefer a Focused Written or Video Response?</h3>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Start with a single question. Submit your toughest challenge and get a personalized video analysis from Marshall within 24 hours.
                </p>
                <Button size="lg" className="bg-gradient-gold hover:shadow-glow text-primary-foreground font-semibold gap-2" asChild>
                  <Link to="/ask-marshall">
                    Submit a Strategic Question — $250
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Apply?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Applications are reviewed personally by Marshall. If there's a fit, you'll hear back within 48 hours.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => openApplication("Private Advisory — $5,000")}
              className="text-lg px-8"
            >
              Apply for Private Advisory — $5,000
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

        <Footer />
        
        <CustomPricingForm 
          open={customPricingOpen}
          onOpenChange={setCustomPricingOpen}
          packageType={selectedPackage}
        />
        <AdvisoryApplicationModal
          open={appModalOpen}
          onOpenChange={setAppModalOpen}
          defaultService={defaultService}
        />
      </main>
    </>
  );
};

export default Coaching;
