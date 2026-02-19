
# Homepage Services Section — Strategic Cleanup

## The Three Problems Being Solved

1. Maximum Proximity section shows raw pricing on the homepage, which risks price-shocking visitors before they understand the value
2. "View All Programs & Pricing" button at the bottom duplicates what the Live Rooms page already does — unnecessary redundancy
3. Private Advisory card doesn't make the "6-session" distinction prominent enough — it's buried in a bullet list

## What's Changing

### Part 1 — Maximum Proximity: Remove Pricing, Replace with Outcome Language

The three bundle cards (Power Hour, Full Access, Full Access Annual) currently show large dollar amounts front-and-center. We will:

- Replace the entire three-card bundle grid with a single, wide "Full Access" highlight card — no prices shown
- The card presents the outcomes and what's included (all live rooms, private sessions, community)
- CTA button says **"Explore Full Access"** and links to `/programs` where pricing is shown in full context
- Remove the "View All Programs & Pricing" button at the bottom (redundant — the card CTA replaces it)
- The "Full Access Membership" label pill and "Maximum Proximity." headline remain — they set the right tone

### Part 2 — Advisory Cards: Surface the Session Count

On the Strategy Session card:
- Add a prominent sub-label directly under the title: **"1-session intensive"** (small, gold, bold)

On the Private Advisory card:
- Change the sub-label to: **"6-session intensive"** (same treatment)
- This makes the core distinction scannable before anyone reads a single bullet

### Part 3 — Remove "View All Programs & Pricing" Bottom Button

Since the Maximum Proximity section now has a clear CTA pointing to the Live Rooms page, the bottom "View All Programs & Pricing" button is no longer needed. Removing it tightens the section.

## What Stays the Same

- The three individual program cards (Power Hour, Sales & Marketing, Contractor School) stay — individual links per program are better UX than one generic Live Rooms link
- The advisory cards still use the application modal (no direct checkout)
- The ALP University wide card with "$197/month" pricing stays — it's a low-ticket subscription where transparency aids conversion
- All pricing remains visible on the dedicated `/programs` page

## Files to Change

- **`src/components/Services.tsx`** — all changes are contained here:
  - Restructure `bundles` array into a single full-access highlight object
  - Replace the three-card grid with a single wide card
  - Add session-count sub-labels to both advisory cards
  - Remove the bottom CTA button

## Result

The homepage becomes a conviction page that drives visitors to dedicated pages. Price discovery happens in context (on program pages) rather than as a cold number on the homepage. The advisory section becomes instantly scannable — 1 session vs. 6 sessions is visible at a glance.
