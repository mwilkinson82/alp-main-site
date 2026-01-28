import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Clock, HardHat, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeeklySchedule from "@/components/WeeklySchedule";

const HandbookSpecial = () => {
  const includedPrograms = [
    {
      name: "Power Hour",
      icon: Clock,
      description: "Daily morning accountability sessions Monday-Friday at 8am EST",
      features: ["Live coaching calls", "Goal setting & tracking", "Community accountability"]
    },
    {
      name: "Contractor School",
      icon: HardHat,
      description: "Weekly training for scaling your contracting business",
      features: ["Operations systems", "Crew management", "Estimating & bidding"]
    },
    {
      name: "Sales & Marketing School",
      icon: TrendingUp,
      description: "Weekly sessions to master client acquisition",
      features: ["Lead generation", "Sales scripts", "Marketing funnels"]
    }
  ];

  const benefits = [
    "Access to all live sessions for one full month",
    "Full recordings library access",
    "Private community membership",
    "Direct access to Marshall Wilkinson",
    "Workbooks and resources",
    "Cancel anytime after your month"
  ];

  return (
    <>
      <Helmet>
        <title>ALP Handbook Special Offer | Marshall Wilkinson</title>
        <meta name="description" content="Exclusive offer for ALP Handbook purchasers: Get one month of Power Hour, Contractor School, and Sales & Marketing School for just $999." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 md:mb-6 bg-primary/20 text-primary border-primary/30 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 inline" />
                Exclusive for ALP Handbook Purchasers
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-2">
                Thank You for Getting the{" "}
                <span className="text-primary">ALP Handbook</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto px-2">
                As a special thank you, you're invited to join our complete training program 
                for one month at an exclusive rate.
              </p>

              <div className="inline-flex items-center gap-3 md:gap-4 bg-muted/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                <div className="text-left">
                  <p className="text-xs md:text-sm text-muted-foreground">Handbook Purchaser Special</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl md:text-5xl font-bold text-primary">$999</span>
                    <span className="text-sm md:text-base text-muted-foreground line-through">$2,000+ value</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">One month • Full access</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What's Included in Your Month
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get access to all three programs for one full month of intensive training and accountability
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {includedPrograms.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <Card key={index} className="bg-background/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                        <p className="text-muted-foreground mb-4">{program.description}</p>
                        <ul className="space-y-2">
                          {program.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Schedule */}
        <WeeklySchedule />

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything You Get
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-5 md:p-12 relative">
                  <div className="text-center">
                    <Badge className="mb-3 md:mb-4 bg-primary text-primary-foreground text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Limited Time Offer
                    </Badge>
                    
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                      Ready to Transform Your Business?
                    </h2>
                    
                    <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto">
                      Join fellow handbook owners who are implementing what they learned 
                      with live coaching, accountability, and community support.
                    </p>

                    <div className="mb-6 md:mb-8">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl md:text-6xl font-bold text-primary">$999</span>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground px-2">
                        One month of Power Hour + Contractor School + Sales & Marketing School
                      </p>
                    </div>

                    <Button 
                      size="xl" 
                      variant="premium"
                      className="group w-full md:w-auto text-sm md:text-base px-6 md:px-8"
                      onClick={() => window.open('https://buy.stripe.com/8x2bJ28FXg9wgMo1aWeQM0K', '_blank')}
                    >
                      Claim Your Handbook Special
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                      Secure checkout • Cancel anytime • Instant access
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HandbookSpecial;
