
# Copy Refresh: Hero, StartHere, About, Services & AskMarshallHighlight

This is a copy-only update — no structural changes, no new components, no routing changes. Every file already exists in the right shape; we're replacing text strings and swapping out a few labels. Five files touch.

---

## What's Changing (File by File)

### 1. `src/components/CinematicHero.tsx`

**Pill tag:**
- Current: `Altitude Logic Pressure`
- New: `ALTITUDE • LOGIC • PRESSURE`

**Headline:**
- Current: `Strategic Leverage for / Founders and Operators`
- New: `Execution Systems for Operators Who Want Scale` (single line, no gold split needed — or keep the same two-line structure with the second line in gold)

**Subheadline:**
- Current: "Marshall Wilkinson teaches negotiation, execution, and decision architecture — built from over $5B in real-world outcomes across enterprise deals and high-stakes business decisions."
- New: "Marshall Wilkinson teaches decision architecture, negotiation leverage, and execution systems built from over $5B in real-world outcomes across enterprise deals and high-stakes operations."

**Microline (italic small text):**
- Current: `Frameworks, not motivation. Strategy, not noise.`
- New: `Frameworks that create revenue, control, and operational dominance.`

**Quote line (brand anchor)** — replace with the anchor sentence:
- Current: `"I teach the frameworks. I deliver the outcomes."`
- New: `ALP installs execution systems that scale businesses without chaos.`

**3 Stat Cards:**

| Card | Current stat | New stat | Current sub | New sub |
|---|---|---|---|---|
| 1 | `1-on-1 Advisory` | `$5B+ Outcomes` | Private Strategic Engagements | Enterprise execution and negotiated results |
| 2 | `1,000+ Hours` | `Systems First` | Training & Consulting | Build infrastructure before scaling volume |
| 3 | `Daily Live` | `Live Operator Rooms` | Power Hour Community | Daily and weekly strategic execution sessions |

---

### 2. `src/components/StartHere.tsx`

**Section title:**
- Current: `How You Can Engage`
- New: `Choose Your Access Level`

**Subheadline:**
- Current: `Three paths depending on how directly you want access.`
- New: `Three paths depending on how directly you want systems, execution clarity, and decision leverage.`

**ALP University card body** (currently has no body text — we add it below the subtitle):
- New body: `Access the full repository of recorded Power Hour, Sales & Marketing School, and Contractor School sessions — indexed and expanded every week.`

**Ask Marshall card body** (currently has no body text — we add it below the subtitle):
- New body: `Submit your most pressing business decision and receive a direct Loom breakdown of what to do next — with clear steps, structure, and leverage.`

**Direct Advisory card body** (currently has no body text — we add it below the subtitle):
- New body: `Private strategic engagements designed to install execution systems, sharpen leadership decisions, and remove bottlenecks.`

The card data array (`entries`) currently only has a `subtitle` field. We'll add a `body` field to each entry and render it as a second paragraph below the subtitle in both the featured and standard card layouts.

---

### 3. `src/components/About.tsx`

**Section subheadline** (under "Why Marshall" heading):
- Current: "Marshall Wilkinson has advised on over $5B in negotiated outcomes and enterprise-scale execution environments. He now teaches the frameworks behind those decisions to founders, operators, and contractors building serious companies."
- New: "Marshall Wilkinson has operated inside high-stakes environments where execution wasn't optional. He has advised on and executed over $5B in outcomes, building systems that protect margin, create leverage, and scale operations without chaos. ALP is not motivation. It's infrastructure."

**Four feature card copy:**

| Card | Current title | New title | Current description | New description |
|---|---|---|---|---|
| 1 | Executed at Scale | Executed at Scale | Over $5B in high-stakes negotiations and executed projects | Real systems built inside enterprise environments. |
| 2 | Results-Driven | Results-Driven | Strategies tested and refined through real-world application | Every framework is built for measurable outcomes. |
| 3 | Decision Architecture | Decision Architecture | Specialized in high-leverage decision-making, negotiation, and scale | Clarity, leverage, and structure under pressure. |
| 4 | Trusted Advisor | Operator Systems | Decades of experience advising top-tier executives and operators | Scale operations without losing control. |

The fourth card icon changes from `Shield` to `TrendingUp` (or keep `Shield` — the copy is what matters). We'll swap the icon to `Cog` or `BarChart2` to better reflect "Operator Systems" — available in lucide-react.

---

### 4. `src/components/AskMarshallHighlight.tsx`

**Opening paragraph:**
- Current: "Not ready for a live session? Get Marshall's direct analysis on your most pressing business decision — delivered as a personalized Loom video within 24 hours. No fluff. No waiting. Just leverage."
- New: "Not ready for a live engagement? Get Marshall's direct systems-level analysis on your most pressing business decision — delivered within 24 hours."

(Keep the bullet points unchanged.)

---

### 5. `src/components/Services.tsx`

**Section subheadline** (under "Direct Access Options"):
- Current: `Private, high-leverage engagements for operators ready to move.`
- New: `Private engagements for operators who need execution clarity, leverage, and systems installed fast.`

**Live Group Programs heading:**
- Current: `Train Live. Think Sharper. Move Faster.`
- New: `Train Live. Execute Faster.`

**Live Group Programs subheadline:**
- Current: `Daily and weekly strategic sessions for operators in motion.`
- New: `Daily and weekly live sessions built to sharpen decision-making and install scalable business systems.`

**Three live program card taglines:**

| Card | Current tagline | New tagline |
|---|---|---|
| Power Hour | `Daily live coaching at 8am EST` | `Daily live execution room at 8am EST.` |
| Sales & Marketing | `Close more deals, generate leads` | `Weekly systems for lead flow, persuasion, and deal control.` |
| Contractor School | `Scale like an operator, not a tradesman.` | `Weekly systems for contractors scaling real operations.` |

**ALP University archive card** — add one line below the existing description:
- Add: `5+ years of recorded execution breakdowns. Updated weekly.`

**Full Access Membership — add a third bundle card:**
- Title: `Full Access (Annual)`
- Price: `$16,000`
- Period: `/year`
- Description: `All live rooms + full community + 10 private advisory sessions annually. Maximum proximity. Maximum leverage.`
- CTA: `Choose Duration →` (opens the existing `FullAccessModal`)

The `bundles` array currently has two items. We add a third. The grid changes from `md:grid-cols-2` to `md:grid-cols-3` to accommodate the new card.

---

## Files Being Edited

| File | Type of Change |
|---|---|
| `src/components/CinematicHero.tsx` | Copy: pill, headline, subheadline, microline, brand quote, 3 stat cards |
| `src/components/StartHere.tsx` | Copy: section title, subheadline, add body text to each of the 3 cards |
| `src/components/About.tsx` | Copy: subheadline, 4 feature card titles + descriptions, card 4 icon |
| `src/components/AskMarshallHighlight.tsx` | Copy: opening paragraph only |
| `src/components/Services.tsx` | Copy: section subheadline, live programs heading + subheadline, 3 card taglines, ALP University add-on line, add 3rd bundle card, grid layout |

No new components. No routing changes. No database changes. Pure copy and one additional card.
