import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import alpLogo from "@/assets/alp-logo.png";

type Props = {
  children: ReactNode;
  isAdmin?: boolean;
};

const navLinks = [
  { to: "/portal/dashboard", label: "Dashboard" },
  { to: "/portal/power-hour", label: "Power Hour" },
  { to: "/portal/contractor-school", label: "Contractor School" },
  { to: "/portal/sales-marketing-school", label: "Sales & Marketing" },
];

export default function PortalLayout({ children, isAdmin }: Props) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/client-login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "text-primary bg-primary/10"
        : "text-foreground/80 hover:text-primary hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/portal/dashboard" className="flex items-center gap-2">
              <img src={alpLogo} alt="ALP" className="h-9 w-auto" />
              <span className="hidden sm:inline text-sm font-semibold tracking-tight text-foreground/70">
                Client Portal
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass} end>
                  {l.label}
                </NavLink>
              ))}
              {isAdmin && (
                <>
                  <NavLink to="/admin/recordings" className={linkClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Recordings
                    </span>
                  </NavLink>
                  <NavLink to="/admin/clients" className={linkClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Clients
                    </span>
                  </NavLink>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2 text-foreground/80"
              >
                <LogOut className="w-4 h-4 mr-1.5" /> Log Out
              </Button>
            </nav>

            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1 border-t border-border pt-3">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                  end
                >
                  <span className="block">{l.label}</span>
                </NavLink>
              ))}
              {isAdmin && (
                <>
                  <NavLink
                    to="/admin/recordings"
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin: Recordings
                    </span>
                  </NavLink>
                  <NavLink
                    to="/admin/clients"
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin: Clients
                    </span>
                  </NavLink>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                <LogOut className="w-4 h-4 mr-1.5 inline" /> Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Altitude Logic Pressure. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
