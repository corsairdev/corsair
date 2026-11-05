# @corsair-dev/customerio

Customer engagement platform for targeted email, SMS, and push messages.
Implements 23 operations across the Customer.io **App API**, **Track API (v1)**,
and **CDP/Pipelines API** — every method, path, and auth scheme verified
against the published docs and OpenAPI specs, plus live checks against a real
workspace.

## Auth

One `api_key` connection carries a credential per API family (same
extension mechanism as Twilio's `accountSid` and Algolia's
`applicationId`):

| API | Stored field | How it is sent |
|---|---|---|
| App | `api_key` (`key` option) | `Authorization: Bearer <app-key>` — create under Settings → Workspace Settings → API and Webhook Credentials → Create App API Key |
| Track v1 | `track_api_key` (`trackApiKey` option) | `Authorization: Basic base64(siteId:apiKey)` — Site ID + API key from the same credentials screen |
| CDP | `cdp_write_key` (`cdpWriteKey` option) | `Authorization: Basic base64(writeKey:)` — Pipelines write key from Integrations → Sources |

```ts
import { createCorsair } from 'corsair/core';
import { customerio } from '@corsair-dev/customerio';

const corsair = createCorsair({
	plugins: [
		customerio({
			key: process.env.CUSTOMERIO_API_KEY,
			trackApiKey: process.env.CUSTOMERIO_TRACK_API_KEY, // "siteId:apiKey"
			cdpWriteKey: process.env.CUSTOMERIO_CDP_WRITE_KEY,
		}),
	],
});
```

Resolution order per family is explicit option → stored field → shared
`key` fallback, so legacy setups that keep `siteId:apiKey` (Track) or the
write key (CDP) in the key field keep working. App endpoints always use
the shared key as the Bearer token; no `;`/`=` parsing and no compound
string.

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

One `customerio()` instance carries the standard Corsair `api_key`
credential (see `brevo` `packages/brevo/index.ts:28-32`, `sendgrid`
`packages/sendgrid/index.ts:41-43`, scaffold
`scripts/generate-plugin.ts:204-206,327-344`) plus the two per-family
fields above, so a single configured connection can call all three
families. The App key is forwarded verbatim as the Bearer token; Track
and CDP resolve their own credential as described above.

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
| `client.test.ts` | Bearer/Basic auth headers per transport, query/body forwarding, error mapping, plus endpoint-to-transport composition (one endpoint per family) |
| `endpoints.test.ts` | All 23 endpoints: exact path, method, body, and query, plus per-family credential precedence |
| `api.test.ts` | Live read-only App API checks — **skipped unless `CUSTOMERIO_API_KEY` is set** (CI ignores this file) |

```bash
pnpm --filter @corsair-dev/customerio test
CUSTOMERIO_API_KEY=<app-api-key> pnpm --filter @corsair-dev/customerio test
```

Type safety: `strict` TypeScript, zod validation on every endpoint, no `any`,
no `unknown` in logic, no `as` casts except framework-required `as const`
literals (documented inline). Never commit real keys — use environment
variables; rotate any credential that was ever pasted into chat.
