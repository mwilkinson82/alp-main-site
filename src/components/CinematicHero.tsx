import { Volume2, VolumeX, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import marshallHero from "@/assets/marshall-conference-hero.jpg";
import alpLogo from "@/assets/alp-logo.png";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
const CinematicHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Cinematic sequence on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem('alp-visited') === 'true';

    // Detect AI browsers and disable video
    const ua = (navigator?.userAgent || '').toLowerCase();
    const isAiBrowser = /chatgpt|atlas|openai|bot|crawler/i.test(ua);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (isAiBrowser || prefersReducedMotion || hasVisited) {
      setVideoError(true);
    }
    if (!hasVisited) {
      // First-time visitor: Full cinematic sequence
      if (logoRef.current) {
        const timeline = gsap.timeline();

        // Black screen → Logo appears
        timeline.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out"
        });

        // Logo holds for 1s
        timeline.to({}, {
          duration: 1
        });

        // Logo fades out
        timeline.to(logoRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            setShowLogo(false);
            setShowContent(true);
            localStorage.setItem('alp-visited', 'true');
          }
        });
      }

      // Safety fallback: ensure intro completes even if animations fail
      const fallbackTimer = setTimeout(() => {
        setShowLogo(false);
        setShowContent(true);
        localStorage.setItem('alp-visited', 'true');
      }, 3000);
      return () => clearTimeout(fallbackTimer);
    } else {
      // Returning visitor: Skip to content immediately
      setShowLogo(false);
      setShowContent(true);
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  return <section className="relative overflow-hidden">
      {/* Video/Image Hero - Full height, no overlay */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {!videoError ? <video ref={videoRef} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" onError={e => {
        console.log('Video failed to load:', e);
        setVideoError(true);
      }}>
            <source src="/videos/welcome-background.mp4" type="video/mp4" />
          </video> : <img src={marshallHero} alt="Marshall Wilkinson" className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* Subtle gradient only at bottom for blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>

        {/* Scroll Cue - bouncing chevron at bottom of video */}
        {showContent && (
          <div
            className="absolute bottom-8 inset-x-0 mx-auto w-fit z-10 animate-bounce transition-opacity duration-500"
            style={{ opacity: scrollY < 100 ? 1 : 0 }}
          >
            <ChevronDown className="w-8 h-8 text-primary drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Black Screen with Logo Intro */}
      {showLogo && <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div ref={logoRef} className="opacity-0" style={{
        filter: "blur(8px)",
        transform: "scale(0.95)"
      }}>
            <img src={alpLogo} alt="ALP - Altitude Logic Pressure" className="w-64 md:w-96" />
          </div>
        </div>}

      {/* Tap to Unmute Button */}
      {showContent && !videoError && <button onClick={toggleAudio} className="fixed top-24 right-8 z-30 p-4 glass rounded-full hover:bg-background/60 hover-glow transition-smooth group" aria-label={isMuted ? "Unmute video" : "Mute video"}>
          {isMuted ? <>
              <VolumeX className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              <span className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Tap to Unmute
              </span>
            </> : <Volume2 className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />}
        </button>}

      {/* Hero Content - Below video, not overlaying */}
      {showContent && <div className="relative bg-background py-16 md:py-20 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8 text-center">
              {/* Overline */}
              <div className="inline-block">
                <span className="text-primary text-xs md:text-sm font-bold tracking-widest uppercase px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  ALTITUDE • LOGIC • PRESSURE
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                Execution Systems for
                <span className="text-gradient-gold block mt-2">Operators Who Want Scale</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Decision architecture, negotiation leverage, and execution systems built from over $5B in real-world enterprise outcomes.
              </p>

              {/* Micro line */}
              <p className="text-sm text-muted-foreground/60 italic">
                Frameworks that create revenue, control, and operational dominance.
              </p>

              {/* Brand line */}
              <p className="text-base md:text-lg font-semibold italic" style={{ color: "hsl(var(--primary))", opacity: 0.85 }}>
                ALP installs execution systems that scale businesses without chaos.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="w-full sm:w-auto group bg-gradient-gold hover:shadow-glow hover-gold-edge" asChild>
                  <a href="/ask-marshall">
                    Start Here — Get Marshall's Analysis
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button size="default" variant="outline" className="text-sm border-primary/20 hover:bg-primary/10" onClick={() => {
                  const el = document.getElementById("origin-story");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}>
                  Watch the Origin Story
                </Button>
              </div>

              {/* Qualifier line */}
              <p className="text-sm text-muted-foreground/70 italic">
                Built for executives, founders, and operators scaling beyond $1M+ in revenue.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto pt-12 sm:pt-8">
                <div className="flex sm:block items-center gap-4 sm:space-y-1.5 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-base sm:text-xl md:text-4xl font-bold text-primary leading-tight whitespace-nowrap sm:whitespace-normal">$5B+ Outcomes</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-snug">Enterprise execution and negotiated results</div>
                </div>
                <div className="flex sm:block items-center gap-4 sm:space-y-1.5 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-base sm:text-xl md:text-4xl font-bold text-primary leading-tight whitespace-nowrap sm:whitespace-normal">Systems First</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-snug">Build infrastructure before scaling volume</div>
                </div>
                <div className="flex sm:block items-center gap-4 sm:space-y-1.5 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-base sm:text-xl md:text-4xl font-bold text-primary leading-tight whitespace-nowrap sm:whitespace-normal">Live Training Programs</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-snug">Daily and weekly strategic execution sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>}

    </section>;
};
export default CinematicHero;