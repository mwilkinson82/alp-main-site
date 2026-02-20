import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ScrollProgress from "@/components/ScrollProgress";
import FeaturedIn from "@/components/FeaturedIn";
import Services from "@/components/Services";
import About from "@/components/About";
import CoachingTestimonials from "@/components/CoachingTestimonials";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import PersistentCTA from "@/components/PersistentCTA";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import StartHere from "@/components/StartHere";
import AskMarshallHighlight from "@/components/AskMarshallHighlight";
import LatestInsights from "@/components/LatestInsights";
import LeadMagnet from "@/components/LeadMagnet";
import InsightsNewsletter from "@/components/InsightsNewsletter";

const Index = () => {
  return (
    <>
      <SEO 
        title="Marshall Wilkinson - Elite Business Coach & Strategic Consultant"
        description="Marshall Wilkinson is an elite business coach and strategic consultant specializing in leadership, sales, and business transformation. Over $2.5B in proven results with ALP (Altitude Logic Pressure)."
        keywords="Marshall Wilkinson, Marshall Wilkinson coach, Marshall Wilkinson ALP, Altitude Logic Pressure, business coaching, strategic consulting, executive coaching, leadership development, sales training, entrepreneur coaching"
        canonical="/"
      />
      <StructuredData type="organization" />
      <main className="min-h-screen">
        <ScrollProgress />
        <Header />
        <CinematicHero />
        <StartHere />
        <FeaturedIn />
        <About />
        <AskMarshallHighlight />
        <Services />
        <LatestInsights />
        <InsightsNewsletter />
        {/* <LeadMagnet /> */}
        <CoachingTestimonials />
        <Testimonials />
        <Footer />
        <PersistentCTA />
      </main>
    </>
  );
};

export default Index;
