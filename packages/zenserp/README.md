# @corsair-dev/zenserp

Zenserp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zenserp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getStatus` | `zenserp.api.account.getStatus` | `read` | Return the remaining request quota for the API key |
| `batches.list` | `zenserp.api.batches.list` | `read` | List submitted Zenserp batches |
| `metadata.listCountries` | `zenserp.api.metadata.listCountries` | `read` | List supported Google country parameters |
| `metadata.listLanguages` | `zenserp.api.metadata.listLanguages` | `read` | List supported Google interface languages |
| `metadata.listLocations` | `zenserp.api.metadata.listLocations` | `read` | List supported geolocation targets |
| `metadata.listSearchEngines` | `zenserp.api.metadata.listSearchEngines` | `read` | List supported search-engine domains |
| `search.bing` | `zenserp.api.search.bing` | `read` | Search Bing and return structured SERP data |
| `search.google` | `zenserp.api.search.google` | `read` | Search Google and return structured SERP data |
| `search.reverseImage` | `zenserp.api.search.reverseImage` | `read` | Run a Google reverse-image search for a public image URL |
| `search.yandex` | `zenserp.api.search.yandex` | `read` | Search Yandex and return structured SERP data |
| `shopping.getProduct` | `zenserp.api.shopping.getProduct` | `read` | Retrieve Google Shopping product details |
| `trends.get` | `zenserp.api.trends.get` | `read` | Retrieve Google Trends data for one or more keywords |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zenserp

## License

Apache-2.0
