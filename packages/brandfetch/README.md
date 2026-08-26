# @corsair-dev/brandfetch

Brandfetch plugin for Corsair. Covers brand lookup by domain, brand
search, CDN logo retrieval, transaction enrichment, and credential
verification via the Brandfetch API v2
(`https://api.brandfetch.io`).

## Authentication

The plugin supports two auth types:

### API key (default, `api_key`)

1. Create an API key at [brandfetch.io](https://brandfetch.io/).
2. Store it as the plugin's API key in Corsair. Requests are sent as
   `Authorization: Bearer <key>`.

### OAuth 2.0 (`oauth_2`)

Register a Brandfetch app with your Corsair callback URL. Supply the
client ID and secret to Corsair.

A **Brandfetch Client ID** is also required for the `brands.search` and
`logos.get` operations. It can be passed per-request via `clientId` or
set globally in the plugin options.

## Endpoints

5 operations across these domains:

| Domain          | Operation     | Description                                       |
| --------------- | ------------- | ------------------------------------------------- |
| `brands`        | `get`         | Get brand information by domain                   |
| `brands`        | `search`      | Search for brands by query string                 |
| `logos`         | `get`         | Get a hotlinkable CDN logo URL for a domain       |
| `transactions`  | `get`         | Get brand info enriched from a transaction label  |
| `viewer`        | `get`         | Verify credentials and return the caller identity |

All operations are read-only (`risk: read`).

## Webhooks

The plugin supports inbound webhook events following the
[Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks)
specification.

### Signature verification

Incoming webhook requests are verified using HMAC-SHA256. The
`verifyBrandfetchWebhookSignature` function validates the `webhook-id`,
`webhook-timestamp`, `webhook-signature`, and
`webhook-signature-algorithm` headers, enforces a 5-minute timestamp
tolerance, and performs a constant-time signature comparison. The raw
request body is required for verification.

### Tenant matching

Each webhook event is matched to a tenant by extracting the
`tenant_external_id` from the payload. The matcher first checks for an
explicit `body.tenant_external_id` field, then falls back to parsing the
organization ID from the event URN
(`urn:brandfetch:organization:{orgId}:webhook:...`).

## Usage

```typescript
import { brandfetch } from "@corsair-dev/brandfetch";

const plugin = brandfetch({
  key: process.env.BRANDFETCH_API_KEY,
  clientId: process.env.BRANDFETCH_CLIENT_ID,
});

// Get brand info by domain
const brand = await plugin.endpoints.brands.get({
  domain: "example.com",
});

// Search for brands
const results = await plugin.endpoints.brands.search({
  query: "example",
});

// Get a CDN logo URL
const logo = await plugin.endpoints.logos.get({
  domain: "example.com",
});

// Enrich a transaction
const transaction = await plugin.endpoints.transactions.get({
  transactionLabel: "COFFEE SHOP",
  countryCode: "US",
});

// Verify credentials
const viewer = await plugin.endpoints.viewer.get({});
```

## Tests

```bash
pnpm --filter @corsair-dev/brandfetch test
```
