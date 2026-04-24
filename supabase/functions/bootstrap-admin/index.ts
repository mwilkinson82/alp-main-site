import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

// Hard-coded allowed bootstrap email — only this email can claim the first
// admin slot, and only when there are zero admins in the system.
const ALLOWED_BOOTSTRAP_EMAIL = "marshall@marshallwilkinson.com";

const FROM_ADDRESS = "ALP Client Portal <noreply@altitudelogicpressure.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Refuse if an admin already exists
    const { count, error: cntErr } = await admin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (cntErr) throw cntErr;
    if ((count ?? 0) > 0) {
      return new Response(
        JSON.stringify({ error: "An admin already exists. Bootstrap is disabled." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const origin = req.headers.get("origin") || "https://altitudelogicpressure.com";
    const redirectTo = `${origin}/portal/reset-password`;

    if (email !== ALLOWED_BOOTSTRAP_EMAIL.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Email not allowed for bootstrap." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Generate invite link (creates user if missing, recovery link if exists)
    let actionLink: string | undefined;
    let userId: string | null = null;

    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo },
    });

    if (linkErr) {
      const { data: rec, error: recErr } = await admin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo },
      });
      if (recErr) throw recErr;
      actionLink = rec.properties?.action_link;
      userId = rec.user?.id ?? null;
    } else {
      actionLink = linkData.properties?.action_link;
      userId = linkData.user?.id ?? null;
    }

    if (!actionLink || !userId) throw new Error("Could not generate action link");

    // Profile + roles
    await admin.from("profiles").upsert(
      { user_id: userId, email, status: "active" },
      { onConflict: "user_id" },
    );
    await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "client" }, { onConflict: "user_id,role" });
    await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    // Send branded email
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Your ALP Client Portal — admin access",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0a0a0a, #2d2d2d); padding: 40px; text-align: center; border-bottom: 3px solid #c9a44a;">
            <h1 style="color: #c9a44a; font-size: 32px; letter-spacing: 6px; margin: 0;">ALP</h1>
          </div>
          <div style="padding: 32px;">
            <h2>You're now an admin of the ALP Client Portal</h2>
            <p>Click below to set your password and sign in.</p>
            <p style="text-align:center; margin: 32px 0;">
              <a href="${actionLink}" style="background:#c9a44a; color:#0a0a0a; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:700;">Set Up My Account</a>
            </p>
            <p style="font-size:13px;color:#888;">Or paste this link: <br><span style="word-break:break-all;">${actionLink}</span></p>
          </div>
        </div>`,
    });

    return new Response(JSON.stringify({ success: true, email }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("bootstrap-admin error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
