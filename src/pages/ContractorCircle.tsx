import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CHECKOUT_URL = "https://buy.stripe.com/28EcN66xPcXk53GdXIeQM18";

const included = [
  ["Live owner calls", "Bring the real decision, constraint, or pressure point in your company this week. Leave with a move."],
  ["Implementation bootcamps", "Install one operating system at a time—inside the company, with owners and evidence."],
  ["AOS access", "Unlimited workspaces and seats for the augmented operating system the Circle teaches from."],
  ["Ask Marshall", "Direct owner-level guidance on bids, hires, partners, banks, risk, and decisions you cannot afford to drift on."],
  ["Replay and tool library", "Search the calls, templates, documents, and operating tools when the issue appears in your business."],
  ["Operator community", "A private room of construction owners doing the work, without gurus, spectators, or posturing."],
];

const ContractorCircle = () => (
  <>
    <SEO title="ALP Contractor Circle — Operating Environment for Construction Owners" description="Contractor Circle gives serious construction owners live calls, bootcamps, AOS, tools, templates, replays, and a private operator community." canonical="/contractor-circle" />
    <main className="min-h-screen">
      <Header />
      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell py-20 md:py-28 lg:py-36">
          <p className="alp-eyebrow">ALP Contractor Circle · Flagship program</p>
          <h1 className="alp-display mt-8 max-w-6xl text-[clamp(4rem,9vw,9rem)]">Build the company <span className="alp-italic text-accent">behind the projects.</span></h1>
          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">The project is not the business. The company is. Contractor Circle is the standing operating environment for construction owners who are done running everything through themselves.</p>
            <div className="flex flex-col gap-3 md:items-end"><a href={CHECKOUT_URL} className="alp-button">Join the Circle · $497/month <ArrowRight className="h-4 w-4" /></a><Link to="/client-login" className="text-sm underline underline-offset-4">Already a client? Access replays</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell grid gap-8 py-14 md:grid-cols-3 md:py-20">
          {[
            "Growth does not fix disorder.",
            "The owner cannot remain the routing layer for the entire company.",
            "Not theory. Field-tested operating doctrine.",
          ].map((statement, index) => <div key={statement} className="border-t border-background/25 pt-5"><span className="alp-italic text-background/35">0{index + 1}</span><p className="mt-4 text-2xl leading-tight">{statement}</p></div>)}
        </div>
      </section>

      <section className="border-b border-border">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="alp-eyebrow">What it is</p><h2 className="mt-5 text-4xl leading-tight md:text-5xl">A working environment for owner-level execution.</h2><p className="alp-italic mt-6 text-2xl text-accent">Not a stack of videos you mean to watch later.</p></div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {included.map(([title, copy], index) => <div key={title} className="border-t border-border pt-5"><div className="flex items-baseline gap-3"><span className="alp-number">0{index + 1}</span><h3 className="text-xl">{title}</h3></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/55">
        <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div><p className="alp-eyebrow">Who belongs here</p><h2 className="alp-display mt-5 text-5xl sm:text-6xl">Owners carrying too much of the company in their own head.</h2></div>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            {["You run a construction business doing real work and real volume.", "Decisions, money, exceptions, and people still flow back through you.", "You are done collecting generic business content and ready to install systems.", "You want operators who will challenge the work, not applaud the idea."].map((line) => <div key={line} className="flex gap-3 border-t border-border pt-4"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" /><span>{line}</span></div>)}
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="alp-shell grid gap-10 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-28">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/45">Circle membership</p><h2 className="alp-display mt-5 max-w-4xl text-5xl sm:text-7xl">Stop being the operating system.</h2><p className="mt-6 max-w-2xl text-lg text-background/60">Live calls, bootcamps, replays, templates, tools, community, and full AOS access with unlimited workspaces and seats.</p></div>
          <div className="md:text-right"><p className="text-5xl tracking-[-0.05em]">$497<span className="text-lg text-background/50">/month</span></p><a href={CHECKOUT_URL} className="mt-6 inline-flex min-h-12 items-center gap-2 bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">Join the Circle <ArrowRight className="h-4 w-4" /></a></div>
        </div>
      </section>
      <Footer />
    </main>
  </>
);

export default ContractorCircle;
