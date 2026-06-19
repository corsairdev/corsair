# Corsair Tunnel (`hub.corsair.dev`)

Corsair Tunnel is a public edge service that connects third-party integrations (OAuth providers, webhook senders) to a developer's own application — locally or in production. It replaces ngrok, custom OAuth callback routes, webhook endpoints, and connect/approval pages with one stable hostname and one handler on the developer's side.

**What Corsair Tunnel is:** a simple relay + hosted UI.

**What it is not:** a data store for integration entities, credentials, or synced Slack/GitHub/Linear records. Developers keep their own Postgres, KEK, and OAuth app credentials (`client_id`, `client_secret` in `corsair_integrations`). Corsair does not provide managed OAuth apps. If all of the data in `hub.corsair.dev` leaked, there'd be no significant compromise. 

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Third parties: Google, Slack, GitHub, Linear, …                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  hub.corsair.dev                                                │
│  • Simple server / relay                                        │
│  • Stateless UI (auth, permissions)                             │
│  • Corsair Postgres (customers, config, audit logs only)        │
└────────────────────────────┬────────────────────────────────────┘
                             │ signed POST (tunnel envelope)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Developer's app                                                │
│  POST /api/corsair  →  processCorsair(corsair, request)         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Developer's Postgres                                           │
│  corsair_integrations, corsair_accounts, corsair_entities, …    │
└─────────────────────────────────────────────────────────────────┘
```

### Corsair's server

One simple server process plus a stateless UI layer. All customer configuration and operational metadata live in **one Postgres database owned by Corsair** — not customer integration data.

### Corsair's database (our customers, not theirs)

| Table / concept | Purpose |
|-----------------|--------|
| **Projects** | One row per customer integration project |
| **Hub keys** | Opaque path tokens (`hk_…`) mapping to a project; used in OAuth callback URLs |
| **Tenant hub keys** | Opaque path tokens (`ht_…`) mapping to a `(project, tenant_id)` pair; used in webhook URLs |
| **API keys** | Issued per project; used to authenticate tunnel deliveries and CLI |
| **Target URLs** | Where to forward requests: `dev`, `staging`, `prod`, or an active local tunnel |
| **Audit log** | Record of each relay: project, plugin (if known), tenant (if known), type, timestamp, outcome |

The audit log answers: *"We forwarded a Slack webhook for project X, tenant Y, at 2:04 PM — success."* It does not store webhook bodies, access tokens, or entity payloads.

Each project also gets a **hub key** — see below.

### Developer's app

One route. One function.

```ts
// app/api/corsair/route.ts
import { corsair } from '@/server/corsair';
import { processCorsair } from 'corsair';

export async function POST(request: Request) {
  return processCorsair(corsair, request);
}
```

```ts
// corsair.ts
export const corsair = createCorsair({
  database: process.env.DATABASE_URL!,
  kek: process.env.CORSAIR_KEK!,
  hub: { apiKey: process.env.CORSAIR_TUNNEL_KEY! },
  plugins: [slack(), gmail(), linear(), googlecalendar()],
});
```

`processCorsair()` verifies the request came from Corsair, reads a typed envelope, and dispatches to existing SDK functions. The developer never mounts separate OAuth, webhook, or approval routes.

---

## Getting started

```bash
# 1. Create a project on hub.corsair.dev → receive CORSAIR_TUNNEL_KEY
corsair login

# 2. Initialize local corsair (DB migration, corsair.ts, KEK)
corsair init

# 3. Print hub URLs (oauth + webhooks) — copy oauth URL into Google Console
corsair hub urls

# 4. Store OAuth app credentials in YOUR db (not Corsair's)
corsair setup --plugin=gmail client_id=... client_secret=... \
  redirect_url=https://hub.corsair.dev/oauth/callback/hk_7Qm3Kp9x...

# 5. Register target URLs in the dashboard (or CLI)
#    prod:  https://api.acme.com/api/corsair
#    dev:   (set automatically when tunnel is running)

# 6. Local development — outbound tunnel, no ngrok
corsair tunnel start --path /api/corsair --port 3000
```

While `corsair tunnel start` is running, the CLI opens an **outbound** connection from the developer's machine to `hub.corsair.dev`. Incoming public traffic is delivered through that connection to `localhost:3000/api/corsair`. Nothing on the internet needs to reach the laptop directly.

In production, register a stable HTTPS URL. No tunnel process required.

---

## Target URLs (dev, staging, prod)

Each project registers one or more delivery targets:

| Environment | Example | When used |
|-------------|---------|-----------|
| **production** | `https://api.acme.com/api/corsair` | Default when no dev tunnel is active |
| **staging** | `https://staging.acme.com/api/corsair` | Selected via dashboard or header |
| **dev (tunnel)** | `http://127.0.0.1:3000/api/corsair` | While `corsair tunnel start` is connected |

The dashboard (or CLI) lets customers add, rotate, and prioritize targets. Corsair signs every outbound delivery so the developer can reject forgeries.

---

## Hub keys (public path identifiers)

Public URLs must identify which Corsair project — and, for webhooks, which tenant — should receive a request. No guessable IDs in query params. No tampering project or tenant by editing the URL.

### Project key (`hk_…`)

Each project gets one or more **project hub keys** at creation time. Stored in Corsair's Postgres:

```
hk_<43 chars base64url>   # 32 random bytes
```

OAuth redirect URI (registered in Google Console and in `redirect_url`):

```
https://hub.corsair.dev/oauth/callback/hk_7Qm3Kp9xR2vN8wL4jT6yZ1aB5cD0eF3gH8iJ1k
```

The **tenant** for OAuth is not in this URL. It lives inside the SDK's HMAC-signed `state` query param (`plugin` + `tenantId`, signed with the developer's KEK). Google returns `state` unchanged; `processOAuthCallback` verifies it.

### Tenant hub key (`ht_…`)

Each `(project, tenant_id)` pair gets a **tenant hub key** when the tenant is provisioned (`setupCorsair`, `corsair hub tenant register`, or first connect):

```
ht_<43 chars base64url>   # 32 random bytes, unique per project + tenant
```

Webhook URL registered in Slack/GitHub/etc. — **no query params**:

```
https://hub.corsair.dev/hooks/ht_9xR2vN8wL4jT6yZ1aB5cD0eF3gH8iJ1k
```

Changing one character → unknown key → `404`. An attacker cannot swap `user_123` for `user_456` because the internal tenant ID never appears in the public URL.

### Resolution

**OAuth callback:**

```
GET /oauth/callback/hk_abc...?code=...&state=...
        │
        ▼
  lookup hk_… → project_id
        │
        ▼
  forward oauth.callback (tenant comes from verified state on developer server)
```

**Webhook:**

```
POST /hooks/ht_xyz...
        │
        ▼
  lookup ht_… → (project_id, tenant_id)
        │
        ▼
  forward webhook to developer with tenantId in tunnel payload (not from public URL)
```

Hub keys are opaque random tokens in our DB — not reversible hashes. Same idea as Stripe's `whsec_` or ngrok tokens. Rotate by issuing a new key, updating the third-party console, revoking the old key.

### SDK / CLI

```bash
# Project-level (OAuth)
corsair hub urls
# → oauthRedirectUrl: https://hub.corsair.dev/oauth/callback/hk_...

# Per-tenant (webhooks)
corsair hub urls --tenant=user_123
# → webhookUrl: https://hub.corsair.dev/hooks/ht_...
```

When `hub: { apiKey }` is set on `createCorsair`:

```ts
{
  oauthRedirectUrl: 'https://hub.corsair.dev/oauth/callback/hk_...',
  webhookUrl: (tenantId: string) => 'https://hub.corsair.dev/hooks/ht_...',
}
```

Use `oauthRedirectUrl` as `redirect_url` in setup and as `redirectUri` in `generateOAuthUrl`. The string must match **exactly** what the OAuth provider redirects to.

Register `webhookUrl(tenantId)` in each third-party console for that tenant's integrations.

### Why not query params

| Plain query params | Hub keys in path |
|--------------------|------------------|
| `?project=…&tenantId=…` | `/callback/hk_…` and `/hooks/ht_…` |
| Human-readable, enumerable | Opaque, unguessable |
| Tamperable in the URL bar | Invalid key → 404 |
| Internal IDs in access logs | Only opaque tokens in logs |

**OAuth:** project → `hk_…`; tenant → signed `state` (developer KEK).  
**Webhooks:** project + tenant → single `ht_…`.  
**Auth / permissions UI:** short-lived signed tokens in path (already bind `tenantId` at creation).

---

## The tunnel envelope

Every delivery from `hub.corsair.dev` to the developer is a signed POST:

```
Headers:
  X-Corsair-Signature: HMAC-SHA256(body, project_secret)
  X-Corsair-Timestamp: ...
  X-Corsair-Project: proj_abc

Body:
  {
    "type": "oauth.callback" | "webhook" | "permission.approve" | "permission.deny" | "auth.credentials" | "run",
    "payload": { ... }
  }
```

`processCorsair()` verifies the signature, routes on `type`, and returns an ACK:

```ts
{ "status": "ok" }
// or
{ "status": "failed", "retryable": true, "error": "..." }
```

---

## 1. OAuth

### Problem today

OAuth providers redirect to a **public** callback URL with an authorization `code`. Local development requires a localhost listener (`pnpm corsair auth`) or ngrok. Production requires mounting `/api/auth` and registering that URL in Google/GitHub console.

### How the tunnel solves it

Developers register a single redirect URI in their OAuth app console — the project's **hub key URL** (from `corsair hub urls`):

```
https://hub.corsair.dev/oauth/callback/hk_7Qm3Kp9xR2vN8wL4jT6yZ1aB5cD0eF3gH8iJ1k
```

That exact string is stored in their DB via `corsair setup` as `redirect_url`.

### Flow

```
1. App or agent calls generateOAuthUrl(corsair, 'gmail', {
     tenantId: 'user_123',
     redirectUri: 'https://hub.corsair.dev/oauth/callback/hk_7Qm3Kp9x...',
   })
   → reads client_id from developer's corsair_integrations
   → builds Google URL with HMAC-signed state (plugin + tenantId)

2. User approves at Google

3. Browser → GET hub.corsair.dev/oauth/callback/hk_7Qm3Kp9x...?code=...&state=...
   → hub resolves hk_... → project → target URL
   (browser never hits the developer's server)

4. hub.corsair.dev → POST /api/corsair {
     type: 'oauth.callback',
     payload: { code, state, redirectUri }  // redirectUri = full URL Google used
   }

5. processCorsair → processOAuthCallback(corsair, { code, state, redirectUri })
   → reads client_id / client_secret from developer's DB
   → exchanges code for tokens
   → stores access_token / refresh_token in corsair_accounts for tenant user_123

6. Browser sees "Connected ✓" on hub.corsair.dev
```

Corsair Tunnel holds the authorization `code` only long enough to forward it. Token exchange and storage always happen in the developer's app using credentials from the developer's DB. Corsair does not provide managed OAuth apps.

---

## 2. Webhooks

### Problem today

Slack, GitHub, and others POST to a public URL. `localhost` is unreachable. Developers run ngrok or deploy just to receive webhooks.

### How the tunnel solves it

Register one stable URL **per tenant** in the third-party console (tenant hub key — no query params):

```
https://hub.corsair.dev/hooks/ht_9xR2vN8wL4jT6yZ1aB5cD0eF3gH8iJ1k
```

Get the URL with `corsair hub urls --tenant=user_123`.

### Forwarding (transparent to processWebhook)

When a sender POSTs to `hub.corsair.dev`, the hub resolves `ht_…` → `(project, tenant_id)`, then forwards to the developer's `/api/corsair` with **the exact same headers and raw body** as the original request. The hub injects `tenantId` into the tunnel payload from the lookup — not from anything the sender supplied.

```
Slack POST → hub.corsair.dev/hooks/ht_9xR2vN8w...
          → hub resolves ht_… → tenant_id user_123
          → POST /api/corsair {
              type: 'webhook',
              payload: {
                headers: { ... original, including X-Slack-Signature },
                body: "<raw string or bytes>",
                query: { tenantId: 'user_123' }   // from hub lookup, trusted
              }
            }
          → processCorsair → processWebhook(corsair, headers, body, query)
```

`processWebhook()` behaves as if Slack hit the developer directly. Signature verification uses secrets from the developer's DB (`webhook_signature`, signing secrets, etc.) — unchanged.

Corsair logs the relay (project, plugin if matched, tenant, timestamp) in its audit table. It does not persist webhook bodies.

### Responses back to the sender

Some providers require a specific HTTP response:

- Slack URL verification (`challenge` echo)
- Asana `X-Hook-Secret` handshake
- Custom status codes or JSON bodies from plugin webhook handlers

`processWebhook()` already returns `response` and `responseHeaders`. The developer's handler passes these back in the tunnel ACK:

```ts
{
  "status": "ok",
  "webhookResponse": {
    "status": 200,
    "body": { "challenge": "..." },
    "headers": { "X-Hook-Secret": "..." }
  }
}
```

`hub.corsair.dev` sends that response to the original sender. The third party completes validation without knowing a tunnel sits in the middle.

---

## 3. Permissions UI

When an agent action requires approval, Corsair creates a row in the developer's `corsair_permissions` table and returns a link:

```
https://hub.corsair.dev/permissions/{token}
```

The hosted UI is stateless. It loads permission metadata by asking the developer's server (via a signed tunnel round-trip or a read-only management call), displays the action (plugin, endpoint, args summary), and renders **Approve** / **Deny**.

On click:

```
hub.corsair.dev → POST /api/corsair {
  type: 'permission.approve',   // or permission.deny
  payload: { token: '...' }
}
→ processCorsair updates corsair_permissions in developer's DB
→ UI shows confirmation
→ agent retries and succeeds
```

Example agent message:

> Please approve this request to send Mike a calendar invite for next Thursday at 9 AM:  
> https://hub.corsair.dev/permissions/xyz789

No custom approval page in the developer's frontend.

---

## 4. Auth UI

When a plugin/tenant is not authenticated, the SDK's auth-missing flow (or the agent) returns a connect link:

```
https://hub.corsair.dev/auth/{token}
```

The hosted UI shows:

- **OAuth plugins:** "Connect Gmail" → redirects to the provider using a URL built from the developer's `client_id` (session created when the link was generated)
- **API key plugins:** a simple form → submits the key through the tunnel

On completion:

```
hub.corsair.dev → POST /api/corsair {
  type: 'auth.credentials',   // or reuses oauth.callback for OAuth completion
  payload: { plugin, tenantId, ... }
}
→ processCorsair stores credentials via keys.set_* / processOAuthCallback
→ encrypted in developer's corsair_accounts
```

Example agent message:

> I can't check your email because Gmail isn't connected. Sign in here:  
> https://hub.corsair.dev/auth/abc123  
> Let me know when you're done and I'll try again.

---

## Security

| Concern | Approach |
|---------|----------|
| Forged deliveries | HMAC signature on every POST to `/api/corsair` |
| Replay | Timestamp + nonce window |
| Project routing | Opaque `hk_…` in OAuth path; invalid key → 404 |
| Tenant routing (webhooks) | Opaque `ht_…` in webhook path; hub injects `tenantId` into payload |
| OAuth tenant binding | HMAC-signed `state` (plugin + tenantId, developer KEK) |
| Webhook spoofing | Original sender signatures verified on developer server |
| Credential exposure | Tokens never stored in Corsair's Postgres; forward-only for OAuth codes |
| Tenant hijacking on connect | Auth tokens are short-lived and signed; tenantId bound at link creation |

---

## Summary

| Surface | Public URL | Developer handler | Data stored |
|---------|------------|-------------------|-------------|
| OAuth | `hub.corsair.dev/oauth/callback/hk_…` | `processOAuthCallback()` | Developer's DB |
| Webhooks | `hub.corsair.dev/hooks/ht_…` | `processWebhook()` | Developer's DB |
| Permissions | `hub.corsair.dev/permissions/{token}` | update `corsair_permissions` | Developer's DB |
| Auth | `hub.corsair.dev/auth/{token}` | `keys.set_*` / OAuth callback | Developer's DB |

**Corsair Tunnel:** one public hostname, one private endpoint, your database, your credentials. Corsair handles the plumbing and keeps a log of what it relayed — not what your integrations contain.
