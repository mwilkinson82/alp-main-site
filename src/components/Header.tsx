import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src={alpLogo} 
              alt="ALP - Altitude Logic Pressure" 
              className="h-10 w-auto"
            />
          </a>

          {/* Client Portal Button */}
          <Button 
            variant="premium" 
            size="sm"
            asChild
          >
            <a 
              href="https://marshallwilkinson.mykajabi.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Client Portal
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
