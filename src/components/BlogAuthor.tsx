import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import marshallCasual from "@/assets/marshall-casual.jpg";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const BlogAuthor = () => {
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
        .insert({ email: result.data, source: "blog_post_subscribe" });

      if (dbError && dbError.code !== "23505") throw dbError;

      supabase.functions.invoke("send-form-notification", {
        body: { formType: "newsletter", email: result.data },
      }).catch((err) => console.error("Newsletter notification error:", err));

      setIsSuccess(true);
    } catch (err) {
      console.error("Blog subscribe error:", err);
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
    <div className="py-6 border-t border-b border-border my-8 space-y-5">
      {/* Author row */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={marshallCasual} alt="Marshall Wilkinson" className="object-cover" />
          <AvatarFallback>MW</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Written by</p>
          <p className="text-lg font-bold">Marshall Wilkinson</p>
          <p className="text-sm text-muted-foreground">
            Business Coach, Strategic Consultant & Founder of ALP
          </p>
        </div>
      </div>

      {/* Inline subscribe */}
      {!isSuccess ? (
        <div className="flex items-start gap-3 bg-muted/30 border border-border/50 rounded-lg p-4">
          <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 items-center justify-center mt-0.5">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2.5">
            <div>
              <p className="text-sm font-semibold text-foreground">Get insights like this in your inbox</p>
              <p className="text-xs text-muted-foreground">One email per week. No spam. Unsubscribe anytime.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-9 text-sm"
                disabled={isSubmitting}
                required
              />
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-gold hover:shadow-glow whitespace-nowrap h-9 px-4 text-xs font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-muted/30 border border-border/50 rounded-lg p-4">
          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-semibold text-foreground">You're in — next insight lands in your inbox soon.</p>
        </div>
      )}
    </div>
  );
};

export default BlogAuthor;
