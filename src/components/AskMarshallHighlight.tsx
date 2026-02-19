import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import askMarshallLoomPreview from "@/assets/ask-marshall-loom-preview.png";

const bullets = [
  "Direct systems-level breakdown",
  "24-hour turnaround guaranteed",
  "No live call required",
];

const AskMarshallHighlight = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
        style={{ background: "var(--gradient-gold-radial)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-premium hover-lift order-2 lg:order-1">
            <img
              src={askMarshallLoomPreview}
              alt="Ask Marshall — Strategic Question Loom preview"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Right — Copy */}
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-xs font-bold tracking-widest bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full">
                MOST POPULAR ENTRY POINT — $250
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Submit a{" "}
              <span className="text-gradient-gold">Strategic Question</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Not ready for a live engagement? Get Marshall's direct systems-level analysis on your most pressing business decision — delivered within 24 hours.
            </p>

            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" variant="premium" className="gap-2 group" asChild>
              <Link to="/ask-marshall">
                Submit a Strategic Question
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskMarshallHighlight;
