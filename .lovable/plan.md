

# "Ask Marshall" -- Standalone Page with Cross-Site Visibility

## Updated Approach

"Ask Marshall" gets its own dedicated page at `/ask-marshall` that serves as both the marketing pitch and (post-purchase) the submission form. The Coaching page and Homepage each get a prominent link/card pointing visitors there.

## User Flow

```text
1. Visitor discovers "Ask Marshall" via Homepage or Coaching page
2. Clicks through to /ask-marshall -- sees the pitch, benefits, and $250 CTA
3. Pays via Stripe payment link
4. Receives welcome email with a link back to /ask-marshall?token=...
5. Returns to the same page, now sees the submission form
6. Submits question + uploads documents
7. Marshall gets notified via email with all details
8. Marshall sends Loom video response within 24 hours
```

## What Gets Built

### 1. Standalone Page: `/ask-marshall`

A full page with two states:

**State A -- Sales/Landing (default):**
- Hero section with headline like "Get Marshall's Brain on Your Problem"
- Value proposition: personalized video analysis, no live call, 24-hour turnaround
- How it works (3 steps: Pay, Submit, Receive)
- $250 CTA button linking to Stripe
- FAQ or trust-building copy

**State B -- Submission Form (accessed via welcome email link with query params):**
- Name and email (pre-filled from URL params)
- Main question field
- Detailed context textarea
- File upload (up to 5 files)
- Submit button

### 2. Homepage Reference

Add an "Ask Marshall" card in the Services component, positioned as an accessible entry point alongside the existing group programs or as a callout near the coaching packages. Something like:

- Small card or banner: "Not ready for a call? Ask Marshall a question and get a video answer -- $250"
- Links to `/ask-marshall`

### 3. Coaching Page Reference

Add a section or callout card on the Coaching page (below or near the coaching packages):

- Positioned as the low-commitment alternative: "Not sure about 1-on-1 coaching? Start here."
- Links to `/ask-marshall`

### 4. Database Table: `ask_marshall_submissions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| customer_name | text | |
| customer_email | text | |
| question | text | Main question |
| context | text | Detailed background |
| file_urls | text[] | Links to uploaded files |
| status | text | Default: "pending" |
| stripe_session_id | text | Nullable |
| created_at | timestamptz | Default: now() |

RLS: Public insert, admin-only for select/update/delete.

### 5. Storage Bucket: `ask-marshall-files`

For uploaded documents. Public read access so Marshall can open files directly from the notification email.

### 6. Email Notification to Marshall

Extend `send-form-notification` with a new `formType: 'ask-marshall'` that sends Marshall an email containing the customer's question, context, and direct links to all uploaded files.

### 7. Stripe Webhook Update

- Add the new payment link ID to `PRODUCT_MAP`
- Create a welcome email template with a link to `/ask-marshall?email=...&name=...`

### 8. Route

Add `/ask-marshall` to `App.tsx`.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/AskMarshall.tsx` | New standalone page (sales + form) |
| `src/App.tsx` | Add `/ask-marshall` route |
| `src/components/Services.tsx` | Add "Ask Marshall" card/link |
| `src/pages/Coaching.tsx` | Add "Ask Marshall" callout section |
| `supabase/functions/send-form-notification/index.ts` | New form type handler |
| `supabase/functions/stripe-webhook/index.ts` | New product + welcome email |
| `supabase/functions/stripe-webhook/email-templates.ts` | New email template |
| Database migration | `ask_marshall_submissions` table |
| Storage | `ask-marshall-files` bucket |

## What I Need From You

**Create a $250 one-time Stripe payment link** for "Ask Marshall" and share the link ID with me so I can wire it into the site.

