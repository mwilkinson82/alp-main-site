import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import alpLogo from "@/assets/alp-logo.png";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(8, "Use at least 8 characters").max(128),
});

const PortalResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    // Handle both link formats:
    //   1) Hash style: #access_token=...&type=recovery  (Supabase handles automatically)
    //   2) Query style: ?code=...                       (must call exchangeCodeForSession)
    //   3) Error in URL: ?error=...&error_description=...
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const errParam = url.searchParams.get("error_description") || url.searchParams.get("error");

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });

    (async () => {
      if (errParam) {
        setLinkError(decodeURIComponent(errParam.replace(/\+/g, " ")));
        return;
      }

      // Existing session (hash already processed by client) → ready
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setReady(true);
        return;
      }

      // Query-style code → exchange for session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setLinkError(
            "This reset link is invalid or has already been used. Please request a new one.",
          );
          return;
        }
        setReady(true);
        // Clean the code out of the URL so a refresh doesn't re-attempt
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      // No session, no code, no error — give the hash listener a moment, then error out
      setTimeout(() => {
        if (cancelled) return;
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          if (!s && !ready) {
            setLinkError(
              "We couldn't verify your reset link. Please use the most recent email or request a new link.",
            );
          }
        });
      }, 1500);
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ password });
    if (!result.success) {
      toast({ title: "Invalid password", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You're signed in." });
    navigate("/portal/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/40 p-4">
      <Card className="w-full max-w-md border-border/60 shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <img src={alpLogo} alt="ALP" className="h-11" />
          </div>
          <CardTitle className="text-2xl">Set a new password</CardTitle>
          <CardDescription>
            {ready ? "Choose a strong password for your account." : "Verifying your reset link…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!ready}
                required
              />
            </div>
            <Button type="submit" variant="premium" className="w-full" disabled={loading || !ready}>
              {loading ? "Saving…" : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalResetPassword;
