import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, GraduationCap, ArrowRight, HardHat, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapStagger } from "@/hooks/use-gsap-scroll";

const programs = [
  {
    icon: Clock,
    title: "Power Hour",
    tagline: "Daily Momentum",
    description: "Start every day with Marshall at 8am EST. Live coaching, accountability, and the mindset to dominate.",
    link: "/power-hour"
  },
  {
    icon: HardHat,
    title: "Contractor School",
    tagline: "Build Your Empire",
    description: "Weekly deep-dive into estimating, project management, and scaling your construction business.",
    link: "/contractor-school"
  },
  {
    icon: TrendingUp,
    title: "Sales & Marketing School",
    tagline: "Close More Deals",
    description: "Master lead generation, sales psychology, and marketing systems that convert.",
    link: "/sales-marketing-school"
  },
  {
    icon: GraduationCap,
    title: "ALP University",
    tagline: "Complete Training Library",
    description: "Access the full video library plus all recorded sessions from every program.",
    link: "/alp-university"
  }
];

const bundles = [
  {
    title: "6-Session Intensive",
    price: "$5,000",
    period: "",
    description: "Six 1-on-1 hours with Marshall + direct access between sessions",
    highlight: true
  },
  {
    title: "Growth Academy",
    price: "$2,000",
    period: "for 1 month",
    description: "All 4 programs + community access"
  },
  {
    title: "Full Access",
    price: "$10,000",
    period: "for 6 months",
    description: "Everything + 1-on-1 coaching sessions"
  }
];

const Services = () => {
  const containerRef = useGsapStagger();
  
  return (
    <section 
      id="services" 
      className="py-20 md:py-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Programs</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to unprecedented success
          </p>
        </header>

        {/* Program Cards */}
        <div ref={containerRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Link key={index} to={program.link}>
                <Card className="h-full glass-card hover-lift hover-glow group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                      <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-smooth" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{program.title}</h3>
                      <p className="text-primary text-sm font-medium mb-2">{program.tagline}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium pt-2">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bundle Options */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Bundle & Save</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">Get Access to Everything</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {bundles.map((bundle, index) => (
              <Card 
                key={index} 
                className={`glass-card hover-lift ${bundle.highlight ? 'border-primary/40 relative' : ''}`}
              >
                {bundle.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className="p-6 text-center space-y-4">
                  <h4 className="text-xl font-bold">{bundle.title}</h4>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{bundle.price}</span>
                    <span className="text-muted-foreground">{bundle.period}</span>
                  </div>
                  <p className="text-muted-foreground">{bundle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/programs">
                View All Programs & Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 1-on-1 Coaching CTA */}
        <div className="mt-20 text-center">
          <Card className="glass-card border-primary/30 max-w-3xl mx-auto overflow-hidden">
            <CardContent className="p-8 md:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">1-on-1 with Marshall</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                6-Session Intensive — <span className="text-gradient-gold">$5,000</span>
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Six dedicated hours with Marshall, plus direct text & Discord access between sessions. Walk away with a strategic roadmap built for your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button variant="premium" size="lg" className="gap-2" asChild>
                  <a href="https://buy.stripe.com/14A5kEf4l0ay7bOaLweQM0Q" target="_blank" rel="noopener noreferrer">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link to="/coaching">
                    View All Options
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
