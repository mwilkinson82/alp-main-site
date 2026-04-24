import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";
import SEO from "@/components/SEO";
import { z } from "zod";
import { getPortalResetUrl } from "@/lib/site-url";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const PortalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/portal/dashboard", { replace: true });
      } else {
        setChecking(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        navigate("/portal/dashboard", { replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      toast({
        title: "Invalid input",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    // navigation handled by onAuthStateChange
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = z.string().trim().email().safeParse(email);
    if (!emailCheck.success) {
      toast({ title: "Invalid email", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPortalResetUrl(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send reset email", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Check your inbox",
      description: "If an account exists for that email, we've sent password reset instructions.",
    });
    setForgotMode(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Sign In | ALP Client Portal" description="Sign in to the Altitude Logic Pressure client replay portal." canonical="/portal/login" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/40 p-4">
        <div className="w-full max-w-md">
          <Link to="/client-login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Link>

          <Card className="border-border/60 shadow-elegant">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <img src={alpLogo} alt="ALP" className="h-11" />
              </div>
              <CardTitle className="text-2xl">
                {forgotMode ? "Reset your password" : "Client Portal"}
              </CardTitle>
              <CardDescription>
                {forgotMode
                  ? "Enter your email and we'll send you a reset link."
                  : "Sign in to access your class replays."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={forgotMode ? handleForgot : handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {!forgotMode && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" variant="premium" className="w-full" disabled={loading}>
                  {loading ? "Please wait…" : forgotMode ? "Send Reset Link" : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setForgotMode((v) => !v)}
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  {forgotMode ? "Back to sign in" : "Forgot password?"}
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Need access? Contact{" "}
            <a href="mailto:marshall@marshallwilkinson.com" className="underline hover:text-primary">
              marshall@marshallwilkinson.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default PortalLogin;
