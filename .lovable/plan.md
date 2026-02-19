
# Add Contractor School Back to "Learn the ALP Framework"

## What Happened
During the last restructure, Contractor School was removed from the `programs` array in `src/components/Services.tsx` based on feedback to "remove construction-adjacent content from the homepage." However, Contractor School is a legitimate core program — it's part of the Growth Academy bundle and has its own dedicated page at `/contractor-school`. It belongs in the grid with the other programs.

## The Fix

**File: `src/components/Services.tsx`**

Add Contractor School back to the `programs` array as the 4th entry:

```
{
  icon: HardHat,
  title: "Contractor School",
  tagline: "Scale your construction business",
  link: "/contractor-school",
}
```

Also add `HardHat` to the icon imports from `lucide-react`.

**Grid layout:** The grid is currently `grid-cols-2 md:grid-cols-4` — with 4 programs restored, this is actually correct. On desktop: 4 equal columns. On mobile: 2x2 grid. No layout change needed.

That's the entire fix — one array entry restored, one icon import added.
