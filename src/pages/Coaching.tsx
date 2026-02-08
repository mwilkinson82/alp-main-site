import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Video, Users, Star, ArrowRight } from "lucide-react";
import CustomPricingForm from "@/components/CustomPricingForm";

const Coaching = () => {
  const [customPricingOpen, setCustomPricingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openCustomPricingForm = (packageName: string) => {
    setSelectedPackage(packageName);
    setCustomPricingOpen(true);
  };

  const packages = [
    {
      name: "Single Session",
      price: "$1,000",
      duration: "1 Hour",
      features: [
        "Deep dive into your specific challenges",
        "Actionable strategies and solutions",
        "Recorded session with lifetime access",
        "Personalized guidance and recommendations",
        "Follow-up resources and materials"
      ],
      cta: "Book Your Session"
    },
    {
      name: "6-Session Intensive",
      subtitle: "ALP's Premier Coaching Experience",
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
      cta: "Book Your Intensive",
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
        title="Marshall Wilkinson - 1-on-1 Business Coaching & Consulting Sessions"
        description="Get personalized business coaching from Marshall Wilkinson. Deep-dive 1-on-1 sessions tailored to your challenges with lifetime recording access. Elite coaching for CEOs, entrepreneurs, and sales professionals."
        keywords="Marshall Wilkinson coaching, Marshall Wilkinson 1-on-1, Marshall Wilkinson consultant, 1-on-1 coaching, business coaching, personalized coaching, executive coaching, business consulting, leadership coaching, ALP coaching"
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
            style={{ backgroundImage: `url(/images/marshall-origin-thumbnail.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </section>

        {/* Content Section */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-gradient-gold">1-on-1 Coaching</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Elite business coaching for entrepreneurs, CEOs, and sales professionals ready to scale beyond limits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-black font-semibold text-lg px-8 h-12"
                  onClick={scrollToBooking}
                >
                  Book Your Session
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-black font-semibold text-lg px-8 h-12"
                  asChild
                >
                  <Link to={{ pathname: "/", hash: "#testimonials" }}>See Client Results</Link>
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
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-background">
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
                      onClick={() => pkg.price === "Custom Pricing" ? openCustomPricingForm(pkg.name) : scrollToBooking()}
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

      {/* Book Your Session */}
      <section id="booking-section" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your Session
              </h2>
              <p className="text-xl text-muted-foreground">
                Select a time that works best for you
              </p>
            </div>
            
            {/* Calendly Inline Widget */}
            <div className="bg-background rounded-lg shadow-lg p-4 md:p-8">
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/marshallwilkinson/60min?primary_color=ffc700" 
                style={{ minWidth: '320px', height: '1000px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See What Clients Are Saying
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Hear directly from business owners who've transformed their operations through personalized coaching
            </p>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to={{ pathname: "/", hash: "#testimonials" }}>
                View Client Testimonials
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Book your session today and take the first step toward transforming your business
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToBooking}
              className="text-lg px-8"
            >
              Schedule Your Session Now
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
      </main>
    </>
  );
};

export default Coaching;
