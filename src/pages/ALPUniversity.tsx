import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users, Calendar, PlayCircle, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-5 h-5" />
                <span className="font-semibold">Master Your Business & Mindset</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                ALP University
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                1,000's of Hours of Business, Mindset & Sales Mastery Training + Live Class Recordings
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get unlimited access to our complete training library and recorded sessions from Power Hour, Contractor School, and Sales & Marketing School.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to master business fundamentals, sales strategies, and personal growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Complete Training Library</CardTitle>
                  <CardDescription>
                    Access 1,000's of hours of courses, classes, and audio content covering Business, Mindset, and Sales Mastery
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Video className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Daily Power Hour Recordings</CardTitle>
                  <CardDescription>
                    Get access to every recorded Power Hour session - daily accountability, live coaching, and community support
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Calendar className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Contractor School</CardTitle>
                  <CardDescription>
                    Weekly Tuesday evening classes specifically designed for builders, with all recordings available
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Sales & Marketing School</CardTitle>
                  <CardDescription>
                    Weekly Wednesday evening classes focused on growing your business through effective sales and marketing
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <PlayCircle className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>On-Demand Access</CardTitle>
                  <CardDescription>
                    Learn at your own pace with unlimited access to all content, available anytime, anywhere
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <GraduationCap className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Continuous Learning</CardTitle>
                  <CardDescription>
                    New content added regularly from live sessions and updated course materials
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why ALP University?</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Knowledge Base</h3>
                    <p className="text-muted-foreground">
                      Years of proven business strategies, sales techniques, and mindset training all in one place
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Learn From Real Sessions</h3>
                    <p className="text-muted-foreground">
                      Access recordings of actual coaching sessions where real business challenges are solved in real-time
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
                    <p className="text-muted-foreground">
                      Can't make it to live sessions? No problem. Watch recordings on your schedule and revisit content anytime
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Incredible Value</h3>
                    <p className="text-muted-foreground">
                      Access to thousands of hours of training plus ongoing live session recordings for less than the cost of a single coaching hour
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Schedule Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Weekly Live Classes</h2>
              
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
                      Daily accountability & coaching (recordings available)
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
                      Specialized training for builders (recordings available)
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
                      Grow your business (recordings available)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-muted-foreground mt-8">
                All live sessions are recorded and added to your library for on-demand viewing
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join ALP University Today</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Get unlimited access to everything for just $197/month
              </p>

              {/* Stripe Pricing Table */}
              <div className="bg-card rounded-lg p-8 shadow-lg">
                <stripe-pricing-table 
                  pricing-table-id="prctbl_1SKaufJdDAUSVXbNTzAHj1Kl"
                  publishable-key="pk_live_51HPL9DJdDAUSVXbNUTKTJ3iFWkm647TcFaWPxG7jEN5yxOQbOdoQKMr7EwQVdeqaXNJNWtFSZJPcIzsNpFu7wq2B00FraU36Xi"
                />
              </div>

              <p className="text-sm text-muted-foreground mt-8">
                Cancel anytime. Immediate access upon subscription.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ALPUniversity;
