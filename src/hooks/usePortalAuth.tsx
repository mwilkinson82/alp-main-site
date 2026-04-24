import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type PortalProfile = {
  user_id: string;
  email: string;
  full_name: string | null;
  status: "active" | "inactive";
};

export type PortalAuthState = {
  loading: boolean;
  user: User | null;
  profile: PortalProfile | null;
  isAdmin: boolean;
  isActiveClient: boolean;
};

/**
 * Hook for portal pages. If `requireAuth` is true, redirects to /portal/login
 * when no session is present. If `requireAdmin` is true, redirects when not admin.
 */
export function usePortalAuth(opts?: { requireAuth?: boolean; requireAdmin?: boolean }) {
  const { requireAuth = true, requireAdmin = false } = opts ?? {};
  const navigate = useNavigate();
  const [state, setState] = useState<PortalAuthState>({
    loading: true,
    user: null,
    profile: null,
    isAdmin: false,
    isActiveClient: false,
  });

  useEffect(() => {
    let mounted = true;

    const loadUserContext = async (user: User | null) => {
      if (!user) {
        if (!mounted) return;
        setState({ loading: false, user: null, profile: null, isAdmin: false, isActiveClient: false });
        if (requireAuth) navigate("/portal/login", { replace: true });
        return;
      }

      // Defer DB calls so onAuthStateChange callback doesn't deadlock
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id,email,full_name,status")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id),
      ]);

      const roleSet = new Set((roles ?? []).map((r: { role: string }) => r.role));
      const isAdmin = roleSet.has("admin");
      const isClient = roleSet.has("client");
      const isActive = profile?.status === "active";
      const isActiveClient = (isAdmin || isClient) && isActive;

      if (!mounted) return;
      setState({
        loading: false,
        user,
        profile: (profile as PortalProfile) ?? null,
        isAdmin,
        isActiveClient,
      });

      if (requireAdmin && !isAdmin) {
        navigate("/portal/dashboard", { replace: true });
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to avoid Supabase deadlock
      setTimeout(() => loadUserContext(session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserContext(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
