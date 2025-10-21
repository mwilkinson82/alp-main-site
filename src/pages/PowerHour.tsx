import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Users, Video, Calendar, Play } from "lucide-react";

const PowerHour = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              The <span className="text-gradient-gold">Power Hour</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Start Every Morning with Focus, Strategy, and Community
            </p>
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg px-6 py-4 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Daily Live Call</p>
              <p className="text-3xl font-bold text-primary">8:00 AM EST • Every Morning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              What is Power Hour?
            </h2>
            <Card className="overflow-hidden relative">
              <video 
                ref={videoRef}
                controls 
                className="w-full aspect-video"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/videos/power-hour-explainer.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Custom Play Button Overlay */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer group"
                  onClick={handlePlayVideo}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary shadow-lg">
                    <Play className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
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
              {[
                "Daily live coaching calls at 8:00 AM EST",
                "Access to exclusive Power Hour community portal",
                "Recordings of all sessions for flexibility",
                "Weekly accountability check-ins",
                "Direct access to Marshall during calls",
                "Networking with successful entrepreneurs",
                "Action-oriented daily exercises",
                "Priority support and resources"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
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
            
            {/* Stripe Pricing Table */}
            <div 
              className="bg-background rounded-lg p-8"
              dangerouslySetInnerHTML={{
                __html: `<stripe-pricing-table 
                  pricing-table-id="prctbl_1SKa3dJdDAUSVXbN5JNkigpq"
                  publishable-key="pk_live_51HPL9DJdDAUSVXbNUTKTJ3iFWkm647TcFaWPxG7jEN5yxOQbOdoQKMr7EwQVdeqaXNJNWtFSZJPcIzsNpFu7wq2B00FraU36Xi">
                </stripe-pricing-table>`
              }}
            />

            <p className="text-sm text-secondary-foreground/60 mt-6">
              After payment, you'll receive immediate access to the member portal and your first call invitation
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PowerHour;
