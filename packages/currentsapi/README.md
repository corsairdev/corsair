# @corsair-dev/currentsapi

CurrentsApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/currentsapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.get` | `currentsapi.api.categories.get` | `read` | List valid category codes |
| `languages.get` | `currentsapi.api.languages.get` | `read` | List valid language codes |
| `latest.get` | `currentsapi.api.latest.get` | `read` | Get latest news headlines |
| `regions.get` | `currentsapi.api.regions.get` | `read` | List valid country region codes |
| `search.get` | `currentsapi.api.search.get` | `read` | Search news articles by keywords with filters |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/currentsapi

## License

Apache-2.0
