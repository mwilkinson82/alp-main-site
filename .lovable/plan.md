
# Homepage Restructure: Ascension Ladder + "Choose Your Access" Architecture

This is a strategic restructure of the homepage to express a clear **progression** rather than a menu of options. ChatGPT's core insight is correct: visitors need to see a ladder, not a list.

---

## What's Actually Being Recommended (Interpreted)

ChatGPT is proposing three core structural changes:

1. **Replace "Start Here" (3 content-entry cards) with "How You Can Engage" (3 access-level cards)** — shifting the framing from "here's how to learn" to "here's how to access Marshall"
2. **Restructure the Services section** to separate "Live Rooms" (group programs) from "Full Access Membership" (bundles) more clearly, and rename accordingly
3. **Navigation rename**: "Ecosystem" → "Access", with a restructured dropdown separating ALP University, Live Rooms, and Full Access Membership

There's also a suggestion for an **Ascension Ladder visual** — a horizontal progression strip showing the full ladder from cheapest to most intensive.

---

## What Already Exists (No Change Needed)

Reviewing the code, several of ChatGPT's suggestions are **already implemented**:
- Hero headline, subheadline, and CTAs ("Submit a Strategic Question" + "Watch the Origin Story") — ✅ already done
- "Direct Advisory" section header in CoachingTestimonials — ✅ done
- ALP University card with "The Operator's Archive" copy and "Enter the Archive →" CTA — ✅ done
- "Train Live. Think Sharper. Move Faster." heading in Services — ✅ done
- Nav labels "Insights", "Ecosystem", "1-on-1 Advisory", "Ask Marshall" — ✅ done

---

## What's NOT Being Changed (and Why)

- **Section order**: The current flow (Hero → Start Here → FeaturedIn → About → AskMarshallHighlight → Services → Insights → Lead Magnet → Testimonials) is already well-structured. ChatGPT's proposed order moves "Why Marshall" above "Ask Marshall" — this is a minor reorder. The bigger concern is the current `About` section is very long (Origin Story video + photo + body copy + highlights grid). Moving it up before the Ask Marshall CTA would bury the conversion point under too much content. Current order is kept.
- **Growth Academy / Full Access bundle removal**: These are real products with Stripe checkout. Leaving them as-is but renaming/repositioning slightly.

---

## Changes Being Made

### Change 1: Replace "Start Here" with "How You Can Engage" — `src/components/StartHere.tsx`

This is the most important change. The section currently shows 3 content-entry cards (Watch the Framework, Read Insights, Ask Marshall). ChatGPT correctly points out these are content lane cards, not **access lane** cards.

**New 3-card structure — 3 access tiers:**

| Card | What It Is | Price | CTA |
|---|---|---|---|
| ALP University | On-demand archive | $197/mo | Enter the Archive → |
| Ask Marshall | Direct strategic answer (no call) | $250 | Submit a Question → |
| Direct Advisory | Private sessions | From $1,000 | Explore 1-on-1 Options → |

**Visual treatment:**
- Ask Marshall card keeps its elevated featured treatment (gold border, glow, scale, solid gold banner "MOST POPULAR ENTRY POINT")
- ALP University card: standard glass-card, left-aligned, icon + copy
- Direct Advisory card: standard glass-card, right-aligned

**Section header copy changes:**
- Title: `Start Here` → **`How You Can Engage`**
- Subheadline: "Three ways to engage with the ALP framework." → **"Three paths depending on how directly you want access."**

---

### Change 2: Add Ascension Ladder Strip — Between Hero and "How You Can Engage" sections

ChatGPT's strongest structural suggestion is a **visual ladder** showing the full progression. This goes inside `StartHere.tsx` as a narrow strip above the 3 cards, inside the same section:

```text
ALP University ($197/mo) → Ask Marshall ($250) → Strategy Session ($1,000) → Private Advisory ($5,000) → Full Access Membership
```

Rendered as a horizontal row of connected steps with arrows between them, using small chips with gold text. On mobile it wraps into 2 rows. This single element communicates the entire business model in one glance.

---

### Change 3: Rename "Ecosystem" nav dropdown → "Access" + Restructure Dropdown — `src/components/Header.tsx`

**New nav label:** "Ecosystem" → **"Access"**

**New dropdown items** (replacing the current "All Programs / Power Hour / Contractor School / Sales & Marketing School / ALP University" list):

```
── ALP University        (On-Demand Archive)
── Live Rooms            → /programs  (links to programs page with live programs anchor)
── Full Access Membership → /programs
```

This matches ChatGPT's recommendation exactly and removes the confusing "All Programs" link in favor of clear category names.

**Mobile nav** also updates: the "Programs" label under the mobile accordion becomes **"Access"**.

---

### Change 4: "Get Everything" → "Full Access Membership" Rename + Subtext — `src/components/Services.tsx`

The bundles section currently has a chip labeled "Get Everything" and a heading "Extended Engagement Options." These get renamed:

- Chip label: "Get Everything" → **"Full Access Membership"**
- Section heading: "Extended Engagement Options" → **"Everything. Live."**
- Bundle descriptions update:
  - Growth Academy: "All 4 group programs + community access" → **"All Live Rooms + community access. Active operator environment."**
  - Full Access: "Everything + 1-on-1 consulting sessions" → **"All Live Rooms + 10 private advisory sessions per year. Maximum proximity."**

---

## Files Being Edited

| File | Change |
|---|---|
| `src/components/StartHere.tsx` | Full rewrite — section title, subheadline, 3 access-lane cards, ascension ladder strip |
| `src/components/Header.tsx` | "Ecosystem" → "Access", restructure dropdown items (desktop + mobile) |
| `src/components/Services.tsx` | Bundles section: chip, heading, and description copy updates |

No new components. No database changes. No routing changes. Three files.

---

## What the Homepage Communicates After These Changes

```text
HERO
"Strategic Leverage for Founders and Operators"
[Submit a Strategic Question] [Watch the Origin Story]

↓

HOW YOU CAN ENGAGE
Ascension Ladder: ALP University → Ask Marshall → Strategy Session → Private Advisory → Full Access
[ALP University $197/mo] [★ Ask Marshall $250] [Direct Advisory from $1,000]

↓

FEATURED IN (credibility chips)

↓

WHY MARSHALL (Origin Story + authority copy)

↓

ASK MARSHALL HIGHLIGHT (full-width feature, $250 entry point)

↓

DIRECT ACCESS OPTIONS
  ├─ Private Advisory section (Strategy Session + Private Advisory)
  ├─ Live Rooms (Power Hour, Sales & Marketing, Contractor School)
  ├─ On-Demand Library (ALP University)
  └─ Full Access Membership (Growth Academy, Full Access bundles)

↓

LATEST INSIGHTS → LEAD MAGNET → TESTIMONIALS
```

This is the clearest expression of the ascension ladder the site has had.
