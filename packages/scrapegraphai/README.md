# @corsair-dev/scrapegraphai

Corsair plugin for [ScrapeGraphAI](https://scrapegraphai.com) — AI-powered web scraping, search, crawling, and page-to-markdown conversion.

## Auth setup

API key only, no OAuth, no webhooks.

```ts
import { scrapegraphai } from '@corsair-dev/scrapegraphai'

// Preferred in apps: key resolved from Corsair's key context
const plugin = scrapegraphai()

// Scripts / demos: pass the key directly
const pluginWithKey = scrapegraphai({ key: process.env.SGAI_API_KEY })
```

Missing credentials throw `AuthMissingError`.

- Base URL: `https://api.scrapegraphai.com/v1`
- Auth header: `SGAI-APIKEY: <key>` — not a Bearer token

Get a key from the [ScrapeGraphAI dashboard](https://dashboard.scrapegraphai.com). The free tier includes 500 credits/month, enough to exercise every operation below.

## Endpoint overview (27 operations)

| Domain                    | Ops                                          |
| ------------------------- | --------------------------------------------- |
| **SearchScraper** (3)     | start, status, history                        |
| **SmartScraper** (3)      | start, status, history                        |
| **Markdownify** (3)       | start, status, history                        |
| **SmartCrawler** (4)      | start, status, history, webhookLogs           |
| **AgenticScraper** (2)    | history, getLiveSessionUrl                    |
| **Scrape** (1)            | history — no start op in this catalog         |
| **Sitemap** (1)           | history — no start op in this catalog         |
| **Schema** (1)            | generate                                      |
| **Endpoint** (2)          | getSuggestions, save                          |
| **Account** (3)           | credits, validateApiKey, usageTimeline        |
| **Feedback** (2)          | submit, submitProduct                         |
| **ScheduledJobs** (1)     | list                                          |
| **Utilities** (1)         | toonify (JSON → TOON)                         |

SearchScraper, SmartScraper, Markdownify, and SmartCrawler are all async: `start` returns an id, `status` polls for the result. Their `start`/`status` responses are also saved to a local `jobs` entity so status history is available without re-fetching the provider.

## Error handling

- `RATE_LIMIT_ERROR` — HTTP 429; retries with `Retry-After` when present
- `AUTH_ERROR` — HTTP 401; no retry
- `INSUFFICIENT_CREDITS_ERROR` — HTTP 402; no retry (matches ScrapeGraphAI's own SDK, which maps 402 to "insufficient credits")
- `DEFAULT` — no retry

## Provider quirks

- **Toonify's response is a bare string**, not wrapped in an object — `utilities.toonify`'s output schema is a `string | object` union to match.
- **A handful of endpoints don't publish a response schema** on the provider's own OpenAPI doc (`crawl` start/status, `webhook/logs`, `endpoint/save-endpoint`, `validate`, `toonify`). Those are typed loosely (`.loose()`) against the closest sibling model instead of guessed field-by-field — see the comment above each one in `endpoints/types.ts`.
- **Real (non-mock) requests currently 500 on a fresh free-tier account** without deducting credits — reproduced on both `smartscraper` and the simplest possible endpoint (`scrape`, just a URL), so it isn't request-shape specific. `mock: true` and all read-only endpoints (`credits`, `validate`, `history`... though history itself also 500s on an empty account) work fine. This looks like a provider-side account issue, reported to ScrapeGraphAI support.

## Tests

```bash
pnpm --filter @corsair-dev/scrapegraphai test
```

43 tests, all mocked (client transport, all 27 endpoint wrappers, error routing, schema) — no API key required, runs in CI.

## Links

- Docs: https://docs.scrapegraphai.com
- API reference: https://api.scrapegraphai.com/openapi.json
- Package: `@corsair-dev/scrapegraphai`
