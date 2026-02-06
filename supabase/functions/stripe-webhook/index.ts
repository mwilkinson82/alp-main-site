import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
function getProductFromSession(session: any): typeof PRODUCT_MAP[string] | null {
  // 1. Check metadata for product_key
  if (session.metadata?.product_key && PRODUCT_MAP[session.metadata.product_key]) {
    return PRODUCT_MAP[session.metadata.product_key];
  }
  
  // 2. Check payment_link
  if (session.payment_link) {
    const linkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link.id;
    for (const key of Object.keys(PRODUCT_MAP)) {
      if (linkId?.includes(key)) {
        return PRODUCT_MAP[key];
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
  const resp = await fetch("https://api.kajabi.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: KAJABI_CLIENT_ID,
      client_secret: KAJABI_CLIENT_SECRET,
    }),
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

async function createOrUpdateKajabiContact(token: string, name: string, email: string): Promise<string> {
  console.log("Creating/updating Kajabi contact:", email);
  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ") || "";

  const resp = await fetch("https://api.kajabi.com/api/v1/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        email,
        first_name: firstName,
        last_name: lastName,
      },
    }),
  });

  const data = await resp.json();
  
  if (!resp.ok) {
    // If contact already exists, try to find them
    if (resp.status === 422 || resp.status === 409) {
      console.log("Contact may already exist, searching...");
      const searchResp = await fetch(`https://api.kajabi.com/api/v1/contacts?filter[email]=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const searchData = await searchResp.json();
      if (searchData.data && searchData.data.length > 0) {
        console.log("Found existing Kajabi contact:", searchData.data[0].id);
        return searchData.data[0].id;
      }
    }
    console.error("Kajabi contact creation error:", resp.status, JSON.stringify(data));
    throw new Error(`Kajabi contact creation failed: ${resp.status}`);
  }
  
  console.log("Kajabi contact created:", data.id || data.data?.id);
  return data.id || data.data?.id;
}

async function grantKajabiOffer(token: string, contactId: string, offerId: string): Promise<void> {
  console.log(`Granting Kajabi offer ${offerId} to contact ${contactId}`);
  const resp = await fetch(`https://api.kajabi.com/api/v1/contacts/${contactId}/offers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ offer_id: offerId }),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    console.error("Kajabi offer grant error:", resp.status, text);
    // Don't throw — log and continue so the email still sends
  } else {
    console.log(`Kajabi offer ${offerId} granted successfully`);
  }
}

// --- Welcome Email ---
function buildWelcomeEmail(name: string, productName: string): string {
  const firstName = name.split(" ")[0];
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c9a44a; font-size: 28px; margin: 0 0 10px;">Welcome to ALP</h1>
        <p style="color: #ffffff; font-size: 16px; margin: 0;">You're in, ${firstName}.</p>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Hey ${firstName},
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for investing in yourself and joining <strong>${productName}</strong>. 
          This is the beginning of something powerful.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          You'll receive a separate email from Kajabi shortly with your login credentials and access to your courses. 
          Keep an eye on your inbox.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          <strong>What to expect:</strong>
        </p>
        <ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">
          <li>Your Kajabi access email will arrive within a few minutes</li>
          <li>Live session notifications will be sent directly to your email</li>
          <li>Click "Join Session" in any notification to hop on live</li>
          <li>All recordings are available in your Kajabi dashboard</li>
        </ul>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          If you have any questions, reply directly to this email — I read everything.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Let's build something great together.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          — Marshall Wilkinson
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
        <p style="margin: 0;">ALP — Accelerated Learning Program</p>
        <p style="margin: 5px 0 0;">marshallwilkinson.com</p>
      </div>
    </div>
  `;
}

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
    const product = getProductFromSession(session);
    
    if (!product) {
      console.error("Could not identify product — sending generic welcome email");
      // Still send a generic welcome email
      await resend.emails.send({
        from: "ALP — Marshall Wilkinson <onboarding@resend.dev>",
        to: [customerEmail],
        subject: "Welcome to ALP! 🚀",
        html: buildWelcomeEmail(customerName, "ALP"),
        replyTo: "marshall@marshallwilkinson.com",
      });
      
      // Notify Marshall
      await resend.emails.send({
        from: "ALP Website <onboarding@resend.dev>",
        to: ["marshall@marshallwilkinson.com"],
        subject: `⚠️ New Purchase — Unknown Product — ${customerName}`,
        html: `
          <h2>New Purchase — Could Not Auto-Identify Product</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Stripe Session ID:</strong> ${session.id}</p>
          <p>Please check Stripe and manually add this customer to Kajabi.</p>
        `,
      });
      
      return new Response(JSON.stringify({ received: true, warning: "unknown_product" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Product identified:", product.name);

    // 1. Send welcome email to customer
    console.log("Sending welcome email to:", customerEmail);
    const emailResult = await resend.emails.send({
      from: "ALP — Marshall Wilkinson <onboarding@resend.dev>",
      to: [customerEmail],
      subject: product.welcomeSubject,
      html: buildWelcomeEmail(customerName, product.name),
      replyTo: "marshall@marshallwilkinson.com",
    });
    console.log("Welcome email sent:", emailResult.data?.id);

    // 2. Create Kajabi contact and grant offers
    if (KAJABI_CLIENT_ID && KAJABI_CLIENT_SECRET) {
      try {
        const kajabiToken = await getKajabiAccessToken();
        const contactId = await createOrUpdateKajabiContact(kajabiToken, customerName, customerEmail);
        
        for (const offerId of product.kajabiOfferIds) {
          await grantKajabiOffer(kajabiToken, contactId, offerId);
        }
        console.log("Kajabi automation complete for:", customerEmail);
      } catch (kajabiError: any) {
        console.error("Kajabi automation failed:", kajabiError.message);
        // Notify Marshall about the Kajabi failure
        await resend.emails.send({
          from: "ALP Website <onboarding@resend.dev>",
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
      from: "ALP Website <onboarding@resend.dev>",
      to: ["marshall@marshallwilkinson.com"],
      subject: `🎉 New Sale: ${product.name} — ${customerName}`,
      html: `
        <h2>New Sale! 🎉</h2>
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
        <p><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
        <p><strong>Kajabi:</strong> Contact created & offers granted automatically</p>
      `,
      replyTo: customerEmail,
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
