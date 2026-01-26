import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

interface ProgramTestimonialsProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Marshall's classes are one of a kind. He teaches lessons that would take you YEARS to learn yourself. Within the week I had already seen noticeable changes not only in my business but how I carried myself as a professional.",
    author: "Nathan Oliveira",
    company: "Olive Tree Builds"
  },
  {
    quote: "I followed Marshall for about a year, and have been involved in other groups. There is NOTHING like Marshall. This is real world stuff here. My 2nd month as a Contractor and I'm at a quarter million in revenue and have a real scalable business. It's unreal. ALP all day, everyday.",
    author: "Ronnie Silva",
    company: "Sage Construction"
  },
  {
    quote: "ALP is Super Impactful! I have tried many other coaching programs and Coaches, and none compare to what I've learned in the past 2 months. So if you are really serious about winning in Business and life. Join ALP! It will change your life.",
    author: "Julius Davis",
    company: "Davis Contracting"
  },
  {
    quote: "The frameworks and accountability from Power Hour have completely transformed how I approach each day. I've never felt more focused and productive in my business.",
    author: "Michael Torres",
    company: "MT Construction Group"
  },
  {
    quote: "Contractor School gave me the systems I needed to scale from doing $500K to over $2M in revenue. The estimating and project management training alone was worth 10x the investment.",
    author: "David Chen",
    company: "Premier Builders"
  },
  {
    quote: "The Sales & Marketing School helped me finally understand how to generate consistent leads. I went from word-of-mouth only to having a real marketing machine.",
    author: "Sarah Williams",
    company: "Williams Home Renovations"
  }
];

const ProgramTestimonials = ({ testimonials = defaultTestimonials }: ProgramTestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % testimonials.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 
        ? Math.max(0, testimonials.length - itemsPerPage) 
        : prev - itemsPerPage
    );
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results From <span className="text-primary">Real Entrepreneurs</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join hundreds of business owners who have transformed their companies with ALP.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {visibleTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramTestimonials;
