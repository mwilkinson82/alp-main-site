import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users, Calendar, PlayCircle, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import marshallOffice from "@/assets/marshall-office.jpg";
import alpAudiosMockup from "@/assets/alp-audios-mockup.png";
import consultingMockup from "@/assets/consulting-mockup.png";

const ALPUniversity = () => {
  useEffect(() => {
    // Load Stripe pricing table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <SEO 
        title="ALP University — On-Demand Archive | Altitude Logic Pressure"
        description="1,000+ hours of execution systems, sales infrastructure, and operator training — archived from real sessions. The ALP University on-demand library for serious operators."
        keywords="ALP University, Altitude Logic Pressure, execution systems, operator training, sales infrastructure, business systems, on-demand training archive, Marshall Wilkinson"
        canonical="/alp-university"
      />
      <StructuredData 
        type="course" 
        data={{
          name: "ALP University",
          description: "1,000+ hours of business, mindset, and sales mastery training with live class recordings",
          price: "197"
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-16">
        {/* Hero Image Section */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${alpAudiosMockup})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </section>

        {/* Content Section */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-gradient-gold">ALP University</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The on-demand archive. 1,000+ hours of execution systems, sales infrastructure, and operator training — built from real sessions, not theory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-black font-semibold text-lg px-8 h-12"
                  onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Curriculum
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-black font-semibold text-lg px-8 h-12"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section id="curriculum" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Inside</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every session, every system, every framework — archived and searchable. Built for operators who move fast and need answers now.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Complete Training Archive</CardTitle>
                  <CardDescription>
                    1,000+ hours of structured content spanning business systems, sales infrastructure, and decision-making frameworks — organized for fast retrieval.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Video className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Power Hour Recordings</CardTitle>
                  <CardDescription>
                    Every recorded Power Hour session in full — daily execution reviews, live deal breakdowns, and real-time problem solving from operators in the room.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Contractor School</CardTitle>
                  <CardDescription>
                    Tuesday evening sessions built for contractors — bidding strategy, crew systems, client management, and scaling without losing control.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Sales & Marketing School</CardTitle>
                  <CardDescription>
                    Wednesday evening sessions focused on revenue architecture — positioning, pipeline, and converting at a higher level without discounting your value.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <PlayCircle className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>On-Demand. No Expiry.</CardTitle>
                  <CardDescription>
                    Access the full archive on your schedule. Revisit sessions when a specific challenge surfaces — the library works when you need it, not just when it's convenient.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <GraduationCap className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Always Growing</CardTitle>
                  <CardDescription>
                    New sessions are added as they happen. Your library compounds over time — every live room adds to the archive automatically.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section with Images */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Operators Choose ALP University</h2>
            
            {/* Content Row 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Built From Real Decisions</h3>
                    <p className="text-muted-foreground">
                      This isn't a course library assembled from slides. Every session in the archive comes from a live room where real operators brought real problems — and walked out with systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Access the Room After the Room</h3>
                    <p className="text-muted-foreground">
                      The best insights in a live session often happen in the last ten minutes. The archive captures all of it — including the Q&A, the follow-ups, and the unscripted breakdowns that don't make it into formal courses.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={alpAudiosMockup} 
                  alt="ALP Training Content on Mobile" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Content Row 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="relative order-2 lg:order-1">
                <img 
                  src={consultingMockup} 
                  alt="Strategic Growth and Marketing Plan" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
              
              <div className="space-y-8 order-1 lg:order-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Deploy It When You Need It</h3>
                    <p className="text-muted-foreground">
                      Miss a session? No friction. The archive is organized so you can pull a relevant recording the moment a challenge surfaces — not weeks later when a new course drops.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Highest ROI Entry Point</h3>
                    <p className="text-muted-foreground">
                      Thousands of hours of advisory-level content at a fraction of the cost of a single private session. If one session changes one decision, it pays for years.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Schedule Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Live Rooms — Weekly Schedule</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-center">Monday - Friday</CardTitle>
                    <CardDescription className="text-center text-lg">
                      8:00 AM EST
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center font-semibold text-primary">Power Hour</p>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Daily execution sessions — live deal reviews, operator Q&A (recordings included)
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-center">Tuesday</CardTitle>
                    <CardDescription className="text-center text-lg">
                      Evening
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center font-semibold text-primary">Contractor School</p>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Bidding, systems, and scaling for contractors (recordings included)
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-center">Wednesday</CardTitle>
                    <CardDescription className="text-center text-lg">
                      Evening
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center font-semibold text-primary">Sales & Marketing</p>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Revenue architecture, positioning, and pipeline (recordings included)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-muted-foreground mt-8">
                All live sessions are recorded and added to your archive automatically — no manual downloads, no missed content.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Full Archive Access</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Everything. Every session. Every system. $197/month — cancel anytime.
              </p>

              {/* Stripe Pricing Table */}
              <div className="bg-card rounded-lg p-8 shadow-lg">
                <stripe-pricing-table 
                  pricing-table-id="prctbl_1SKaufJdDAUSVXbNTzAHj1Kl"
                  publishable-key="pk_live_51HPL9DJdDAUSVXbNUTKTJ3iFWkm647TcFaWPxG7jEN5yxOQbOdoQKMr7EwQVdeqaXNJNWtFSZJPcIzsNpFu7wq2B00FraU36Xi"
                />
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                Cancel anytime. Access begins immediately upon subscription.
              </p>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ALPUniversity;
