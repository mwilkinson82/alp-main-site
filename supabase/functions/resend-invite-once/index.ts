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
const ALLOW_TOKEN = "alp-resend-once-2026";
const FROM_ADDRESS = "ALP Client Portal <notifications@notifications.marshallwilkinson.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    if (body.token !== ALLOW_TOKEN) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const email = String(body.email).toLowerCase().trim();
    const fullName = body.fullName || null;
    const redirectTo = "https://altitudelogicpressure.com/portal/reset-password";

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: rec, error: recErr } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });
    if (recErr) throw recErr;
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
