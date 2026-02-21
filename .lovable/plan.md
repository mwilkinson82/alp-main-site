
## Mobile UX Improvements — Hero CTA, Trust Cards, and Scroll Cue

### What We're Doing
Implementing the three highest-impact mobile fixes from the audit: making the hero CTA dominant on mobile, stacking trust cards vertically on small screens, and adding a scroll cue below the hero video.

### Changes

**1. Hero CTA — Full-width primary button on mobile**
- Make "Start Here — Get Marshall's Analysis" full-width on mobile (`w-full sm:w-auto`)
- Reduce the secondary "Watch the Origin Story" button size on mobile (smaller text, less padding)
- Keeps the current side-by-side layout on tablet/desktop

**2. Trust Cards — Vertical stack on mobile**
- Change from `grid-cols-3` (always) to `grid-cols-1 sm:grid-cols-3`
- On mobile, each card becomes a horizontal row layout (icon left, text right) for better scannability
- On tablet/desktop, keeps the current 3-column grid

**3. Scroll Cue — Animated down arrow below hero video**
- Add a subtle bouncing chevron-down icon at the bottom of the hero video area
- Only visible when content has loaded and user hasn't scrolled yet
- Fades out after the user begins scrolling

### Files That Will Change
- `src/components/CinematicHero.tsx` — all three changes live here (CTA buttons, trust cards grid, and scroll cue)

### What We're NOT Doing
- Footer accordion (unnecessary — footer is already stacked on mobile)
- Hero-to-trust spacing (already adequate with pt-8)
- Hamburger menu spacing (already close to guidelines, minor polish for another time)
