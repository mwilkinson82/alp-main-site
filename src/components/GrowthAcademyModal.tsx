import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

interface GrowthAcademyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const packages = [
  {
    name: "1 Month",
    price: "$2,000",
    features: [
      "20+ live sessions",
      "Full month of access",
      "All recordings included"
    ],
    buttonText: "Select 1 Month",
    variant: "outline" as const,
    checkoutUrl: "https://buy.stripe.com/00wbJ23lDbTgfIk8DoeQM0z"
  },
  {
    name: "6 Months",
    price: "$8,000",
    badge: "HOLIDAY SPECIAL",
    savings: "Save $4,000",
    features: [
      "6 months of full access",
      "Best for committed growth"
    ],
    buttonText: "Select 6 Months",
    variant: "default" as const,
    highlight: true,
    checkoutUrl: "https://buy.stripe.com/eVq28sbS9cXkgMo6vgeQM0A"
  },
  {
    name: "Annual",
    price: "$14,000",
    badge: "BEST VALUE",
    savings: "Save $10,000",
    features: [
      "Full year of access",
      "Maximum savings"
    ],
    buttonText: "Select Annual",
    variant: "default" as const,
    highlight: true,
    checkoutUrl: "https://buy.stripe.com/6oUbJ2aO53mK53G9HseQM0C"
  }
];

const GrowthAcademyModal = ({ open, onOpenChange }: GrowthAcademyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-background border-border p-0 gap-0">
        
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Choose Your Growth Academy Package
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Choose your commitment level and start accelerating today.
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`relative rounded-xl p-6 border transition-all ${
                  pkg.highlight 
                    ? 'border-primary bg-card' 
                    : 'border-border bg-card/50'
                }`}
              >
                {pkg.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
                    pkg.badge === "BEST VALUE" 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {pkg.badge}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="text-3xl md:text-4xl font-bold mt-1">{pkg.price}</p>
                    {pkg.savings && (
                      <div className="flex items-center gap-1 mt-2 text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">{pkg.savings}</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={pkg.variant}
                    className={`w-full ${pkg.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                    asChild
                  >
                    <a href={pkg.checkoutUrl} target="_blank" rel="noopener noreferrer">
                      {pkg.buttonText}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthAcademyModal;
