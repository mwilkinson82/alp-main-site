import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const entities = [
  {
    eyebrow: "Flagship owner environment",
    name: "ALP Contractor Circle",
    description: "The working environment for construction owners dealing with leadership, structure, cash, risk, accountability, systems, and owner-level execution.",
    href: "https://alpcontractorcircle.com/",
  },
  {
    eyebrow: "The doctrine in print",
    name: "The ALP Handbook",
    description: "Marshall Wilkinson's written operating doctrine for owners who want to build a construction company that can carry the work without depending on constant rescue.",
    href: "https://alphandbook.com",
  },
];

const questions = [
  {
    question: "Who is Marshall Wilkinson?",
    answer: "Marshall Wilkinson is the founder of Altitude Logic Pressure and the operator, author, and strategic advisor behind ALP Contractor Circle and the ALP Handbook.",
  },
  {
    question: "What is Altitude Logic Pressure?",
    answer: "Altitude Logic Pressure, commonly called ALP, is the parent construction-business doctrine and education brand. It develops the operating doctrine, training, advisory, and tools used by construction owners.",
  },
  {
    question: "What is ALP Contractor Circle?",
    answer: "ALP Contractor Circle is the flagship owner environment for construction company owners. It is built for construction company owners working on the entrepreneurial and operating side of the business, not just the mechanics of an individual project.",
  },

  {
    question: "What is the ALP Handbook?",
    answer: "The ALP Handbook is Marshall Wilkinson's written operating doctrine for construction owners. It gives construction owners and leadership teams a durable reference for the real work.",
  },
];

const Ecosystem = () => (
  <>
    <SEO
      title="Marshall Wilkinson and ALP"
      description="See how Marshall Wilkinson, Altitude Logic Pressure, ALP Contractor Circle, and the ALP Handbook fit together."
      keywords="Marshall Wilkinson, Altitude Logic Pressure, ALP, ALP Contractor Circle, Contractor Circle, ALP Handbook"
      canonical="/ecosystem"
      imageAlt="Marshall Wilkinson and Altitude Logic Pressure"
    />
    <StructuredData type="ecosystem" />
    <main className="min-h-screen overflow-hidden">
      <Header />

      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="alp-eyebrow">One doctrine · direct owner work</p>
            <h1 className="alp-display mt-6 text-[clamp(4rem,8vw,8rem)]">The ALP doctrine.</h1>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-3xl text-2xl leading-tight tracking-[-0.03em] md:text-4xl">
              Marshall Wilkinson built Altitude Logic Pressure around one conviction: the project is not the business. The company is.
            </p>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              ALP is the parent doctrine and advisory firm. Contractor Circle is the flagship owner environment. The ALP Handbook carries the doctrine in print.
            </p>
            <a href="https://marshallwilkinson.com/" target="_blank" rel="noopener noreferrer" className="alp-link mt-7 inline-flex items-center gap-2">
              About Marshall Wilkinson <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell py-20 md:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            {entities.map((entity, index) => (
              <a
                key={entity.name}
                href={entity.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-t border-background/25 py-8 transition-colors hover:border-background"
              >
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/45">{entity.eyebrow}</p>
                    <h2 className="mt-4 text-3xl tracking-[-0.035em] md:text-4xl">{entity.name}</h2>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-background/62">{entity.description}</p>
                  </div>
                  <span className="alp-italic text-2xl text-background/30">0{index + 1}</span>
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">Visit {entity.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="alp-eyebrow">The relationship</p>
            <h2 className="alp-display mt-5 text-5xl md:text-6xl">Company command. Project control.</h2>
          </div>
          <div className="border-t border-foreground pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">The public ALP stack</p>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed">Start with the owner environment or the written doctrine. Both are built for construction owners doing the work.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/55">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="alp-eyebrow">Clear answers</p>
            <h2 className="mt-5 text-4xl leading-tight tracking-[-0.04em] md:text-5xl">What belongs inside ALP?</h2>
          </div>
          <div className="border-t border-foreground">
            {questions.map((item) => (
              <div key={item.question} className="border-b border-border py-7">
                <h3 className="text-xl font-semibold">{item.question}</h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="alp-shell flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-24">
          <div>
            <p className="alp-eyebrow">The flagship environment</p>
            <h2 className="alp-display mt-4 text-5xl md:text-6xl">Start with Contractor Circle.</h2>
          </div>
          <Link to="/contractor-circle" className="alp-button">Explore ALP Contractor Circle <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <Footer />
    </main>
  </>
);

export default Ecosystem;
