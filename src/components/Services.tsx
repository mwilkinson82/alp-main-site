import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapStagger } from "@/hooks/use-gsap-scroll";

const services = [
  {
    icon: Users,
    title: "1-on-1 Elite Coaching",
    description: "Personalized consulting sessions designed for entrepreneurs, CEOs, and business operators ready to scale.",
    features: [
      "Direct access to proven strategies",
      "Custom business roadmaps",
      "Accountability partnerships",
      "Real-world construction insights"
    ],
    cta: "Book Consultation",
    ctaLink: "/coaching",
    isInternal: true
  },
  {
    icon: Clock,
    title: "Power Hour Membership",
    description: "Join our exclusive daily 8am EST morning call and unlock the complete ALP training ecosystem.",
    features: [
      "Daily live coaching calls",
      "Complete video library access",
      "Comprehensive ebooks & audio",
      "Private community support"
    ],
    cta: "Join Power Hour",
    ctaLink: "/power-hour",
    isInternal: true,
    highlight: true
  },
  {
    icon: GraduationCap,
    title: "ALP University",
    description: "Access the complete training library plus recorded sessions from Power Hour, Contractor School, and Sales & Marketing School.",
    features: [
      "Complete video library access",
      "Daily Power Hour recordings",
      "Weekly Contractor School recordings",
      "Weekly Sales & Marketing recordings"
    ],
    cta: "Join ALP University",
    ctaLink: "/alp-university",
    isInternal: true
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
        <header className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Services</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to unprecedented success
          </p>
        </header>

        <div ref={containerRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className={`glass-card hover-lift hover-glow group ${
                  service.highlight ? 'border-primary/40' : ''
                }`}
              >
                {service.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth ${
                    service.highlight ? 'bg-gradient-gold' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-6 h-6 group-hover:scale-110 transition-smooth ${
                      service.highlight ? 'text-primary-foreground' : 'text-primary'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full group/btn" 
                    variant={service.highlight ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    {service.isInternal ? (
                      <Link to={service.ctaLink} className="gap-2">
                        {service.cta}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-smooth" />
                      </Link>
                    ) : (
                      <a href={service.ctaLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        {service.cta}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-smooth" />
                      </a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
