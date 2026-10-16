# People Data Labs Plugin for Corsair

This package provides a People Data Labs (PDL) integration for Corsair.

People Data Labs is a B2B data provider: person and company enrichment,
large dataset search, identity resolution, bulk enrichment, IP-based
lookups, job posting search, and field normalizers — all behind a single
key at `api.peopledatalabs.com`, sent as the `X-Api-Key` header (not
Bearer, not Basic).

## Endpoints

| Endpoint | Path | Notes |
| --- | --- | --- |
| `person.enrich` | `/v5/person/enrich` | Billed per match; a 404 (no match) is a normal outcome returned as `{found: false}` |
| `person.search` | `/v5/person/search` | Elasticsearch v7.7 DSL or SQL, 200 even at zero records; page with `scroll_token` |
| `person.identify` | `/v5/person/identify` | Candidate matches with `match_score` (1-99); billed per call including no-match calls |
| `person.bulk` | `/v5/person/bulk` | 1-100 enrichments per request; per-item statuses are surfaced inline, failures do not fail the call |
| `company.enrich` | `/v5/company/enrich` | Billed per match; the flat company body is reshaped into `company` beside `found`, `status`, `likelihood` |
| `company.search` | `/v5/company/search` | Same DSL/SQL convention as `person.search`, no `dataset` param |
| `company.clean` | `/v5/company/clean` | Free; takes `name`, `website`, or `profile` |
| `school.clean` | `/v5/school/clean` | Free; same match rule as the company cleaner |
| `location.clean` | `/v5/location/clean` | Free; takes a `location` string |
| `ip.enrich` | `/v5/ip/enrich` | Company and person data behind an IP; proxy/Tor/hosting IPs fail with 400 "Cannot Enrich IP" |
| `job.search` | `/v5/job_posting/search` | Beta; structured field filters XOR a raw DSL `query` (the API ignores filters when `query` is present) |
| `autocomplete.suggest` | `/v5/autocomplete` | Free-form suggestions for any PDL field |

Not implemented on purpose: the deprecated `from` pagination (use
`scroll_token`), School Enrichment and School Search APIs (do not exist),
Job Title and Skill Enrichment (paid add-ons), and the Person Changelog,
Subject Request, and Preview APIs (niche or separate purchase).

## Setup

You need a People Data Labs account and an API key.

Supply it to the provider configuration:
```typescript
import { createCorsair } from 'corsair';
import { pdl } from '@corsair-dev/pdl';

export const corsair = createCorsair({
  // ...
  plugins: [
    pdl({
      key: process.env.PDL_API_KEY,
    }),
  ],
});
```

Point `baseUrl` at `https://sandbox.api.peopledatalabs.com` to run the
same `/v5/` paths against PDL's sandbox without charging real credits:
```typescript
pdl({
  key: process.env.PDL_API_KEY,
  baseUrl: 'https://sandbox.api.peopledatalabs.com',
});
```

## Usage

### Enrich a person
The API enforces a minimum input set, and the plugin enforces it before
any request is sent: one of `profile`, `email`, `phone`, `email_hash`,
`lid`, or a name (`name`, or `first_name` + `last_name`) plus one of
`locality`, `region`, `company`, `school`, `location`, `postal_code`.
```typescript
const result = await corsair.pdl.api.person.enrich({
  profile: 'linkedin.com/in/gracehopper',
  min_likelihood: 8,
});

if (!result.found) {
  // 404: no match; nothing was billed
  return;
}
console.log(result.likelihood, result.data.full_name);
```

Enriched people are stored in the `people` DB entity keyed by their
`pdl_id` when a database is configured; companies are stored in
`companies` keyed by the PDL company id (website as fallback).

### Search the person dataset
Search accepts an Elasticsearch v7.7 DSL object or a SQL string, never
both. The plugin sends the body with POST, PDL's documented
"Using POST Requests" convention, which has no URL-length limit.
```typescript
const page = await corsair.pdl.api.person.search({
  query: { term: { location_country: 'mexico' } },
  dataset: 'phone,-resume',
});

console.log(page.total, page.data.length);
if (page.scroll_token) {
  const next = await corsair.pdl.api.person.search({
    query: { term: { location_country: 'mexico' } },
    scroll_token: page.scroll_token,
  });
}
```

### Resolve identity candidates
`person.identify` returns candidate matches scored 1-99 instead of one
record. It is billed per call, including calls that come back empty.
```typescript
const result = await corsair.pdl.api.person.identify({
  name: 'grace hopper',
  company: 'us navy',
});
if (result.found) {
  console.log(result.matches.map((m) => m.match_score));
}
```

### Enrich many people at once
`person.bulk` answers with a positional array; items can succeed or fail
independently and the array preserves each item's status.
```typescript
const results = await corsair.pdl.api.person.bulk({
  requests: [
    { params: { profile: 'linkedin.com/in/a' } },
    { params: { email: 'b@example.com' }, metadata: { row: 2 } },
  ],
});
results.forEach((item, index) => {
  if (item.status !== 200) console.log(`row ${index} failed: ${item.status}`);
});
```

## Quirks & Constraints
- **Billing**: enrichment and bulk bill per match; identify bills per
  call even when nothing matches; cleaners are free. Calls that return
  an error consume no credits.
- **No-match is a 404**: for `person.enrich`, `company.enrich`, and
  `person.identify` the plugin translates a 404 into a typed
  `{found: false}` result instead of an error.
- **company.enrich is flat**: PDL returns company fields beside
  `status` and `likelihood` (no `data` wrapper). The plugin keeps the
  fields together under `company` so both enrich endpoints share the
  `found` shape.
- **Search rate limits**: the person search endpoint defaults to 10
  requests per minute. Every endpoint has a separate, per-key fixed
  window; live limits come back in the `x-ratelimit-*` headers.
- **Retries**: 429s retry with exponential backoff (PDL documents no
  `Retry-After` header; the reset time from `x-ratelimit-reset` is
  honored when present). 401, 402, 400, 5xx, and timeouts are not
  retried: there are no idempotency keys, and enrichment may have been
  billed server-side before the failure. Once `x-totallimit-remaining`
  reaches 0 every call returns 402 until the account maximum is raised.
- **Bulk params are not pre-validated**: PDL validates each request
  server-side and answers per item, so the plugin passes items through
  and surfaces their statuses rather than rejecting the whole call.
- **Webhooks are not supported**: PDL webhooks are enterprise-only,
  push a monthly batch of up to 1000 changed IDs, and carry no
  signature scheme (only a registration-time shared Authorization
  header value). There is nothing for an agent to subscribe to or
  verify per event, so the plugin ships no webhook surface.

## Plugin docs
See `plugin-docs.yaml` for the summary Corsair surfaces to agents.
