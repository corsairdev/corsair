# Stripe App — data handling notes for marketplace review

Stripe's app review scrutinizes how apps handle customer and payment data. This
Stripe App is a **data-only / backend-only** integration: it holds no card data
directly and runs no Dashboard UI. It exists as the OAuth grant mechanism +
webhook receiver for the Corsair Stripe plugin.

## What the plugin stores

The Corsair Stripe plugin mirrors Stripe objects into the tenant database
(`ctx.db`) via its endpoints and webhook handlers. The stored shapes are in
`packages/stripe/schema/database.ts`:

- **customers** — `id`, `email`, `name`, `phone`, `description`, `currency`,
  `balance`, `metadata`. This is customer PII.
- **charges**, **payment_intents** — amounts, currency, status, customer ref,
  `payment_method`/`payment_intent` refs, failure info, `metadata`.
- **coupons**, **prices**, **sources**, **balance** — Stripe object IDs and
  non-sensitive fields.

Webhook handlers (`packages/stripe/webhooks/*`) upsert these on
`charge.*`, `customer.*`, `paymentIntent.*`, and `coupon.*` events.

## PCI scope

The schemas store **only Stripe object IDs and non-PAN fields** — no card
numbers, no CVC, no full PANs. `sources.create` and `tokens.create` pass card
data straight to Stripe's API and persist only the returned Stripe IDs. This
keeps Corsair out of cardholder-data (PCI) scope.

> Action for review: confirm no code path writes a raw PAN or CVC into `ctx.db`.
> Audit `webhooks/*` and `endpoints/{sources,tokens}.ts` before submitting.

## Stripe's data-usage rules (must comply)

- Use only the data required for the functionality you disclose to users.
- **Do not resell or publish** any data obtained from Stripe users.
- Provide a public **privacy policy URL** in the listing (review requirement)
  that discloses what is stored and why.
- Request **least-privilege** permissions. The manifest already does this —
  read-only scopes for read-only resources, no `token_read` (the plugin only
  creates tokens), and `customer_write` (Stripe has no delete scope) is the only
  grant that authorizes the destructive `customers.delete` path.

## Why the ENG-51 (Atlassian) mechanism does NOT apply

ENG-51 built a generic personal-data reporting pass
(`packages/corsair/oauth/personal-data-reporting.ts`) because Atlassian
*mandates* reporting stored account IDs to a provider erasure API
(`report-accounts`) and erasing on request. **Stripe exposes no equivalent
provider-side erasure-report API.** So that machinery does not transfer here —
do not copy it. The obligation for Stripe is contractual (data-usage rules +
privacy policy), not an API handshake.

## Recommendation

1. **Least-privilege manifest — done.** Strongest review signal, fully in repo
   scope. Enforced by `manifest.test.ts`.
2. **Document + disclose.** Publish a privacy policy that lists the stored fields
   above and the retention approach. Link it in the listing.
3. **Honor deletion — already done for customers.** The plugin's
   `customer.deleted` handler (`packages/stripe/webhooks/customer.ts`) calls
   `ctx.db.customers.deleteByEntityId(...)`, so it hard-erases the mirror row.
   That is the in-repo deletion path.
4. **Uninstall / revocation erasure — follow-up ticket, not this PR.** A
   data-only app receives no per-account "uninstalled" webhook; the practical
   signal is OAuth refresh-token revocation (an unrecoverable 401 in
   `getValidStripeAccessToken`). On that signal, purge the account's mirror rows.
   No Stripe API forces this and it needs core plumbing, so it is flagged, not
   built here.
