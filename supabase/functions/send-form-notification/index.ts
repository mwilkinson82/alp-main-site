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

type FormData = ContactFormData | PricingFormData;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();
    console.log("Received form submission:", { formType: formData.formType, name: formData.name });

    // Validate form type
    if (!formData.formType || !['contact', 'pricing'].includes(formData.formType)) {
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
    if (!formData.name || !formData.email || !formData.message) {
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

    if (formData.formType === 'contact') {
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
