import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

import ProgramTestimonials from "@/components/ProgramTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, HardHat, Calculator, FileText, DollarSign, Users, ClipboardList } from "lucide-react";

const ContractorSchool = () => {
  const topics = [
    { icon: Calculator, title: "Estimating", description: "Master accurate job costing and profitable pricing strategies" },
    { icon: ClipboardList, title: "Project Management", description: "Systems for managing projects from start to finish" },
    { icon: FileText, title: "Legal & Contracts", description: "Protect yourself and your business with proper contracts" },
    { icon: DollarSign, title: "Accounting", description: "Financial systems that scale with your business" },
    { icon: Users, title: "C-Suite Activities", description: "Think and operate like a CEO, not just a contractor" },
    { icon: HardHat, title: "Operations", description: "Build systems that allow you to scale without burning out" }
  ];

  const benefits = [
    "Live weekly training every Tuesday at 7pm EST",
    "All sessions recorded for on-demand viewing",
    "Real-world construction business strategies",
    "Direct access to Marshall during live sessions",
    "Community of like-minded builders",
    "Recordings archive grows every week"
  ];

  return (
    <>
      <SEO 
        title="Contractor School - Construction Business Training | Marshall Wilkinson"
        description="Scale your construction company the right way with Marshall Wilkinson's Contractor School. Live weekly training on estimating, project management, legal, accounting, and operations. $497/mo or lock in your quarter for $1,341."
        keywords="Contractor School, construction business training, contractor coaching, Marshall Wilkinson, builder training, construction estimating, project management"
        canonical="/contractor-school"
      />
      <StructuredData 
        type="service" 
        data={{
          serviceType: "Contractor Business Training",
          description: "Weekly live training for construction business owners on scaling operations",
          price: "497"
        }}
      />
      
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm">
                <HardHat className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Live Tuesdays at 7pm EST</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-gradient-gold">Contractor School</span>
              </h1>
              
              <p className="text-xl text-primary font-medium">
                Scale your construction company the right way.
              </p>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to scale: estimating, project management, legal and contracts, accounting, C-suite activities, taxes, and operations. All recordings included.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-gold hover:shadow-glow text-primary-foreground font-semibold text-lg px-8 h-12"
                  asChild
                >
                  <a href="#pricing">Join Contractor School</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Learn</h2>
                <p className="text-muted-foreground text-lg">
                  Comprehensive training designed specifically for construction business owners
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                        <p className="text-muted-foreground">{topic.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Why Contractor School?
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Most contractors are great at building, but struggle with the business side. 
                    Contractor School gives you the systems and strategies to run a profitable, scalable construction company.
                  </p>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="border-2 border-primary/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <HardHat className="w-16 h-16 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold">Built for Builders</h3>
                    <p className="text-muted-foreground">
                      Contractor School is purpose-built for construction business owners who want to stop trading time for money and start building a real company.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold">When We Meet</h2>
              <div className="bg-muted/50 border border-border rounded-xl p-6 md:p-8">
                <HardHat className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-xl md:text-2xl font-bold">Every Tuesday</p>
                <p className="text-lg text-primary font-medium">7:00 PM EST</p>
                <p className="text-muted-foreground text-sm mt-3">All sessions are recorded — watch on your schedule if you can't make it live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <ProgramTestimonials />

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
                Join Contractor School
              </h2>
              <p className="text-xl text-secondary-foreground/80 mb-8">
                Start building the business systems your construction company needs
              </p>

              <div className="bg-background rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {/* Monthly Subscription */}
                  <div className="border border-border rounded-lg p-6 space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground mb-1">$497<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                      <p className="text-muted-foreground">Monthly Subscription</p>
                      <p className="text-xs text-muted-foreground mt-1">Cancel anytime</p>
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                    >
                      <a href="https://buy.stripe.com/5kQcN6g8p8H41RubPAeQM12" target="_blank" rel="noopener noreferrer">
                        Subscribe Monthly
                      </a>
                    </Button>
                  </div>

                  {/* Lock in Your Quarter */}
                  <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      LOCK IN YOUR QUARTER
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground mb-1">$1,497</p>
                      <p className="text-muted-foreground">3 Months</p>
                      <p className="text-sm text-primary">Save $494</p>
                    </div>
                    <Button 
                      asChild 
                      variant="premium" 
                      size="lg" 
                      className="w-full"
                    >
                      <a href="https://buy.stripe.com/bJebJ22hzg9w7bO3j4eQM13" target="_blank" rel="noopener noreferrer">
                        Lock in 3 Months
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-secondary-foreground/60 mt-6">
                After payment, you'll receive immediate access to the member portal and live session invites every Tuesday at 7pm EST
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ContractorSchool;