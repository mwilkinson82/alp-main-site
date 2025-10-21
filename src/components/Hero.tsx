import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import marshallSuit from "@/assets/marshall-suit.png";
import alpLogo from "@/assets/alp-logo.png";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background - Always Playing */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
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

      {/* Audio Control Button - Visible After Logo Fades */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-8 right-8 z-20 p-4 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-full hover:bg-background/30 transition-all duration-300"
        style={{ opacity: Math.min(1, Math.max(0, (scrollY - 200) / 200)) }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-primary" />
        ) : (
          <Volume2 className="w-6 h-6 text-primary" />
        )}
      </button>

      {/* Scroll Indicator - Visible Initially */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce transition-opacity duration-500"
        style={{ opacity: logoOpacity }}
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
