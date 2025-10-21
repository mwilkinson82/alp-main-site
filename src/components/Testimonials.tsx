import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({
    beauMonde: false,
    ahronGluck: false
  });

  const handlePlay = (videoKey: string) => {
    setIsPlaying(prev => ({ ...prev, [videoKey]: true }));
  };

  const handlePauseOrEnd = (videoKey: string) => {
    setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from those who've transformed their businesses and lives
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-6xl mx-auto">
          {/* Video Testimonial - Beau Monde Builders */}
          <Card className="overflow-hidden md:col-span-2">
            <div className="relative group">
              <video 
                controls 
                className="w-full aspect-video"
                preload="metadata"
                onPlay={() => handlePlay('beauMonde')}
                onPause={() => handlePauseOrEnd('beauMonde')}
                onEnded={() => handlePauseOrEnd('beauMonde')}
              >
                <source src="/videos/beau-monde-testimonial.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!isPlaying.beauMonde && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary/90 rounded-full p-6 shadow-lg">
                    <Play className="w-12 h-12 text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Additional Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Video Testimonial - Ahron Gluck */}
          <Card className="overflow-hidden md:col-span-2">
            <div className="relative group">
              <video 
                controls 
                className="w-full aspect-video"
                preload="metadata"
                onPlay={() => handlePlay('ahronGluck')}
                onPause={() => handlePauseOrEnd('ahronGluck')}
                onEnded={() => handlePauseOrEnd('ahronGluck')}
              >
                <source src="/videos/ahron-gluck-testimonial.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!isPlaying.ahronGluck && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary/90 rounded-full p-6 shadow-lg">
                    <Play className="w-12 h-12 text-primary-foreground" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* LinkedIn Embed */}
          <Card className="overflow-hidden">
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7271908156803301376?compact=1" 
                title="LinkedIn embedded post - Beau Monde Builders testimonial" 
                frameBorder="0" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/j2ztf9b9YbA?si=HaHccBYpGT0E7TKv" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/videoseries?si=Q-WWQSwQOpiM6IS4&amp;list=PLV-2OwQiZMZs8mpkGkHBQ0Qy3xEosMyM3" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
