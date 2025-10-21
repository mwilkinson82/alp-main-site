import { Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import marshallSuit from "@/assets/marshall-suit.png";
import marshallCasual from "@/assets/marshall-casual.jpg";
import alpLogo from "@/assets/alp-logo.png";

import { Button } from "@/components/ui/button";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [forceStatic, setForceStatic] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasVisitedBefore = useRef(false);

  // Detect AI browsers and force static mode
  useEffect(() => {
    const ua = (navigator?.userAgent || '').toLowerCase();
    const isAiBrowser = /chatgpt|atlas|openai|bot|crawler/i.test(ua);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    if (isAiBrowser || prefersReducedMotion) {
      console.log('Static mode enabled (AI browser or reduced motion detected)');
      setForceStatic(true);
      setVideoError(true);
      setAutoplayFailed(false);
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }
    }
  }, []);

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
    
    // Skip video logic if forcing static mode
    if (forceStatic) return;
    
    // Attempt to play video after intro
    setTimeout(() => {
      if (videoRef.current && videoLoaded && !videoError) {
        const video = videoRef.current;
        
        // Check if video has enough data loaded
        console.log('Video ready state:', video.readyState);
        if (video.readyState < 2) {
          console.log('Video not ready, showing static image');
          setVideoError(true);
          return;
        }
        
        const initialTime = video.currentTime;
        
        video.muted = true;
        video.play().then(() => {
          console.log('Video play succeeded');
          setAutoplayFailed(false);
          setVideoCanPlay(true);
        }).catch((error) => {
          console.log('Video autoplay failed:', error);
          setAutoplayFailed(true);
        });
        
        // Check if video is actually progressing
        setTimeout(() => {
          if (videoRef.current) {
            const hasProgressed = videoRef.current.currentTime > initialTime;
            const isStuck = videoRef.current.paused || !hasProgressed;
            if (isStuck) {
              console.log('Video appears stuck, showing play button');
              setAutoplayFailed(true);
            }
          }
        }, 500);
      }
      
      // Aggressive timeout: if video hasn't started playing after 3 seconds, force fallback
      videoTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && !videoCanPlay) {
          console.log('Video timeout - forcing static image fallback');
          setVideoError(true);
        }
      }, 3000);
    }, 300);
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

  const handleVideoLoaded = () => {
    console.log('Video metadata loaded');
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.error('Video failed to load, falling back to static image');
    setVideoError(true);
    setVideoEnded(true);
  };

  const handleVideoPlay = () => {
    console.log('Video started playing');
    setAutoplayFailed(false);
    setVideoCanPlay(true);
    // Clear timeout since video is playing
    if (videoTimeoutRef.current) {
      clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = null;
    }
  };

  const tryPlayVideo = async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.muted = true;
      await videoRef.current.play();
      setAutoplayFailed(false);
    } catch (err) {
      console.log('Manual play failed:', err);
      setAutoplayFailed(true);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background or Image After Video Ends */}
      <div className="absolute inset-0 z-0">
        {!forceStatic && !videoEnded && !videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={marshallCasual}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onLoadedData={handleVideoLoaded}
            onPlay={handleVideoPlay}
            onError={handleVideoError}
          >
            <source src="/videos/welcome-background.webm" type="video/webm" />
            <source src="/videos/welcome-background.mp4" type="video/mp4" />
            <img 
              src={marshallCasual} 
              alt="Marshall Wilkinson - ALP Welcome" 
              className="absolute inset-0 w-full h-full object-cover"
            />
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
      {!forceStatic && !videoEnded && !videoError && (
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

      {/* Tap-to-Play overlay when autoplay is blocked */}
      {!forceStatic && !videoEnded && !videoError && !showIntro && autoplayFailed && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <Button
            onClick={tryPlayVideo}
            size="lg"
            variant="secondary"
            className="gap-2 shadow-elegant backdrop-blur-sm bg-background/60"
          >
            Tap to Play
          </Button>
        </div>
      )}

      {/* Watch full intro link - Only in static mode */}
      {forceStatic && !showIntro && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <a
            href="/videos/welcome-background.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-background/70 border border-primary/30 text-primary font-semibold shadow-elegant backdrop-blur-md hover:bg-background/80 transition pointer-events-auto"
          >
            Watch Full Intro
          </a>
        </div>
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
