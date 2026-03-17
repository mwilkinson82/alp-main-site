import { Archive, MessageCircle, Users, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ladderSteps = [
  { label: "ALP University" },
  { label: "Ask Marshall" },
  { label: "Live Training Rooms" },
  { label: "Strategy Session" },
  { label: "Private Advisory" },
];

const entries = [
  {
    icon: Archive,
    title: "ALP University",
    subtitle: "The Operator's Archive. Updated daily.",
    body: "Access the full repository of recorded Power Hour, Sales & Marketing School, and Contractor School sessions — indexed and expanded every week.",
    cta: "Enter the Archive",
    href: "/alp-university",
    featured: false,
  },
  {
    icon: MessageCircle,
    title: "Ask Marshall",
    subtitle: "Get a direct strategic answer — without booking a call.",
    body: "Submit your most pressing business decision and receive a direct Loom breakdown of what to do next — with clear steps, structure, and leverage.",
    cta: "Start Here — Get Marshall's Analysis",
    href: "/ask-marshall",
    featured: true,
  },
  {
    icon: Users,
    title: "Private Advisory",
    subtitle: "Single-session and multi-session intensives.",
    body: "Private strategic engagements designed to install execution systems, sharpen leadership decisions, and remove bottlenecks.",
    cta: "Explore Private Advisory",
    href: "/coaching",
    featured: false,
  },
];

const StartHere = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20 border-y border-border/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-gradient-gold">Choose Your Access Level</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Three paths depending on how directly you want systems, execution clarity, and decision leverage.
          </p>
        </div>

        {/* Ascension Ladder Strip */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {ladderSteps.map((step, index) => {
              const isAskMarshall = step.label === "Ask Marshall";
              return (
                <div key={index} className="flex items-center gap-1">
                  {isAskMarshall ? (
                    <div className="relative flex flex-col items-center bg-gradient-gold rounded-lg px-3 py-1.5 text-center shadow-[0_0_14px_-3px_hsl(var(--primary)/0.6)] ring-1 ring-primary/60">
                      <span className="text-xs font-bold text-primary-foreground leading-tight">{step.label}</span>
                      <span className="text-[9px] font-bold text-primary-foreground/80 tracking-wide uppercase leading-none mt-0.5">Most Popular</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center bg-primary/10 border border-primary/40 rounded-lg px-3 py-1.5 text-center">
                      <span className="text-xs font-semibold text-primary leading-tight">{step.label}</span>
                    </div>
                  )}
                  {index < ladderSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-primary/50 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-2 tracking-wider uppercase">
            Start where you need. Scale proximity as required.
          </p>
        </div>

        {/* 3 Access-Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {entries.map((entry, index) => {
            const Icon = entry.icon;

            const content = entry.featured ? (
              /* ── Featured "Ask Marshall" card ── */
              <div className="glass-card hover-lift relative h-full flex flex-col rounded-xl overflow-hidden border border-primary/60 shadow-[0_0_35px_-5px_hsl(var(--primary)/0.45)] scale-[1.03] group z-10">
                <div className="bg-gradient-gold px-6 py-2 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-primary-foreground uppercase">
                    Most Popular Entry Point
                  </span>
                </div>
                <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-lg font-bold">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.subtitle}</p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">{entry.body}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-base font-bold text-primary pt-1 group-hover:gap-3 transition-all">
                    {entry.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ) : (
              /* ── Standard card ── */
              <div className="glass-card hover-lift hover-glow p-6 md:p-8 space-y-4 h-full flex flex-col relative group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-lg font-bold">{entry.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.subtitle}</p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{entry.body}</p>
              </div>
                
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-1 group-hover:gap-2 transition-all">
                  {entry.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );

            return (
              <Link key={index} to={entry.href} className="block h-full">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StartHere;