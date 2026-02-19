
# Two Changes: Ask Marshall Card Redesign + Live Sessions vs. ALP University Separation

---

## Problem 1: Ask Marshall Card Looks Sunken, Not Elevated

### Why It Looks Wrong
The standard cards use `.glass-card` which has `shadow-premium` (a multi-layer lifted shadow) and a subtle gradient background — they literally look like they're floating off the page. The Ask Marshall card currently replaces all of that with `bg-primary/5` (a flat tinted fill) and no elevation shadow. The result: the other two cards look like glass tiles hovering above the surface, and Ask Marshall looks like a pressed button inset into the surface.

### The Fix: Elevate It Further, Not Differently
Instead of using a different background treatment, the Ask Marshall card needs to be *more* elevated than its siblings — not differently styled. The approach:

**Keep `.glass-card` as the base** (same floating aesthetic as siblings), then layer on top:
- A brighter, more prominent gold border: `border-primary/60` instead of `border-primary/10`
- A gold outer glow shadow on top of `shadow-premium`: add `shadow-[0_0_35px_-5px_hsl(45_100%_51%/0.4)]`
- Slightly scale it up at rest: `scale-[1.02]` so it's physically taller/larger than its neighbors on desktop
- Keep the top banner but give it a solid gold background (`bg-gradient-gold text-primary-foreground`) so it reads like a highlighted "RECOMMENDED" ribbon, not a muted note
- The icon circle upgrades to `bg-primary/30` with the icon in gold
- CTA text stays `font-bold text-base text-primary`

This way all three cards share the same material (glass, elevated) but Ask Marshall is unambiguously the biggest and brightest one in the group.

**File:** `src/components/StartHere.tsx`

---

## Problem 2: "ALP Courses" Misrepresents Live Group Sessions

### The Reality
- **Power Hour** — live group call, daily, 8am EST
- **Sales & Marketing School** — live group call, weekly
- **Contractor School** — live group call, weekly
- **ALP University** — recorded video library, $197/month (a passive content product)

Lumping all four under one label creates a false impression. ALP University is a fundamentally different product type (self-paced, subscription, recorded) from the three live programs.

### The Fix: Split into Two Subsections

**Rename the current section from "ALP Courses" to "Live Group Programs"** and keep only the three live sessions (Power Hour, Sales & Marketing, Contractor School) in a 3-column grid.

**Add a separate smaller row below it** for ALP University, positioned as the "on-demand" companion — a different value prop. It gets its own label like "On-Demand Library" with copy that makes clear it's the recorded archive, not a live program.

This creates two distinct product categories:
```text
┌──────────────────────────────────────────────────────┐
│  LIVE GROUP PROGRAMS                                 │
│  [Power Hour] [Sales & Marketing] [Contractor School]│
│  3 cards, full width, 3-col grid                     │
├──────────────────────────────────────────────────────┤
│  ON-DEMAND LIBRARY                                   │
│  [ALP University — $197/mo]  (single wider card)     │
└──────────────────────────────────────────────────────┘
```

ALP University's card gets a slightly different treatment — perhaps a horizontal layout (icon + text side by side) or a full-width banner card — to visually signal it's a different product type. Its tagline updates to something accurate like: "Recorded sessions + full video training library — $197/month."

**File:** `src/components/Services.tsx`

---

## Summary

| Change | File | What Changes |
|---|---|---|
| Ask Marshall card elevated above siblings | `StartHere.tsx` | Glass base kept, gold border brightened, outer glow added, scale-up at rest, solid gold banner |
| Live programs renamed + separated from University | `Services.tsx` | Section split into "Live Group Programs" (3-col) and "On-Demand Library" (ALP University, full-width card) |

No new components. No database changes. Two targeted file edits.
