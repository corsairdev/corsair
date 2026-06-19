# app.corsair.dev — Corsair Tunnel

A single public edge that connects third-party services (OAuth, webhooks) to a developer's app (local or production). Developers keep their own DB, KEK, and OAuth app credentials (`client_id`, `client_secret` in `corsair_integrations`). Corsair does not provide managed OAuth or store integration data. 

```
Slack / Google / etc.
        ↓
app.corsair.dev  (OAuth callback, webhooks, hosted UI)
        ↓ signed POST
POST /api/corsair  →  processCorsair(corsair, req)
        ↓
Developer DB
```

**Developer setup:** one tunnel (`corsair tunnel start --path /api/corsair`), one handler. `processCorsair()` verifies the request is from Corsair, routes by type, and calls existing SDK functions.

---

# V1

## 1. OAuth

Public OAuth redirect URL (replaces CLI localhost listener or custom `/api/auth` route). Google redirects to `app.corsair.dev`, tunnel forwards `{ code, state, redirectUri }` to the developer's `/api/corsair`, and `processOAuthCallback()` exchanges the code using credentials from the developer's DB.

`redirect_url` in setup points at `app.corsair.dev/oauth/callback?project=…`.

## 2. Webhooks

One stable webhook URL per project (e.g. `app.corsair.dev/hooks/{project}?tenantId=…`). Slack/GitHub POST there; tunnel forwards raw headers + body to `/api/corsair`; `processWebhook()` runs on the developer's server. Fan-out to localhost when dev tunnel is active, production otherwise.

## 3. Permissions UI

Hosted approve/deny page — no custom client needed.

> "Please approve this request to send Mike a calendar invite for next Thursday at 9 AM: app.corsair.dev/permissions/{token}"

User clicks Approve → tunnel POSTs to `/api/corsair` → updates `corsair_permissions` in the developer's DB.

## 4. Auth UI

Hosted connect page when a plugin/tenant isn't authenticated (OAuth or API key).

> "I can't check your email because Gmail isn't connected. Sign in here: app.corsair.dev/auth/{token}"

Completes auth → tunnel POSTs credentials/tokens to `/api/corsair` → stored encrypted in the developer's DB. Agent retries.




# V2 

## Workflows


## Triggers and cron jobs
