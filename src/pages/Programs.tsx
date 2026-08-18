import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CIRCLE_CHECKOUT = "https://buy.stripe.com/28EcN66xPcXk53GdXIeQM18";

const schools = [
  {
    number: "01",
    title: "Power Hour",
    schedule: "Monday–Friday · 8:00 AM EST",
    price: "$997/month",
    thesis: "Daily pressure for the entrepreneurial work that otherwise gets pushed behind the urgent jobsite noise.",
    details: "Decision-making, execution, accountability, leadership, business judgment, and the next move.",
    to: "/power-hour",
  },
  {
    number: "02",
    title: "Contractor School",
    schedule: "Tuesdays · 7:00 PM EST",
    price: "$497/month",
    thesis: "The machinations of running the construction work correctly—not the entrepreneurial owner work around it.",
    details: "Estimating, project controls, contracts, accounting, field management, cost, schedule, and commercial discipline.",
    to: "/contractor-school",
  },
  {
    number: "03",
    title: "Sales & Marketing School",
    schedule: "Wednesdays · 7:00 PM EST",
    price: "$497/month",
    thesis: "A working room for creating demand, controlling the sale, and converting attention into profitable work.",
    details: "Positioning, presentations, negotiation, closing, traffic, retargeting, follow-up, and lead generation.",
    to: "/sales-marketing-school",
  },
];

const Programs = () => (
  <>
    <SEO title="ALP Programs — Contractor Circle and Live Training" description="Explore ALP Contractor Circle, Power Hour, Contractor School, Sales and Marketing School, and the ALP replay library." canonical="/programs" />
    <main className="min-h-screen">
      <Header />
      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell py-20 md:py-28">
          <p className="alp-eyebrow">ALP programs</p>
          <h1 className="alp-display mt-7 max-w-6xl text-[clamp(4rem,8vw,8rem)]">One flagship. Three focused training rooms.</h1>
          <p className="mt-9 max-w-3xl text-xl leading-relaxed text-muted-foreground">Contractor Circle is the center of the ALP ecosystem. The schools remain available for owners and teams who need direct access to a specific operating discipline.</p>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/45">Flagship · Contractor Circle</p><h2 className="alp-display mt-5 text-5xl sm:text-7xl">Build the company behind the projects.</h2></div>
          <div>
            <p className="text-xl leading-relaxed text-background/65">A standing operating environment for construction owners: live working sessions, bootcamps, AOS, Ask Marshall, tools, templates, replays, and a private operator community.</p>
            <div className="mt-8 grid gap-3 text-sm text-background/65 sm:grid-cols-2">{["Owner-level operating work", "Full AOS access", "Live calls and bootcamps", "Tools, templates, and replays"].map((item) => <p key={item} className="border-t border-background/20 pt-3">{item}</p>)}</div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href={CIRCLE_CHECKOUT} className="inline-flex min-h-12 items-center justify-center gap-2 bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">Join · $497/month <ArrowRight className="h-4 w-4" /></a><Link to="/contractor-circle" className="inline-flex min-h-12 items-center justify-center border border-background/35 px-6 py-3 text-sm font-semibold hover:bg-background hover:text-foreground">Explore the Circle</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="alp-shell py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr]">
            <div><p className="alp-eyebrow">Focused access</p><h2 className="mt-5 text-4xl leading-tight md:text-5xl">Choose the room that matches the work.</h2></div>
            <div className="border-t border-foreground">
              {schools.map((school) => (
                <Link key={school.to} to={school.to} className="group block border-b border-border py-8">
                  <div className="grid gap-5 sm:grid-cols-[56px_1fr_auto] sm:items-start">
                    <span className="alp-number">{school.number}</span>
                    <div><div className="flex flex-wrap items-baseline gap-x-4 gap-y-2"><h3 className="text-3xl group-hover:text-accent">{school.title}</h3><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{school.schedule}</span></div><p className="mt-4 max-w-2xl text-lg leading-relaxed">{school.thesis}</p><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{school.details}</p></div>
                    <div className="flex items-center gap-3 text-sm font-semibold"><span>{school.price}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/55">
        <div className="alp-shell grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20"><div><p className="alp-eyebrow">Already a client?</p><h2 className="mt-4 text-4xl">Your class archive is still here.</h2><p className="mt-3 text-muted-foreground">Access Power Hour, Contractor School, and Sales & Marketing School replays.</p></div><Link to="/client-login" className="alp-button">Open the replay libraries <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
      <Footer />
    </main>
  </>
);

export default Programs;
