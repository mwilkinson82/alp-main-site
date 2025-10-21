import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import marshallSuit from "@/assets/marshall-suit.png";

const Hero = () => {
  const [videoOpacity, setVideoOpacity] = useState(0.9);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500;
      const newOpacity = Math.max(0.4, 0.9 - (scrollPosition / maxScroll) * 0.5);
      setVideoOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Scroll-Reveal Effect */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={marshallSuit}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/welcome-background.mp4" type="video/mp4" />
        </video>
        <div 
          className="absolute inset-0 bg-gradient-dark transition-opacity duration-300"
          style={{ opacity: videoOpacity }}
        ></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000">
          {/* Overline */}
          <div className="inline-block">
            <span className="text-primary text-sm font-bold tracking-widest uppercase px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              Altitude Logic Pressure
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-secondary-foreground leading-tight">
            Transform Your Business with
            <span className="text-gradient-gold block mt-2">Proven Expertise</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-secondary-foreground/80 max-w-3xl mx-auto leading-relaxed">
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

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">$2.5B+</div>
              <div className="text-secondary-foreground/70">Construction Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1000s</div>
              <div className="text-secondary-foreground/70">Hours of Training Content</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Daily</div>
              <div className="text-secondary-foreground/70">Power Hour at 8am EST</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
