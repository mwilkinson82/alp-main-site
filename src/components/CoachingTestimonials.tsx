import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    quote:
      "Marshall runs 1-on-1 consulting the way a real executive should. Every session had a clear agenda, priorities were set immediately, and there was no wasted time. He worked around my schedule without any issues, and the level of organization made the experience feel premium from day one. What stood out most was how quickly he identified the root problems in my operation — not symptoms, but the actual structural flaws. The clarity he gave me around what to do next was worth more than any course or program I've ever purchased.",
    attribution: "Client, 1-on-1 Consulting",
  },
  {
    quote:
      "I've worked with a lot of people in construction who talk a good game. Marshall is the real deal. He knows contracting inside and out and can spot the problem fast. I came into the calls thinking I needed help with one issue and he ended up uncovering three bigger bottlenecks that were costing me money every week. He didn't just talk theory — he gave me real fixes that I could implement immediately. Best part is he keeps you moving. No fluff. No wasting time.",
    attribution: "Client, Contractor Coaching",
  },
  {
    quote:
      "Before working with Marshall I felt completely overwhelmed. I had a business that was growing but it felt like I was constantly reacting and putting out fires. Marshall helped me see what was actually happening underneath everything. He broke down the 'why' behind my problems in a way that made everything click, and suddenly I had direction. The biggest value wasn't even the advice — it was the clarity and confidence I got from finally understanding what mattered and what didn't. I walked away from every call feeling sharper.",
    attribution: "Client, 1-on-1 Mentorship",
  },
  {
    quote:
      "This was hands down the best consulting experience I've ever had. Marshall was flexible with scheduling and extremely professional, but what really impressed me was the depth. He doesn't give generic business advice — he gets into nuance. He asked questions nobody else would ask and identified blind spots I didn't even know existed. The recommendations were unique, practical, and tailored specifically to my business. It felt like having a world-class expert step inside my company and rewrite the operating system.",
    attribution: "Client, Private Advisory",
  },
];

const CoachingTestimonials = () => {
  const sectionRef = useGsapScroll();

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            <span className="text-gradient-gold">Direct Advisory</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Private strategic access for operators making high-stakes decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-muted/30 p-6 md:p-8 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <blockquote className="text-sm md:text-base text-foreground leading-relaxed">
                "{t.quote}"
              </blockquote>
              <p className="text-sm font-semibold text-primary">— {t.attribution}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" className="bg-gradient-gold hover:shadow-glow hover-gold-edge gap-2" asChild>
            <a href="/coaching#packages">
              Book a Strategy Session
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoachingTestimonials;
