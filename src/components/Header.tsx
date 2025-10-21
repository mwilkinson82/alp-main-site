import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={alpLogo} 
              alt="ALP - Altitude Logic Pressure" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/power-hour" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Power Hour
            </Link>
            <Link 
              to="/coaching" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              1-on-1 Coaching
            </Link>
            <Link 
              to="/alp-university" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              ALP University
            </Link>
            <Button
              variant="premium" 
              size="sm"
              asChild
            >
              <a 
                href="https://marshallwilkinson.mykajabi.com/login" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Client Portal
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/power-hour" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Power Hour
            </Link>
            <Link 
              to="/coaching" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              1-on-1 Coaching
            </Link>
            <Link 
              to="/alp-university" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              ALP University
            </Link>
            <Button
              variant="premium" 
              size="sm"
              className="w-full"
              asChild
            >
              <a 
                href="https://marshallwilkinson.mykajabi.com/login" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Client Portal
              </a>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
