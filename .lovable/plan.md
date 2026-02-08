

## Redesign the Programs Section on the Homepage

Right now the Programs area has three separate blocks stacked on top of each other -- four individual program cards, then a "Bundle & Save" section with three pricing cards (including the 6-Session Intensive mixed in with bundles it doesn't belong with), then a separate 1-on-1 coaching card at the bottom. It reads as three disconnected sections and on mobile it's a long, confusing scroll. Here's the fix.

### The Problem

- The 6-Session Intensive is lumped into "Bundle & Save" alongside Growth Academy and Full Access, but it's not a bundle -- it's a standalone coaching product. This is confusing.
- Three separate sub-sections (program cards, bundles, coaching CTA) make the area feel cluttered and repetitive.
- On mobile, four program cards stacked vertically plus three bundle cards plus a coaching CTA card is a LOT of scrolling with no clear hierarchy.
- The CoachingCTA component further down the page repeats the same 6-Session Intensive pitch again.

### The New Structure

Consolidate everything under "Programs" into two clear tiers with a simple visual hierarchy:

**Tier 1: "Work With Marshall Directly" (1-on-1 Coaching)**
- Featured at the top as the premium offering
- Shows the two coaching packages side-by-side: Single Session ($1,000) and 6-Session Intensive ($5,000, highlighted as most popular)
- Each card has 3 bullet-point benefits and a direct Stripe checkout button
- On mobile: stacks vertically, full-width cards, large tap targets

**Tier 2: "Group Programs & Training"**
- The four programs (Power Hour, Contractor School, Sales & Marketing School, ALP University) shown as a clean, compact list/grid
- On mobile: 2-column grid instead of single-column stack to reduce scroll length
- Each card is simplified -- icon, title, one-liner, tap to learn more

**Tier 3: "Get Everything" (Bundles)**
- Two bundle options only: Growth Academy ($2,000) and Full Access ($10,000)
- Positioned as the value play for people who want multiple programs
- Each card opens its existing modal for duration selection
- On mobile: stacks to full-width

**Single CTA at the bottom**: "View All Programs & Pricing" linking to /programs

The separate CoachingCTA component stays on the homepage but gets updated copy to avoid repeating the exact same pitch -- it becomes a reinforcement/reminder rather than a duplicate.

### Technical Details

**Files modified:**

1. `src/components/Services.tsx` -- Complete rewrite of the section content:
   - Remove the current `bundles` array (which incorrectly mixes coaching with bundles)
   - Remove the standalone "1-on-1 Coaching CTA" card at the bottom
   - Add a new `coachingPackages` array with Single Session ($1,000, Stripe link: `https://buy.stripe.com/bJeaEYe0h9L8ao0g5QeQM0R`) and 6-Session Intensive ($5,000, Stripe link: `https://buy.stripe.com/14A5kEf4l0ay7bOaLweQM0Q`)
   - Add a new `bundles` array with only Growth Academy and Full Access (no coaching mixed in)
   - Restructure the JSX into three clearly labeled tiers with appropriate headings
   - Use a 2-column mobile grid (`grid grid-cols-2 md:grid-cols-4`) for the four program cards to cut mobile scroll in half
   - Make all buttons full-width on mobile with minimum 48px tap targets
   - Import and use GrowthAcademyModal and FullAccessModal for bundle selection

2. `src/components/CoachingCTA.tsx` -- Update the copy to be a reinforcement rather than a repeat:
   - Change headline to something like "Still Deciding? Start With One Session"
   - Shift the primary CTA to the Single Session ($1,000) as a lower-commitment entry point
   - Keep the secondary link to /coaching for full details
   - This way the two homepage touchpoints complement each other: Services section sells the Intensive, CoachingCTA catches people who want to start smaller
