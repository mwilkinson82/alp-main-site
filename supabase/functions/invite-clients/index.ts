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
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const resend = new Resend(RESEND_API_KEY);

const FROM_ADDRESS = "ALP Client Portal <notifications@notifications.marshallwilkinson.com>";
const PUBLIC_SITE_URL = "https://altitudelogicpressure.com";

function getAllowedOrigin(input?: string | null) {
  if (!input) return PUBLIC_SITE_URL;

  try {
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase();
    const isLiveSite = hostname === "altitudelogicpressure.com" || hostname === "www.altitudelogicpressure.com";

    return isLiveSite ? `${url.protocol}//${url.host}` : PUBLIC_SITE_URL;
  } catch {
    return PUBLIC_SITE_URL;
  }
}

function apologyEmailHtml(opts: {
  fullName: string | null;
  inviteUrl: string;
}) {
  const greeting = opts.fullName ? `Hi ${opts.fullName},` : "Hi,";
  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%); padding: 48px 30px; text-align: center; border-bottom: 3px solid #c9a44a;">
      <h1 style="color: #c9a44a; font-size: 36px; font-weight: 800; letter-spacing: 6px; margin: 0; text-transform: uppercase;">ALP</h1>
      <p style="color: #888; font-size: 11px; letter-spacing: 3px; margin: 8px 0 0; text-transform: uppercase;">Altitude Logic Pressure</p>
    </div>
    <div style="padding: 32px 30px;">
      <h2 style="font-size: 22px; color: #1a1a1a; margin: 0 0 16px;">Quick fix — please use this new link</h2>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">${greeting}</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Apologies — the link in our previous email about the new ALP Client Replay Portal was misconfigured and didn't take you where it should have. That's on us, not on Marshall.
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        The button below is the corrected link. Click it to set your password and access the portal where all new class recordings from <strong>April 26, 2026 onward</strong> will live (Power Hour, Contractor School, and Sales &amp; Marketing School).
      </p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${opts.inviteUrl}" style="display: inline-block; background: #c9a44a; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; letter-spacing: 0.5px;">Set Up My Account</a>
      </p>
      <p style="font-size: 13px; color: #888; line-height: 1.6;">
        If the button doesn't work, copy and paste this URL into your browser:<br>
        <span style="word-break: break-all; color: #555;">${opts.inviteUrl}</span>
      </p>
      <p style="font-size: 14px; color: #888; line-height: 1.6; margin-top: 28px;">
        Your existing recordings from 2023 through April 2026 remain in the legacy Kajabi library — nothing has changed there.
      </p>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin-top: 28px;">
        Thanks for your patience.<br>
        — The ALP Tech Team
      </p>
    </div>
    <div style="background: #1a1a1a; padding: 24px 30px; text-align: center; font-size: 12px; color: #888;">
      <p style="margin: 0; color: #c9a44a; font-weight: 600;">ALP — Altitude Logic Pressure</p>
      <p style="margin: 8px 0 0;"><a href="https://altitudelogicpressure.com" style="color: #888; text-decoration: none;">altitudelogicpressure.com</a></p>
    </div>
  </div>`;
}

function inviteEmailHtml(opts: {
  fullName: string | null;
  inviteUrl: string;
  asAdmin: boolean;
}) {
  const greeting = opts.fullName ? `Hi ${opts.fullName},` : "Hi,";
  const role = opts.asAdmin ? "an administrator" : "a member";
  return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%); padding: 48px 30px; text-align: center; border-bottom: 3px solid #c9a44a;">
      <h1 style="color: #c9a44a; font-size: 36px; font-weight: 800; letter-spacing: 6px; margin: 0; text-transform: uppercase;">ALP</h1>
      <p style="color: #888; font-size: 11px; letter-spacing: 3px; margin: 8px 0 0; text-transform: uppercase;">Altitude Logic Pressure</p>
    </div>
    <div style="padding: 32px 30px;">
      <h2 style="font-size: 22px; color: #1a1a1a; margin: 0 0 16px;">You've been invited to the ALP Client Portal</h2>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">${greeting}</p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        You've been added as ${role} to the new ALP Client Replay Portal. This is where all new class recordings from <strong>April 26, 2026 onward</strong> will live (Power Hour, Contractor School, and Sales &amp; Marketing School).
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Click the button below to set your password and access the portal.
      </p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${opts.inviteUrl}" style="display: inline-block; background: #c9a44a; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; letter-spacing: 0.5px;">Set Up My Account</a>
      </p>
      <p style="font-size: 13px; color: #888; line-height: 1.6;">
        This link will sign you in and let you choose your password. If the button doesn't work, copy and paste this URL into your browser:<br>
        <span style="word-break: break-all; color: #555;">${opts.inviteUrl}</span>
      </p>
      <p style="font-size: 14px; color: #888; line-height: 1.6; margin-top: 28px;">
        Your existing recordings from 2023 through April 2026 remain in the legacy Kajabi library.
      </p>
      <p style="font-size: 14px; color: #555; line-height: 1.6; margin-top: 28px;">
        Questions? Reply to this email or write to <a href="mailto:marshall@marshallwilkinson.com" style="color: #c9a44a;">marshall@marshallwilkinson.com</a>.
      </p>
    </div>
    <div style="background: #1a1a1a; padding: 24px 30px; text-align: center; font-size: 12px; color: #888;">
      <p style="margin: 0; color: #c9a44a; font-weight: 600;">ALP — Altitude Logic Pressure</p>
      <p style="margin: 8px 0 0;"><a href="https://altitudelogicpressure.com" style="color: #888; text-decoration: none;">altitudelogicpressure.com</a></p>
    </div>
  </div>`;
}

type InviteRequest = {
  emails: string[];
  asAdmin?: boolean;
  redirectTo?: string;
};

type InviteResult = {
  email: string;
  status: "invited" | "reinvited" | "exists_active" | "error";
  message?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the caller is an admin using their JWT
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user: caller },
      error: callerErr,
    } = await callerClient.auth.getUser();
    if (callerErr || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as InviteRequest;
    const emails = (body.emails ?? [])
      .map((e) => e.trim().toLowerCase())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const asAdmin = !!body.asAdmin;
    const origin = getAllowedOrigin(
      body.redirectTo || req.headers.get("origin") || PUBLIC_SITE_URL,
    );
    const redirectTo = `${origin}/portal/reset-password`;

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid email addresses provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const results: InviteResult[] = [];

    for (const email of emails) {
      try {
        // 1) Find or create user via inviteUserByEmail (sends nothing if we
        //    handle email ourselves — but invite returns an action link too).
        //    We use generateLink which works for new + existing users.

        // Check if user already exists
        const { data: existing } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 1,
          // listUsers has no email filter — fetch by getUserByEmail-like helper:
        });

        // Try to look up existing via filter
        let userId: string | null = null;
        // Use admin generate link "invite" which creates user if missing
        const { data: linkData, error: linkErr } = await admin.auth.admin
          .generateLink({
            type: "invite",
            email,
            options: { redirectTo },
          });

        let actionLink: string | undefined;
        let isNew = true;

        if (linkErr) {
          // If user already exists, generate a recovery link instead
          if (
            linkErr.message?.toLowerCase().includes("already") ||
            linkErr.message?.toLowerCase().includes("registered")
          ) {
            isNew = false;
            const { data: rec, error: recErr } = await admin.auth.admin
              .generateLink({
                type: "recovery",
                email,
                options: { redirectTo },
              });
            if (recErr) throw recErr;
            actionLink = rec.properties?.action_link;
            userId = rec.user?.id ?? null;
          } else {
            throw linkErr;
          }
        } else {
          actionLink = linkData.properties?.action_link;
          userId = linkData.user?.id ?? null;
        }

        if (!actionLink || !userId) {
          throw new Error("Could not generate action link");
        }

        // Bypass Supabase's Site URL / redirect allow-list entirely:
        // extract the verify token from the action_link and rebuild it
        // ourselves with our production redirect_to. This guarantees the
        // email link goes to altitudelogicpressure.com regardless of
        // whatever Site URL is configured in Supabase auth settings.
        let finalLink = actionLink;
        try {
          const parsed = new URL(actionLink);
          const token = parsed.searchParams.get("token");
          const type = parsed.searchParams.get("type") ?? (isNew ? "invite" : "recovery");
          if (token) {
            finalLink = `${SUPABASE_URL}/auth/v1/verify?token=${encodeURIComponent(
              token,
            )}&type=${encodeURIComponent(type)}&redirect_to=${encodeURIComponent(redirectTo)}`;
          }
        } catch {
          // fall back to original action_link
        }

        // 2) Ensure profile exists & is active (trigger handles new users,
        //    but explicitly upsert in case)
        await admin.from("profiles").upsert(
          {
            user_id: userId,
            email,
            status: "active",
          },
          { onConflict: "user_id" },
        );

        // 3) Ensure client role
        await admin
          .from("user_roles")
          .upsert(
            { user_id: userId, role: "client" },
            { onConflict: "user_id,role" },
          );

        // 4) If admin requested, also grant admin role
        if (asAdmin) {
          await admin
            .from("user_roles")
            .upsert(
              { user_id: userId, role: "admin" },
              { onConflict: "user_id,role" },
            );
        }

        // 5) Send our branded email
        const { data: profile } = await admin
          .from("profiles")
          .select("full_name")
          .eq("user_id", userId)
          .maybeSingle();

        await resend.emails.send({
          from: FROM_ADDRESS,
          to: email,
          subject: "Your ALP Client Portal access",
          html: inviteEmailHtml({
            fullName: profile?.full_name ?? null,
            inviteUrl: finalLink,
            asAdmin,
          }),
        });

        results.push({
          email,
          status: isNew ? "invited" : "reinvited",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Invite failed for ${email}:`, msg);
        results.push({ email, status: "error", message: msg });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("invite-clients fatal:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
