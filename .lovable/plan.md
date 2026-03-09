

## Root Cause: Published Site Not Updated

I found the problem. When I fetched your **published** site at `alp-site.lovable.app/alp-university`, it still shows the old Stripe Pricing Table alongside the new button. The code in the repo is correct (Payment Link only), but **the frontend hasn't been republished**. North Legacy Builders purchased through the old embedded pricing table that's still live on your published site.

Frontend changes require clicking "Update" in the publish dialog to go live. Backend changes (like the webhook) deploy immediately, but the page itself is still serving the old version with the pricing table.

**Immediate action needed**: Click the **Publish** button (top right) and hit **Update** to push the current code live. This removes the old pricing table from the published site.

## Plan: Belt-and-Suspenders Fix

Even after republishing, we should make the webhook resilient to any checkout path. Here's what I'll build:

### 1. Add Price ID fallback to the webhook

Update `getProductFromSession()` in `stripe-webhook/index.ts` to check the Stripe Price ID (`price_1SKarMJdDAUSVXbNSJFzDORs`) as a third identification method. This way, even if someone checks out through a pricing table, invoice, or any other Stripe surface, the webhook still identifies ALP University and triggers automation.

Add a `PRICE_ID_MAP` that maps known price IDs to product keys, and check `session.line_items` or the subscription's price data when `payment_link` is null.

### 2. Add manual retry edge function

Create a new `manual-fulfill` edge function that accepts a customer email, name, and product key. It will:
- Send the welcome email
- Create/update the Kajabi contact and grant offers
- Log the result to `purchase_log`

This gives you an operational safety net from the admin dashboard.

### 3. Add retry button to admin purchase log

Add a "Retry" button on failed/custom purchases in the admin dashboard that calls the manual-fulfill function, so you can replay any missed automation with one click.

