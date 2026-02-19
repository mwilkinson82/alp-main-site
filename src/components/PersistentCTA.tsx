import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersistentCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-gradient-gold shadow-elegant border-t border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-primary-foreground font-semibold text-sm md:text-base">
                Start Here — Ask Marshall ($250)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="default"
                className="bg-background text-foreground hover:bg-background/90"
                onClick={() => navigate("/ask-marshall")}
              >
                Submit a Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-primary-foreground hover:text-primary-foreground/80 p-1"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersistentCTA;
