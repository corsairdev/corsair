# @corsair-dev/brandfetch

Brandfetch plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/brandfetch
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.get` | `brandfetch.api.brands.get` | `read` | Get brand logos, colors, fonts, and company details by domain, ticker, ISIN, crypto symbol, or Brand ID |
| `brands.getCompany` | `brandfetch.api.brands.getCompany` | `read` | Get firmographic company data for a brand identifier |
| `brands.search` | `brandfetch.api.brands.search` | `read` | Search brands by name for autocomplete (requires client ID) |
| `graphql.getVersion` | `brandfetch.api.graphql.getVersion` | `read` | Get the Brandfetch GraphQL API version |
| `logos.get` | `brandfetch.api.logos.get` | `read` | Build a Brandfetch Logo CDN URL (requires client ID) |
| `taxonomy.get` | `brandfetch.api.taxonomy.get` | `read` | Get Brandfetch industries, countries, and geographic regions |
| `transactions.get` | `brandfetch.api.transactions.get` | `read` | Match a payment descriptor to merchant brand data |
| `webhooks.list` | `brandfetch.api.webhooks.list` | `read` | List registered Brandfetch webhooks |
| `webhooks.listEvents` | `brandfetch.api.webhooks.listEvents` | `read` | List webhook event types that can be subscribed to |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/brandfetch

## License

Apache-2.0
