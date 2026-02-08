

## Elevate 1-on-1 Coaching on the Homepage

The goal is to give the 1-on-1 Coaching line -- especially the 6-Session Intensive -- prominent placement on the homepage so visitors see it as a flagship offering, not just a footnote.

### What Changes

**1. Replace the existing "Need Personalized Guidance?" card in the Services section**

The current card at the bottom of the Services section is generic and easy to scroll past. We'll replace it with a more compelling, dedicated coaching promotion that:
- Highlights the **6-Session Intensive at $5,000** by name and price
- Calls out the key differentiator: direct access to Marshall between sessions via text and Discord
- Uses stronger copy focused on risk mitigation, scaling confidence, and having an advisor in your corner
- Includes a primary CTA button that links directly to the Stripe checkout for the 6-Session Intensive
- Includes a secondary "Learn More" link to `/coaching` for those who want details first

**2. Add an InlineTestimonial or coaching-focused callout between sections**

Insert a new content block (between About and Testimonials) that positions coaching as the "top-tier" ALP service. This would be a visually distinct banner-style section with:
- A bold headline like "Your Business Decisions Are Too Important to Wing It"
- A short paragraph about how the 6-Session Intensive fits the needs of most clients
- Two CTAs: "Get the 6-Session Intensive" (Stripe link) and "Explore All Coaching Options" (link to /coaching)

### Technical Details

**Files modified:**
- `src/components/Services.tsx` -- Replace the bottom "Personalized Guidance" card with an upgraded coaching promotion featuring the 6-Session Intensive, its price, key benefits, and a direct Stripe checkout button alongside a link to `/coaching`
- `src/pages/Index.tsx` -- Add a new dedicated coaching CTA section component between the About/InlineTestimonial block and the Testimonials section

**New file:**
- `src/components/CoachingCTA.tsx` -- A standalone homepage section component with:
  - A compelling headline and supporting copy about risk mitigation and scaling with expert guidance
  - The 6-Session Intensive called out with price and key features (direct access, six 1-hour sessions, strategic roadmap)
  - Primary button linking to the Stripe checkout URL
  - Secondary outline button linking to `/coaching`
  - Styled consistently with the existing glass-card / gold-gradient design system

No database, backend, or dependency changes are needed.
