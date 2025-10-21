import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const HeroContent = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Overline */}
          <div className="inline-block">
            <span className="text-primary text-sm font-bold tracking-widest uppercase px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              Altitude Logic Pressure
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight">
            Transform Your Business with
            <span className="text-gradient-gold block mt-2">Proven Expertise</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Over <span className="text-primary font-bold">$2.5 Billion</span> in construction success. 
            Elite coaching for entrepreneurs, CEOs, and sales professionals who demand results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="xl" 
              variant="premium"
              className="group"
              asChild
            >
              <a href="#services">
                Explore Services
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              size="xl" 
              variant="hero"
              asChild
            >
              <a href="https://calendly.com/your-calendly-link" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2" />
                Schedule 1-on-1
              </a>
            </Button>
          </div>

          {/* Client Login Link */}
          <div className="pt-6">
            <a 
              href="https://marshallwilkinson.mykajabi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-semibold underline underline-offset-4"
            >
              Existing Client? Login to ALP Portal →
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1 on 1</div>
              <div className="text-muted-foreground">Elite Coaching and Consulting</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1000s</div>
              <div className="text-muted-foreground">Hours of Training Content</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Daily</div>
              <div className="text-muted-foreground">Power Hour at 8am EST</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
