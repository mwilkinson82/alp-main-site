
# Homepage Restructure — Hybrid Positioning for Volume Inbound

This is a significant structural and copy overhaul across 3 files. The goal: shift from "exclusive advisory gatekeeping" to "content-forward authority + multiple accessible entry points" — which ChatGPT calls the hybrid that maximizes both volume and premium conversion.

---

## The Core Problem

The current homepage is optimized for one thing: filtering for high-ticket advisory clients. That's great for positioning but terrible for volume. The feedback is clear — you need a funnel that lets people start small ($250 Ask Marshall), warm up through content (Origin Story video, Articles), and self-select into advisory. Right now there's no easy "start here" path.

---

## New Homepage Flow (Target State)

```text
1. Hero (content-forward authority)
2. Start Here — 3 entry points (Watch / Read / Ask)
3. Credibility Stats + "As Featured In"
4. Origin Story Video (already exists in About — moves up)
5. Ask Marshall $250 (standalone section)
6. Direct Access Options — $1K / $5K (renamed from "Work With Marshall")
7. Learn the ALP Framework (renamed from "Structured Programs", removes Contractor School)
8. Latest Insights — 3 article previews pulled from backend
9. Testimonials (existing)
10. Footer
```

---

## File-by-File Changes

### 1. `src/components/CinematicHero.tsx`

**Headline:**
- Current: `Strategic Advisory for / Operators Who Demand Results`
- New: `Strategic Leverage for / Founders and Operators`

**Subheadline:**
- Current: `Marshall Wilkinson advises founders, executives...`
- New: `Marshall Wilkinson teaches negotiation, execution, and decision architecture — built from over $5B in real-world outcomes across high-stakes environments.`

**Micro line (replaces current quiet selectivity line):**
- Remove: `"Not built for everyone. Designed for operators who move."`
- Add: `Frameworks, not motivation. Strategy, not noise.`

**Authority line:**
- Remove the standalone authority line (now embedded in subheadline)

**CTA Buttons — rewire both:**
- Primary: `Watch the Origin Story` → scrolls to `#origin-story` anchor (which we'll add to the About section's video)
- Secondary: `Work With Marshall` → scrolls to `#services`

**Remove:**
- The "Not built for everyone" line (per ChatGPT's explicit instruction)
- The "Client Login" link (moves to Header or Footer, not prime hero real estate)

**Add one brand line above CTAs:**
- `"I teach the frameworks. I deliver the outcomes."` — rendered as a small gold-tinted italic line, centered

---

### 2. `src/pages/Index.tsx` — Homepage Restructure

This is the main structural change. The component order and new sections are defined here.

**New import:** `StartHere` (new component), `LatestInsights` (new component), `AskMarshallHighlight` (new component)

**New component order:**
```
<CinematicHero />           ← updated copy
<StartHere />               ← NEW: 3 entry point cards
<FeaturedIn />              ← stays (credibility)
<About />                   ← stays but Origin Story video gets id="origin-story"
<AskMarshallHighlight />    ← NEW: dedicated $250 section before advisory cards
<Services />                ← updated (see below)
<LatestInsights />          ← NEW: 3 article previews from backend
<CoachingTestimonials />    ← stays
<Testimonials />            ← stays
<Footer />
<PersistentCTA />
```

**Remove from homepage:**
- `InlineTestimonial` (both instances) — they break flow of the new structure
- `ContactForm` — redundant with application modal
- `CTA` component — replaced by AskMarshallHighlight and Services

---

### 3. New Component: `src/components/StartHere.tsx`

A new section immediately below the hero. Three cards in a row:

**Card 1 — Watch the Framework**
- Icon: Play circle
- Subtitle: "The core philosophy behind ALP."
- CTA: `Watch Now` → scrolls to `#origin-story`

**Card 2 — Read Strategic Insights**
- Icon: BookOpen
- Subtitle: "Articles on leverage, decision-making, and execution."
- CTA: `Read Articles` → links to `/blog`

**Card 3 — Ask Marshall ($250)**
- Icon: MessageCircle
- Subtitle: "Get a direct strategic response within 24 hours."
- Badge: `ENTRY POINT`
- CTA: `Submit a Question` → links to `/ask-marshall`

Visual style: Three equal glass-cards in a row on desktop, stacked on mobile. Section header: **"Start Here"** in large bold text.

---

### 4. New Component: `src/components/AskMarshallHighlight.tsx`

A full-width feature section (not a footnote card) dedicated to the $250 Ask Marshall product. This elevates it above the advisory cards.

**Layout:**
- Left: large icon or mockup image (`ask-marshall-loom-preview.png` already exists in assets)
- Right: copy block

**Copy:**
- Eyebrow: `ENTRY POINT — $250`
- Headline: `Submit a Strategic Question`
- Body: `Not ready for a live session? Get Marshall's direct analysis on your most pressing business decision — delivered as a personalized Loom video within 24 hours. No fluff. No waiting. Just leverage.`
- Bullet points: Personalized video analysis / 24-hour turnaround / No live call required
- CTA Button: `Submit a Strategic Question` → `/ask-marshall`

---

### 5. `src/components/Services.tsx`

**Section header rename:**
- Current: `Work With Marshall`
- New: `Direct Access Options`

**Section subheader:**
- Current: `There is one path to working with Marshall directly. Choose your entry point.`
- New: `Private, high-leverage engagements for operators ready to move.`

**Strategy Session card — add "BY APPLICATION" badge:**
- Add the same badge style as Private Advisory but in a muted/subtle version (e.g. `bg-muted border border-primary/30 text-primary` instead of the gold gradient)
- This matches the "Submit Application" CTA already on it

**Strategy Session CTA:**
- Per this new feedback: change back from `Submit Application` → `Book a Strategy Session`
- ChatGPT's new thinking is that the word "application" reduces conversion; filtering happens inside the form

**Programs grid — remove Contractor School:**
- Remove `Contractor School` from the `programs` array
- Rename section header: `Learn the ALP Framework` (from `Structured Programs`)
- Remaining programs: Power Hour / Sales & Marketing / ALP University

**Ask Marshall callout at bottom:**
- Remove the horizontal callout card entirely (now elevated to its own `AskMarshallHighlight` section above)

---

### 6. New Component: `src/components/LatestInsights.tsx`

Pulls the 3 most recent published articles from the backend and renders them as a strip of preview cards.

**Query:** `supabase.from('blog_posts').select('id, title, slug, excerpt, featured_image_url, published_at').eq('published', true).order('published_at', { ascending: false }).limit(3)`

**Layout:**
- Section header: `Latest Insights`
- Subheader: `Strategic frameworks, negotiation insights, and execution models.`
- 3 cards in a row (on desktop), each showing: featured image (or placeholder), title, excerpt (truncated), date, "Read Article →" link
- CTA below: `View All Articles →` → `/blog`
- Loading state: skeleton cards

---

### 7. `src/components/About.tsx` — Small Anchor Addition

Add `id="origin-story"` to the video wrapper div so the hero "Watch the Origin Story" button can scroll directly to it.

---

## Summary Table

| File | Change Type | What Changes |
|---|---|---|
| `CinematicHero.tsx` | Copy rewrite | Headline, subheadline, micro line, CTAs, remove exclusivity language |
| `Index.tsx` | Structure | New component order, new imports, removes InlineTestimonials/ContactForm/CTA |
| `StartHere.tsx` | New component | 3 entry point cards below hero |
| `AskMarshallHighlight.tsx` | New component | Full-width $250 feature section above advisory cards |
| `LatestInsights.tsx` | New component | 3 latest articles pulled from backend |
| `Services.tsx` | Copy + data | Rename section, add badge to Strategy Session, change CTA text, remove Contractor School, rename programs section, remove Ask Marshall callout |
| `About.tsx` | Anchor | Add `id="origin-story"` to video wrapper |

No database changes. No new routes. 3 new components, 4 file edits.
