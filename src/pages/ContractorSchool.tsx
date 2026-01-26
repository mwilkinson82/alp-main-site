import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, HardHat, Calculator, FileText, DollarSign, Users, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    "Included in ALP Growth Academy bundle"
  ];

  return (
    <>
      <SEO 
        title="Contractor School - Construction Business Training | Marshall Wilkinson"
        description="Scale your construction company the right way with Marshall Wilkinson's Contractor School. Live weekly training on estimating, project management, legal, accounting, and operations."
        keywords="Contractor School, construction business training, contractor coaching, Marshall Wilkinson, builder training, construction estimating, project management"
        canonical="/contractor-school"
      />
      <StructuredData 
        type="service" 
        data={{
          serviceType: "Contractor Business Training",
          description: "Weekly live training for construction business owners on scaling operations"
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
                  className="bg-gold hover:bg-gold/90 text-black font-semibold text-lg px-8 h-12"
                  asChild
                >
                  <Link to="/programs">View All Programs</Link>
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
                    <h3 className="text-2xl font-bold">Get Access to Contractor School</h3>
                    <p className="text-muted-foreground">
                      Contractor School is included in the ALP Growth Academy bundle along with Power Hour and Sales & Marketing School.
                    </p>
                    <Button asChild variant="premium" size="lg" className="w-full">
                      <Link to="/programs">
                        View All Programs
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Schedule */}
        <WeeklySchedule />

        {/* Testimonials */}
        <ProgramTestimonials />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Scale Your Construction Business?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Get access to Contractor School through the ALP Growth Academy for the full training ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  asChild
                >
                  <Link to="/programs">
                    Explore All Programs
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ContractorSchool;
