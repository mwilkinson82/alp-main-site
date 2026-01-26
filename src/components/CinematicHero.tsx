import { Volume2, VolumeX, ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import marshallCasual from "@/assets/marshall-casual.jpg";
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
          </video> : <img src={marshallCasual} alt="Marshall Wilkinson" className="absolute inset-0 w-full h-full object-cover" />}
        
        {/* Subtle gradient only at bottom for blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
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
                  Altitude Logic Pressure
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                Transform Your Business with
                <span className="text-gradient-gold block mt-2">Proven Expertise</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Over <span className="text-primary font-bold">$5 Billion</span> in construction success. 
                Elite coaching for entrepreneurs, CEOs, and sales professionals who demand results.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="group bg-gradient-gold hover:shadow-glow hover-gold-edge" asChild>
                  <a href="#services">
                    Explore Services
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10" asChild>
                  <Link to="/coaching">
                    <Calendar className="mr-2" />
                    Schedule 1-on-1
                  </Link>
                </Button>
              </div>

              {/* Client Login Link */}
              <div className="pt-4">
                <a href="https://marshallwilkinson.mykajabi.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold underline underline-offset-4">
                  Existing Client? Login to ALP Portal →
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto pt-8">
                <div className="space-y-2 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-3xl md:text-5xl font-bold text-primary">1 on 1</div>
                  <div className="text-sm md:text-base text-muted-foreground">Elite Coaching</div>
                </div>
                <div className="space-y-2 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-3xl md:text-5xl font-bold text-primary">1,000s</div>
                  <div className="text-sm md:text-base text-muted-foreground">Training Hours</div>
                </div>
                <div className="space-y-2 glass-card p-4 md:p-6 hover-lift">
                  <div className="text-3xl md:text-5xl font-bold text-primary">Daily</div>
                  <div className="text-sm md:text-base text-muted-foreground">Power Hour</div>
                </div>
              </div>
            </div>
          </div>
        </div>}

    </section>;
};
export default CinematicHero;