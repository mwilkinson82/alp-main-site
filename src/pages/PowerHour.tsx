import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Users, Video, Calendar } from "lucide-react";
import powerHourHero from "@/assets/power-hour-hero.jpg";

const PowerHour = () => {
  return <>
      <SEO title="Marshall Wilkinson's Power Hour - Daily Morning Accountability & Coaching" description="Join Marshall Wilkinson's daily Power Hour at 8:00 AM EST. Start every morning with focus, strategy, and community through live coaching calls and accountability support." keywords="Marshall Wilkinson Power Hour, Marshall Wilkinson coaching, power hour, daily accountability, morning routine, business coaching, live coaching calls, entrepreneur community, Altitude Logic Pressure" canonical="/power-hour" />
      <StructuredData type="service" data={{
      serviceType: "Daily Accountability Coaching",
      description: "Daily morning accountability and coaching calls at 8:00 AM EST",
      price: "197"
    }} />
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Image Section */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-muted">
          <img
            src={powerHourHero}
            alt="Marshall Wilkinson leading a live Power Hour coaching session"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        </section>

        {/* Content Section */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-gradient-gold">Power Hour</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Start Every Morning with Focus, Strategy, and Community
              </p>
              <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg px-6 py-4">
                <p className="text-sm text-muted-foreground mb-1">Daily Live Call</p>
                <p className="text-3xl font-bold text-primary">8:00 AM EST • Every Morning</p>
              </div>
            </div>
          </div>
        </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Join Power Hour?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Daily Accountability</h3>
                  <p className="text-muted-foreground">
                    Start every day with purpose and clear priorities
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community Support</h3>
                  <p className="text-muted-foreground">
                    Connect with like-minded entrepreneurs daily
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Live Coaching</h3>
                  <p className="text-muted-foreground">
                    Get real-time guidance from Marshall and peers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Consistent Growth</h3>
                  <p className="text-muted-foreground">
                    Build momentum through daily action and reflection
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What's Included
            </h2>
            <div className="space-y-4">
              {["Daily live coaching calls at 8:00 AM EST", "Access to exclusive Power Hour community portal", "Recordings of all sessions for flexibility", "Weekly accountability check-ins", "Direct access to Marshall during calls", "Networking with successful entrepreneurs", "Action-oriented daily exercises", "Priority support and resources"].map((benefit, index) => <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Power Hour Success Stories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Power Hour Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Jason R.</p>
                      <p className="text-sm text-muted-foreground">Construction Business Owner</p>
                    </div>
                  </div>
                  <blockquote className="text-lg text-foreground">
                    "Power Hour completely transformed how I start my day. In just 3 months, I closed more deals than the entire previous year. The accountability and community support are game-changers."
                  </blockquote>
                  <p className="text-sm text-primary font-medium">Power Hour Member since 2024</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Maria S.</p>
                      <p className="text-sm text-muted-foreground">Real Estate Developer</p>
                    </div>
                  </div>
                  <blockquote className="text-lg text-foreground">
                    "The daily structure and Marshall's insights have been invaluable. I've doubled my project pipeline and finally have the discipline to follow through on my goals every single day."
                  </blockquote>
                  <p className="text-sm text-primary font-medium">Power Hour Member since 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Sign Up Section */}
      <section className="py-20 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Join Power Hour Today
            </h2>
            <p className="text-xl text-secondary-foreground/80 mb-8">
              Start transforming your mornings and your business
            </p>
            
            {/* Pricing Options */}
            <div className="bg-background rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* 1 Month Option */}
                <div className="border border-border rounded-lg p-6 space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">$1,000</p>
                    <p className="text-muted-foreground">1 Month</p>
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                  >
                    <a href="https://buy.stripe.com/7sYeVeaO52iGgMo4n8eQM0J" target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>
                </div>

                {/* 6 Month Option - Best Value */}
                <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">$5,000</p>
                    <p className="text-muted-foreground">6 Months</p>
                    <p className="text-sm text-primary">Save $1,000</p>
                  </div>
                  <Button 
                    asChild 
                    variant="premium" 
                    size="lg" 
                    className="w-full"
                  >
                    <a href="https://buy.stripe.com/bJe6oI8FX2iG9jW4n8eQM0I" target="_blank" rel="noopener noreferrer">
                      Get 6 Months
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-sm text-secondary-foreground/60 mt-6">After payment, you'll receive immediate access to the member portal and start receiving email invites to daily Power Hour</p>
          </div>
        </div>
      </section>

        <Footer />
      </main>
    </>;
};
export default PowerHour;