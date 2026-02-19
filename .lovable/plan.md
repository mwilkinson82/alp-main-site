
# Remove "Full Access Membership" from the Access Dropdown

## What's Changing

The "Full Access Membership" entry in the Access dropdown currently links to `/programs` — the same URL as "Live Rooms." This creates a broken-site perception when a user is already on that page and clicks it. Since Full Access is not a standalone page or experience, the cleanest fix is to remove it from the dropdown entirely.

## Why This Is the Right Call

- Full Access is a *bundle*, not a *destination*. It lives logically inside the Live Rooms page (the Full Access card section) and in the Investment Table.
- The dropdown should only contain distinct destinations. Right now that's ALP University and Live Rooms — two clearly different things.
- Full Access remains discoverable through the Live Rooms page, the Investment Table, the homepage Services/Ascension Ladder section, and the `/programs#full-access` anchor.
- Removing it makes the nav cleaner and eliminates user confusion.

## Result After Change

The Access dropdown will contain exactly two items:
- ALP University — On-Demand Archive → `/alp-university`
- Live Rooms — Power Hour · Sales & Marketing · Contractor School → `/programs`

## Technical Details

### File: `src/components/Header.tsx`

The `accessLinks` array (line 49–53) currently has three entries. Remove the third entry:

```
{ name: "Full Access Membership", path: "/programs", sub: "All Live Rooms + Advisory Sessions", highlight: true },
```

This change applies to both desktop dropdown and mobile navigation (both use the same `accessLinks` array), so one removal handles both.

No other files need to change. The Full Access section on the `/programs` page, the Investment Table, and homepage references remain untouched.
