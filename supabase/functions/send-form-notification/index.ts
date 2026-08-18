import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email recipient
const RECIPIENT_EMAIL = "wilkinson.marshall@gmail.com";
const PARTNERSHIP_RECIPIENT_EMAIL =
  Deno.env.get("PARTNERSHIP_RECIPIENT_EMAIL") || RECIPIENT_EMAIL;

const escapeHtml = (value: string): string =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);

const subjectText = (value: string): string =>
  value.replace(/[\r\n]+/g, " ").trim().slice(0, 120);

const safeHttpUrl = (value: string): string => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
};

interface ContactFormData {
  formType: 'contact';
  name: string;
  email: string;
  category: string;
  message: string;
}

interface PricingFormData {
  formType: 'pricing';
  name: string;
  email: string;
  phone?: string;
  frequency?: string;
  message: string;
  packageType: string;
}

interface AskMarshallFormData {
  formType: 'ask-marshall';
  name: string;
  email: string;
  question: string;
  context?: string;
  fileUrls?: string[];
}

interface AdvisoryApplicationFormData {
  formType: 'advisory-application';
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  annualRevenue: string;
  biggestChallenge: string;
  alreadyTried: string;
  serviceApplyingFor: string;
}

interface NewsletterFormData {
  formType: 'newsletter';
  email: string;
}

interface PartnershipFormData {
  formType: 'partnership';
  name: string;
  email: string;
  companyName: string;
  productName: string;
  companyUrl: string;
  campaignObjective: string;
  intendedDeliverables: string;
  campaignBudget: string;
  organicUsage: string;
  paidUsageRequirements: string;
  whitelistingRequirements: string;
  exclusivityTerms: string;
  timeline: string;
  productAccess: string;
  contractorRelevance: string;
  engagementType: string;
}

type FormData = ContactFormData | PricingFormData | AskMarshallFormData | AdvisoryApplicationFormData | NewsletterFormData | PartnershipFormData;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();
    console.log("Received form submission:", { formType: formData.formType, ...('name' in formData ? { name: formData.name } : {}) });

    // Validate form type
    if (!formData.formType || !['contact', 'pricing', 'ask-marshall', 'advisory-application', 'newsletter', 'partnership'].includes(formData.formType)) {
      console.error("Invalid form type:", formData.formType);
      return new Response(
        JSON.stringify({ error: "Invalid form type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Newsletter — short-circuit: just send notification, no other validation needed
    if (formData.formType === 'newsletter') {
      const newsletterData = formData as NewsletterFormData;
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'long' });
      const emailResponse = await resend.emails.send({
        from: "ALP Website <notifications@notifications.marshallwilkinson.com>",
        to: [RECIPIENT_EMAIL],
        subject: `📬 New Newsletter Subscriber — ${newsletterData.email}`,
        html: `
          <h2>New Newsletter Subscriber 📬</h2>
          <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
          <p><strong>Email:</strong> <a href="mailto:${newsletterData.email}">${newsletterData.email}</a></p>
          <p><strong>Source:</strong> ALP Insights Newsletter (Homepage)</p>
          <p style="color: #6b7280; font-size: 14px;"><small>Subscribed: ${timestamp}</small></p>
        `,
      });
      return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate required fields
    const missingRequiredFields =
      !formData.name ||
      !formData.email ||
      (formData.formType === 'contact' && !formData.message) ||
      (formData.formType === 'pricing' && (!formData.message || !formData.packageType)) ||
      (formData.formType === 'ask-marshall' && !formData.question) ||
      (formData.formType === 'advisory-application' && (!formData.biggestChallenge || !formData.companyName || !formData.serviceApplyingFor)) ||
      (formData.formType === 'partnership' && [
        formData.companyName,
        formData.productName,
        safeHttpUrl(formData.companyUrl),
        formData.campaignObjective,
        formData.intendedDeliverables,
        formData.campaignBudget,
        formData.organicUsage,
        formData.paidUsageRequirements,
        formData.whitelistingRequirements,
        formData.exclusivityTerms,
        formData.timeline,
        formData.productAccess,
        formData.contractorRelevance,
        formData.engagementType,
      ].some((value) => !value));

    if (missingRequiredFields) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let subject: string;
    let html: string;
    let recipientEmail = RECIPIENT_EMAIL;
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    if (formData.formType === 'ask-marshall') {
      const askData = formData as AskMarshallFormData;
      subject = `🎯 New "Ask Marshall" Submission from ${askData.name}`;
      const fileLinks = askData.fileUrls && askData.fileUrls.length > 0
        ? `<p><strong>Uploaded Files:</strong></p><ul>${askData.fileUrls.map((url, i) => `<li><a href="${url}" style="color: #c9a44a;">File ${i + 1}</a></li>`).join("")}</ul>`
        : `<p><em>No files uploaded</em></p>`;
      html = `
        <h2>New "Ask Marshall" Submission 🎯</h2>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
        <p><strong>Name:</strong> ${askData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${askData.email}">${askData.email}</a></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Question:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${askData.question}</p>
        ${askData.context ? `<p><strong>Additional Context:</strong></p><p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${askData.context}</p>` : ''}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        ${fileLinks}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="background: #fff3cd; padding: 12px; border-radius: 5px; font-weight: bold;">⏰ Reminder: Respond within 24 hours via Loom video</p>
        <p style="color: #6b7280; font-size: 14px;"><small>Submitted: ${timestamp}</small></p>
      `;
    } else if (formData.formType === 'advisory-application') {
      const appData = formData as AdvisoryApplicationFormData;
      subject = `🔒 New Advisory Application from ${appData.name} — ${appData.serviceApplyingFor}`;
      html = `
        <h2>New Advisory Application 🔒</h2>
        <p style="background: #fef3c7; padding: 10px; border-radius: 5px; font-weight: bold;">Applying for: ${appData.serviceApplyingFor}</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
        <p><strong>Name:</strong> ${appData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${appData.email}">${appData.email}</a></p>
        <p><strong>Phone:</strong> ${appData.phone ? `<a href="tel:${appData.phone}">${appData.phone}</a>` : 'Not provided'}</p>
        <p><strong>Company:</strong> ${appData.companyName}</p>
        <p><strong>Annual Revenue:</strong> ${appData.annualRevenue}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Biggest Challenge:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${appData.biggestChallenge}</p>
        <p><strong>What They've Already Tried:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${appData.alreadyTried}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="background: #dcfce7; padding: 12px; border-radius: 5px; font-weight: bold;">✅ Review this application and follow up manually within 48 hours if qualified.</p>
        <p style="color: #6b7280; font-size: 14px;"><small>Submitted: ${timestamp}</small></p>
      `;
    } else if (formData.formType === 'partnership') {
      const partnershipData = formData as PartnershipFormData;
      const companyUrl = safeHttpUrl(partnershipData.companyUrl);
      recipientEmail = PARTNERSHIP_RECIPIENT_EMAIL;
      subject = `Strategic Brand Partnership Inquiry — ${subjectText(partnershipData.companyName)} / ${subjectText(partnershipData.productName)}`;
      html = `
        <h2>Strategic Brand Partnership Inquiry</h2>
        <p style="background: #fef3c7; padding: 12px; border-radius: 5px; font-weight: bold;">Requested engagement: ${escapeHtml(partnershipData.engagementType)}</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
        <h3>Company and Contact</h3>
        <p><strong>Name:</strong> ${escapeHtml(partnershipData.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(partnershipData.email)}">${escapeHtml(partnershipData.email)}</a></p>
        <p><strong>Company:</strong> ${escapeHtml(partnershipData.companyName)}</p>
        <p><strong>Product or Service:</strong> ${escapeHtml(partnershipData.productName)}</p>
        <p><strong>URL:</strong> ${companyUrl ? `<a href="${escapeHtml(companyUrl)}">${escapeHtml(companyUrl)}</a>` : "Invalid or missing URL"}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <h3>Campaign Scope</h3>
        <p><strong>Objective:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${escapeHtml(partnershipData.campaignObjective)}</p>
        <p><strong>Intended Deliverables:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${escapeHtml(partnershipData.intendedDeliverables)}</p>
        <p><strong>Campaign Budget:</strong> ${escapeHtml(partnershipData.campaignBudget)}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(partnershipData.timeline)}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <h3>Usage and Commercial Terms</h3>
        <p><strong>Organic Usage:</strong> ${escapeHtml(partnershipData.organicUsage)}</p>
        <p><strong>Whitelisting / Partnership Ads:</strong> ${escapeHtml(partnershipData.whitelistingRequirements)}</p>
        <p><strong>Paid-Media Usage:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${escapeHtml(partnershipData.paidUsageRequirements)}</p>
        <p><strong>Exclusivity Terms:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${escapeHtml(partnershipData.exclusivityTerms)}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <h3>Product Fit</h3>
        <p><strong>Product Access or Trial:</strong> ${escapeHtml(partnershipData.productAccess)}</p>
        <p><strong>Why It Is Relevant to Contractors:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${escapeHtml(partnershipData.contractorRelevance)}</p>
        <p style="background: #dcfce7; padding: 12px; border-radius: 5px; font-weight: bold;">Review audience fit, substantiation, usage rights, exclusivity, and whether advisory requires a separate scope before responding.</p>
        <p style="color: #6b7280; font-size: 14px;"><small>Submitted: ${timestamp}</small></p>
      `;
    } else if (formData.formType === 'contact') {
      // Contact form email
      subject = `New Contact Form Submission from ${formData.name}`;
      html = `
        <h2>New Contact Form Submission</h2>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
        <p><strong>Category:</strong> ${formData.category}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${formData.message}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;"><small>Submitted: ${timestamp}</small></p>
      `;
    } else {
      // Pricing form email
      const pricingData = formData as PricingFormData;
      subject = `New Custom Pricing Request - ${pricingData.packageType} from ${pricingData.name}`;
      html = `
        <h2>New Custom Pricing Request</h2>
        <p style="background: #dbeafe; padding: 10px; border-radius: 5px; font-weight: bold;">Package Type: ${pricingData.packageType}</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
        <p><strong>Name:</strong> ${pricingData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${pricingData.email}">${pricingData.email}</a></p>
        <p><strong>Phone:</strong> ${pricingData.phone || "Not provided"}</p>
        ${pricingData.frequency ? `<p><strong>Preferred Frequency:</strong> ${pricingData.frequency}</p>` : ''}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Their Needs:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px;">${pricingData.message}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;"><small>Submitted: ${timestamp}</small></p>
      `;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "ALP Website <notifications@notifications.marshallwilkinson.com>",
      to: [recipientEmail],
      subject: subject,
      html: html,
      replyTo: formData.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        id: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-form-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred sending the email",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
