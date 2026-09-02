import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="alp-shell flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="ALP home">
          <img src={alpLogo} alt="ALP" className="h-11 w-11 shrink-0 object-contain" />
          <span className="hidden border-l border-border pl-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
            Altitude Logic Pressure
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          <a href="https://alpcontractorcircle.com" className="text-sm font-medium hover:text-accent">Contractor Circle</a>
          <Link to="/programs" className="text-sm font-medium hover:text-accent">Programs</Link>
          <Link to="/coaching" className="text-sm font-medium hover:text-accent">Private Intensives</Link>
          <Link to="/insights" className="text-sm font-medium hover:text-accent">Insights</Link>
          <Link to="/client-login" className="alp-button-outline min-h-10 px-4 py-2">
            <LogIn className="h-4 w-4" /> Replay login
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-2xl gap-1">
            <a href="https://alpcontractorcircle.com" className="border-b border-border py-3 text-sm">Contractor Circle</a>
            <Link to="/programs" className="border-b border-border py-3 text-sm">Programs</Link>
            <Link to="/coaching" className="border-b border-border py-3 text-sm">Private Intensives</Link>
            <Link to="/insights" className="border-b border-border py-3 text-sm">Insights</Link>
            <Link to="/client-login" className="alp-button mt-4"><LogIn className="h-4 w-4" /> Replay login</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
