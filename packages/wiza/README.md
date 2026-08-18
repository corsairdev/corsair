# @corsair-dev/wiza

Wiza plugin for Corsair. Wiza finds and exports accurate contact data for
prospects from LinkedIn — verified emails, phone numbers, and enriched
professional information for sales prospecting.

## Auth setup

Wiza uses API key auth (Bearer token). Get a key from your
[Wiza dashboard](https://wiza.co) and pass it as `key`, or store it per
tenant via Corsair's key management (`get_api_key`).

```ts
import { wiza } from '@corsair-dev/wiza'

const plugin = wiza({ key: process.env.WIZA_API_KEY })
```

## Endpoints

| Endpoint                  | Risk  | Description                                                                                        |
| ------------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| `credits.get`             | read  | Remaining API credits (emails, phones, exports)                                                    |
| `individualReveals.start` | write | Enrich a single contact in real time (by LinkedIn URL, email, or name + company); consumes credits |
| `individualReveals.get`   | read  | Status and results of a reveal by ID                                                               |
| `lists.get`               | read  | Processing status and details of a list by ID                                                      |
| `prospects.search`        | read  | Count and sample profiles matching filters (job title, location, company, industry)                |

Reveals are asynchronous: `individualReveals.start` returns an ID with status
`queued`, then poll `individualReveals.get` until `status` is `finished`.
Optional `callback_url` is delivered by Wiza directly to your URL — it does
not go through Corsair webhooks.

## Entities

Results are persisted to the plugin database: `reveals` (enriched contacts),
`lists`, and `prospects` (search results, keyed by LinkedIn URL).

## API reference

[docs.wiza.co](https://docs.wiza.co/) — base URL `https://wiza.co/api`,
`Authorization: Bearer <api_key>`.
