import { useId, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const initialForm = {
  name: "",
  email: "",
  companyName: "",
  productName: "",
  companyUrl: "",
  campaignObjective: "",
  intendedDeliverables: "",
  campaignBudget: "",
  organicUsage: "",
  paidUsageRequirements: "",
  whitelistingRequirements: "",
  exclusivityTerms: "",
  timeline: "",
  productAccess: "",
  contractorRelevance: "",
  engagementType: "",
};

const PartnershipApplicationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [standardsAccepted, setStandardsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof initialForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!standardsAccepted) {
      toast({ title: "Confirm the partnership standard", description: "Please confirm that you understand ALP's evaluation and substantiation requirements.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-form-notification", {
        body: { formType: "partnership", ...formData },
      });
      if (error) throw error;

      setSubmitted(true);
      setFormData(initialForm);
      setStandardsAccepted(false);
    } catch (error) {
      console.error("Partnership inquiry submission failed:", error);
      toast({ title: "Inquiry not sent", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-background">
        <div className="alp-narrow py-24 text-center md:py-32">
          <CheckCircle className="mx-auto h-12 w-12 text-accent" />
          <p className="alp-eyebrow mt-7">Inquiry received</p>
          <h2 className="alp-display mt-5 text-5xl sm:text-6xl">ALP will review the fit.</h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">If the audience, product, campaign, and standards align, the partnership team will respond with the appropriate next step. This is not an automated booking request.</p>
          <button type="button" onClick={() => setSubmitted(false)} className="alp-link mt-8">Submit another inquiry</button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background" id="partnership-inquiry">
      <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.62fr_1.38fr]">
        <div>
          <p className="alp-eyebrow">Partnership qualification</p>
          <h2 className="alp-display mt-5 text-5xl sm:text-6xl">Put the actual opportunity on the table.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">No rates are published and no deliverable can be purchased from this page. Give ALP enough information to evaluate the product, business case, usage rights, and strategic fit.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 border-t border-foreground pt-8" aria-label="Strategic brand partnership qualification form">
          <fieldset className="grid gap-6">
            <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.15em]">Company and contact</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your name" id="partner-name"><Input id="partner-name" value={formData.name} onChange={(event) => update("name", event.target.value)} required /></Field>
              <Field label="Work email" id="partner-email"><Input id="partner-email" type="email" value={formData.email} onChange={(event) => update("email", event.target.value)} required /></Field>
              <Field label="Company" id="partner-company"><Input id="partner-company" value={formData.companyName} onChange={(event) => update("companyName", event.target.value)} required /></Field>
              <Field label="Product or service" id="partner-product"><Input id="partner-product" value={formData.productName} onChange={(event) => update("productName", event.target.value)} required /></Field>
            </div>
            <Field label="Company or product URL" id="partner-url"><Input id="partner-url" type="url" placeholder="https://" value={formData.companyUrl} onChange={(event) => update("companyUrl", event.target.value)} required /></Field>
          </fieldset>

          <fieldset className="grid gap-6 border-t border-border pt-8">
            <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.15em]">Campaign scope</legend>
            <Field label="Campaign objective" id="partner-objective"><Textarea id="partner-objective" rows={4} placeholder="What must this campaign accomplish?" value={formData.campaignObjective} onChange={(event) => update("campaignObjective", event.target.value)} required /></Field>
            <Field label="Intended deliverables" id="partner-deliverables"><Textarea id="partner-deliverables" rows={4} placeholder="Describe the content, channels, quantities, events, or education you have in mind." value={formData.intendedDeliverables} onChange={(event) => update("intendedDeliverables", event.target.value)} required /></Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField label="Campaign budget" value={formData.campaignBudget} onValueChange={(value) => update("campaignBudget", value)} options={["Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000–$100,000", "$100,000+", "Not yet established"]} />
              <SelectField label="What are you seeking?" value={formData.engagementType} onValueChange={(value) => update("engagementType", value)} options={["Content partnership", "Product advisory", "Content and advisory—separately scoped"]} />
            </div>
            <Field label="Timeline" id="partner-timeline"><Input id="partner-timeline" placeholder="Key dates, launch date, and approval window" value={formData.timeline} onChange={(event) => update("timeline", event.target.value)} required /></Field>
          </fieldset>

          <fieldset className="grid gap-6 border-t border-border pt-8">
            <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.15em]">Usage and commercial terms</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField label="Organic usage requirements" value={formData.organicUsage} onValueChange={(value) => update("organicUsage", value)} options={["ALP channels only", "Brand organic channels requested", "Both—details below", "Not yet determined"]} />
              <SelectField label="Whitelisting or partnership ads" value={formData.whitelistingRequirements} onValueChange={(value) => update("whitelistingRequirements", value)} options={["Not required", "Whitelisting requested", "Partnership ads requested", "Both requested", "Not yet determined"]} />
            </div>
            <Field label="Paid-media usage requirements" id="partner-paid-usage"><Textarea id="partner-paid-usage" rows={3} placeholder="Channels, geography, term, edits, cutdowns, and any requested paid usage." value={formData.paidUsageRequirements} onChange={(event) => update("paidUsageRequirements", event.target.value)} required /></Field>
            <Field label="Exclusivity terms" id="partner-exclusivity"><Textarea id="partner-exclusivity" rows={3} placeholder="Category, competitors, geography, and requested duration. Enter None if not required." value={formData.exclusivityTerms} onChange={(event) => update("exclusivityTerms", event.target.value)} required /></Field>
          </fieldset>

          <fieldset className="grid gap-6 border-t border-border pt-8">
            <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.15em]">Product fit</legend>
            <SelectField label="Will product access or a trial be provided?" value={formData.productAccess} onValueChange={(value) => update("productAccess", value)} options={["Yes—full product access", "Yes—limited trial or sample", "No", "To be determined"]} />
            <Field label="Why is this product relevant to contractors?" id="partner-relevance"><Textarea id="partner-relevance" rows={5} placeholder="Explain the contractor problem, operating benefit, and evidence supporting the claim." value={formData.contractorRelevance} onChange={(event) => update("contractorRelevance", event.target.value)} required /></Field>
          </fieldset>

          <div className="flex items-start gap-3 border-t border-border pt-7">
            <Checkbox id="partner-standards" checked={standardsAccepted} onCheckedChange={(value) => setStandardsAccepted(value === true)} />
            <Label htmlFor="partner-standards" className="text-sm font-normal leading-relaxed text-muted-foreground">I understand that ALP evaluates products before endorsement, will not make scripted claims it cannot independently substantiate, and scopes product advisory separately from campaign deliverables.</Label>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">Submitting this form does not create a booking, endorsement, exclusivity obligation, or partnership agreement.</p>
            <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : <>Submit for review <ArrowRight className="h-4 w-4" /></>}</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

const Field = ({ label, id, children }: { label: string; id: string; children: ReactNode }) => (
  <div className="space-y-2"><Label htmlFor={id}>{label} *</Label>{children}</div>
);

const SelectField = ({ label, value, onValueChange, options }: { label: string; value: string; onValueChange: (value: string) => void; options: string[] }) => {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} *</Label>
      <Select value={value} onValueChange={onValueChange} required>
        <SelectTrigger id={id}><SelectValue placeholder="Select one" /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
};

export default PartnershipApplicationForm;
