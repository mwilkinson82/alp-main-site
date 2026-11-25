import { Button } from "@/components/ui/button";
import bookCover from "@/assets/dont-grow-scale-cover.jpg.asset.json";
import { BOOK_PRICE_USD, BOOK_SALES_URL } from "@/lib/bookOffer";

const BookFeature = () => (
  <section
    id="dont-grow-scale"
    aria-labelledby="book-heading"
    className="border-b border-border bg-secondary/40"
  >
    <div className="alp-shell grid items-center gap-6 py-10 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-10 md:py-12 lg:gap-16">
      <img
        src={bookCover.url}
        alt="Don't Grow, Scale book cover"
        width={800}
        height={1200}
        loading="lazy"
        decoding="async"
        className="mx-auto aspect-[2/3] h-auto w-[160px] max-w-full object-contain shadow-elegant sm:w-[220px]"
      />
      <div className="min-w-0">
        <p className="alp-eyebrow">NEW BOOK FROM MARSHALL WILKINSON</p>
        <h2 id="book-heading" className="mt-3 text-3xl leading-tight tracking-normal sm:text-4xl">
          Don't Grow, Scale
        </h2>
        <p className="mt-2 text-lg leading-snug sm:text-xl">
          The Architecture of Competitive Advantage
        </p>
        <p className="alp-italic mt-4 text-xl leading-snug text-accent sm:text-2xl">
          We don't scale businesses. We scale advantages.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Audiobook, Kindle edition and Illustrated PDF. One price, all three.
        </p>
        <Button asChild className="alp-button mt-6">
          <a href={BOOK_SALES_URL} target="_blank" rel="noopener noreferrer">
            Get the book · ${BOOK_PRICE_USD.toFixed(2)}
          </a>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Included for Contractor Circle members.
        </p>
      </div>
    </div>
  </section>
);

export default BookFeature;