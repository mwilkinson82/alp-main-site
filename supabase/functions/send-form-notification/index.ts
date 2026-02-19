import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email recipient
const RECIPIENT_EMAIL = "marshall@marshallwilkinson.com";

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
  companyName: string;
  annualRevenue: string;
  biggestChallenge: string;
  alreadyTried: string;
  serviceApplyingFor: string;
}

type FormData = ContactFormData | PricingFormData | AskMarshallFormData | AdvisoryApplicationFormData;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();
    console.log("Received form submission:", { formType: formData.formType, name: formData.name });

    // Validate form type
    if (!formData.formType || !['contact', 'pricing', 'ask-marshall', 'advisory-application'].includes(formData.formType)) {
      console.error("Invalid form type:", formData.formType);
      return new Response(
        JSON.stringify({ error: "Invalid form type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate required fields
    const isAskMarshall = formData.formType === 'ask-marshall';
    const isAdvisoryApplication = formData.formType === 'advisory-application';
    if (!formData.name || !formData.email || (!isAskMarshall && !isAdvisoryApplication && !(formData as any).message) || (isAskMarshall && !(formData as AskMarshallFormData).question) || (isAdvisoryApplication && !(formData as AdvisoryApplicationFormData).biggestChallenge)) {
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
      to: [RECIPIENT_EMAIL],
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
