# @corsair-dev/companyenrich

CompanyEnrich v2 plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/companyenrich
```

## Authentication

The plugin uses a CompanyEnrich API token with the `Authorization: Bearer <token>` header. Corsair prompts for the API key on first use. The API base URL is `https://api.companyenrich.com`.

## Operations

Every operation validates its input and response against a Zod schema. Search operations return cursor pagination where documented; pass the returned `nextCursor` as `cursor` to continue with the same search.

| Operation | Method and path | Official reference |
| --- | --- | --- |
| `companies.get` | `GET /v2/companies/{companyId}` | [Get a company by ID](https://docs.companyenrich.com/reference/get_v2-companies-companyid.md) |
| `companies.enrichByDomain` | `GET /v2/companies/enrich` | [Enrich by domain](https://docs.companyenrich.com/reference/get_v2-companies-enrich.md) |
| `companies.enrichByProperties` | `POST /v2/companies/enrich` | [Enrich by properties](https://docs.companyenrich.com/reference/post_v2-companies-enrich.md) |
| `companies.enrichBatch` | `POST /v2/companies/enrich/batch` | [Batch enrich by domain](https://docs.companyenrich.com/reference/post_v2-companies-enrich-batch.md) |
| `companies.autocomplete` | `GET /v2/companies/autocomplete` | [Autocomplete companies](https://docs.companyenrich.com/reference/get_v2-companies-autocomplete.md) |
| `companies.workforce` | `GET /v2/companies/workforce` | [Company workforce](https://docs.companyenrich.com/reference/get_v2-companies-workforce.md) |
| `companies.search` | `POST /v2/companies/search` | [Search companies](https://docs.companyenrich.com/reference/post_v2-companies-search.md) |
| `companies.searchCount` | `POST /v2/companies/search/count` | [Count matching companies](https://docs.companyenrich.com/reference/post_v2-companies-search-count.md) |
| `companies.searchPreview` | `POST /v2/companies/search/preview` | [Preview matching companies](https://docs.companyenrich.com/reference/post_v2-companies-search-preview.md) |
| `people.get` | `GET /v2/people/{personId}` | [Get a person by ID](https://docs.companyenrich.com/reference/get_v2-people-personid.md) |
| `people.enrich` | `POST /v2/people/enrich` | [Enrich a person by email](https://docs.companyenrich.com/reference/post_v2-people-enrich.md) |
| `people.findEmail` | `GET /v2/people/{personId}/email` | [Find a person's work email (beta)](https://docs.companyenrich.com/reference/get_v2-people-personid-email.md) |
| `people.search` | `POST /v2/people/search` | [Search people](https://docs.companyenrich.com/reference/post_v2-people-search.md) |
| `people.searchCount` | `POST /v2/people/search/count` | [Count matching people](https://docs.companyenrich.com/reference/post_v2-people-search-count.md) |
| `people.searchPreview` | `POST /v2/people/search/preview` | [Preview matching people](https://docs.companyenrich.com/reference/post_v2-people-search-preview.md) |
| `geo.regions` | `GET /v2/geo/regions` | [Get regions](https://docs.companyenrich.com/reference/get_v2-geo-regions.md) |
| `geo.getCountry` | `GET /v2/geo/countries/{countryCode}` | [Get country by code](https://docs.companyenrich.com/reference/get_v2-geo-countries-countrycode.md) |
| `geo.searchCountries` | `POST /v2/geo/countries` | [Search countries](https://docs.companyenrich.com/reference/post_v2-geo-countries.md) |
| `geo.searchStates` | `POST /v2/geo/states` | [Search states](https://docs.companyenrich.com/reference/post_v2-geo-states.md) |
| `geo.searchCities` | `POST /v2/geo/cities` | [Search cities](https://docs.companyenrich.com/reference/post_v2-geo-cities.md) |
| `industries.list` | `GET /v2/industries` | [List industries](https://docs.companyenrich.com/reference/get_v2-industries.md) |
| `keywords.autocomplete` | `GET /v2/keywords/autocomplete` | [Lookup keywords](https://docs.companyenrich.com/reference/get_v2-keywords-autocomplete.md) |
| `technologies.autocomplete` | `GET /v2/technologies/autocomplete` | [Lookup technologies](https://docs.companyenrich.com/reference/get_v2-technologies-autocomplete.md) |
| `positions.autocomplete` | `GET /v2/positions/autocomplete` | [Lookup positions](https://docs.companyenrich.com/reference/get_v2-positions-autocomplete.md) |
| `account.me` | `GET /v2/me` | [Get current user information](https://docs.companyenrich.com/reference/get_v2-me.md) |

`companies.get` costs 1 credit per returned company. The `financial`, `keywords`, `naicsCodes`, `technologies`, and `workforce` expansions add 1 credit each; `workforce` includes the latest 12 months of history, and each earlier 12-month page from `companies.workforce` costs 1 more credit.

## API-surface note

This plugin implements the 25 synchronous v2 operations listed above. The v2 OpenAPI also documents 10 asynchronous operations that are not implemented here: bulk company enrichment (`POST /v2/companies/enrich/bulk` and its results download), company and people search exports (`POST /v2/companies/search/export`, `POST /v2/people/search/export` and their results downloads), and batch management (`GET /v2/batches`, `GET /v2/batches/{id}`, `POST /v2/batches/{id}/cancel`, `GET /v2/batches/{id}/results`). Lookalike search runs through `companies.search` and `companies.searchCount`. Saved company lists and list-based exports are V1 only; the v2 description says they are not planned for v2.

## Webhooks

No inbound webhooks or webhook management operations are implemented. The plugin handles documented v2 request/response endpoints only.

## References

- [CompanyEnrich documentation index](https://docs.companyenrich.com/llms.txt)
- [Rate limits](https://docs.companyenrich.com/docs/rate-limit.md) — documentation gives differing limits; this plugin handles 429 responses without hard-coding a provider request-rate number.
- [Credits](https://docs.companyenrich.com/docs/credits.md)

## License

Apache-2.0
