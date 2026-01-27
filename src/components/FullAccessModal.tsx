import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

interface FullAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const packages = [
  {
    name: "6 Months",
    price: "$10,000",
    badge: "HOLIDAY SPECIAL",
    savings: "Save $5,000",
    features: [
      "10 private 1:1 sessions",
      "Full Growth Academy access",
      "Direct text access to Marshall"
    ],
    buttonText: "Select 6 Months",
    checkoutUrl: "https://buy.stripe.com/4gMaEY09r4qO67K8DoeQM0D"
  },
  {
    name: "Annual",
    price: "$15,000",
    badge: "BEST VALUE",
    savings: "Save $15,000",
    features: [
      "10 private 1:1 sessions",
      "Full Growth Academy access",
      "Direct text access to Marshall",
      "Maximum savings"
    ],
    buttonText: "Select Annual",
    checkoutUrl: "https://buy.stripe.com/3cI8wQ7BT1eCbs4bPAeQM0E"
  }
];

const FullAccessModal = ({ open, onOpenChange }: FullAccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-background border-border p-0 gap-0">
        
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Get ALP Full Access
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Elite mentorship with direct access to Marshall.
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-4">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className="relative rounded-xl p-6 border-2 border-primary bg-card"
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {pkg.badge}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="text-3xl md:text-4xl font-bold mt-1">{pkg.price}</p>
                    <div className="flex items-center gap-1 mt-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">{pkg.savings}</span>
                    </div>
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
                    className="w-full bg-primary hover:bg-primary/90"
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

export default FullAccessModal;
