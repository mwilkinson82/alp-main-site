import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import groupPhoto from "@/assets/testimonials-group.jpg";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { VideoTestimonial } from "./VideoTestimonial";

const Testimonials = () => {
  const sectionRef = useGsapScroll();

  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className="py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real operators. Real results. Real execution shifts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-6xl mx-auto">
          {/* Video Testimonial - Beau Monde Builders */}
          <Card className="overflow-hidden md:col-span-2">
            <VideoTestimonial 
              src="/videos/beau-monde-testimonial.mp4"
              title="AJ Hoover — Beau Monde Builders"
              captureAt={1.8}
            />
          </Card>
        </div>

        {/* Additional Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Video Testimonial - Ahron Gluck */}
          <Card className="overflow-hidden md:col-span-2">
            <VideoTestimonial 
              src="/videos/ahron-gluck-testimonial.mp4"
              title="Ahron Gluck — AG Builders"
              captureAt={1.5}
            />
          </Card>

          {/* Community Group Photo */}
          <Card className="overflow-hidden md:col-span-2">
            <AspectRatio ratio={16 / 9}>
              <img
                src={groupPhoto}
                alt="ALP community group photo at live event - client testimonials"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </AspectRatio>
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
