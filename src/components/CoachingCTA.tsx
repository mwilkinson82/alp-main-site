import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Calendar, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const STRIPE_6SESSION = "https://buy.stripe.com/14A5kEf4l0ay7bOaLweQM0Q";

const features = [
  { icon: Calendar, text: "Six 1-hour sessions tailored to you" },
  { icon: MessageCircle, text: "Direct text & Discord access between sessions" },
  { icon: Map, text: "Custom strategic scaling roadmap" },
];

const CoachingCTA = () => {
  const sectionRef = useGsapScroll();

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Your Business Decisions Are Too Important{" "}
            <span className="text-gradient-gold">to Wing It</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most business owners wait until a crisis to seek guidance. The 6-Session Intensive gives you a strategic advisor in your corner—before the stakes get too high.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 py-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{f.text}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="premium" size="lg" className="gap-2" asChild>
              <a href={STRIPE_6SESSION} target="_blank" rel="noopener noreferrer">
                Get the 6-Session Intensive — $5,000
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
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
