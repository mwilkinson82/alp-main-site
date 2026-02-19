
# Three Focused Changes: Section Rename, Ask Marshall Standout Card, Featured In Jazz-Up

---

## Change 1: Rename "Learn the ALP Framework" → "ALP Courses"

**File: `src/components/Services.tsx`**

The `<h3>` heading that currently reads "Learn the ALP Framework" will be changed to **"ALP Courses"** — short, distinct, and doesn't conflict with the lead magnet section's "ALP Framework" language lower on the page.

---

## Change 2: Ask Marshall Card Stands Out in "Start Here"

**File: `src/components/StartHere.tsx`**

Currently, all three cards use the exact same `glass-card` styling. The Ask Marshall card (index 2) needs to visually break from the pack as the recommended entry point. The fix applies conditional styling when `index === 2`:

**Card container gets:**
- A gold-tinted border: `border border-primary/40` (replaces the plain glass border)
- A very subtle gold background tint: `bg-primary/5`
- A soft gold glow shadow: `shadow-[0_0_30px_-5px_hsl(45_100%_51%/0.25)]`

**Icon background gets:**
- Upgraded from `bg-primary/10` to `bg-primary/20` — more visible gold circle

**Badge gets upgraded from a tiny pill to a prominent label:**
- Current: tiny 10px pill in the top-right corner with low contrast
- New: full-width banner strip at the top of the card reading **"MOST POPULAR ENTRY POINT"** in gold text on a `bg-primary/10` background with a bottom border `border-b border-primary/20` — mimics a "recommended" ribbon treatment

**CTA text gets a visual boost:**
- The `Submit a Question` CTA link text gets bumped to `font-bold` and `text-base` (vs the other cards' `text-sm`) and the arrow gets a gold ring treatment

This makes the Ask Marshall card feel like a featured/recommended product without being garish.

---

## Change 3: "As Featured In" Strip — Credibility Chip Treatment

**File: `src/components/FeaturedIn.tsx`**

Right now the section is invisible: plain muted text on a muted background with no visual anchors. Three things change:

**Section header upgrade:**
- "As Featured In" label gets a decorative treatment: two thin gold lines flanking it on left and right (using CSS flex + `border-t border-primary/40` dividers), making it feel like a formal credibility section rather than a footnote

**Publication names become bordered chips:**
- Each name gets wrapped in a `border border-primary/20 rounded-full px-5 py-2` chip with `bg-primary/5` background tint
- Text color lifts from `text-foreground/60` to `text-foreground/80` with `font-semibold`
- On hover: `hover:border-primary/50 hover:bg-primary/10 transition-colors` for subtle interactivity

**Section background:**
- Stays muted but the padding increases slightly (`py-14`) so there's more breathing room around the chips — currently it feels cramped which contributes to the "invisible" feeling

These three together make the Featured In strip feel like a credibility statement, not an afterthought.

---

## Summary

| Change | File | What Changes |
|---|---|---|
| Rename section header | `Services.tsx` | "Learn the ALP Framework" → "ALP Courses" |
| Ask Marshall card standout | `StartHere.tsx` | Gold border, gold background tint, top banner badge, stronger CTA |
| Featured In visual upgrade | `FeaturedIn.tsx` | Flanking dividers on label, chip-style publication names, lifted opacity |

No new components. No database changes. Three targeted file edits.
