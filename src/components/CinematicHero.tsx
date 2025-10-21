import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import marshallCasual from "@/assets/marshall-casual.jpg";
import alpLogo from "@/assets/alp-logo.png";
import { gsap } from "gsap";

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
    
    if (!hasVisited) {
      // First-time visitor: Full cinematic sequence
      const timeline = gsap.timeline();
      
      // Black screen → Logo appears
      timeline.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
      });

      // Logo holds for 1.5s
      timeline.to({}, { duration: 1.5 });

      // Logo fades out
      timeline.to(logoRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          setShowLogo(false);
          setShowContent(true);
          localStorage.setItem('alp-visited', 'true');
        },
      });
    } else {
      // Returning visitor: Skip to content
      setShowLogo(false);
      setShowContent(true);
    }

    // Detect AI browsers and disable video
    const ua = (navigator?.userAgent || '').toLowerCase();
    const isAiBrowser = /chatgpt|atlas|openai|bot|crawler/i.test(ua);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    if (isAiBrowser || prefersReducedMotion) {
      setVideoError(true);
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background (Muted Loop) */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={marshallCasual}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/welcome-background.webm?v=2" type="video/webm" />
            <source src="/videos/welcome-background.mp4?v=2" type="video/mp4" />
          </video>
        ) : (
          <img 
            src={marshallCasual} 
            alt="Marshall Wilkinson" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
      </div>

      {/* Black Screen with Logo Intro */}
      {showLogo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div
            ref={logoRef}
            className="opacity-0"
            style={{ filter: "blur(8px)", transform: "scale(0.95)" }}
          >
            <img 
              src={alpLogo} 
              alt="ALP - Altitude Logic Pressure" 
              className="w-64 md:w-96"
            />
          </div>
        </div>
      )}

      {/* Tap to Unmute Button */}
      {showContent && !videoError && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-8 right-8 z-30 p-4 glass rounded-full hover:bg-background/60 hover-glow transition-smooth group"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              <span className="absolute bottom-full right-0 mb-2 px-3 py-1 text-xs bg-background/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Tap to Unmute
              </span>
            </>
          ) : (
            <Volume2 className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
          )}
        </button>
      )}

      {/* Scroll Indicator */}
      {showContent && scrollY < 300 && (
        <div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-primary/60 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary rounded-full mt-2"></div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-screen"></div>
    </section>
  );
};

export default CinematicHero;
