import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  heading?: string;
  description?: string;
  defaultCategory?: string;
  lockCategory?: boolean;
}

const ContactForm = ({
  heading = "Get in touch.",
  description = "Tell us what you are working on and why ALP is relevant.",
  defaultCategory = "",
  lockCategory = false,
}: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", category: defaultCategory, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-form-notification", {
        body: { formType: "contact", ...formData },
      });
      if (error) throw error;

      toast({ title: "Message received", description: "ALP will review the opportunity and respond if there is a fit." });
      setFormData({ name: "", email: "", category: defaultCategory, message: "" });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      toast({ title: "Message not sent", description: "Please try again or email Marshall directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background">
      <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="alp-eyebrow">Contact ALP</p>
          <h2 className="alp-display mt-5 text-5xl sm:text-6xl">{heading}</h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">{description}</p>
          <a href="mailto:marshall@marshallwilkinson.com" className="alp-link mt-8">marshall@marshallwilkinson.com</a>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 border-t border-foreground pt-7" aria-label="Contact form">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="contact-name">Name *</Label><Input id="contact-name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="contact-email">Email *</Label><Input id="contact-email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required /></div>
          </div>

          {!lockCategory && (
            <div className="space-y-2">
              <Label htmlFor="contact-category">Reason for reaching out *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                <SelectTrigger id="contact-category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor-circle">Contractor Circle</SelectItem>
                  <SelectItem value="private-intensive">Private intensives</SelectItem>
                  <SelectItem value="partnerships">Partnerships</SelectItem>
                  <SelectItem value="speaking">Speaking and events</SelectItem>
                  <SelectItem value="media">Media inquiry</SelectItem>
                  <SelectItem value="general">General question</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2"><Label htmlFor="contact-message">Tell us what you have in mind *</Label><Textarea id="contact-message" rows={7} placeholder="The opportunity, the audience, the outcome, and why ALP is relevant..." value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required /></div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">We review every serious inquiry. A clear proposal gets a clearer answer.</p>
            <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send inquiry"}<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
