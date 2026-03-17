

## Revised Schedule for Unbundling Plan

The schedule correction is noted. Here are the updated times that will be used across all pages and components:

| Program | Day(s) | Time |
|---------|--------|------|
| Power Hour | Monday–Friday | 8:00 AM EST |
| Contractor School | Tuesday | 7:00 PM EST |
| Sales & Marketing School | Wednesday | 7:00 PM EST |

### What Changes

1. **`WeeklySchedule.tsx`** — Update the schedule data: Contractor School stays on Tuesday at 7pm, Sales & Marketing moves to Wednesday at 7pm. These match the existing code almost exactly (only the current code already has these times), so minimal changes needed.

2. **`ContractorSchool.tsx`** — Hero badge says "Live Tuesdays at 7pm EST" (already correct). Benefits list says "Live weekly training every Tuesday at 7pm EST" (already correct). No changes needed.

3. **`SalesMarketingSchool.tsx`** — Hero badge currently says "Live Wednesdays at 7pm EST" (already correct). Benefits list says "Live weekly training every Wednesday at 7pm EST" (already correct). No changes needed.

4. **Any memory/context references** — The stored memory saying "Contractor School on Wednesdays at 1:00 PM" and "Sales & Marketing School on Thursdays at 1:00 PM" is wrong and will be corrected during implementation.

### Summary

The existing code in `WeeklySchedule.tsx`, `ContractorSchool.tsx`, and `SalesMarketingSchool.tsx` already reflects the correct schedule (Tue 7pm / Wed 7pm). The only thing that was wrong was the stored memory context. When I implement the full unbundling plan, I'll use these correct times throughout and update the memory.

The full unbundling plan (6 Stripe products, remove Full Access & Growth Academy, update all pages with new pricing) remains as previously approved — ready to implement on your go-ahead.

