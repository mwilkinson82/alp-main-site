import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Target, Shield } from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "Proven Track Record",
    description: "Over $2.5 billion in construction projects successfully delivered"
  },
  {
    icon: TrendingUp,
    title: "Results-Driven",
    description: "Strategies tested and refined through real-world application"
  },
  {
    icon: Target,
    title: "Focused Expertise",
    description: "Specialized in scaling businesses and developing leaders"
  },
  {
    icon: Shield,
    title: "Trusted Advisor",
    description: "Decades of experience coaching top-tier executives"
  }
];

const About = () => {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      {/* Background accent */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-20"
        style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase">
                About ALP
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Altitude. Logic. Pressure.
              </h2>
            </div>
            
            <div className="text-lg text-secondary-foreground/80 space-y-4">
              <p>
                At ALP, we believe success requires three essential elements: the <span className="text-primary font-semibold">altitude</span> to see the bigger picture, 
                the <span className="text-primary font-semibold">logic</span> to make sound decisions, and the <span className="text-primary font-semibold">pressure</span> to 
                execute with precision.
              </p>
              <p>
                With over <span className="text-primary font-bold">$2.5 billion in construction</span> delivered throughout my career, I've mastered the art of building—not 
                just structures, but businesses, teams, and leaders who dominate their markets.
              </p>
              <p>
                Whether you're an entrepreneur scaling your operation, a CEO refining your strategy, or a sales professional looking to close bigger deals, 
                ALP provides the proven frameworks and personal guidance to elevate your performance.
              </p>
            </div>

            <Button size="lg" variant="premium" asChild className="mt-4">
              <a href="https://calendly.com/your-calendly-link" target="_blank" rel="noopener noreferrer">
                Work With Me
              </a>
            </Button>
          </div>

          {/* Right Content - Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div 
                  key={index} 
                  className="bg-background/5 backdrop-blur-sm border border-primary/20 rounded-lg p-6 space-y-3 hover:border-primary/40 transition-smooth"
                >
                  <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">{highlight.title}</h3>
                  <p className="text-sm text-secondary-foreground/70">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
