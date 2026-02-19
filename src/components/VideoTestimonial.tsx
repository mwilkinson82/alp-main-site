import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState(!posterSrc);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-generate poster from video frame if no posterSrc provided
  const handleVideoLoaded = () => {
    if (posterSrc || posterUrl) {
      setIsLoading(false);
      return;
    }

    const video = document.createElement('video');
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.src = src;
    video.muted = true;
    video.playsInline = true;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = captureAt;
    });

    video.addEventListener('seeked', () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (dataUrl && dataUrl !== 'data:,') {
          setPosterUrl(dataUrl);
        }
      }
      setIsLoading(false);
    });

    video.addEventListener('error', () => {
      // Gracefully fall back — show play button on dark background
      setIsLoading(false);
    });
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative group bg-muted rounded-lg overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <video 
          ref={videoRef}
          controls 
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          poster={posterUrl || undefined}
          onLoadedMetadata={handleVideoLoaded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading skeleton */}
        {isLoading && !isPlaying && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <Skeleton className="absolute inset-0 rounded-none" />
            <div className="relative z-10 bg-primary/80 rounded-full p-6 shadow-lg">
              <Play className="w-12 h-12 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Poster overlay with play button */}
        {!isLoading && !isPlaying && (
          <>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              // Dark fallback when no poster could be generated
              <div className="absolute inset-0 bg-muted" />
            )}
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
