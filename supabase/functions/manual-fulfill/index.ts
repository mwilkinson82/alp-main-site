import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getWelcomeEmailHtml } from "./email-templates.ts";


const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Kajabi API credentials
const KAJABI_CLIENT_ID = Deno.env.get("KAJABI_CLIENT_ID");
const KAJABI_CLIENT_SECRET = Deno.env.get("KAJABI_CLIENT_SECRET");

// Product map — all products for fulfillment
const PRODUCT_MAP: Record<string, { name: string; kajabiOfferIds: string[]; welcomeSubject: string }> = {
  // Legacy
  "7sYeVeaO52iGgMo4n8eQM0J": { name: "Power Hour (1 Month)", kajabiOfferIds: ["2150291427"], welcomeSubject: "Welcome to Power Hour! 🚀" },
  "bJe6oI8FX2iG9jW4n8eQM0I": { name: "Power Hour (6 Months)", kajabiOfferIds: ["2150291441"], welcomeSubject: "Welcome to Power Hour! 🚀" },
  "00wbJ23lDbTgfIk8DoeQM0z": { name: "ALP Growth Academy (1 Month)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to the ALP Growth Academy! 🎓" },
  "eVq28sbS9cXkgMo6vgeQM0A": { name: "ALP Growth Academy (6 Months)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to the ALP Growth Academy! 🎓" },
  "6oUbJ2aO53mK53G9HseQM0C": { name: "ALP Growth Academy (Annual)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to the ALP Growth Academy! 🎓" },
  "4gMaEY09r4qO67K8DoeQM0D": { name: "ALP Full Access (6 Months)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to ALP Full Access! 👑" },
  "3cI8wQ7BT1eCbs4bPAeQM0E": { name: "ALP Full Access (Annual)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to ALP Full Access! 👑" },
  // New standalone
  "PH_MONTHLY_V2": { name: "Power Hour (Monthly — $997)", kajabiOfferIds: ["2150291427"], welcomeSubject: "Welcome to Power Hour! 🚀" },
  "PH_QUARTER_V2": { name: "Power Hour (Quarter — $2,997)", kajabiOfferIds: ["2150291441"], welcomeSubject: "Welcome to Power Hour! 🚀" },
  "CS_MONTHLY": { name: "Contractor School (Monthly — $497/mo)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to Contractor School! 🏗️" },
  "CS_QUARTER": { name: "Contractor School (Quarter — $1,497)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to Contractor School! 🏗️" },
  "SM_MONTHLY": { name: "Sales & Marketing School (Monthly — $497/mo)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to Sales & Marketing School! 📈" },
  "SM_QUARTER": { name: "Sales & Marketing School (Quarter — $1,497)", kajabiOfferIds: ["2150966111"], welcomeSubject: "Welcome to Sales & Marketing School! 📈" },
  // Other
  "8x2bJ28FXg9wgMo1aWeQM0K": { name: "Handbook Special (1 Month)", kajabiOfferIds: ["2150291427", "2150966111"], welcomeSubject: "Welcome to ALP — Handbook Special! 📘" },
  "8x2dRa1dvg9w1RudXIeQM0T": { name: "ALP University", kajabiOfferIds: ["2149157033"], welcomeSubject: "Welcome to ALP University! 🎓" },
  "bJeaEYe0h9L8ao0g5QeQM0R": { name: "1-on-1 Coaching (Single Session)", kajabiOfferIds: [], welcomeSubject: "Welcome — Your 1-on-1 Session Is Confirmed 🤝" },
  "14A5kEf4l0ay7bOaLweQM0Q": { name: "1-on-1 Coaching (6-Session Intensive)", kajabiOfferIds: [], welcomeSubject: "Welcome — Your 6-Session Intensive Begins Now 🤝" },
  "cNi4gA1dvbTg1Ru5rceQM0S": { name: "Ask Marshall", kajabiOfferIds: [], welcomeSubject: "Your Ask Marshall Submission Is Ready 🎯" },
};

async function getKajabiAccessToken(): Promise<string> {
  const resp = await fetch("https://api.kajabi.com/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: KAJABI_CLIENT_ID!,
      client_secret: KAJABI_CLIENT_SECRET!,
    }).toString(),
  });
  if (!resp.ok) throw new Error(`Kajabi auth failed: ${resp.status}`);
  const data = await resp.json();
  return data.access_token;
}

async function getKajabiSiteId(token: string): Promise<string> {
  const resp = await fetch("https://api.kajabi.com/v1/sites", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.api+json" },
  });
  if (!resp.ok) throw new Error(`Kajabi sites failed: ${resp.status}`);
  const data = await resp.json();
  const siteId = data.data?.[0]?.id;
  if (!siteId) throw new Error("No Kajabi site found");
  return siteId;
}

async function createOrUpdateKajabiContact(token: string, name: string, email: string, siteId: string): Promise<string> {
  const resp = await fetch("https://api.kajabi.com/v1/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
    body: JSON.stringify({
      data: {
        type: "contacts",
        attributes: { name, email, subscribed: true },
        relationships: { site: { data: { id: siteId, type: "sites" } } },
      },
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    if (resp.status === 422 || resp.status === 409) {
      const searchResp = await fetch(`https://api.kajabi.com/v1/contacts?filter[email]=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.api+json" },
      });
      const searchData = await searchResp.json();
      if (searchData.data?.length > 0) {
        const contactId = searchData.data[0].id;
        await fetch(`https://api.kajabi.com/v1/contacts/${contactId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
          body: JSON.stringify({ data: { type: "contacts", id: contactId, attributes: { subscribed: true } } }),
        });
        return contactId;
      }
    }
    throw new Error(`Kajabi contact creation failed: ${resp.status}`);
  }
  return data.data?.id;
}

async function grantKajabiOffer(token: string, contactId: string, offerId: string): Promise<void> {
  const resp = await fetch(`https://api.kajabi.com/v1/contacts/${contactId}/offers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
    body: JSON.stringify({ data: { type: "offers", id: offerId } }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Kajabi offer grant error:", resp.status, text);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check admin role
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { customer_name, customer_email, product_key, purchase_log_id } = body;

    if (!customer_name || !customer_email || !product_key) {
      return new Response(JSON.stringify({ error: "Missing required fields: customer_name, customer_email, product_key" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const product = PRODUCT_MAP[product_key];
    if (!product) {
      return new Response(JSON.stringify({ error: `Unknown product_key: ${product_key}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Manual fulfill:", product.name, "for", customer_email);

    let welcomeEmailSent = false;
    let kajabiProvisioned = false;
    let errorMessage = "";

    // 1. Send welcome email
    try {
      const emailResult = await resend.emails.send({
        from: "ALP — Marshall Wilkinson <marshall@notifications.marshallwilkinson.com>",
        to: [customer_email],
        subject: product.welcomeSubject,
        html: getWelcomeEmailHtml(product_key, customer_name, customer_email),
        replyTo: "marshall@marshallwilkinson.com",
      });
      console.log("Welcome email sent:", emailResult.data?.id);
      welcomeEmailSent = true;
    } catch (e: any) {
      console.error("Email failed:", e.message);
      errorMessage += `Email: ${e.message}. `;
    }

    // 2. Kajabi provisioning
    if (KAJABI_CLIENT_ID && KAJABI_CLIENT_SECRET && product.kajabiOfferIds.length > 0) {
      try {
        const kajabiToken = await getKajabiAccessToken();
        const siteId = await getKajabiSiteId(kajabiToken);
        const contactId = await createOrUpdateKajabiContact(kajabiToken, customer_name, customer_email, siteId);
        for (const offerId of product.kajabiOfferIds) {
          await grantKajabiOffer(kajabiToken, contactId, offerId);
        }
        kajabiProvisioned = true;
        console.log("Kajabi provisioned for:", customer_email);
      } catch (e: any) {
        console.error("Kajabi failed:", e.message);
        errorMessage += `Kajabi: ${e.message}. `;
      }
    } else if (product.kajabiOfferIds.length === 0) {
      kajabiProvisioned = true;
    }

    // 3. Update purchase_log if ID provided
    if (purchase_log_id) {
      await supabase.from("purchase_log").update({
        product_name: product.name,
        welcome_email_sent: welcomeEmailSent,
        kajabi_provisioned: kajabiProvisioned,
        error_message: errorMessage || null,
      }).eq("id", purchase_log_id);
    }

    return new Response(JSON.stringify({
      success: true,
      welcome_email_sent: welcomeEmailSent,
      kajabi_provisioned: kajabiProvisioned,
      error_message: errorMessage || null,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Manual fulfill error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

Deno.serve(handler);
