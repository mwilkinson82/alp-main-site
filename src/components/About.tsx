import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Target, Shield } from "lucide-react";
import marshallCasual from "@/assets/marshall-casual.jpg";
import marshallSignature from "@/assets/marshall-signature-black.png";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { VideoTestimonial } from "@/components/VideoTestimonial";

const highlights = [
  {
    icon: Award,
    title: "Proven Track Record",
    description: "Over $2.5 billion in construction projects successfully delivered"
  },
  {
    icon: TrendingUp,
    title: "Results-Driven",
    description: "Strategies tested and refined through real-world application"
  },
  {
    icon: Target,
    title: "Focused Expertise",
    description: "Specialized in scaling businesses and developing leaders"
  },
  {
    icon: Shield,
    title: "Trusted Advisor",
    description: "Decades of experience coaching top-tier executives"
  }
];

const About = () => {
  const sectionRef = useGsapScroll();
  
  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-20 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      {/* Background accent */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1/2 opacity-20"
        style={{ backgroundImage: 'var(--gradient-gold-radial)' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="text-gradient-gold">Meet Marshall</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Builder of systems, strategist, and architect of transformation
          </p>
        </div>

        {/* Origin Story Video */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
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
                Marshall Wilkinson is not just a business strategist. He is a builder of people, systems, and frameworks that win. With over <span className="text-primary font-bold">$2.5 billion in projects delivered by the age of 38</span> and a career forged in the trenches of high-stakes construction and enterprise, Marshall now teaches a philosophy that transcends industry.
              </p>
              <p>
                Marshall built his reputation negotiating some of the most complex contracts in New York City. He mastered leverage, timing, and execution in environments where failure wasn't an option. But it wasn't just about construction—it was about the game of life.
              </p>
              <p>
                <span className="text-primary font-semibold">The Mission:</span> Marshall created ALP to help others take back control of their lives. Whether you're trying to scale a business, rebuild after trauma, or restore a broken relationship, ALP offers a path. Not just a mindset, but a <span className="text-primary font-semibold">system of strategic thinking</span> that leads to action and transformation.
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
            <span className="text-primary font-semibold">Legacy & Vision:</span> Marshall is building more than a coaching company. He is building an army of empowered individuals ready to master life at the highest level. His mission is simple: to awaken clarity, ignite strength, and unleash decisive action in every area that matters.
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
