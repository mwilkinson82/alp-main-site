import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Target, Shield } from "lucide-react";
import marshallCasual from "@/assets/marshall-casual.jpg";
import marshallSignature from "@/assets/marshall-signature-black.png";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { VideoTestimonial } from "@/components/VideoTestimonial";

const highlights = [
  {
    icon: Award,
    title: "Executed at Scale",
    description: "Real systems built inside enterprise environments."
  },
  {
    icon: TrendingUp,
    title: "Results-Driven",
    description: "Every framework is built for measurable outcomes."
  },
  {
    icon: Target,
    title: "Decision Architecture",
    description: "Clarity, leverage, and structure under pressure."
  },
  {
    icon: Shield,
    title: "Operator Systems",
    description: "Scale operations without losing control."
  }
];

const About = () => {
  const sectionRef = useGsapScroll();
  
  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-16 md:py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background accent */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-20"
        style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Why Marshall</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Marshall Wilkinson has operated inside high-stakes environments where execution wasn't optional. He has advised on and executed over $5B in outcomes, building systems that protect margin, create leverage, and scale operations without chaos. ALP is not motivation. It's infrastructure.
          </p>
        </div>

        {/* Origin Story Video */}
        <div id="origin-story" className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">The Origin Story</h3>
            <p className="text-lg text-muted-foreground">
              Discover how Marshall built a legacy of transformation
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-premium hover-lift">
            <VideoTestimonial 
              src="/videos/origin-story.mp4"
              title="Marshall Wilkinson's Origin Story"
              posterSrc="/images/marshall-origin-thumbnail.png"
              captureAt={1.5}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left - Photo */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-premium hover-lift">
              <img 
                src={marshallCasual} 
                alt="Marshall Wilkinson" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            {/* Floating accent */}
            <div 
              className="absolute -bottom-8 -right-8 w-64 h-64 opacity-30 blur-3xl pointer-events-none"
              style={{ background: 'var(--gradient-gold)' }}
            ></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="text-lg text-foreground space-y-4">
              <p>
                Marshall Wilkinson is not just a business strategist. He is an architect of decisions, systems, and frameworks that win. With over <span className="text-primary font-bold">$5B in executed projects and negotiations</span> by the age of 38 and a career forged in high-stakes environments where failure wasn't an option, Marshall now teaches a philosophy that transcends industry.
              </p>
              <p>
                Marshall built his reputation mastering leverage, timing, and execution in some of the most complex negotiations and enterprise environments in New York City. He didn't just manage — he controlled outcomes. That distinction defines everything he teaches.
              </p>
              <p>
                <span className="text-primary font-semibold">The Mission:</span> Marshall created ALP to give others the same decision-making edge he forged under pressure. Whether you're scaling a business, navigating a high-stakes negotiation, or restructuring your leadership approach, ALP delivers not just a mindset, but a <span className="text-primary font-semibold">precision framework for strategic action</span>.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-4">
              <img 
                src={marshallSignature} 
                alt="Marshall Wilkinson Signature" 
                className="h-16 opacity-80"
              />
              <p className="text-sm text-muted-foreground mt-2">Marshall Wilkinson</p>
            </div>

            <Button size="lg" variant="premium" asChild className="mt-6">
              <a href="#services">
                Explore Services
              </a>
            </Button>
          </div>
        </div>


        {/* Legacy Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xl text-foreground leading-relaxed">
            <span className="text-primary font-semibold">Legacy & Vision:</span> Marshall is building more than an advisory firm. He is building an army of empowered operators ready to execute at the highest level. His mission is precise: to sharpen clarity, forge strategic leverage, and unleash decisive action in every area that matters.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div 
                key={index} 
                className="glass-card hover-lift hover-glow p-6 space-y-3"
              >
                <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center group-hover:shadow-glow transition-smooth">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
