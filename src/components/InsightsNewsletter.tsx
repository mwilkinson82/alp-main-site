import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const InsightsNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase
        .from("email_subscribers")
        .insert({ email: result.data, source: "insights_newsletter" });

      if (dbError) {
        if (dbError.code === "23505") {
          // Duplicate — still show success
          setIsSuccess(true);
        } else {
          throw dbError;
        }
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Newsletter signup error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-14 md:py-20 bg-muted/20 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Eyebrow */}
          <span className="text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full uppercase">
            ALP Insights — Weekly
          </span>

          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-bold leading-tight">
            Get the Insights{" "}
            <span className="text-gradient-gold">Delivered to Your Inbox</span>
          </h2>

          {/* Body */}
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Decision frameworks, execution breakdowns, and strategic thinking — direct from Marshall. No noise. One email. Every week.
          </p>

          {/* Form */}
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-gold hover:shadow-glow hover-gold-edge whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Get the Insights"}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-xs text-muted-foreground/60">
                No spam. Unsubscribe any time.
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="h-10 w-10 text-primary" />
              <p className="text-lg font-semibold text-foreground">
                You're in. First insight arrives soon.
              </p>
              <p className="text-sm text-muted-foreground">
                In the meantime, explore the latest articles below.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InsightsNewsletter;
