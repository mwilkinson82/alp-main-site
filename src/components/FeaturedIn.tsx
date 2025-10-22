import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const FeaturedIn = () => {
  const sectionRef = useGsapScroll();
  
  const features = [
    "Yahoo Finance",
    "Business Insider", 
    "Forbes",
    "The Daily Pod",
    "Construction Week"
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-12 border-y border-primary/10 bg-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            As Featured In
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-foreground/60 hover:text-primary transition-smooth text-lg md:text-xl font-semibold"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
