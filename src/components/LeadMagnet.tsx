import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const LeadMagnet = () => {
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
        .insert({ email: result.data, source: "lead_magnet" });

      if (dbError) {
        if (dbError.code === "23505") {
          // Duplicate email — still show success (don't reveal if email exists)
          setIsSuccess(true);
        } else {
          throw dbError;
        }
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Lead magnet submission error:", err);
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
    <section className="py-20 md:py-28 bg-foreground relative overflow-hidden">
      {/* Gold accent glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: "var(--gradient-gold-radial)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Eyebrow */}
          <span className="text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full uppercase">
            Free Resource
          </span>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-background leading-tight">
            Get the{" "}
            <span className="text-gradient-gold">ALP Framework</span>
          </h2>

          {/* Body */}
          <p className="text-lg text-background/70 leading-relaxed max-w-xl mx-auto">
            Download the core decision framework used in billion-dollar negotiations.
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
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-primary flex-1"
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="submit"
                  size="default"
                  className="bg-gradient-gold hover:shadow-glow hover-gold-edge whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Download the Framework"}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-xs text-background/40">
                No spam. One email with your download link.
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-lg font-semibold text-background">
                Check your inbox — the framework is on its way.
              </p>
              <p className="text-sm text-background/50">
                While you wait, explore the programs below.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
