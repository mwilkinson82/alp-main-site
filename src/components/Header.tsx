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

  // All pages now have dark background — text is always light at top
  const forceBlackTextPages: string[] = [];

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
  const shouldForceBlack = forceBlackTextPages.includes(location.pathname) || location.pathname.startsWith('/insights/');
  const isAtTop = scrollY < 300 && !shouldForceBlack;
  const textColorClass = isAtTop ? "text-white" : "text-foreground";
  const iconColorClass = isAtTop ? "text-white" : "";

  const programLinks = [
    { name: "Power Hour", path: "/power-hour", sub: "Daily at 8am EST" },
    { name: "Contractor School", path: "/contractor-school", sub: "Tuesdays at 7pm EST" },
    { name: "Sales & Marketing", path: "/sales-marketing-school", sub: "Wednesdays at 7pm EST" },
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
              to="/insights" 
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
                Programs
                <ChevronDown className={`w-4 h-4 transition-transform ${programsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {programsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  {programLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="block px-4 py-3 hover:bg-muted transition-colors"
                      onClick={() => setProgramsOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-foreground">{link.name}</span>
                      {link.sub && <span className="block text-xs text-muted-foreground mt-0.5">{link.sub}</span>}
                    </Link>
                  ))}
                  <div className="border-t border-border mx-2 my-1" />
                  <Link
                    to="/programs"
                    className="block px-4 py-3 hover:bg-muted transition-colors"
                    onClick={() => setProgramsOpen(false)}
                  >
                    <span className="block text-sm font-semibold text-primary">View All Programs</span>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/coaching" 
              className={`${textColorClass} hover:text-primary transition-colors font-medium`}
            >
              1-on-1 Advisory
            </Link>
            <Button
              variant="premium"
              size="sm"
              asChild
            >
              <Link to="/ask-marshall">
                Ask Marshall
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-current opacity-60 hover:opacity-100"
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

      </div>

      {/* Mobile Navigation — full-width solid white panel, rendered outside header padding */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
          <nav className="px-4 py-5 space-y-0">
            <Link
              to="/"
              className="block px-3 py-3.5 text-gray-900 font-medium hover:text-primary hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="mx-3 border-b border-gray-100" />

            <Link
              to="/insights"
              className="block px-3 py-3.5 text-gray-900 font-medium hover:text-primary hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </Link>

            <div className="mx-3 border-b border-gray-100" />

            {/* Mobile Access Section */}
            <div>
              <p className="px-3 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Programs</p>
              <div className="space-y-0">
                {programLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="block px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="block text-sm font-semibold text-gray-900 hover:text-primary">{link.name}</span>
                    {link.sub && <span className="block text-xs text-gray-500 mt-0.5">{link.sub}</span>}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-3 border-b border-gray-100" />

            <Link
              to="/coaching"
              className="block px-3 py-3.5 text-gray-900 font-medium hover:text-primary hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              1-on-1 Advisory
            </Link>

            <div className="pt-4 space-y-2 border-t border-gray-200 mt-2">
              <Button variant="premium" size="sm" className="w-full min-h-[44px]" asChild>
                <Link to="/ask-marshall" onClick={() => setMobileMenuOpen(false)}>
                  Ask Marshall
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full opacity-70 min-h-[44px]" asChild>
                <a href="https://marshallwilkinson.mykajabi.com/login" target="_blank" rel="noopener noreferrer">
                  <LogIn className="mr-2 h-4 w-4" />
                  Client Portal
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
