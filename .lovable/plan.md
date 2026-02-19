
## Fix the Investment Overview Table

### The Problem
The current `InvestmentTable` component has two inaccuracies:
1. It shows monthly prices ($500) and 6-month prices ($2,500) for **Contractor School** and **Sales & Marketing School** — programs that are NOT sold individually.
2. The subtitle reads: *"All programs are available individually."* — which is factually wrong.

### Two Options — Choose One

**Option A: Remove the table entirely**
The Programs page already has a clear Full Access pricing card above the table (6 months: $10,000 / Annual: $15,000) and the Power Hour standalone card. The table is redundant and misleading. Removing it simplifies the page and eliminates the confusion.

**Option B: Rebuild the table accurately**
Restructure the table to only show what is actually for sale, with corrected columns and a truthful subtitle.

The revised table would look like this:

```text
Program                 | Available As         | Price
------------------------|----------------------|------------------
Power Hour              | Standalone           | $1,000 / mo  or  $5,000 / 6 mo
Contractor School       | Full Access only     | Included
Sales & Marketing       | Full Access only     | Included
ALP University          | Subscription         | $197 / mo
ALP Full Access         | 6 Mo or Annual       | $10,000  /  $15,000
```

The subtitle would change to: *"Power Hour is the only live room available as a standalone purchase. Contractor School and Sales & Marketing School are included exclusively in Full Access."*

---

### Recommendation
**Option A (remove the table)** is the cleanest path. The information it was trying to convey is already present higher on the page — the standalone Power Hour card and the Full Access card both display the correct pricing. The table adds no new information and only risks creating confusion.

If you prefer Option B, the table will be rebuilt with accurate data and honest copy.

### Files That Would Change
- **`src/components/InvestmentTable.tsx`** — rebuilt or removed
- **`src/pages/Programs.tsx`** — `<InvestmentTable />` import and usage removed (if Option A)
