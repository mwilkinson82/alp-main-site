import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ScrollProgress from "@/components/ScrollProgress";
import FeaturedIn from "@/components/FeaturedIn";
import Services from "@/components/Services";
import InlineTestimonial from "@/components/InlineTestimonial";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PersistentCTA from "@/components/PersistentCTA";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const Index = () => {
  return (
    <>
      <SEO 
        title="Business Coaching & Strategic Consulting for Leaders | ALP"
        description="Elite coaching and consulting to transform your business, mindset, and execution. Join Power Hour or book 1-on-1 with Marshall Wilkinson. Over $2.5B in proven results."
        keywords="business coaching, strategic consulting, executive coaching, leadership development, sales training, entrepreneur coaching, Marshall Wilkinson, ALP"
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
