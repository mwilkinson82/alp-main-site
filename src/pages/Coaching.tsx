import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import AdvisoryApplicationModal from "@/components/AdvisoryApplicationModal";
import marshallHeroProfile from "@/assets/marshall-hero-profile.jpg";

type Intensive = "Three-Week Sprint — $5,000" | "Six-Week Installation — $10,000";

const engagements: Array<{
  name: Intensive;
  eyebrow: string;
  price: string;
  duration: string;
  purpose: string;
  outcomes: string[];
}> = [
  {
    name: "Three-Week Sprint — $5,000",
    eyebrow: "Focused intervention",
    price: "$5,000",
    duration: "3 sessions",
    purpose: "For one expensive problem that needs diagnosis, decisions, installation, and a clean handoff—not an open-ended coaching relationship.",
    outcomes: ["Defined problem and success condition", "Three private working sessions", "Live evidence review and decision support", "Written next moves, owners, and deadlines", "Session recordings and working materials"],
  },
  {
    name: "Six-Week Installation — $10,000",
    eyebrow: "Operating reset",
    price: "$10,000",
    duration: "6 sessions",
    purpose: "For a deeper operating problem that crosses people, process, financial control, leadership, or execution and requires implementation over time.",
    outcomes: ["Structural diagnosis across the business", "Six private working sessions", "Between-session decision access", "Operating cadence and accountability design", "Implementation inspection and final handoff"],
  },
];

const Coaching = () => {
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [selectedIntensive, setSelectedIntensive] = useState<Intensive>("Three-Week Sprint — $5,000");

  const applyFor = (intensive: Intensive) => {
    setSelectedIntensive(intensive);
    setApplicationOpen(true);
  };

  return (
    <>
      <SEO title="Private Advisory with Marshall Wilkinson" description="Apply for the Three-Week Sprint ($5,000) or the Six-Week Installation ($10,000) with Marshall Wilkinson." keywords="Marshall Wilkinson private advisory, Three-Week Sprint, Six-Week Installation, construction business advisory" canonical="/coaching" />
      <StructuredData type="service" data={{ serviceType: "Private business intensive", description: "Application-only private operating intensives with Marshall Wilkinson", price: "5000", offers: { "@type": "AggregateOffer", lowPrice: "5000", highPrice: "10000", priceCurrency: "USD" } }} />
      <main className="min-h-screen">
        <Header />
        <section className="border-b border-border pt-[72px]">
          <div className="alp-shell grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center py-20 pr-0 md:py-28 lg:border-r lg:border-border lg:pr-14">
              <p className="alp-eyebrow">Application-only private work</p>
              <h1 className="alp-display mt-7 text-[clamp(4rem,7vw,7.5rem)]">Come in with the real problem.</h1>
              <p className="alp-italic mt-5 text-3xl text-accent">Leave with the company able to carry the answer.</p>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">These are tightly scoped working engagements for owners facing a decision, operating constraint, leadership failure, or commercial problem expensive enough to require direct attention.</p>
            </div>
            <div className="relative min-h-[480px] bg-foreground"><img src={marshallHeroProfile} alt="Marshall Wilkinson, founder of Altitude Logic Pressure" className="absolute inset-0 h-full w-full object-cover object-top grayscale-[0.25]" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><p className="absolute inset-x-8 bottom-8 border-t border-white/35 pt-4 text-sm text-white/70">Private. Direct. Built around live evidence and required decisions.</p></div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/55">
          <div className="alp-shell py-16 md:py-20"><p className="alp-eyebrow">The rule</p><p className="mt-5 max-w-5xl text-3xl leading-tight tracking-[-0.035em] md:text-5xl">No vague “business coaching.” The engagement starts with a defined problem, a hard time box, and a result that can be verified.</p></div>
        </section>

        <section className="border-b border-border" id="intensives">
          <div className="alp-shell py-20 md:py-28">
            <div className="grid gap-8 lg:grid-cols-2">
              {engagements.map((engagement, index) => (
                <article key={engagement.name} className={`flex flex-col border border-border p-7 sm:p-10 ${index === 1 ? "bg-foreground text-background" : "bg-card"}`}>
                  <div className={`flex items-center justify-between border-b pb-6 ${index === 1 ? "border-background/20" : "border-border"}`}><p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${index === 1 ? "text-background/45" : "text-muted-foreground"}`}>{engagement.eyebrow}</p><span className={`alp-italic text-lg ${index === 1 ? "text-background/35" : "text-muted-foreground"}`}>0{index + 1}</span></div>
                  <h2 className="mt-8 text-4xl">{engagement.name.split(" — ")[0]}</h2>
                  <div className="mt-4 flex items-baseline gap-3"><span className="text-5xl tracking-[-0.05em]">{engagement.price}</span><span className={index === 1 ? "text-background/50" : "text-muted-foreground"}>/ {engagement.duration}</span></div>
                  <p className={`mt-7 text-lg leading-relaxed ${index === 1 ? "text-background/65" : "text-muted-foreground"}`}>{engagement.purpose}</p>
                  <ul className={`mt-8 grid gap-3 border-t pt-6 text-sm ${index === 1 ? "border-background/20 text-background/75" : "border-border"}`}>{engagement.outcomes.map((outcome) => <li key={outcome} className="flex gap-3"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${index === 1 ? "text-background" : "text-accent"}`} />{outcome}</li>)}</ul>
                  <button type="button" onClick={() => applyFor(engagement.name)} className={`mt-10 inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold ${index === 1 ? "bg-background text-foreground hover:bg-secondary" : "bg-foreground text-background hover:bg-accent"}`}>Apply for this intensive <ArrowRight className="h-4 w-4" /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/55">
          <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.7fr_1.3fr]">
            <div><p className="alp-eyebrow">How it works</p><h2 className="mt-5 text-4xl leading-tight md:text-5xl">Application first. Scope before access.</h2></div>
            <div className="grid gap-7 sm:grid-cols-3">{[["01", "Apply", "Name the business, the problem, what you have tried, and the intensive you want."], ["02", "Review", "Marshall reviews the evidence and determines whether the issue and engagement are a fit."], ["03", "Work", "If accepted, the work begins with the problem, required decisions, and success condition already visible."]].map(([number, title, copy]) => <div key={number} className="border-t border-foreground pt-5"><span className="alp-number">{number}</span><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p></div>)}</div>
          </div>
        </section>

        <section className="bg-foreground text-background"><div className="alp-shell grid gap-9 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-24"><div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/45">Ready to put the real issue on the table?</p><h2 className="alp-display mt-5 max-w-4xl text-5xl sm:text-6xl">Apply for the engagement that matches the work.</h2></div><button type="button" onClick={() => applyFor("Six-Week Installation — $10,000")} className="inline-flex min-h-12 items-center justify-center gap-2 bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">Start the application <ArrowRight className="h-4 w-4" /></button></div></section>
        <Footer />
        <AdvisoryApplicationModal open={applicationOpen} onOpenChange={setApplicationOpen} defaultService={selectedIntensive} />
      </main>
    </>
  );
};

export default Coaching;
