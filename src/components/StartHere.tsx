import { BookOpen, Users, Calendar, Shield, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ladderSteps = [
  { label: "The Handbook", badge: "START HERE" },
  { label: "Live Training Programs", badge: "MOST POPULAR" },
  { label: "Strategy Session" },
  { label: "Private Advisory", badge: "HIGHEST TIER" },
];

const tiers = [
  {
    icon: BookOpen,
    title: "The ALP Handbook",
    price: "$47",
    badge: "START HERE",
    description: "The foundational playbook for running a contracting business with systems, structure, and leverage — not gut instinct and guesswork.",
    cta: "Get the Handbook",
    href: "https://alphandbook.com",
    external: true,
    featured: false,
  },
  {
    icon: Users,
    title: "Live Training Programs",
    price: "Starting at $497/mo",
    badge: "MOST POPULAR",
    description: "Join a live coaching room led by Marshall and his team. Power Hour daily at 8am. Contractor School Tuesdays at 7pm. Sales & Marketing School Wednesdays at 7pm. Real problems. Real answers. Real time.",
    cta: "View Programs",
    href: "/programs",
    featured: true,
  },
  {
    icon: Calendar,
    title: "Strategy Session",
    price: "$1,000",
    description: "A focused 1-on-1 working session. Bring your biggest operational challenge — walk away with a clear action plan, SOPs, and a guardrail playbook you can execute the following week.",
    cta: "Book a Session",
    href: "/coaching",
    featured: false,
  },
  {
    icon: Shield,
    title: "Private Advisory",
    price: "$5,000 / 6 Sessions",
    badge: "HIGHEST TIER",
    description: "Private strategic engagements designed to install execution systems, sharpen leadership decisions, and remove the bottlenecks keeping you trapped in the day-to-day. For contractors ready to operate like a CEO.",
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
          <p className="text-muted-foreground mt-3 text-lg max-w-3xl mx-auto">
            Four tiers of access — from foundational knowledge to direct strategic partnership. Start where you need. Scale proximity as required.
          </p>
        </div>

        {/* Ascension Ladder Strip */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {ladderSteps.map((step, index) => {
              const isFeatured = step.badge === "MOST POPULAR";
              return (
                <div key={index} className="flex items-center gap-1">
                  {isFeatured ? (
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

        {/* 4 Access-Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;

            const content = tier.featured ? (
              /* ── Featured card ── */
              <div className="glass-card hover-lift relative h-full flex flex-col rounded-xl overflow-hidden border border-primary/60 shadow-[0_0_35px_-5px_hsl(var(--primary)/0.45)] lg:scale-[1.03] group z-10">
                <div className="bg-gradient-gold px-6 py-2 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-primary-foreground uppercase">
                    {tier.badge}
                  </span>
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-lg font-bold">{tier.title}</h3>
                    <p className="text-primary font-bold text-sm">{tier.price}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-base font-bold text-primary pt-1 group-hover:gap-3 transition-all">
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ) : (
              /* ── Standard card ── */
              <div className="glass-card hover-lift hover-glow p-6 space-y-4 h-full flex flex-col relative group">
                {tier.badge && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-primary/20 border-b border-primary/30 px-4 py-1.5 rounded-t-xl text-center">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{tier.badge}</span>
                    </div>
                  </div>
                )}
                <div className={tier.badge ? "pt-6" : ""}>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-lg font-bold">{tier.title}</h3>
                  <p className="text-primary font-bold text-sm">{tier.price}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-1 group-hover:gap-2 transition-all">
                  {tier.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );

            return (
              <Link key={index} to={tier.href} className="block h-full">
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
