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
    "authorization, x-client-info, apikey, content-type",
};

// Kajabi API credentials
const KAJABI_CLIENT_ID = Deno.env.get("KAJABI_CLIENT_ID");
const KAJABI_CLIENT_SECRET = Deno.env.get("KAJABI_CLIENT_SECRET");

// Map Stripe checkout links (last segment) to product info and Kajabi offer IDs
const PRODUCT_MAP: Record<string, { name: string; kajabiOfferIds: string[]; welcomeSubject: string }> = {
  // Power Hour 1 Month
  "7sYeVeaO52iGgMo4n8eQM0J": {
    name: "Power Hour (1 Month)",
    kajabiOfferIds: ["2150291427"],
    welcomeSubject: "Welcome to Power Hour! 🚀",
  },
  // Power Hour 6 Months
  "bJe6oI8FX2iG9jW4n8eQM0I": {
    name: "Power Hour (6 Months)",
    kajabiOfferIds: ["2150291441"],
    welcomeSubject: "Welcome to Power Hour! 🚀",
  },
  // Growth Academy 1 Month
  "00wbJ23lDbTgfIk8DoeQM0z": {
    name: "ALP Growth Academy (1 Month)",
    kajabiOfferIds: ["2150966111"],
    welcomeSubject: "Welcome to the ALP Growth Academy! 🎓",
  },
  // Growth Academy 6 Months
  "eVq28sbS9cXkgMo6vgeQM0A": {
    name: "ALP Growth Academy (6 Months)",
    kajabiOfferIds: ["2150966111"],
    welcomeSubject: "Welcome to the ALP Growth Academy! 🎓",
  },
  // Growth Academy Annual
  "6oUbJ2aO53mK53G9HseQM0C": {
    name: "ALP Growth Academy (Annual)",
    kajabiOfferIds: ["2150966111"],
    welcomeSubject: "Welcome to the ALP Growth Academy! 🎓",
  },
  // Full Access 6 Months
  "4gMaEY09r4qO67K8DoeQM0D": {
    name: "ALP Full Access (6 Months)",
    kajabiOfferIds: ["2150966111"],
    welcomeSubject: "Welcome to ALP Full Access! 👑",
  },
  // Full Access Annual
  "3cI8wQ7BT1eCbs4bPAeQM0E": {
    name: "ALP Full Access (Annual)",
    kajabiOfferIds: ["2150966111"],
    welcomeSubject: "Welcome to ALP Full Access! 👑",
  },
  // Handbook Special
  "8x2bJ28FXg9wgMo1aWeQM0K": {
    name: "Handbook Special (1 Month)",
    kajabiOfferIds: ["2150291427", "2150966111"],
    welcomeSubject: "Welcome to ALP — Handbook Special! 📘",
  },
  // ALP University
  "alp-university": {
    name: "ALP University",
    kajabiOfferIds: ["2149157033"],
    welcomeSubject: "Welcome to ALP University! 🎓",
  },
};

// Extract the product key from a Stripe Payment Link URL
function getProductFromPaymentLink(paymentLinkUrl: string | null): typeof PRODUCT_MAP[string] | null {
  if (!paymentLinkUrl) return null;
  // Try to match the last segment of the URL
  for (const key of Object.keys(PRODUCT_MAP)) {
    if (paymentLinkUrl.includes(key)) {
      return PRODUCT_MAP[key];
    }
  }
  return null;
}

// Get product from Stripe metadata or line items description
function getProductFromSession(session: any): { product: typeof PRODUCT_MAP[string]; key: string } | null {
  // 1. Check metadata for product_key
  if (session.metadata?.product_key && PRODUCT_MAP[session.metadata.product_key]) {
    return { product: PRODUCT_MAP[session.metadata.product_key], key: session.metadata.product_key };
  }
  
  // 2. Check payment_link
  if (session.payment_link) {
    const linkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link.id;
    for (const key of Object.keys(PRODUCT_MAP)) {
      if (linkId?.includes(key)) {
        return { product: PRODUCT_MAP[key], key };
      }
    }
  }

  console.warn("Could not identify product from session:", JSON.stringify({
    payment_link: session.payment_link,
    metadata: session.metadata,
  }));
  return null;
}

// --- Kajabi API ---
async function getKajabiAccessToken(): Promise<string> {
  console.log("Requesting Kajabi access token...");
  const resp = await fetch("https://api.kajabi.com/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: KAJABI_CLIENT_ID!,
      client_secret: KAJABI_CLIENT_SECRET!,
    }).toString(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Kajabi token error:", resp.status, text);
    throw new Error(`Kajabi auth failed: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  console.log("Kajabi access token obtained");
  return data.access_token;
}

async function getKajabiSiteId(token: string): Promise<string> {
  console.log("Fetching Kajabi site ID...");
  const resp = await fetch("https://api.kajabi.com/v1/sites", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.api+json",
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Kajabi sites error:", resp.status, text);
    throw new Error(`Failed to fetch Kajabi sites: ${resp.status}`);
  }
  const data = await resp.json();
  const siteId = data.data?.[0]?.id;
  if (!siteId) throw new Error("No Kajabi site found");
  console.log("Kajabi site ID:", siteId);
  return siteId;
}

async function createOrUpdateKajabiContact(token: string, name: string, email: string, siteId: string): Promise<string> {
  console.log("Creating/updating Kajabi contact:", email);

  const resp = await fetch("https://api.kajabi.com/v1/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "contacts",
        attributes: {
          name,
          email,
          subscribed: true,
        },
        relationships: {
          site: {
            data: { id: siteId, type: "sites" },
          },
        },
      },
    }),
  });

  const data = await resp.json();
  console.log("Kajabi contact creation response:", resp.status, JSON.stringify(data));
  
  if (!resp.ok) {
    // If contact already exists, find them and ensure they're subscribed
    if (resp.status === 422 || resp.status === 409) {
      console.log("Contact creation returned", resp.status, "- searching for existing contact...");
      const searchResp = await fetch(`https://api.kajabi.com/v1/contacts?filter[email]=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.api+json",
        },
      });
      const searchData = await searchResp.json();
      if (searchData.data && searchData.data.length > 0) {
        const contactId = searchData.data[0].id;
        console.log("Found existing Kajabi contact:", contactId);
        
        // Ensure existing contact is subscribed to marketing emails
        console.log("Ensuring contact is subscribed to marketing emails...");
        await fetch(`https://api.kajabi.com/v1/contacts/${contactId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify({
            data: {
              type: "contacts",
              id: contactId,
              attributes: { subscribed: true },
            },
          }),
        });
        
        return contactId;
      }
    }
    console.error("Kajabi contact creation error:", resp.status, JSON.stringify(data));
    throw new Error(`Kajabi contact creation failed: ${resp.status}`);
  }
  
  console.log("Kajabi contact created with marketing subscription:", data.data?.id);
  return data.data?.id;
}

async function grantKajabiOffer(token: string, contactId: string, offerId: string): Promise<void> {
  console.log(`Granting Kajabi offer ${offerId} to contact ${contactId}`);
  const resp = await fetch(`https://api.kajabi.com/v1/contacts/${contactId}/offers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "offers",
        id: offerId,
      },
    }),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Kajabi offer grant error:", resp.status, text);
    // Don't throw — log and continue so the email still sends
  } else {
    console.log(`Kajabi offer ${offerId} granted successfully`);
  }
}

// (Welcome email templates moved to email-templates.ts)
// --- Main Handler ---
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const event = JSON.parse(body);
    
    console.log("Stripe webhook received:", event.type);

    if (event.type !== "checkout.session.completed") {
      console.log("Ignoring event type:", event.type);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const session = event.data.object;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || "Valued Customer";

    console.log("Processing checkout for:", customerName, customerEmail);

    if (!customerEmail) {
      console.error("No customer email found in session");
      return new Response(JSON.stringify({ error: "No customer email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Identify the product
    const result = getProductFromSession(session);
    
    if (!result) {
      console.log("Unrecognized product — skipping customer email, notifying Marshall only");
      
      // Only notify Marshall — no email to the customer for custom/ad-hoc purchases
      await resend.emails.send({
        from: "ALP Website <notifications@notifications.marshallwilkinson.com>",
        to: ["marshall@marshallwilkinson.com"],
        subject: `💰 New Purchase (Custom) — ${customerName}`,
        html: `
          <h2>New Purchase — Custom / Ad-Hoc Product</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
          <p><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
          <p><strong>Stripe Session ID:</strong> ${session.id}</p>
          <p>This purchase didn't match a known product. No welcome email was sent to the customer.</p>
          <p>Follow up with them directly if needed.</p>
        `,
        replyTo: customerEmail,
      });
      // Log custom purchase
      await supabase.from("purchase_log").insert({
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: "Custom / Ad-Hoc",
        stripe_session_id: session.id,
        amount_cents: session.amount_total,
        welcome_email_sent: false,
        kajabi_provisioned: false,
      });
      
      return new Response(JSON.stringify({ received: true, warning: "custom_product" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { product, key: productKey } = result;
    console.log("Product identified:", product.name);

    // 1. Send welcome email to customer
    let welcomeEmailSent = false;
    let kajabiProvisioned = false;
    let errorMessage = "";

    console.log("Sending welcome email to:", customerEmail);
    try {
      const emailResult = await resend.emails.send({
        from: "ALP — Marshall Wilkinson <marshall@notifications.marshallwilkinson.com>",
        to: [customerEmail],
        subject: product.welcomeSubject,
        html: getWelcomeEmailHtml(productKey, customerName),
        replyTo: "marshall@marshallwilkinson.com",
      });
      console.log("Welcome email sent:", emailResult.data?.id);
      welcomeEmailSent = true;
    } catch (emailError: any) {
      console.error("Welcome email failed:", emailError.message);
      errorMessage += `Email: ${emailError.message}. `;
    }

    // 2. Create Kajabi contact and grant offers
    if (KAJABI_CLIENT_ID && KAJABI_CLIENT_SECRET) {
      try {
        const kajabiToken = await getKajabiAccessToken();
        const siteId = await getKajabiSiteId(kajabiToken);
        const contactId = await createOrUpdateKajabiContact(kajabiToken, customerName, customerEmail, siteId);
        
        for (const offerId of product.kajabiOfferIds) {
          await grantKajabiOffer(kajabiToken, contactId, offerId);
        }
        console.log("Kajabi automation complete for:", customerEmail);
        kajabiProvisioned = true;
      } catch (kajabiError: any) {
        console.error("Kajabi automation failed:", kajabiError.message);
        errorMessage += `Kajabi: ${kajabiError.message}. `;
        await resend.emails.send({
           from: "ALP Website <notifications@notifications.marshallwilkinson.com>",
          to: ["marshall@marshallwilkinson.com"],
          subject: `⚠️ Kajabi Automation Failed — ${customerName}`,
          html: `
            <h2>Kajabi Automation Failed</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Error:</strong> ${kajabiError.message}</p>
            <p>Please manually add this customer in Kajabi.</p>
          `,
        });
      }
    } else {
      console.warn("Kajabi credentials not configured — skipping Kajabi automation");
    }

    // 3. Notify Marshall of the sale
    await resend.emails.send({
      from: "ALP Website <notifications@notifications.marshallwilkinson.com>",
      to: ["marshall@marshallwilkinson.com"],
      subject: `🎉 New Sale: ${product.name} — ${customerName}`,
      html: `
        <h2>New Sale! 🎉</h2>
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
        <p><strong>Kajabi:</strong> ${kajabiProvisioned ? "✅ Provisioned" : "❌ Failed or skipped"}</p>
      `,
      replyTo: customerEmail,
    });

    // 4. Log purchase to database
    await supabase.from("purchase_log").insert({
      customer_name: customerName,
      customer_email: customerEmail,
      product_name: product.name,
      stripe_session_id: session.id,
      amount_cents: session.amount_total,
      welcome_email_sent: welcomeEmailSent,
      kajabi_provisioned: kajabiProvisioned,
      error_message: errorMessage || null,
    });

    return new Response(
      JSON.stringify({ received: true, product: product.name }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
