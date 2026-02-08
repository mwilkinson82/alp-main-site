import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const STRIPE_SINGLE = "https://buy.stripe.com/bJeaEYe0h9L8ao0g5QeQM0R";

const CoachingCTA = () => {
  const sectionRef = useGsapScroll();

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Still Deciding?{" "}
            <span className="text-gradient-gold">Start With One Session</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Not ready for the full Intensive? Book a single hour with Marshall — bring your biggest challenge and leave with a clear plan of attack.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="premium" size="lg" className="gap-2 min-h-[48px] w-full sm:w-auto" asChild>
              <a href={STRIPE_SINGLE} target="_blank" rel="noopener noreferrer">
                Book a Single Session — $1,000
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground min-h-[48px] w-full sm:w-auto" asChild>
              <Link to="/coaching">
                Explore All Coaching Options
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachingCTA;
