
# Remove Pricing From Homepage Cards — Conviction Over Catalog

## The Core Decision

The homepage should build conviction and drive qualified clicks — not act as a price list. Showing dollar amounts on the homepage before someone understands the value risks two things: sticker shock on the high-ticket offers, and underselling the low-ticket ones by reducing them to a commodity number. The one exception is ALP University, where "$197/month — Cancel anytime" is a reassurance signal, not a price shock. It stays.

## What's Changing

### 1. StartHere.tsx — "Choose Your Access Level" section

**Ascension Ladder Strip (the horizontal pill badges):**
- Remove all price labels from the ladder steps
- The steps become: ALP University → Ask Marshall → Strategy Session → Private Advisory → Full Access Membership
- The strip communicates progression, not pricing

**The three access-tier cards:**
- **ALP University card**: Remove the `$197/mo` price line from the card body. The price will be discovered on the `/alp-university` page.
- **Ask Marshall card** (featured): Remove the `$250` price line from the card body.
- **Direct Advisory card**: Remove the `From $1,000` price line from the card body.
- All CTAs, icons, subtitles, and body copy remain exactly as-is.
- The "Most Popular Entry Point" gold banner on Ask Marshall stays — it's a social proof signal, not a price.

### 2. Services.tsx — "Direct Access Options" section

**Advisory Cards (Strategy Session / Private Advisory):**
- Remove the large `$1,000` and `$5,000` price displays from both cards
- The session labels ("1-session intensive" / "6-session intensive") stay — they communicate value structure, not cost
- The benefit bullet lists stay
- The "BY APPLICATION" badges stay — they reinforce exclusivity
- The CTA buttons stay ("Book a Strategy Session" / "Request Private Advisory") — they open the application modal, not a checkout, so no price needs to appear in the button
- The "View all consulting options" link below the cards stays — it points to `/coaching` where pricing is fully contextualized

**Everything else in Services.tsx stays unchanged:**
- Live Group Programs cards (Power Hour, Sales & Marketing, Contractor School) — no prices were shown here anyway
- ALP University wide card — keeps its `$197/month` line (subscription reassurance, not shock)
- Maximum Proximity / Full Access card — no prices shown (already clean from the previous update)

## What Stays the Same — And Why

| Element | Stays | Reason |
|---|---|---|
| ALP University $197/mo | Yes | Low-ticket subscription — transparency aids conversion |
| Advisory application modal | Yes | Price lives inside the modal as a qualifier |
| Session labels (1-session / 6-session) | Yes | Value structure, not cost |
| BY APPLICATION badges | Yes | Exclusivity signal |
| All CTAs and links | Yes | Drive to dedicated pages where pricing has full context |

## Files to Change

- **`src/components/StartHere.tsx`**:
  - Remove `price` field values from the `ladderSteps` array (or remove the price rendering entirely)
  - Remove `price` display lines from all three entry cards

- **`src/components/Services.tsx`**:
  - Remove the `price` field and the `<div className="flex items-baseline gap-1">` price block from each advisory card rendering

## Result

Visitors land on the homepage and understand **what** is available and **why** it matters. The price discovery happens in context — on the page for that specific offer — where the full value proposition is laid out. The homepage becomes a conviction engine that earns the click, not a menu that prices them out before they're ready.
