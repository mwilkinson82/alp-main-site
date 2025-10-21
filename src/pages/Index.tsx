import Hero from "@/components/Hero";
import HeroContent from "@/components/HeroContent";
import Services from "@/components/Services";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HeroContent />
      <Services />
      <About />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
