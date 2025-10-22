import { Quote } from "lucide-react";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

interface InlineTestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const InlineTestimonial = ({ quote, author, role }: InlineTestimonialProps) => {
  const sectionRef = useGsapScroll();
  
  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card p-8 md:p-12">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />
            <blockquote className="text-xl md:text-2xl text-foreground italic leading-relaxed text-center relative z-10">
              "{quote}"
            </blockquote>
            <div className="mt-6 text-center">
              <p className="font-semibold text-foreground">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InlineTestimonial;
