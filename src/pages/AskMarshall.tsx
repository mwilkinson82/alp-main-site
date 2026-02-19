import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Upload, FileText, X, CheckCircle2, Clock, Video, MessageCircle, Shield } from "lucide-react";
import loomPreview from "@/assets/ask-marshall-loom-preview.png";
import askMarshallHero from "@/assets/ask-marshall-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STRIPE_ASK_MARSHALL = "https://buy.stripe.com/cNi4gA1dvbTg1Ru5rceQM0S";

const AskMarshall = () => {
  const [searchParams] = useSearchParams();
  const showForm = searchParams.has("email");
  const prefillName = searchParams.get("name") || "";
  const prefillEmail = searchParams.get("email") || "";

  return (
    <>
      <SEO
        title="Ask Marshall — Get a Personalized Video Answer | $250"
        description="Submit your toughest business question and get a personalized Loom video analysis from Marshall Wilkinson within 24 hours. No live call required."
        keywords="Ask Marshall, business advice, video consultation, Marshall Wilkinson, business question, expert analysis"
        canonical="/ask-marshall"
      />
      <main className="min-h-screen">
        <Header />
        {showForm ? (
          <SubmissionForm defaultName={prefillName} defaultEmail={prefillEmail} />
        ) : (
          <SalesLanding />
        )}
        <Footer />
      </main>
    </>
  );
};

/* ─── Sales / Landing State ─── */
const SalesLanding = () => (
  <>
    {/* Hero Image */}
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-muted">
      <img
        src={askMarshallHero}
        alt="Marshall Wilkinson reviewing business documents at his desk"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
    </section>

    {/* Hero */}
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">New — Async Expert Analysis</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Get Systems-Level Clarity on Your Toughest Decision.{" "}
            <span className="text-gradient-gold">On Demand.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Submit your toughest business question with all the details, and receive a direct systems-level breakdown from Marshall within 24 hours. No live call required.
          </p>
          <div className="max-w-3xl mx-auto w-full rounded-xl overflow-hidden shadow-xl">
            <img
              src={loomPreview}
              alt="Marshall Wilkinson video analysis preview"
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" variant="premium" className="text-lg px-10 h-14 gap-2" asChild>
              <a href={STRIPE_ASK_MARSHALL} target="_blank" rel="noopener noreferrer">
                Submit My Question — $250
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">24-hour delivery guaranteed. If not, your fee is refunded.</p>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Three simple steps to expert-level clarity</p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", icon: Shield, title: "Pay & Unlock", desc: "Complete your $250 payment securely through Stripe. You'll receive an email with a link to submit your question." },
              { step: "2", icon: FileText, title: "Submit Your Question", desc: "Fill out the form with your question, context, and any supporting documents. The more detail, the better the analysis." },
              { step: "3", icon: Video, title: "Receive Your Video", desc: "Within 24 hours, Marshall sends you a personalized Loom video walking through his analysis, recommendations, and action steps." },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Value Props */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Why <span className="text-gradient-gold">Ask Marshall</span>?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Clock, title: "24-Hour Turnaround", desc: "No scheduling back-and-forth. Submit your question and get a thorough video response within one business day." },
              { icon: Video, title: "Personalized Video Analysis", desc: "Not a canned response. Marshall records a custom Loom video walking through your specific situation with actionable guidance." },
              { icon: MessageCircle, title: "No Live Call Required", desc: "Perfect if you're not ready for a 1-on-1 session. Get expert-level analysis on your own terms, at your own pace." },
              { icon: FileText, title: "Upload Your Documents", desc: "Share contracts, financials, proposals, or any supporting files so Marshall can give you the most informed analysis possible." },
            ].map((item, i) => (
              <Card key={i} className="glass-card hover-lift">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Who It's For */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Perfect For You If…</h2>
          <ul className="text-left space-y-4 text-lg">
            {[
              "You have a specific business question that's been keeping you up at night",
              "You're not ready to commit to a full coaching engagement — but you need expert input",
              "You want Marshall's perspective on a deal, a hire, a pricing decision, or a strategy shift",
              "You prefer async communication over live calls",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" variant="premium" className="text-lg px-10 h-14 gap-2" asChild>
              <a href={STRIPE_ASK_MARSHALL} target="_blank" rel="noopener noreferrer">
                Submit My Question — $250
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">24-hour delivery guaranteed. If not, your fee is refunded.</p>
          </div>
        </div>
      </div>
    </section>
  </>
);

/* ─── Submission Form State ─── */
const SubmissionForm = ({ defaultName, defaultEmail }: { defaultName: string; defaultEmail: string }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (oversized.length > 0) {
      toast({
        title: "File too large",
        description: `Files must be under ${MAX_FILE_SIZE_MB}MB. For larger files, paste a Dropbox or Google Drive link in the question or context field.`,
        variant: "destructive",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const total = files.length + selected.length;
    if (total > MAX_FILES) {
      toast({ title: `Maximum ${MAX_FILES} files allowed`, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !question.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      // Upload files
      const fileUrls: string[] = [];
      for (const file of files) {
        const path = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("ask-marshall-files")
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("ask-marshall-files")
          .getPublicUrl(path);
        fileUrls.push(urlData.publicUrl);
      }

      // Insert submission
      const { error: insertError } = await supabase
        .from("ask_marshall_submissions" as any)
        .insert({
          customer_name: name.trim(),
          customer_email: email.trim(),
          question: question.trim(),
          context: context.trim() || null,
          file_urls: fileUrls.length > 0 ? fileUrls : null,
        } as any);
      if (insertError) throw insertError;

      // Notify Marshall via edge function
      await supabase.functions.invoke("send-form-notification", {
        body: {
          formType: "ask-marshall",
          name: name.trim(),
          email: email.trim(),
          question: question.trim(),
          context: context.trim(),
          fileUrls,
        },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      toast({ title: "Something went wrong. Please try again.", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold">Question Submitted!</h1>
            <p className="text-xl text-muted-foreground">
              Marshall will review your question and supporting materials, and you'll receive a personalized video response at <strong>{email}</strong> within 24 hours.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Submit Your <span className="text-gradient-gold">Question</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Be as detailed as possible — the more context Marshall has, the better his analysis will be.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required maxLength={255} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Your Question *</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's the one thing you need Marshall's perspective on?"
                className="min-h-[100px]"
                required
                maxLength={2000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Background info, constraints, numbers, what you've already tried…"
                className="min-h-[150px]"
                maxLength={5000}
              />
            </div>

            {/* File upload */}
            <div className="space-y-3">
              <Label>Supporting Documents (up to {MAX_FILES} files)</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload files (PDFs, spreadsheets, images, docs)</p>
                <p className="text-xs text-muted-foreground mt-1">Max {MAX_FILE_SIZE_MB}MB per file · For larger files, paste a Dropbox or Google Drive link above</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
                />
              </div>
              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button type="submit" size="lg" variant="premium" className="w-full h-14 text-lg gap-2" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Your Question"}
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AskMarshall;
