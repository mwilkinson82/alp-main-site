import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";

const schools = [
  { label: "ALP Handbook", detail: "Field-tested contractor doctrine", to: "https://alphandbook.com", external: true },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [schoolsOpen, setSchoolsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSchoolsOpen(false);
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
          <a href="https://alpcontractorcircle.com" className="text-sm font-semibold hover:text-accent">Contractor Circle</a>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium hover:text-accent"
              onClick={() => setSchoolsOpen((value) => !value)}
              aria-expanded={schoolsOpen}
            >
              Training <ChevronDown className={`h-4 w-4 transition-transform ${schoolsOpen ? "rotate-180" : ""}`} />
            </button>
            {schoolsOpen && (
              <div className="absolute left-0 top-9 w-72 border border-border bg-card p-2 shadow-elegant">
                {schools.map((school) => school.external ? (
                  <a key={school.to} href={school.to} target="_blank" rel="noopener noreferrer" className="block border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/60">
                    <span className="block text-sm font-semibold">{school.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{school.detail}</span>
                  </a>
                ) : (
                  <Link key={school.to} to={school.to} className="block border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/60">
                    <span className="block text-sm font-semibold">{school.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{school.detail}</span>
                  </Link>
                ))}
                <Link to="/programs" className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">View all programs</Link>
              </div>
            )}
          </div>
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
            <a href="https://alpcontractorcircle.com" className="border-b border-border py-3 text-base font-semibold">Contractor Circle</a>
            <p className="pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Training</p>
            {schools.map((school) => school.external ? (
              <a key={school.to} href={school.to} target="_blank" rel="noopener noreferrer" className="border-b border-border py-3 text-sm">{school.label}</a>
            ) : (
              <Link key={school.to} to={school.to} className="border-b border-border py-3 text-sm">{school.label}</Link>
            ))}
            <Link to="/programs" className="border-b border-border py-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">View all programs</Link>
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
