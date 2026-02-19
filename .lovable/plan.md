
# Final Polish Pass — 6 Targeted Changes Across 4 Files

This is a lightweight but high-ROI pass. No new components, no database changes, no new routes. Pure copy, wiring, and one new lead magnet section.

---

## Change 1: `src/components/FeaturedIn.tsx` — Remove "Construction Week"

**Current list:** Yahoo Finance, Business Insider, Forbes, The Daily Pod, Construction Week

**New list:** Yahoo Finance, Business Insider, Forbes, The Daily Pod, YouTube

"Construction Week" is the last construction-adjacent signal on the homepage. Replace with "YouTube" — it's a real distribution channel and signals content ecosystem without being niche-specific. (Or it can be swapped for "Spotify" / "Apple Podcasts" if preferred.)

---

## Change 2: `src/components/CinematicHero.tsx` — 3 Stats Row Upgrade

**Current:**
- `1 on 1` / `Private Advisory`
- `1,000s` / `Training Hours`
- `Daily` / `Power Hour`

**New (per ChatGPT's specific copy):**
- `1-on-1 Advisory` (large) / `Private Strategic Engagements` (sub-label)
- `1,000+ Hours` (large) / `Training & Consulting` (sub-label)
- `Daily Live` (large) / `Power Hour Community` (sub-label)

The numbers become more specific and the sub-labels add context. Small change, meaningfully clearer.

**Also — subheadline micro-tightening:**
- Current: `...built from over $5B in real-world outcomes across high-stakes environments.`
- New: `...built from over $5B in real-world outcomes across enterprise deals and high-stakes business decisions.`

Drops the vague "environments," replaces with "enterprise deals" which reads as more operator-specific.

---

## Change 3: `src/components/AskMarshallHighlight.tsx` — Badge Upgrade

The "ENTRY POINT — $250" badge gets one word added:

- Current: `ENTRY POINT — $250`
- New: `MOST POPULAR ENTRY POINT — $250`

That's it. ChatGPT explicitly called this out as a click-driver. The badge is already styled — just the text changes.

---

## Change 4: `src/components/PersistentCTA.tsx` — Headline Pivots to Entry Point

The sticky bar currently reads "Executive Advisory — Limited Openings" which creates pressure fatigue for volume visitors. The bar stays, but it points to the low-ticket entry point instead:

- **Headline:** `Executive Advisory — Limited Openings` → `Start Here — Ask Marshall ($250)`
- **Button:** `Request Access` → `Submit a Question` (links to `/ask-marshall` instead of opening the advisory modal)
- **Modal import stays** but is no longer triggered by this bar (the bar now drives volume, not high-ticket applications)

This is the conversion move. The sticky bar becomes the lowest-friction CTA on the entire page.

---

## Change 5: `src/pages/Index.tsx` + New Component — Lead Magnet Section

This is the only structural addition. A new `LeadMagnet` component gets inserted after `<LatestInsights />` and before `<CoachingTestimonials />`.

**New component: `src/components/LeadMagnet.tsx`**

Layout: Centered, full-width dark/muted background section with gold accents. Simple and purposeful.

Copy:
- Eyebrow: `FREE RESOURCE`
- Headline: `Get the ALP Framework`
- Body: `The decision model behind billion-dollar negotiations. Download the core framework Marshall uses with private advisory clients — free.`
- Email input + "Download the Framework" button
- Small note: `No spam. One email with your download link.`

**Behavior:** On submit, captures the email to the `email_subscribers` table (new lightweight table — just `email`, `source`, `created_at`) and shows a success state. No complex flow needed for MVP — can wire to email delivery later.

**Database:** One new migration to create the `email_subscribers` table:
```sql
CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'lead_magnet',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.email_subscribers FOR INSERT WITH CHECK (true);
```

No auth required — public insert is intentional for lead capture.

---

## Summary Table

| File | Change | Impact |
|---|---|---|
| `FeaturedIn.tsx` | Remove "Construction Week", add "YouTube" | Removes construction identity signal |
| `CinematicHero.tsx` | Stats copy + subheadline micro-tweak | Clearer authority signals |
| `AskMarshallHighlight.tsx` | Badge: "MOST POPULAR ENTRY POINT" | Increases clicks on primary gateway offer |
| `PersistentCTA.tsx` | Headline + button → points to Ask Marshall | Converts from pressure bar to volume driver |
| `LeadMagnet.tsx` (new) | Email capture + PDF offer section | Captures "not ready yet" audience into list |
| `Index.tsx` | Import + add `<LeadMagnet />` after LatestInsights | Wires new section into homepage flow |

No existing routes changed. No auth required. One small database table for email capture.
