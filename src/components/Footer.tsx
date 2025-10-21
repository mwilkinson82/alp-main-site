import { Instagram, Youtube } from "lucide-react";
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
              Altitude Logic Pressure - Transforming businesses through proven expertise and elite coaching.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  1-on-1 Coaching
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  Power Hour Membership
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-foreground/70 hover:text-primary transition-smooth">
                  Training Library
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://calendly.com/your-calendly-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary-foreground/70 hover:text-primary transition-smooth"
                >
                  Schedule Consultation
                </a>
              </li>
              <li className="text-secondary-foreground/70">
                Power Hour: Daily at 8:00 AM EST
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
            className="h-12 opacity-60"
          />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
            <p>© {currentYear} Marshall Wilkinson - Altitude Logic Pressure. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-smooth">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
