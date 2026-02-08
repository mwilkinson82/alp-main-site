import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ScrollProgress from "@/components/ScrollProgress";
import FeaturedIn from "@/components/FeaturedIn";
import Services from "@/components/Services";
import InlineTestimonial from "@/components/InlineTestimonial";
import About from "@/components/About";
import CoachingTestimonials from "@/components/CoachingTestimonials";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CoachingCTA from "@/components/CoachingCTA";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PersistentCTA from "@/components/PersistentCTA";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

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
        <FeaturedIn />
        <Services />
        <InlineTestimonial 
          quote="Marshall didn't just coach me—he rebuilt the way I think about business."
          author="Ahron Gluck"
          role="CEO, AG Builders"
        />
        <About />
        <InlineTestimonial 
          quote="The frameworks Marshall teaches have transformed how we scale and lead."
          author="AJ Hoover"
          role="CEO, Beau Monde Builders"
        />
        <CoachingCTA />
        <CoachingTestimonials />
        <Testimonials />
        <ContactForm />
        <CTA />
        <Footer />
        <PersistentCTA />
      </main>
    </>
  );
};

export default Index;
