import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoTestimonialProps {
  src: string;
  title: string;
  captureAt?: number;
  posterSrc?: string;
}

export const VideoTestimonial = ({ 
  src, 
  title, 
  captureAt = 1.5,
  posterSrc 
}: VideoTestimonialProps) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(posterSrc || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If posterSrc is provided, use it directly
    if (posterSrc) {
      setPosterUrl(posterSrc);
      return;
    }

    // Auto-generate poster from video frame
    const generatePoster = async () => {
      const video = document.createElement('video');
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = src;
      video.muted = true;
      video.playsInline = true;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      return new Promise<string>((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = captureAt;
        });

        video.addEventListener('seeked', () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          }
        });

        video.addEventListener('error', () => {
          // Fallback: if video fails to load, resolve with empty string
          resolve('');
        });
      });
    };

    generatePoster().then(url => {
      if (url) {
        setPosterUrl(url);
      }
    });
  }, [src, captureAt, posterSrc]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative group bg-background">
      <AspectRatio ratio={16 / 9}>
        <video 
          ref={videoRef}
          controls 
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {!isPlaying && posterUrl && (
          <>
            <img
              src={posterUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handlePlay}
            >
              <div className="bg-primary/90 rounded-full p-6 shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-12 h-12 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          </>
        )}
      </AspectRatio>
    </div>
  );
};
