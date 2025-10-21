import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Video, Users, Star, ArrowRight } from "lucide-react";
import CustomPricingForm from "@/components/CustomPricingForm";
import marshallSuit from "@/assets/marshall-suit.png";

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
      cta: "Discuss Your Needs",
      premium: true
    },
    {
      name: "Extended Partnership",
      subtitle: "6 Months or 1 Year",
      price: "Custom Pricing",
      duration: "Long-term Commitment",
      features: [
        "Comprehensive business transformation",
        "Quarterly strategic planning sessions",
        "All ongoing support benefits",
        "Exclusive access to network and resources",
        "VIP priority for all services"
      ],
      cta: "Discuss Your Needs"
    }
  ];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="text-sm font-semibold">Premium 1-on-1 Coaching</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Transform Your Business with Personalized Guidance
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Get exclusive access to expert coaching that delivers real results. 
                  Deep-dive sessions tailored to your unique challenges with lifetime access to recordings.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={scrollToBooking} className="text-lg px-8">
                    Book Your Session
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8">
                    <Link to="/#testimonials">See Client Results</Link>
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative">
                  <img 
                    src={marshallSuit} 
                    alt="Marshall Wilkinson - Business Coach" 
                    className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                  />
                </div>
              </div>
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

      {/* Packages */}
      <section className="py-20">
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
                      onClick={() => pkg.price === "$1,000" ? scrollToBooking() : openCustomPricingForm(pkg.name)}
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See What Clients Are Saying
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Hear directly from business owners who've transformed their operations through personalized coaching
            </p>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/#testimonials">
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
  );
};

export default Coaching;
