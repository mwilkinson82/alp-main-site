import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PartnershipApplicationForm from "@/components/PartnershipApplicationForm";

const audienceSignals = [
  "Construction company owners",
  "Builders and specialty contractors",
  "Executives and project leaders",
  "A high-value B2B purchasing audience",
  "Approximately $2.5 billion in project experience",
  "Experience helping scale a construction company beyond $100 million",
  "A cross-platform construction and entrepreneurship audience",
];

const partnershipFormats = [
  ["Sponsored educational content", "Credible teaching built around a real contractor problem—not a pasted talking point."],
  ["Product demonstrations", "Workflow-based content showing where the product fits, how it works, and what it changes."],
  ["Product and feature launches", "Clear market education for a new product, capability, or construction-specific use case."],
  ["Long-term category partnerships", "Sustained alignment with one serious brand in a strategically relevant category."],
  ["Webinars and industry education", "Live or recorded education designed for owners, executives, and project leaders."],
  ["Licensed paid-media campaigns", "Separately scoped usage for approved content across paid channels and partnership ads."],
  ["Product advisory", "Construction-industry insight, product feedback, and strategic access—always scoped apart from sponsorship."],
];

const Partnerships = () => (
  <>
    <SEO
      title="Strategic Brand Partnerships — ALP"
      description="ALP selectively partners with brands whose products materially improve how contractors operate, manage risk, protect margin, and build stronger businesses."
      canonical="/partnerships"
    />
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-border pt-[72px]">
        <div className="alp-shell py-20 md:py-28 lg:py-36">
          <p className="alp-eyebrow">Strategic Brand Partnerships</p>
          <h1 className="alp-display mt-7 max-w-6xl text-[clamp(4rem,8vw,8rem)]">
            Reach the contractors who make the decisions.
          </h1>
          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-[1.15fr_0.85fr]">
            <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              ALP works with a limited number of brands whose products and services help construction companies improve financial control, operations, risk management, project delivery, and profitable growth.
            </p>
            <p className="alp-italic max-w-xl text-2xl leading-snug text-accent">
              We have earned the attention of the people your company is trying to sell to.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="alp-shell grid gap-14 py-20 md:py-28 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/45">The audience</p>
            <h2 className="alp-display mt-5 text-5xl sm:text-6xl">Authority before reach.</h2>
            <p className="mt-6 max-w-md leading-relaxed text-background/60">
              ALP is a specialized construction-business media and education platform. The value is not a follower count. It is trust with owners and operators who evaluate, specify, purchase, and implement.
            </p>
          </div>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {audienceSignals.map((signal, index) => (
              <div key={signal} className="grid grid-cols-[38px_1fr] gap-3 border-t border-background/20 py-5">
                <span className="alp-italic text-lg text-background/35">{String(index + 1).padStart(2, "0")}</span>
                <p className="leading-relaxed text-background/78">{signal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="alp-shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr]">
            <div>
              <p className="alp-eyebrow">Partnership formats</p>
              <h2 className="mt-5 text-4xl leading-tight md:text-5xl">Education and credibility—not scripted endorsement.</h2>
            </div>
            <div className="border-t border-foreground">
              {partnershipFormats.map(([title, description], index) => (
                <div key={title} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[52px_0.7fr_1.3fr] sm:items-start">
                  <span className="alp-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/55">
        <div className="alp-shell grid gap-12 py-20 md:py-28 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="alp-eyebrow">The standard</p>
            <h2 className="mt-5 text-4xl leading-tight md:text-5xl">The credibility is the product.</h2>
          </div>
          <div>
            <blockquote className="alp-italic border-l-2 border-accent pl-6 text-3xl leading-snug md:text-4xl">
              ALP does not accept scripted endorsements for products we have not evaluated.
            </blockquote>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Partners must be aligned with our audience, support genuine educational value, provide reasonable product access, and allow ALP to speak only to benefits we can independently substantiate.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="border-t border-foreground pt-4">
                <h3 className="text-lg">Content partnership</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Campaign strategy, approved deliverables, production, organic placement, and specifically licensed usage.</p>
              </div>
              <div className="border-t border-foreground pt-4">
                <h3 className="text-lg">Product advisory</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Construction-industry insight, product evaluation, and development feedback are separate professional work with a separate scope.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnershipApplicationForm />
      <Footer />
    </main>
  </>
);

export default Partnerships;
