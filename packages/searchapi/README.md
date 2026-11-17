# @corsair-dev/searchapi

SearchAPI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/searchapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `searchapi.api.account.get` | `read` | Read account usage and the hourly limit. |
| `locations.list` | `searchapi.api.locations.list` | `read` | Look up Google locations by name. |
| `searches.get` | `searchapi.api.searches.get` | `read` | Read a cached search by id. Result rows are not stored. |
| `searches.html` | `searchapi.api.searches.html` | `read` | Read cached search HTML by id. The HTML is not stored. |
| `searches.run` | `searchapi.api.searches.run` | `read` | Run a search on any SearchAPI engine (google, google_news, bing, youtube, amazon_search, ...) with location, language, page and time filters. Returns organic results and every other section (answer box, AI overview, knowledge graph, news, local results). Uses one search credit. Results are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/searchapi

## License

Apache-2.0
