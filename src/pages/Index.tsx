import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ScrollProgress from "@/components/ScrollProgress";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
