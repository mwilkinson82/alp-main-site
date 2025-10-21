import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import marshallSuit from "@/assets/marshall-suit.png";
import alpLogo from "@/assets/alp-logo.png";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo fades out from 0-300px scroll
  const logoOpacity = Math.max(0, 1 - (scrollY / 300));
  
  // Black overlay fades out from 0-400px scroll
  const blackOverlayOpacity = Math.max(0, 1 - (scrollY / 400));
  
  // Video darkening overlay reduces from 100-600px scroll
  const videoDarkOverlay = Math.max(0.3, 0.8 - (scrollY / 600) * 0.5);
  
  // Hero content fades in from 400-600px scroll
  const contentOpacity = Math.min(1, Math.max(0, (scrollY - 400) / 200));
  const contentTranslateY = Math.max(0, 20 - (scrollY - 400) / 10);

  return (
    <section className="relative min-h-[200vh] overflow-hidden">
      {/* Video Background - Always Playing */}
      <div className="fixed inset-0 z-0">
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
        {/* Video darkening overlay */}
        <div 
          className="absolute inset-0 bg-gradient-dark transition-opacity duration-300"
          style={{ opacity: videoDarkOverlay }}
        ></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
        ></div>
      </div>

      {/* Black Screen with Logo - Fades Out on Scroll */}
      <div 
        className="fixed inset-0 z-10 bg-black flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: blackOverlayOpacity, pointerEvents: blackOverlayOpacity > 0 ? 'auto' : 'none' }}
      >
        <img 
          src={alpLogo} 
          alt="ALP - Altitude Logic Pressure" 
          className="w-64 md:w-96 transition-opacity duration-500"
          style={{ opacity: logoOpacity }}
        />
      </div>

      {/* Scroll Indicator - Visible Initially */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce transition-opacity duration-500"
        style={{ opacity: logoOpacity }}
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>

      {/* Hero Content - Fades In After Video Reveals */}
      <div 
        className="relative z-10 min-h-screen flex items-center justify-center"
        style={{ 
          opacity: contentOpacity,
          transform: `translateY(${contentTranslateY}px)`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
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
      </div>

      {/* Spacer for scroll height */}
      <div className="h-screen"></div>
    </section>
  );
};

export default Hero;
