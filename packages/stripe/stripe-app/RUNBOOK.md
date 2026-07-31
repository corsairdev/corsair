# Stripe App — publish runbook (managed OAuth)

These are the account-tied steps a human runs under `team@corsair.dev`. They
require the team Stripe account and cannot be automated in CI or by an agent.
Everything in this directory except these steps is already done in the repo.

The published app gives Corsair Composio-parity managed OAuth for Stripe: any
Stripe account installs it, and Corsair receives an OAuth access token to call
the Stripe API on that account through the single Hub callback
`https://auth.corsair.dev/oauth/callback`.

## Prerequisites

- Access to the `team@corsair.dev` Stripe account (it must be activated).
- Stripe CLI installed: `brew install stripe/stripe-cli/stripe`
  (or see https://docs.stripe.com/stripe-apps/getting-started).
- A 300x300 PNG icon at `packages/stripe/stripe-app/icon.png`. The manifest
  references `./icon.png`; it is NOT in the repo yet. Add it before uploading —
  upload fails without it.

## Constraints to know before you start

- **One published app per Stripe account.** `dev.corsair.integrations` is
  Corsair's single Stripe marketplace app. Do not create a second.
- The app `id` (`dev.corsair.integrations`) is globally unique across all of
  Stripe and is validated on upload. If it collides, pick another reverse-DNS id
  and update `stripe-app.json` + `manifest.test.ts`.
- Live-mode `allowed_redirect_uris` must be HTTPS and match exactly. Ours is
  `https://auth.corsair.dev/oauth/callback`. Never add a `localhost` redirect to
  the manifest you upload — Stripe rejects it at review.

## Steps

### 1. Log in

```bash
stripe login
# authenticate as team@corsair.dev in the browser
```

### 2. Upload the app (creates it in test mode)

From the repo root:

```bash
cd packages/stripe/stripe-app
stripe apps upload
```

This reads `stripe-app.json`, validates the id/permissions/redirect URIs, and
creates the app in the team account. Note the `client_id` (`ca_...`) and the
test/live secret keys it surfaces — the Hub needs the `client_id` +
`client_secret` to drive the OAuth exchange (see `packages/stripe/client.ts`,
which authenticates the token endpoint with the secret key over HTTP Basic).

### 3. Install into a TEST account and verify the OAuth flow

- Build the OAuth install link:
  `https://marketplace.stripe.com/oauth/v2/authorize?client_id=<ca_...>&redirect_uri=https://auth.corsair.dev/oauth/callback&state=<state>`
- Complete the consent screen with a **test** Stripe account.
- Confirm the callback lands on `https://auth.corsair.dev/oauth/callback` and the
  Hub exchanges the `code` for an access token + refresh token (Basic auth with
  the secret key, `grant_type=authorization_code`). Access tokens last 1 hour;
  refresh tokens last 1 year and are rolled on every refresh — the plugin already
  persists the rolled refresh token (`packages/stripe/index.ts`).
- Sanity-check that a plugin endpoint (e.g. `balance.get`) works against the
  granted token.

### 4. Prepare for public distribution

The manifest already sets `distribution_type: "public"`. Confirm it is public in
the app settings (or run `stripe apps set distribution public`), and confirm the
install link you submit is the **Public Install URL** from the app's Settings tab
in the Dashboard — not any external/test URL. Using the wrong link is the most
common review rejection.

### 5. Write the marketplace listing

In the Dashboard, on the app's listing:

- **Name:** `Corsair Integrations` (must match the manifest; cannot contain
  "Stripe", "app", "free", or "paid").
- **Icon:** the same 300x300 image as the manifest.
- **About / subtitle / key features:** describe the managed-integration use case.
  Use screenshots with no real customer data.
- **Privacy Policy URL (REQUIRED):** a public Corsair privacy policy that covers
  what the app stores and how (see `DATA_HANDLING.md`). Review will not pass
  without this.
- **Support channel:** a Corsair support email/URL with a response-time estimate.
- **Permissions:** each already has a `purpose` (shown to installers) and a
  `name` (shown to reviewers) in the manifest. Make sure every one reads as a
  clear least-privilege justification.

### 6. Submit for review

Submit from the Dashboard. Stripe reviews in ~4 business days and emails an
approval or detailed rejection. If rejected, fix and resubmit (update the testing
guidance if you changed anything).

Provide test credentials as requested: a test Stripe account with admin access,
2FA disabled or with instructions.

### 7. Publish

On approval, click **Review and publish** → **Publish** in the Dashboard. The app
becomes installable by any Stripe account from the Marketplace. Analytics appear
within ~24 hours.

## After publishing

- The `client_id` is stable; wire it + the app secret into the Hub's Stripe
  managed-OAuth config so tenant installs flow through
  `https://auth.corsair.dev/oauth/callback`.
- To ship manifest changes later (new endpoint → new permission), bump `version`,
  update `stripe-app.json` (+ the `manifest.test.ts` expected set), re-run
  `stripe apps upload`, and resubmit for review.
