import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import marshallOffice from "@/assets/marshall-office.jpg";
import marshallHeroProfile from "@/assets/marshall-hero-profile.jpg";
import marginCrumble from "@/assets/margin-crumble.mp4";
import { useEffect, useRef } from "react";

const CIRCLE_CHECKOUT = "https://alpcontractorcircle.com";

const circleIncludes = [
  "Live owner calls and working sessions",
  "Monthly implementation bootcamps",
  "AOS with unlimited workspaces and seats",
  "Ask Marshall, templates, tools, and replays",
  "A private community of construction operators",
];

const supportingPrograms = [
  {
    number: "01",
    title: "Private Intensives",
    format: "Application only · Virtual",
    copy: "Short, hard-working engagements built around a defined operating problem, live evidence, and the decisions the company has been avoiding.",
    price: "From $5,000",
    to: "/coaching",
    external: false,
  },
  {
    number: "02",
    title: "ALP Handbook",
    format: "Self-directed · Field doctrine",
    copy: "The written operating doctrine for construction owners—structure, accountability, cash discipline, and command of the work.",
    price: "$47",
    to: "https://alphandbook.com",
    external: true,
  },
];


const SilentLoopVideo = ({ src, poster, className, label }: { src: string; poster?: string; className?: string; label: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (mediaQuery.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        void video.play().catch(() => undefined);
      }
    };

    syncPlayback();
    mediaQuery.addEventListener("change", syncPlayback);
    return () => mediaQuery.removeEventListener("change", syncPlayback);
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

const Index = () => (
  <>
    <SEO
      title="ALP — Build the Company Behind the Projects"
      description="Altitude Logic Pressure helps construction owners build the operating company behind the work. Explore ALP Contractor Circle, live training, and private intensives with Marshall Wilkinson."
      keywords="Altitude Logic Pressure, ALP Contractor Circle, construction owners, operating doctrine, Marshall Wilkinson"
      canonical="/"

    />
    <StructuredData type="organization" />
    <main className="min-h-screen overflow-hidden">
      <Header />

      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell grid min-h-[calc(100vh-72px)] lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="flex flex-col justify-between py-14 pr-0 sm:py-20 lg:min-h-[calc(100vh-72px)] lg:border-r lg:border-border lg:py-24 lg:pr-12">
            <p className="alp-eyebrow">Altitude Logic Pressure · Built for construction owners</p>
            <div className="my-14 max-w-4xl lg:my-20">
              <h1 className="alp-display text-[clamp(4rem,7.2vw,7.7rem)]">
                The project is not the business.
                <span className="alp-italic mt-3 block text-accent">The company is.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                ALP gives serious construction owners the operating doctrine, working environment, and direct pressure required to build a company that can perform without routing every decision back through the owner.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/contractor-circle" className="alp-button">
                  Explore Contractor Circle <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/client-login" className="alp-button-outline">Access class replays</Link>
              </div>
            </div>
            <div className="grid gap-4 border-t border-border pt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-3">
              <span>Operating systems</span><span>Owner-level execution</span><span>Commercial command</span>
            </div>
          </div>

          <div className="py-8 lg:py-16 lg:pl-12">
            <div className="relative aspect-video overflow-hidden bg-foreground">
              <img
                src={marshallHeroProfile}
                alt="Marshall Wilkinson, founder of Altitude Logic Pressure"
                className="h-full w-full object-cover object-top saturate-[0.9]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

              <div className="absolute inset-x-6 bottom-6 border-t border-white/35 pt-4 text-white sm:inset-x-8 sm:bottom-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Marshall Wilkinson · Founder, ALP</p>
                <p className="mt-2 max-w-lg text-lg leading-snug sm:text-xl">The operating problem becomes the work—in the room, with the evidence visible.</p>
              </div>
            </div>
            <div className="grid gap-3 border-x border-b border-border px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-3 sm:px-7">
              <span>Diagnose clearly</span><span>Decide directly</span><span>Install the mechanism</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="aspect-video overflow-hidden border border-background/15 bg-black">
              <SilentLoopVideo
                src={marginCrumble}
                className="h-full w-full object-cover"
                label="The word margin built from cinder blocks collapsing into rubble"
              />
            </div>
            <div className="lg:pl-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-background/45">The commercial consequence</p>
              <h2 className="mt-5 max-w-xl text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl">Margin rarely disappears in one event.</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/62">It crumbles through late decisions, weak commitments, invisible exposure, owner bottlenecks, and work nobody truly owns. ALP makes the pressure visible before the structure gives way.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-5 border-t border-background/20 pt-6 text-sm text-background/58 md:grid-cols-3">
            <span>Growth does not fix disorder.</span>
            <span>If everything flows back to the owner, the owner is still the operating system.</span>
            <span>Not motivation. Command.</span>
          </div>
        </div>
      </section>

      <section className="border-b border-border" id="circle">
        <div className="alp-shell py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="alp-eyebrow">The flagship program</p>
              <h2 className="alp-display mt-5 text-5xl sm:text-6xl lg:text-7xl">ALP Contractor Circle</h2>
              <p className="alp-italic mt-6 text-2xl text-accent">A standing operating environment, not another course.</p>
            </div>
            <div>
              <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
                Contractor Circle is where the entrepreneurial side of ownership gets worked on in the open: people, structure, cash, risk, accountability, systems, and the decisions that determine whether the company can grow without trapping the owner.
              </p>
              <div className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {circleIncludes.map((item) => (
                  <div key={item} className="flex gap-3 border-t border-border pt-4 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {item}
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a href={CIRCLE_CHECKOUT} className="alp-button">Join the Circle · $497/month <ArrowRight className="h-4 w-4" /></a>
                <Link to="/contractor-circle" className="alp-link">See everything inside</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/45">What ALP does</p>
            <h2 className="alp-display mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">We turn owner knowledge into company infrastructure.</h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-background/65">
              Most construction companies are carrying the right answers in one person’s head. ALP helps expose the work, assign ownership, install the operating cadence, and create evidence the team can act on without waiting for the owner to rescue the day.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-background/55">
              That doctrine runs through <a href="https://alpcontractorcircle.com" className="text-background underline decoration-background/35 underline-offset-4">ALP Contractor Circle</a> and the <a href="https://alphandbook.com" className="text-background underline decoration-background/35 underline-offset-4">ALP Handbook</a>.
            </p>
          </div>
          <div className="grid gap-8 border-t border-background/20 pt-8 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["01", "Diagnose", "Find the owner bottleneck, the missing decision right, and the operating gap."],
              ["02", "Install", "Put the scorecards, meetings, systems, and accountability into the actual week."],
              ["03", "Inspect", "Verify evidence, close loops, and keep pressure on the result until the company can carry it."],
            ].map(([number, title, copy]) => (
              <div key={number} className="grid grid-cols-[40px_1fr] gap-4 border-b border-background/20 pb-7">
                <span className="alp-italic text-xl text-background/35">{number}</span>
                <div><h3 className="text-2xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-background/60">{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="alp-shell py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="alp-eyebrow">Available training</p>
              <h2 className="mt-5 text-4xl leading-tight md:text-5xl">Specific rooms for specific work.</h2>
              <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">These programs remain available, but they are supporting offers—not the center of the ALP story.</p>
            </div>
            <div className="border-t border-foreground">
              {supportingPrograms.map((program) => {
                const content = (
                  <>
                    <span className="alp-number">{program.number}</span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1"><h3 className="text-2xl group-hover:text-accent">{program.title}</h3><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{program.format}</span></div>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{program.copy}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold sm:justify-end"><span>{program.price}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </>
                );
                return program.external ? <a key={program.to} href={program.to} target="_blank" rel="noopener noreferrer" className="group grid gap-4 border-b border-border py-7 sm:grid-cols-[55px_1fr_auto] sm:items-start">{content}</a> : <Link key={program.to} to={program.to} className="group grid gap-4 border-b border-border py-7 sm:grid-cols-[55px_1fr_auto] sm:items-start">{content}</Link>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/50">
        <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-foreground"><img src={marshallOffice} alt="Marshall Wilkinson in a private working session" className="h-full w-full object-cover grayscale-[0.25]" /></div>
          <div className="lg:pl-10">
            <p className="alp-eyebrow">Application-only private work</p>
            <h2 className="alp-display mt-5 text-5xl sm:text-6xl">When the issue is too expensive for general advice.</h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Private intensives are short, hard-working engagements built around a defined operating problem, live evidence, required decisions, and a result your team can carry forward.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border-t border-foreground pt-4"><p className="text-sm font-semibold">Three-Week Sprint</p><p className="mt-1 text-3xl">$5,000</p></div>
              <div className="border-t border-foreground pt-4"><p className="text-sm font-semibold">Six-Week Installation</p><p className="mt-1 text-3xl">$10,000</p></div>
            </div>
            <Link to="/coaching" className="alp-button mt-8">Review the intensives <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  </>
);

export default Index;
