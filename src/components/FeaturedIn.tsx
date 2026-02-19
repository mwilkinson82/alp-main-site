import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const FeaturedIn = () => {
  const sectionRef = useGsapScroll();

  const features = [
    "Yahoo Finance",
    "Business Insider",
    "Forbes",
    "The Daily Pod",
    "YouTube",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-14 border-y border-primary/10 bg-muted/20"
    >
      <div className="container mx-auto px-4">
        {/* Header with flanking gold lines */}
        <div className="flex items-center gap-4 mb-8 max-w-xs mx-auto">
          <div className="flex-1 border-t border-primary/40" />
          <p className="text-xs font-bold text-primary uppercase tracking-widest whitespace-nowrap">
            As Featured In
          </p>
          <div className="flex-1 border-t border-primary/40" />
        </div>

        {/* Chip-style publication names */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-primary/20 rounded-full px-5 py-2 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-default"
            >
              <span className="text-foreground/80 text-sm md:text-base font-semibold">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
