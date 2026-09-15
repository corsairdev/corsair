# @corsair-dev/customerio

Customer engagement platform for targeted email, SMS, and push messages.
Implements 23 operations across the Customer.io **App API**, **Track API (v1)**,
and **CDP/Pipelines API** — every method, path, and auth scheme verified
against the published docs and OpenAPI specs, plus live checks against a real
workspace.

## Auth

Single `api_key` credential, reused per API family:

| API | Base URL | How the key is sent |
|---|---|---|
| App | `https://api.customer.io` | `Authorization: Bearer <app-key>` — create under Settings → Workspace Settings → API and Webhook Credentials → Create App API Key |
| Track v1 | `https://track.customer.io` | `Authorization: Basic base64(siteId:apiKey)` — store `siteId:apiKey` in the key field |
| CDP | `https://cdp.customer.io` | `Authorization: Basic base64(writeKey:)` — Pipelines write key from Integrations → Sources |

```ts
import { createCorsair } from 'corsair/core';
import { customerio } from '@corsair-dev/customerio';

const corsair = createCorsair({
	plugins: [customerio({ key: process.env.CUSTOMERIO_API_KEY })],
});
```

EU workspaces must set `region: 'eu'` so App, Track, and CDP requests use
the EU bases (`https://api-eu.customer.io`, `https://track-eu.customer.io`,
`https://cdp-eu.customer.io`) instead of the US defaults — US traffic sent
to the wrong region still passes through US servers:

```ts
const corsair = createCorsair({
	plugins: [
		customerio({ key: process.env.CUSTOMERIO_API_KEY, region: 'eu' }),
	],
});
```

One `customerio()` instance carries one opaque `key` (standard Corsair
`api_key` pattern — see `brevo` `packages/brevo/index.ts:28-32`, `sendgrid`
`packages/sendgrid/index.ts:41-43`, scaffold
`scripts/generate-plugin.ts:204-206,327-344`). The key is forwarded
verbatim to the transport that needs it (Bearer for App, Basic for Track/CDP).
Because the three families need incompatible credentials, create a separate
`customerio()` instance per family you call — for example one with the App
API key for App endpoints and another with `siteId:apiKey` for Track
endpoints. No `;`/`=` parsing and no compound string.

## Endpoints

### Broadcasts (`broadcasts.*`, App API)

| Endpoint | Call |
|---|---|
| `broadcasts.trigger` | `POST /v1/campaigns/{broadcast_id}/triggers` — rate-limited to 1 req / 10s per broadcast |
| `broadcasts.listTriggers` | `GET /v1/broadcasts/{broadcast_id}/triggers` |
| `broadcasts.getTrigger` | `GET /v1/campaigns/{broadcast_id}/triggers/{trigger_id}` |

### Segments (`segments.*`, App API)

| Endpoint | Call |
|---|---|
| `segments.list` | `GET /v1/segments` |
| `segments.get` | `GET /v1/segments/{segment_id}` |
| `segments.membership` | `GET /v1/segments/{segment_id}/membership` (`limit`, `start` pagination) |

### Messages (`messages.list`, App API)

`GET /v1/messages` with `limit`, `start`, `drafts`, `type`, `campaign_id`,
`newsletter_id`, `action_id` filters.

### Profiles (`profiles.*`, Track API)

| Endpoint | Call |
|---|---|
| `profiles.identify` | `PUT /api/v1/customers/{identifier}` — creates or updates the profile |
| `profiles.alias` | `POST /api/v1/merge_customers` — merges secondary into primary (**irreversible**; primary must already exist) |
| `profiles.suppress` | `POST /api/v1/customers/{identifier}/suppress` — deletes the profile and blocks re-adding (**destructive**, e.g. GDPR/CCPA) |
| `profiles.trackEvent` | `POST /api/v1/customers/{identifier}/events` |
| `profiles.unsubscribe` | `POST /unsubscribe/{delivery_id}` (host root, no `/api/v1` prefix) |
| `profiles.reportPush` | `POST /api/v1/metrics` — the supported replacement for the deprecated `POST /api/v1/push/events` (spec-marked deprecated) |

### Groups (`groups.addPerson`, CDP API)

`POST /v1/group` with `userId`, `groupId`, optional `traits`.

### Catalog reads (App API)

| Endpoint | Call |
|---|---|
| `collections.list` | `GET /v1/collections` |
| `info.listIps` | `GET /v1/info/ip_addresses` |
| `newsletters.list` | `GET /v1/newsletters` (`limit`, `start`, `sort`) |
| `snippets.list` | `GET /v1/snippets` |
| `transactional.list` | `GET /v1/transactional` — returns `{ messages: [{ id, name, trigger_name, … }] }` |
| `reportingWebhooks.list` | `GET /v1/reporting_webhooks` |

### CDP (`cdp.*`, CDP API)

| Endpoint | Call |
|---|---|
| `cdp.batch` | `POST /v1/batch` — discriminated `identify/track/page/screen/group/alias` calls (64KB per call, 1MB total) |
| `cdp.page` | `POST /v1/page` — requires `userId` or `anonymousId` |
| `cdp.screen` | `POST /v1/screen` — requires `userId` or `anonymousId`, plus `name` |

Notes:

- There is **no webhook receiver** in this plugin. Reporting webhooks are
  configuration records read via `reportingWebhooks.list`.
- There is **no `GET /v1/integrations`** in the App, Track, or CDP APIs, so no
  such endpoint is implemented rather than guessing one.
- Empty workspaces return `{"collections": null}` and
  `{"reporting_webhooks": null}` — both fields are nullable in the schemas.

## Tests

Five test files, no more:

| File | What it covers |
|---|---|
| `schema.test.ts` | Plugin schema + every input/output zod schema (valid + rejection cases) |
| `error-handler.test.ts` | All 8 error handlers (match + retry decisions) |
| `client.test.ts` | Bearer/Basic auth headers per transport, query/body forwarding, error mapping |
| `endpoints.test.ts` | All 23 endpoints: exact path, method, body, and query |
| `api.test.ts` | Live read-only App API checks — **skipped unless `CUSTOMERIO_API_KEY` is set** (CI ignores this file) |

```bash
pnpm --filter @corsair-dev/customerio test
CUSTOMERIO_API_KEY=<app-api-key> pnpm --filter @corsair-dev/customerio test
```

Type safety: `strict` TypeScript, zod validation on every endpoint, no `any`,
no `unknown` in logic, no `as` casts except framework-required `as const`
literals (documented inline). Never commit real keys — use environment
variables; rotate any credential that was ever pasted into chat.
