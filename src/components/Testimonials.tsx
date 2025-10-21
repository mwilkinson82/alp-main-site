import { Card } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client Testimonials
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from those who've transformed their businesses and lives
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Video Testimonial 1 */}
          <Card className="overflow-hidden">
            <video 
              controls 
              className="w-full aspect-video"
              poster="/placeholder.svg"
            >
              <source src="/videos/testimonials.mov" type="video/quicktime" />
              <source src="/videos/testimonials.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>

          {/* Video Testimonial 2 - Beau Monde Builders */}
          <Card className="overflow-hidden">
            <video 
              controls 
              className="w-full aspect-video"
              poster="/placeholder.svg"
            >
              <source src="/videos/beau-monde-testimonial.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>

        {/* YouTube Playlist Embed */}
        <div className="max-w-4xl mx-auto">
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
