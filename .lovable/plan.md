
## Two-Part Fix: Application Form + Video Testimonial White Space

### Part 1 — The Pricing Question: Here's the Clear Answer

ChatGPT's recommendation (and the right strategic call) is:

- **Keep prices visible** ($1,000 Strategy Session, $5,000 Private Advisory) — they act as a filter. Serious operators see the number and self-qualify. This is already correct on the homepage Services cards.
- **Remove direct Stripe checkout** — replace with an application. You decide who gets the Stripe link. This is already done on the homepage.
- **The `/coaching` page still has direct Stripe "Book Now" buttons** — this contradicts the advisory positioning. We need to update that page to match: show the pricing, but gate it behind an application form instead of instant checkout.

So to summarize: **prices stay visible everywhere. Checkout buttons become "Apply" buttons that open an application form.**

---

### Part 2 — Application Form

We will build a short advisory application form that captures the right qualifying information. This form will be a modal that appears when someone clicks "Apply for a Session" or "Request Advisory Access" on either the homepage or the `/coaching` page.

**Form Fields (7 questions — concise, serious, qualifying):**
1. Full Name
2. Company Name
3. Annual Revenue Range (dropdown: Under $500K / $500K–$2M / $2M–$10M / $10M+)
4. Biggest Business Challenge Right Now (textarea)
5. What have you already tried? (textarea)
6. Which option are you applying for? (dropdown: Strategy Session $1,000 / Private Advisory $5,000)
7. Email Address

**Where it saves:** Applications are saved to the backend database so Marshall can review them and follow up manually. A notification email is also sent to Marshall via the existing `send-form-notification` edge function.

**Where the form appears:**
- Homepage Services section: "Apply for a Session" and "Request Advisory Access" buttons open this modal
- `/coaching` page: All Stripe "Book Now" / "Book Your Session" / "Book the 6-Session Intensive" buttons are replaced with "Apply for a Session" / "Request Private Advisory Access" buttons that open the same modal
- The `How It Works` section on `/coaching` (step 1: "Choose Your Package", step 2: "Marshall Reaches Out") updates to reflect the application flow: Step 1 → "Submit Your Application", Step 2 → "Marshall Reviews & Reaches Out"

---

### Part 3 — Fix Video Testimonial White Space

**Root Cause:** The `VideoTestimonial` component auto-generates a poster thumbnail by drawing a video frame onto a canvas. While this is processing (or if it fails), `posterUrl` is `null`. The component only renders the visual overlay when `posterUrl` exists — so during loading there's a blank white/transparent box. On the Lovable preview environment, cross-origin restrictions or video preloading issues can cause the canvas grab to fail silently, leaving a permanent white box.

**Fix:**
- Add a `isLoading` state that shows a skeleton/placeholder background with a gold play button while the poster is generating
- Add a dark background fallback (`bg-muted`) to the container so even if the poster never loads, you see a dark card with a centered play button — not white space
- If `posterUrl` generation fails, fall back gracefully to showing just the play button on a dark background instead of a blank area
- Add `poster` attribute directly to the `<video>` element using the generated URL once available, so browser-native controls show the thumbnail too

---

### Files to Edit

1. **`src/components/VideoTestimonial.tsx`** — Add loading state, dark background fallback, improved error handling so white space never appears

2. **`src/components/AdvisoryApplicationModal.tsx`** (new file) — The application form modal component with 7 fields, form validation, saves to database, and sends email notification

3. **`src/components/Services.tsx`** — Change "Apply for a Session" and "Request Advisory Access" `<Link>` buttons to `<Button onClick>` that open the new AdvisoryApplicationModal

4. **`src/pages/Coaching.tsx`** — Replace all Stripe checkout buttons with application-gating buttons that open the modal; update "How It Works" step copy; keep prices visible

5. **Database migration** — Create an `advisory_applications` table to store submissions (name, company, revenue range, challenge, what they've tried, which service, email, submitted_at)

### Database Table Design

```text
advisory_applications
├── id (uuid, primary key)
├── full_name (text, not null)
├── company_name (text, not null)
├── annual_revenue (text, not null)
├── biggest_challenge (text, not null)
├── already_tried (text, not null)
├── service_applying_for (text, not null)
├── email (text, not null)
└── created_at (timestamptz, default now())
```

RLS: Insert allowed for everyone (public form). Select restricted (no public reads). This is a lead capture form — no auth required.
