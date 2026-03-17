import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import marshallSignature from "@/assets/marshall-signature.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-primary">ALP</span>
            </h3>
            <p className="text-sm text-secondary-foreground/70 max-w-xs">
              Altitude Logic Pressure — Execution systems, decision architecture, and strategic leverage for operators who want scale.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Access</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/ask-marshall" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  Ask Marshall
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  1-on-1 Advisory
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  Live Training Rooms
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/ask-marshall"
                  className="text-primary hover:text-primary/80 transition-smooth font-semibold"
                >
                  Start Here — Ask Marshall →
                </Link>
              </li>
              <li>
                <Link 
                  to="/coaching"
                  className="text-secondary-foreground/70 hover:text-primary transition-smooth"
                >
                  Apply for Private Advisory →
                </Link>
              </li>
            </ul>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://instagram.com/realmarshallwilkinson" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary-foreground/70 hover:text-primary transition-smooth"
                aria-label="Follow Marshall on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com/marshallwilkinson" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary-foreground/70 hover:text-primary transition-smooth"
                aria-label="Subscribe to Marshall on YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-center py-8">
          <img 
            src={marshallSignature} 
            alt="Marshall Wilkinson Signature" 
            className="h-20 md:h-24 opacity-60"
          />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <p>© {currentYear} Marshall Wilkinson - Altitude Logic Pressure. All rights reserved.</p>
              <span className="text-xs text-secondary-foreground/40">Build: 2025-10-21</span>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-primary transition-smooth">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-smooth">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
