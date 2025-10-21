import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ScrollProgress from "@/components/ScrollProgress";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const Index = () => {
  return (
    <>
      <SEO 
        title="Business Coaching & Sales Training"
        description="Transform your business with elite coaching from Marshall Wilkinson. Over $2.5 billion in construction success. Expert guidance for entrepreneurs, CEOs, and sales professionals."
        keywords="business coaching, sales training, entrepreneur coaching, executive coaching, leadership development, business consulting"
        canonical="/"
      />
      <StructuredData type="organization" />
      <main className="min-h-screen">
        <ScrollProgress />
        <Header />
        <CinematicHero />
        <Services />
        <About />
        <Testimonials />
        <ContactForm />
        <CTA />
        <Footer />
      </main>
    </>
  );
};

export default Index;
