import { Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import marshallSuit from "@/assets/marshall-suit.png";
import marshallCasual from "@/assets/marshall-casual.jpg";
import alpLogo from "@/assets/alp-logo.png";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const hasVisitedBefore = useRef(false);

  // Check if user has visited before and if video has been played
  useEffect(() => {
    hasVisitedBefore.current = localStorage.getItem('alp-visited') === 'true';
    const hasPlayedVideo = localStorage.getItem('alp-video-played') === 'true';
    if (hasPlayedVideo) {
      setVideoEnded(true);
    }
  }, []);

  // Show skip button after 1 second (only for returning visitors)
  useEffect(() => {
    if (showIntro && hasVisitedBefore.current) {
      const skipTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 1000);
      return () => clearTimeout(skipTimer);
    }
  }, [showIntro]);

  // Timer-based intro: show logo for 2 seconds, then fade out
  useEffect(() => {
    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('alp-visited', 'true');
    
    // Auto-unmute and show toast after a brief delay
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        toast({
          title: "🔊 Audio Enabled",
          description: "Welcome! Click the audio button to mute if needed.",
          duration: 3000,
        });
      }
    }, 800);
  };

  const skipIntro = () => {
    setShowIntro(false);
    setShowSkipButton(false);
    handleIntroComplete();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo and black overlay opacity based on timer
  const introOpacity = showIntro ? 1 : 0;

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    localStorage.setItem('alp-video-played', 'true');
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background or Image After Video Ends */}
      <div className="absolute inset-0 z-0">
        {!videoEnded ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
          >
            <source src="/videos/welcome-background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={marshallCasual} 
              alt="Marshall Wilkinson" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        {/* Overlays - fade out with intro */}
        <div 
          className="absolute inset-0 bg-gradient-dark transition-opacity duration-1000"
          style={{ opacity: showIntro ? 0.8 : 0 }}
        ></div>
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ 
            backgroundImage: 'var(--gradient-gold-radial)',
            opacity: showIntro ? 0.3 : 0 
          }}
        ></div>
      </div>

      {/* Black Screen with Logo - Fades Out After 2 Seconds */}
      <div 
        className="fixed inset-0 z-10 bg-black flex items-center justify-center transition-opacity duration-1000"
        style={{ opacity: introOpacity, pointerEvents: introOpacity > 0 ? 'auto' : 'none' }}
      >
        <img 
          src={alpLogo} 
          alt="ALP - Altitude Logic Pressure" 
          className="w-64 md:w-96 animate-fade-in"
        />
        
        {/* Skip Intro Button - Only for returning visitors */}
        {showSkipButton && (
          <Button
            onClick={skipIntro}
            variant="outline"
            size="sm"
            className="absolute bottom-8 right-8 gap-2 animate-fade-in"
          >
            Skip Intro
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Audio Control Button - Only show when video is playing */}
      {!videoEnded && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-8 right-8 z-20 p-4 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-full hover:bg-background/30 transition-all duration-300"
          style={{ opacity: showIntro ? 0 : 1 }}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-primary" />
          ) : (
            <Volume2 className="w-6 h-6 text-primary" />
          )}
        </button>
      )}

      {/* Scroll Indicator - Visible After Intro */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce transition-opacity duration-500"
        style={{ opacity: showIntro ? 0 : (scrollY < 300 ? 1 : 0) }}
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>

      {/* Just a spacer for the video section */}
      <div className="h-screen"></div>
    </section>
  );
};

export default Hero;
