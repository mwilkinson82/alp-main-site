import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Coffee, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Handshake,
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
    icon: Coffee,
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
    icon: Building2,
    title: "ALP University",
    description: "Access the complete training library plus recorded sessions from Power Hour, Contractor School, and Sales & Marketing School for $197/month.",
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
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">
            Choose Your <span className="text-gradient-gold">Path to Success</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you need personal guidance or comprehensive training, ALP has the solution for your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-smooth hover:shadow-elegant ${
                  service.highlight ? 'border-primary border-2 shadow-gold' : ''
                }`}
              >
                {service.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground px-4 py-1 text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="space-y-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    service.highlight ? 'bg-gradient-gold' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-7 h-7 ${service.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
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
                    className="w-full" 
                    variant={service.highlight ? "premium" : "default"}
                    size="lg"
                    asChild
                  >
                    {service.isInternal ? (
                      <Link to={service.ctaLink}>
                        {service.cta}
                      </Link>
                    ) : (
                      <a href={service.ctaLink} target="_blank" rel="noopener noreferrer">
                        {service.cta}
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
