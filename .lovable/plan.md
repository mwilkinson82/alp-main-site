
# Site-Wide Copy & Strategy Refinement — Implementing ChatGPT's Recommendations

This plan covers all the actionable changes from the audit, filtered and adapted to fit the existing codebase and brand positioning. Some suggestions are adopted as-is, some are adjusted, and a few are skipped with explanation.

---

## What's Being Changed (and Why)

### 1. Navigation Rename — `src/components/Header.tsx`

| Current | New | Reason |
|---|---|---|
| Articles | Insights | More intellectual, authority-driven |
| Programs | Ecosystem | Signals multi-layered, strategic positioning |
| 1-on-1 Consulting | 1-on-1 Advisory | Premium tone; aligns with "advisory firm" brand positioning |

The route links stay the same (`/articles`, `/programs`, `/coaching`) — only the display text changes.

---

### 2. Hero CTA Buttons — `src/components/CinematicHero.tsx`

**Current:**
- Gold primary: "Watch the Origin Story"
- Outline secondary: "Work With Marshall"

**New:**
- Gold primary: "Submit a Strategic Question →" — links to `/ask-marshall`
- Outline secondary: "Watch the Origin Story" — scrolls to `#origin-story`

ChatGPT's reasoning is correct: one clear first step beats two competing calls to action. "Submit a Strategic Question" is the single lowest-friction, highest-clarity CTA for a new visitor.

---

### 3. About / "Why Marshall" Copy — `src/components/About.tsx`

The subheadline under "Why Marshall" gets tightened:

**Current:** "The strategic mind behind billion-dollar decisions"

**New:** "Marshall Wilkinson has advised on over $5B in negotiated outcomes and enterprise-scale execution environments. He now teaches the frameworks behind those decisions to founders, operators, and contractors building serious companies."

This replaces the vague subheadline AND the opening body paragraph — replacing them both with this single, clean, confident authority statement as the section subheadline. The rest of the body copy stays.

---

### 4. Live Group Programs Section Header — `src/components/Services.tsx`

**Current label chip:** "Live Group Programs"
**Current sub-text:** "Daily & weekly live calls — real-time, interactive, recorded for members"

**New heading (h3):** "Train Live. Think Sharper. Move Faster."
**New subheadline:** "Daily and weekly strategic sessions for operators in motion."

The chip badge label ("Live Group Programs") stays as a category identifier above the new heading.

**Contractor School tagline update:**
- Current: "Scale your construction business"
- New: "Scale like an operator, not a tradesman."

---

### 5. ALP University Card Rewrite — `src/components/Services.tsx`

The On-Demand Library card copy gets replaced entirely:

- **Title:** ALP University → "ALP University — The Operator's Archive"
- **Description:** "Access every recorded Power Hour, Sales & Marketing School, and Contractor School session — indexed and updated daily. This is where serious operators study the thinking."
- **Price:** "$197/month — Cancel anytime."
- **CTA:** "Learn More" → "Enter the Archive →"
- **Microline** under CTA: "If you can't attend live, you can still study the room."

---

### 6. Latest Insights Subheadline — `src/components/LatestInsights.tsx`

**Current:** "Strategic frameworks, negotiation insights, and execution models."

**New:** "Where strategic thinking is sharpened publicly."

---

### 7. Lead Magnet Body Copy — `src/components/LeadMagnet.tsx`

**Current:** "Download the core framework Marshall uses with private advisory clients — free."

**New:** "Download the core decision framework used in billion-dollar negotiations."

Clean. Confident. No need to say "free" when the form already conveys that.

---

### 8. Persistent CTA Button Text — `src/components/PersistentCTA.tsx`

**Current button:** "Submit a Question"
**New button:** "Start Here →"

Less transactional, more inviting — as recommended.

---

## What's NOT Being Changed (and Why)

- **Section order:** The current order (Hero → Start Here → Featured In → About → Ask Marshall Highlight → Services → Latest Insights → Lead Magnet → Testimonials) is functionally correct and was intentionally designed in prior sessions. Reordering everything is a large structural change that deserves its own conversation.

- **"Get Everything" bundle section removal:** The bundles (Growth Academy, Full Access) are legitimate product offerings. Removing them in this pass would require product-level decisions. Left as-is.

- **CoachingTestimonials "Direct Advisory" rename:** The testimonials section is titled "What Clients Say About 1-on-1 Consulting" internally. Renaming it to "Direct Advisory" with a CTA button is a good idea — adding it to this pass since it's a small targeted change in `src/components/CoachingTestimonials.tsx`.

---

## Files to Edit

| File | Changes |
|---|---|
| `src/components/Header.tsx` | Nav labels: Articles → Insights, Programs → Ecosystem, 1-on-1 Consulting → 1-on-1 Advisory |
| `src/components/CinematicHero.tsx` | Swap hero CTAs: gold = "Submit a Strategic Question", outline = "Watch the Origin Story" |
| `src/components/About.tsx` | Replace subheadline with tightened authority copy |
| `src/components/Services.tsx` | Live section heading + subheadline, Contractor School tagline, ALP University card full rewrite |
| `src/components/LatestInsights.tsx` | Subheadline copy update |
| `src/components/LeadMagnet.tsx` | Body copy update |
| `src/components/PersistentCTA.tsx` | Button text "Submit a Question" → "Start Here →" |
| `src/components/CoachingTestimonials.tsx` | Section header → "Direct Advisory" + add "Book a Strategy Session →" CTA button below testimonials |

8 files. All copy and light structural changes — no new components, no database changes, no routing changes.
