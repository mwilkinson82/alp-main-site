import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X, ChevronDown } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Pages that should always have black text (no dark hero)
  const forceBlackTextPages = ['/contractor-school', '/sales-marketing-school', '/alp-university', '/programs', '/articles', '/ask-marshall'];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProgramsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Header background becomes visible after scrolling past initial viewport
  const headerOpacity = Math.min(1, Math.max(0, (scrollY - 400) / 200));
  const showBorder = scrollY > 600;
  
  // Text color transitions from white (on dark hero) to foreground as you scroll
  // Force black text on pages without dark heroes
  const shouldForceBlack = forceBlackTextPages.includes(location.pathname) || location.pathname.startsWith('/articles/');
  const isAtTop = scrollY < 300 && !shouldForceBlack;
  const textColorClass = isAtTop ? "text-white" : "text-foreground";
  const iconColorClass = isAtTop ? "text-white" : "";

  const programLinks = [
    { name: "All Programs", path: "/programs", highlight: true },
    { name: "Power Hour", path: "/power-hour" },
    { name: "Contractor School", path: "/contractor-school" },
    { name: "Sales & Marketing School", path: "/sales-marketing-school" },
    { name: "ALP University", path: "/alp-university" },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300"
      style={{
        backgroundColor: `rgba(var(--background-rgb), ${headerOpacity * 0.8})`,
        borderColor: showBorder ? 'hsl(var(--border))' : 'transparent'
      }}
    >
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
              className={`${textColorClass} hover:text-primary transition-colors font-medium`}
            >
              Home
            </Link>
            
            <Link 
              to="/articles" 
              className={`${textColorClass} hover:text-primary transition-colors font-medium`}
            >
            Insights
            </Link>
            
            {/* Programs Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProgramsOpen(!programsOpen)}
                className={`flex items-center gap-1 ${textColorClass} hover:text-primary transition-colors font-medium`}
              >
                Ecosystem
                <ChevronDown className={`w-4 h-4 transition-transform ${programsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {programsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  {programLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className={`block px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        link.highlight ? 'text-primary font-semibold border-b border-border mb-1 pb-3' : 'text-foreground'
                      }`}
                      onClick={() => setProgramsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/coaching" 
              className={`${textColorClass} hover:text-primary transition-colors font-medium`}
            >
              1-on-1 Advisory
            </Link>
            <Link 
              to="/ask-marshall"
              className={`${textColorClass} hover:text-primary transition-colors font-medium`}
            >
              Ask Marshall
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
            className={`md:hidden ${iconColorClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className={iconColorClass} /> : <Menu className={iconColorClass} />}
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
              to="/articles" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </Link>
            
            {/* Mobile Programs Section */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Programs</p>
              <div className="pl-4 space-y-2 border-l border-border">
                {programLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className={`block text-foreground hover:text-primary transition-colors ${
                      link.highlight ? 'font-semibold text-primary' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/coaching" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              1-on-1 Advisory
            </Link>
            <Link 
              to="/ask-marshall" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ask Marshall
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
