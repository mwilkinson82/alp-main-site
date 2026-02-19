import { PlayCircle, BookOpen, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const entries = [
  {
    icon: PlayCircle,
    title: "Watch the Framework",
    subtitle: "The core philosophy behind ALP.",
    cta: "Watch Now",
    href: "#origin-story",
    isAnchor: true,
    badge: null,
  },
  {
    icon: BookOpen,
    title: "Read Strategic Insights",
    subtitle: "Articles on leverage, decision-making, and execution.",
    cta: "Read Articles",
    href: "/blog",
    isAnchor: false,
    badge: null,
  },
  {
    icon: MessageCircle,
    title: "Ask Marshall — $250",
    subtitle: "Get a direct strategic response within 24 hours.",
    cta: "Submit a Question",
    href: "/ask-marshall",
    isAnchor: false,
    badge: "ENTRY POINT",
  },
];

const StartHere = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-gradient-gold">Start Here</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Three ways to engage with the ALP framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {entries.map((entry, index) => {
            const Icon = entry.icon;
            const content = (
              <div className="glass-card hover-lift hover-glow p-6 md:p-8 space-y-4 h-full flex flex-col relative group">
                {entry.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold tracking-widest bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full">
                      {entry.badge}
                    </span>
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-lg font-bold">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.subtitle}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary pt-2 group-hover:gap-2 transition-all">
                  {entry.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );

            if (entry.isAnchor) {
              return (
                <a
                  key={index}
                  href={entry.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("origin-story");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block h-full"
                >
                  {content}
                </a>
              );
            }

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
