import Header from "@/components/Header";
import WelcomeVideo from "@/components/WelcomeVideo";
import HeroContent from "@/components/HeroContent";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <WelcomeVideo />
      <HeroContent />
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
