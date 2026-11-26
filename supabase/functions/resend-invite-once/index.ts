import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FROM_ADDRESS = "ALP Client Portal <notifications@notifications.marshallwilkinson.com>";

// Only an ALP admin may send portal invites. A caller qualifies with either
// a signed-in admin's JWT, or the server-held invite secret, which lives only
// in Vault (checked by a service-role-only RPC) and is never in source code.
async function isAuthorized(req: Request, body: any, admin: any): Promise<boolean> {
  const auth = req.headers.get("Authorization") ?? "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (jwt && jwt !== SUPABASE_ANON_KEY) {
    const { data, error } = await admin.auth.getUser(jwt);
    if (!error && data?.user) {
      const { data: isAdmin } = await admin.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (isAdmin === true) return true;
    }
  }
  const candidate = typeof body?.token === "string" ? body.token : "";
  if (candidate.length >= 32) {
    const { data: ok, error } = await admin.rpc("portal_invite_secret_matches", {
      _candidate: candidate,
    });
    if (!error && ok === true) return true;
  }
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    if (!(await isAuthorized(req, body, admin))) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const email = String(body.email ?? "").toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const fullName = body.fullName || null;
    const redirectTo = "https://altitudelogicpressure.com/portal/reset-password";

    let rec: any; let recErr: any;
    ({ data: rec, error: recErr } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    }));
    if (recErr || !rec?.properties?.action_link) {
      ({ data: rec, error: recErr } = await admin.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo },
      }));
      if (recErr) throw recErr;
      const newUserId = rec.user?.id;
      if (newUserId) {
        await admin.from("profiles").upsert(
          { user_id: newUserId, email, full_name: fullName, status: "active" },
          { onConflict: "user_id" },
        );
        await admin.from("user_roles").upsert(
          { user_id: newUserId, role: "client" },
          { onConflict: "user_id,role" },
        );
      }
    }
    const actionLink = rec.properties?.action_link;
    if (!actionLink) throw new Error("no link");

    // Rebuild with explicit redirect
    let finalLink = actionLink;
    try {
      const parsed = new URL(actionLink);
      const token = parsed.searchParams.get("token");
      const type = parsed.searchParams.get("type") ?? "recovery";
      if (token) {
        finalLink = `${SUPABASE_URL}/auth/v1/verify?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}&redirect_to=${encodeURIComponent(redirectTo)}`;
      }
    } catch {}

    const resend = new Resend(RESEND_API_KEY);
    const greeting = fullName ? `Hi ${fullName},` : "Hi,";
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Your ALP Client Portal access link",
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          <div style="background:linear-gradient(135deg,#0a0a0a,#2d2d2d);padding:40px;text-align:center;border-bottom:3px solid #c9a44a;">
            <h1 style="color:#c9a44a;font-size:32px;letter-spacing:6px;margin:0;">ALP</h1>
          </div>
          <div style="padding:32px;">
            <p>${greeting}</p>
            <p>Here's a fresh link to access your ALP Client Portal. Click below to set your password and sign in.</p>
            <p style="text-align:center;margin:32px 0;">
              <a href="${finalLink}" style="background:#c9a44a;color:#0a0a0a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;">Set Up My Account</a>
            </p>
            <p style="font-size:13px;color:#888;">Or paste this link:<br><span style="word-break:break-all;">${finalLink}</span></p>
            <p style="font-size:14px;color:#555;margin-top:28px;">— The ALP Team</p>
          </div>
        </div>`,
    });

    return new Response(JSON.stringify({ ok: true, email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
