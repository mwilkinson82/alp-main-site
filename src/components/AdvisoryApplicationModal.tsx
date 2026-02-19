import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  company_name: z.string().trim().min(1, "Please enter your company name").max(100),
  annual_revenue: z.string().min(1, "Please select a revenue range"),
  biggest_challenge: z.string().trim().min(20, "Please describe your challenge in a bit more detail").max(2000),
  already_tried: z.string().trim().min(10, "Please share what you've already tried").max(2000),
  service_applying_for: z.string().min(1, "Please select which option you're applying for"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

type FormValues = z.infer<typeof schema>;

interface AdvisoryApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: "Strategy Session — $1,000" | "Private Advisory — $5,000";
}

const AdvisoryApplicationModal = ({ open, onOpenChange, defaultService }: AdvisoryApplicationModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_applying_for: defaultService || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Save to database
      const { error: dbError } = await supabase
        .from("advisory_applications" as any)
        .insert({
          full_name: data.full_name,
          company_name: data.company_name,
          annual_revenue: data.annual_revenue,
          biggest_challenge: data.biggest_challenge,
          already_tried: data.already_tried,
          service_applying_for: data.service_applying_for,
          email: data.email,
        });

      if (dbError) throw dbError;

      // 2. Send email notification to Marshall
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      await fetch(`${SUPABASE_URL}/functions/v1/send-form-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          formType: "advisory-application",
          name: data.full_name,
          email: data.email,
          companyName: data.company_name,
          annualRevenue: data.annual_revenue,
          biggestChallenge: data.biggest_challenge,
          alreadyTried: data.already_tried,
          serviceApplyingFor: data.service_applying_for,
        }),
      });

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Application submission error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email Marshall directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSubmitted(false);
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Application Received</DialogTitle>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              Marshall reviews every application personally. If there's a fit, you'll hear back within 48 hours.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold">Apply for Advisory Access</DialogTitle>
              <DialogDescription className="text-base">
                Marshall reviews every application. Complete all fields honestly — this is how he determines fit.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" {...register("full_name")} placeholder="John Smith" />
                {errors.full_name && <p className="text-destructive text-xs">{errors.full_name.message}</p>}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input id="company_name" {...register("company_name")} placeholder="Acme Corp" />
                {errors.company_name && <p className="text-destructive text-xs">{errors.company_name.message}</p>}
              </div>

              {/* Annual Revenue */}
              <div className="space-y-1.5">
                <Label>Annual Revenue Range *</Label>
                <Select
                  defaultValue={watch("annual_revenue")}
                  onValueChange={(val) => setValue("annual_revenue", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $500K">Under $500K</SelectItem>
                    <SelectItem value="$500K–$2M">$500K–$2M</SelectItem>
                    <SelectItem value="$2M–$10M">$2M–$10M</SelectItem>
                    <SelectItem value="$10M+">$10M+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.annual_revenue && <p className="text-destructive text-xs">{errors.annual_revenue.message}</p>}
              </div>

              {/* Biggest Challenge */}
              <div className="space-y-1.5">
                <Label htmlFor="biggest_challenge">Biggest Business Challenge Right Now *</Label>
                <Textarea
                  id="biggest_challenge"
                  {...register("biggest_challenge")}
                  placeholder="Be specific. What's the problem keeping you up at night?"
                  className="min-h-[100px]"
                />
                {errors.biggest_challenge && <p className="text-destructive text-xs">{errors.biggest_challenge.message}</p>}
              </div>

              {/* Already Tried */}
              <div className="space-y-1.5">
                <Label htmlFor="already_tried">What Have You Already Tried? *</Label>
                <Textarea
                  id="already_tried"
                  {...register("already_tried")}
                  placeholder="What approaches, programs, or strategies have you already attempted?"
                  className="min-h-[90px]"
                />
                {errors.already_tried && <p className="text-destructive text-xs">{errors.already_tried.message}</p>}
              </div>

              {/* Service Applying For */}
              <div className="space-y-1.5">
                <Label>Which Option Are You Applying For? *</Label>
                <Select
                  defaultValue={watch("service_applying_for")}
                  onValueChange={(val) => setValue("service_applying_for", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategy Session — $1,000">Strategy Session — $1,000</SelectItem>
                    <SelectItem value="Private Advisory — $5,000">Private Advisory — $5,000</SelectItem>
                  </SelectContent>
                </Select>
                {errors.service_applying_for && <p className="text-destructive text-xs">{errors.service_applying_for.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" {...register("email")} placeholder="you@company.com" />
                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                variant="premium"
                size="lg"
                className="w-full gap-2 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Marshall reviews every application personally. No spam, no sales calls.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdvisoryApplicationModal;
