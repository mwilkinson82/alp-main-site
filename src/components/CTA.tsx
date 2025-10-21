import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const CTA = () => {
  const sectionRef = useGsapScroll();
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-dark relative overflow-hidden"
    >
      {/* Background accent */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-secondary-foreground">
            Built for <span className="text-gradient-gold">Decision Makers</span>
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            Join the Power Hour community or schedule a 1-on-1 consultation. 
            Take decisive action today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild className="group bg-gradient-gold hover:shadow-glow transition-spring">
              <Link to="/power-hour">
                Join Power Hour
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="hover-gold-edge" asChild>
              <Link to="/coaching">
                <Calendar className="mr-2" />
                Book 1-on-1 Session
              </Link>
            </Button>
          </div>

          {/* Client Login Link */}
          <div className="pt-8">
            <a 
              href="https://marshallwilkinson.mykajabi.com/login" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-semibold underline underline-offset-4"
            >
              Existing Client? Access ALP Portal →
            </a>
          </div>

          {/* Power Hour Info */}
          <div className="pt-12 border-t border-primary/20">
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg px-6 py-4">
              <p className="text-sm text-secondary-foreground/70 mb-1">Daily Power Hour Call</p>
              <p className="text-2xl font-bold text-primary">Every Morning • 8:00 AM EST</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
