import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import alpLogo from "@/assets/alp-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="alp-shell py-16 md:py-20">
        <div className="grid gap-12 border-b border-background/20 pb-14 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
          <div>
            <img src={alpLogo} alt="ALP" className="h-14 w-auto" />
            <p className="mt-6 max-w-md text-2xl leading-tight tracking-[-0.03em]">
              Build the company behind the projects.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/60">
              Altitude Logic Pressure develops field-tested operating doctrine for construction owners, operators, and leadership teams.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/45">Work With Marshall</p>
            <div className="mt-5 grid gap-3 text-sm">
              <Link to="/contractor-circle" className="hover:text-background/60">Contractor Circle</Link>
              <Link to="/programs" className="hover:text-background/60">Live training</Link>
              <Link to="/coaching" className="hover:text-background/60">Private intensives</Link>
              <Link to="/partnerships" className="hover:text-background/60">Partnerships</Link>
              <a href="https://marshallinbio.com/" target="_blank" rel="noopener noreferrer" className="hover:text-background/60">Connect with Marshall</a>

            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/45">ALP ecosystem</p>
            <div className="mt-5 grid gap-3 text-sm">
              <Link to="/ecosystem" className="hover:text-background/60">Ecosystem overview</Link>
              <a href="https://alphandbook.com/preview" target="_blank" rel="noopener noreferrer" className="hover:text-background/60">ALP Handbook</a>
              <a href="https://alpos.alpcontractorcircle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-background/60">AOS by ALP</a>
              <a href="https://overwatch.alpcontractorcircle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-background/60">OverWatch by ALP</a>
              <a href="https://marshallwilkinson.com/" target="_blank" rel="noopener noreferrer" className="hover:text-background/60">MarshallWilkinson.com</a>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/45">Existing clients</p>
            <div className="mt-5 grid gap-3 text-sm">
              <Link to="/client-login" className="hover:text-background/60">Replay libraries</Link>
              <Link to="/portal/login" className="hover:text-background/60">Current portal</Link>
              <Link to="/insights" className="hover:text-background/60">Insights</Link>
            </div>
            <div className="mt-7 flex gap-4">
              <a href="https://www.instagram.com/realmarshallwilkinson" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            </div>

          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-background/45 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Altitude Logic Pressure. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-service">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
