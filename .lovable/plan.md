
# Copy & Positioning Refinements — ChatGPT Feedback Implementation

This is a copy-and-language polish pass across 4 files. No database changes, no new components. Every change is a targeted word swap or small structural tweak.

---

## Files Being Changed

### 1. `src/components/CinematicHero.tsx`

**Authority line (line 148):**
- Current: `Over $5B executed. Complex negotiations. Real-world leverage under pressure.`
- New: `Over $5B executed across high-stakes negotiations and enterprise decisions.`

**Trust indicator label (line 183):**
- Current: `Elite Consulting`
- New: `Private Advisory`

**New quiet line added under the hero subheadline (after line 144):**
- Add: `Not built for everyone. Designed for operators who move.` — rendered as a small italicized muted line, positioned between the subheadline and the authority line.

---

### 2. `src/components/PersistentCTA.tsx`

ChatGPT flagged this as the one element that breaks premium positioning. We'll update the copy to feel controlled rather than sales-funnel-y.

- Text: `Ready to transform your business?` → `Executive Advisory — Limited Openings`
- Button label: `6-Session Intensive` → `Request Access`
- Button behavior: Instead of linking to `/coaching#intensive`, it opens the `AdvisoryApplicationModal` directly
- Remove the `Calendar` icon (too "booking" in energy), replace with `ArrowRight`

This keeps the bar alive (Option B from ChatGPT's suggestion) but makes it feel like access-gating rather than a sales prompt.

---

### 3. `src/components/Services.tsx`

**Section header (line 176):**
- Current: `Group Programs & Training`
- New: `Structured Programs`

**Bundle section header (line 217):**
- Current: `Bundle & Save`
- New: `Extended Engagement Options`

**Strategy Session card button (line 22):**
- Current CTA: `Apply for a Session`
- New CTA: `Submit Application`

**Private Advisory card button (line 37):**
- Current CTA: `Request Advisory Access`
- New CTA: `Request Private Advisory`

**Private Advisory description (line 31):**
- Current: `Long-term strategic access for high-level operators.`
- New: `Direct strategic access for high-level operators navigating consequential decisions.`

**Ask Marshall callout (line 254):**
- Current: `Not ready for a live call?`
- New: `Prefer a focused written or video response?`

**Ask Marshall button (line 260):**
- Current: `Ask Marshall`
- New: `Submit a Strategic Question`

---

### 4. `src/pages/Coaching.tsx`

**Ask Marshall callout heading (line 344):**
- Current: `Not Sure About 1-on-1 Consulting?`
- New: `Prefer a Focused Written or Video Response?`

**Ask Marshall button (line 350):**
- Current: `Ask Marshall — $250`
- New: `Submit a Strategic Question — $250`

---

## Summary of All Changes

| File | What Changes | Why |
|---|---|---|
| `CinematicHero.tsx` | Authority line rewrite, "Elite Consulting" → "Private Advisory", add quiet selectivity line | More institutional language; stronger authority signal |
| `PersistentCTA.tsx` | Headline + button copy, opens application modal instead of /coaching link | Removes funnel energy; consistent with advisory positioning |
| `Services.tsx` | Button CTAs, section headers, Private Advisory description, Ask Marshall framing | Tighter language across every touchpoint |
| `Coaching.tsx` | Ask Marshall heading + button copy | Consistent with homepage changes |

No database changes. No new components. Pure copy and small wiring change (PersistentCTA opens modal instead of linking).
