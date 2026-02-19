import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import WeeklySchedule from "@/components/WeeklySchedule";
import ProgramTestimonials from "@/components/ProgramTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, TrendingUp, Megaphone, Target, Presentation, Globe, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SalesMarketingSchool = () => {
  const topics = [
    { icon: Presentation, title: "Presentations", description: "Master the art of compelling presentations that close deals" },
    { icon: Target, title: "Negotiation & Closing", description: "Learn proven techniques to negotiate and close more deals" },
    { icon: Globe, title: "Website & Landing Pages", description: "Drive traffic and convert visitors into leads" },
    { icon: Megaphone, title: "Retargeting Campaigns", description: "Run effective retargeting to maximize your marketing ROI" },
    { icon: Mail, title: "Offline Marketing", description: "Traditional marketing strategies that still work today" },
    { icon: TrendingUp, title: "Lead Generation", description: "Build systems that consistently generate qualified leads" }
  ];

  const benefits = [
    "Live weekly training every Wednesday at 7pm EST",
    "All sessions recorded for on-demand viewing",
    "Real strategies from real business results",
    "Direct access to Marshall during live sessions",
    "Community of ambitious entrepreneurs",
    "Included in the Full Access membership — not sold separately"
  ];

  return (
    <>
      <SEO 
        title="Sales & Marketing School - Business Growth Training | Marshall Wilkinson"
        description="Generate leads. Close deals. Grow revenue. Marshall Wilkinson's Sales & Marketing School teaches you how to build a real marketing machine for your business."
        keywords="Sales training, marketing training, lead generation, Marshall Wilkinson, business growth, sales coaching, marketing school"
        canonical="/sales-marketing-school"
      />
      <StructuredData 
        type="service" 
        data={{
          serviceType: "Sales & Marketing Training",
          description: "Weekly live training on sales, marketing, and lead generation"
        }}
      />
      
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Live Wednesdays at 7pm EST</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-gradient-gold">Sales & Marketing School</span>
              </h1>
              
              <p className="text-xl text-primary font-medium">
                Generate leads. Close deals. Grow revenue.
              </p>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn how to make presentations, negotiate and close deals, drive traffic to websites and landing pages, 
                run retargeting campaigns, offline marketing, and get attention for your business to generate leads. 
                All recordings included.
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
                  Comprehensive sales and marketing training for business owners
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
                    Why Sales & Marketing School?
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Most business owners rely on word-of-mouth and hope. Sales & Marketing School gives you 
                    the systems to consistently generate leads, close deals, and grow revenue predictably.
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
                    <TrendingUp className="w-16 h-16 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold">Included in Full Access</h3>
                    <p className="text-muted-foreground">
                      Sales & Marketing School is not sold separately. It's included in the ALP Full Access membership — alongside Power Hour and Contractor School — for operators who want the complete training ecosystem.
                    </p>
                    <Button asChild variant="premium" size="lg" className="w-full">
                      <Link to="/programs">
                        View Full Access Membership
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
                Ready to Grow Your Revenue?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Sales & Marketing School is included in the ALP Full Access membership. Join to get access to the complete live training ecosystem.
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

export default SalesMarketingSchool;
