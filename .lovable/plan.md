
## Homepage Strategic Repositioning — Advisory Firm Positioning

### Summary
This is a targeted content and copy rewrite — not a visual redesign. The site already looks premium. What we're changing is the **language, hierarchy, and offer framing** to position Marshall as a strategic advisor, not a transactional coach with a product menu.

---

### Changes Overview

**1. Hero Section — Rewrite (`src/components/CinematicHero.tsx`)**

The current headline ("Transform Your Business with Proven Expertise") and subheadline reference construction-heavy language and feel generic. We rewrite this with the exact copy recommended:

- **Overline**: Keep "Altitude Logic Pressure" pill — it's brand, not filler
- **Headline**: "Strategic Advisory for Operators Who Demand Results"
- **Subheadline**: "Marshall Wilkinson advises founders, executives, and high-performing professionals on negotiation, execution, and scale — using frameworks forged in high-stakes business environments."
- **Authority line** (new, smaller text with gold accent on numbers): "Over $5B executed. Complex negotiations. Real-world leverage under pressure."
- **Primary CTA button**: "Request Private Advisory Access" → links to `/coaching`
- **Primary CTA microcopy** (small text below): "For founders and executives making consequential decisions."
- **Secondary CTA button**: "Start With a Strategy Session" → links to `/coaching`
- **Secondary CTA microcopy** (small text below): "A focused 60-minute deep dive. By application only."
- **Trust stat cards**: Remove "Elite Coaching" label from the first card → change to "Elite Consulting". Keep the 3 stat cards but update the bottom label on card 1 from "Elite Coaching" to "Elite Consulting"
- **Remove**: The `<Calendar>` import and icon (no longer used)

**2. Services Section — Restructured (`src/components/Services.tsx`)**

Replace the scattered product grid with the clean 3-path "Work With Marshall" structure:

- **Section header**: Change from "Programs / Choose your path" to **"Work With Marshall"** with subtext "There is one path to working with Marshall directly. Choose your entry point."
- **Path 1 — Private Advisory** (replaces the 6-Session card):
  - Title: "Private Advisory"
  - Description: "Long-term strategic access for high-level operators."
  - Price: "$5,000" (kept visible — pre-qualifies mindset)
  - Benefits list: unchanged
  - Badge: Change "MOST POPULAR" → "BY APPLICATION"
  - **Button**: Remove direct Stripe checkout. New button: "Request Advisory Access" → links to `/coaching`
- **Path 2 — Strategy Session** (replaces the Single Session card):
  - Title: "Strategy Session"
  - Description: "A focused 60-minute deep dive on your most pressing issue."
  - Price: "$1,000" (kept visible)
  - Benefits: unchanged
  - **Button**: Remove direct Stripe checkout. New button: "Apply for a Session" → links to `/coaching`
- **"View all consulting options" link**: Keep — it now makes more sense contextually
- **Tier 2 Group Programs**: Keep exactly as-is — grid of 4 program cards. This is fine as self-serve
- **Bundles (Tier 3)**: Keep exactly as-is — self-serve checkout modals are appropriate here
- **Ask Marshall callout**: Keep — it's a soft entry point, appropriate at the bottom
- **Remove**: `STRIPE_SINGLE` and `STRIPE_6SESSION` constants (no longer used in this file; they remain on the `/coaching` page)

**3. Page Flow — Remove `CoachingCTA` (`src/pages/Index.tsx`)**

The `CoachingCTA` section mid-page ("Still Deciding? Start With One Session — $1,000" with a direct Stripe link) undercuts the advisory positioning being built above. Remove it from the homepage. It can remain on the `/coaching` page where buyers are already researching.

- Remove `<CoachingCTA />` from the JSX
- Remove the `CoachingCTA` import

**4. Move First Testimonial Higher (`src/pages/Index.tsx`)**

Currently the first inline testimonial ("Marshall didn't just coach me — he rebuilt the way I think about business" — Ahron Gluck) appears *after* the Services section. Per the recommendation, a high-authority testimonial should appear *immediately after* the "Work With Marshall" section.

New page flow:
```text
CinematicHero
FeaturedIn
Services (restructured)
InlineTestimonial — Ahron Gluck (moved up — was after Services already, stays here)
About
InlineTestimonial — AJ Hoover
CoachingTestimonials
Testimonials
ContactForm
CTA
Footer
PersistentCTA
```

The first InlineTestimonial is already positioned after Services — so this ordering is correct as-is. We simply remove `CoachingCTA` which currently sits between the second testimonial and `CoachingTestimonials`.

**5. About Section — Language Update (`src/components/About.tsx`)**

Minor copy updates to shift from biography/construction-heavy framing to strategic capability framing:

- Section header: "Meet Marshall" → "Why Marshall"
- Subheadline: "Builder of systems, strategist, and architect of transformation" → "The strategic mind behind billion-dollar decisions."
- Highlight card 1 title: "Proven Track Record" → "Executed at Scale" | description: remove "construction projects" → "Over $5B in high-stakes negotiations and executed projects"
- Highlight card 3: "Focused Expertise" → "Decision Architecture" | description: "Specialized in high-leverage decision-making, negotiation, and scale"
- In the body copy, soften the construction-specific references — keep them as proof points ("where failure wasn't an option") but don't lead with them

---

### What We Are NOT Changing
- The visual design, color scheme, glassmorphism cards, or layout structure
- The `/coaching` page (all Stripe links and full offer detail remain there)
- Group program pages, bundle modals, or Ask Marshall page
- The video/image cinematic sequence intro logic
- FeaturedIn, CoachingTestimonials, Testimonials, ContactForm, CTA, Footer components

---

### Files to Edit
1. `src/components/CinematicHero.tsx` — Rewrite hero copy + CTAs
2. `src/components/Services.tsx` — Restructure offer hierarchy, remove Stripe links, update CTA language
3. `src/pages/Index.tsx` — Remove `CoachingCTA`
4. `src/components/About.tsx` — Update section header and highlight card copy
