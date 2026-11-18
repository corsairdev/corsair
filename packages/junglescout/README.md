# @corsair-dev/junglescout

Jungle Scout API v1 integration for Corsair. The published API contract is the
[official Swagger specification](https://developer.junglescout.com/api-docs/v1/swagger.json)
and its [documentation site](https://developer.junglescout.com/).

## Install

```bash
pnpm add @corsair-dev/junglescout
```

## Authentication

Jungle Scout requires an `Authorization` header containing the complete
`KEY_NAME:API_KEY` value issued from the account's Developer page. The API key
alone is not sufficient. Corsair stores this combined value as `api_key`:

```bash
pnpm corsair setup --plugin=junglescout api_key='KEY_NAME:API_KEY'
```

Or provide it directly:

```ts
import { junglescout } from '@corsair-dev/junglescout';

const plugin = junglescout({ key: `${process.env.JUNGLESCOUT_KEY_NAME}:${process.env.JUNGLESCOUT_API_KEY}` });
```

Every request also sends `X-API-Type` (`junglescout` by default, or `cobalt` for
Enterprise keys), `Accept: application/vnd.junglescout.v1+json`, and
`Content-Type: application/vnd.api+json`. Every route requires a `marketplace`
query parameter. Supported values are `us`, `uk`, `de`, `in`, `ca`, `fr`, `it`,
`es`, `mx`, and `jp`; an API key may only be authorized for a subset of them.

## Route inventory

The official Swagger reference currently documents these six routes; all six
are implemented. The API uses JSON:API request envelopes for the POST routes.

| Corsair operation | Method and path | Pagination |
|---|---|---|
| `keywords.byAsin` | `POST /api/keywords/keywords_by_asin_query` | Cursor, max page size 100 |
| `keywords.byKeyword` | `POST /api/keywords/keywords_by_keyword_query` | Cursor, max page size 100 |
| `keywords.historicalSearchVolume` | `GET /api/keywords/historical_search_volume` | Not documented for this route |
| `productDatabase.query` | `POST /api/product_database_query` | Cursor, max page size 100 |
| `salesEstimates.query` | `GET /api/sales_estimates_query` | Not documented for this route |
| `shareOfVoice.get` | `GET /api/share_of_voice` | Not documented for this route |

Keyword-by-ASIN queries accept at most 10 ASINs. Keyword-by-keyword queries pass
one or more search phrases in `search_terms`. Product Database keyword filters
allow at most 100 values, each up to 50 characters. The three paginated routes
accept `page_size` and `page_cursor`; extract the `page[cursor]` value from the
server-provided `links.next` URL and pass it as `page_cursor`. For paginated POST
requests, repeat the same request body when requesting the next page, as required
by the provider's pagination rules.

## Usage

```ts
const result = await corsair.junglescout.api.keywords.byKeyword({
	marketplace: 'us',
	search_terms: ['wireless earbuds'],
});
```

All six endpoint inputs and outputs are validated with Zod. Request schemas are
strict, so undocumented inputs (including webhook/callback fields) are rejected.

## Retries and privacy

The provider documents a limit of 300 requests per minute and a burst limit of
15 requests per second per account. HTTP 429 responses are retried up to three
times; a `Retry-After` header is honored when present. Jungle Scout's reference
describes the retry time in the 429 response detail but does not promise that
header. Read-only requests may be retried on server failures; the POST routes
are searches and do not create or update provider resources.

Logs contain only operation-safe context such as marketplace and result counts;
they do not include search phrases, full results, or credentials. Propagated API
errors retain HTTP status and rate-limit metadata, while request values and
provider error payloads are omitted because they may echo submitted search data.

## Webhooks and local data

The published reference documents the six REST routes above; this plugin exposes
no webhook handlers and stores no Jungle Scout data locally.

## Full plugin reference

https://docs.corsair.dev/plugins/junglescout

## License

Apache-2.0
