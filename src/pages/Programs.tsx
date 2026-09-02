import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CIRCLE_CHECKOUT = "https://alpcontractorcircle.com";

const schools = [
  {
    number: "01",
    title: "Private Intensives",
    schedule: "Application only · Virtual",
    price: "Application only",
    thesis: "A focused working engagement for a defined operating problem, live evidence, and required decisions.",
    details: "Choose a 3-week or 6-week engagement based on the problem and depth of work required.",
    to: "/coaching",
    external: false,
  },
  {
    number: "02",
    title: "ALP Handbook",
    schedule: "Self-directed · Field doctrine",
    price: "$47",
    thesis: "Written doctrine for construction owners who need stronger structure, accountability, cash discipline, and command of the work.",
    details: "A practical reference for building the company behind the projects.",
    to: "https://alphandbook.com",
    external: true,
  },
];

const Programs = () => (
  <>
    <SEO title="ALP Programs — Contractor Circle and Private Intensives" description="Explore ALP Contractor Circle, private intensives, the ALP Handbook, and the replay library." canonical="/programs" />
    <main className="min-h-screen">
      <Header />
      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell py-20 md:py-28">
          <p className="alp-eyebrow">ALP programs</p>
          <h1 className="alp-display mt-7 max-w-6xl text-[clamp(4rem,8vw,8rem)]">One flagship. Focused work for construction owners.</h1>
          <p className="mt-9 max-w-3xl text-xl leading-relaxed text-muted-foreground">Contractor Circle is the center of the ALP work. Private intensives and the ALP Handbook provide focused access for owners who need a defined next move.</p>
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
              {schools.map((school) => {
                const content = (
                  <div className="grid gap-5 sm:grid-cols-[56px_1fr_auto] sm:items-start">
                    <span className="alp-number">{school.number}</span>
                    <div><div className="flex flex-wrap items-baseline gap-x-4 gap-y-2"><h3 className="text-3xl group-hover:text-accent">{school.title}</h3><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{school.schedule}</span></div><p className="mt-4 max-w-2xl text-lg leading-relaxed">{school.thesis}</p><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{school.details}</p></div>
                    <div className="flex items-center gap-3 text-sm font-semibold"><span>{school.price}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                );
                return school.external ? <a key={school.to} href={school.to} target="_blank" rel="noopener noreferrer" className="group block border-b border-border py-8">{content}</a> : <Link key={school.to} to={school.to} className="group block border-b border-border py-8">{content}</Link>;
              })}
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
