

## Fix 3-Month Pricing Math

### The Problem
The 3-month "Lock in Your Quarter" prices are currently higher than 3× the monthly rate, and the "Save $X" claims are mathematically wrong.

### New Pricing (~10% off quarterly)

| Program | Monthly | 3-Month (new) | Actual Savings |
|---------|---------|---------------|----------------|
| Contractor School | $497/mo | $1,341 | Save $150 |
| Sales & Marketing School | $497/mo | $1,341 | Save $150 |
| Power Hour | $997/mo | $2,691 | Save $300 |

### Files to Update

1. **`src/pages/ContractorSchool.tsx`** — Change $1,497 → $1,341, "Save $494" → "Save $150", update SEO description
2. **`src/pages/SalesMarketingSchool.tsx`** — Same changes as above, update SEO description
3. **`src/pages/PowerHour.tsx`** — Change $2,997 → $2,691, "Save $994" → "Save $300"

### Also Fix Build Error
4. **`supabase/functions/send-form-notification/index.ts`** — Line 68: Move the `name` log below the newsletter short-circuit, or cast properly to avoid the TS error on `NewsletterFormData` not having `name`.

