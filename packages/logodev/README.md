# @corsair-dev/logodev

Logo.dev plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/logodev
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.search` | `logodev.api.brands.search` | `read` | Search brands by name and get each match with its domain and logo URL. |
| `brands.lookup` | `logodev.api.brands.lookup` | `read` | Look up a brand profile by domain, ticker, ISIN, crypto symbol or name. |
| `brands.get` | `logodev.api.brands.get` | `read` | Get a brand profile by its Logo.dev brand id. |
| `logos.fetch` | `logodev.api.logos.fetch` | `read` | Get a brand's logo as a temporary download URL with its size and format. |
| `logos.getBrandmark` | `logodev.api.logos.getBrandmark` | `read` | Get a brand's brandmark as a temporary download URL. |
| `account.get` | `logodev.api.account.get` | `read` | Get the plan and API credit balance. |
| `subscriptions.get` | `logodev.api.subscriptions.get` | `read` | Check whether the account follows a brand's update events. |
| `subscriptions.subscribe` | `logodev.api.subscriptions.subscribe` | `write` | Follow a brand's update events. |
| `subscriptions.unsubscribe` | `logodev.api.subscriptions.unsubscribe` | `write` | Stop following a brand's update events. |
| `webhookEndpoints.list` | `logodev.api.webhookEndpoints.list` | `read` | List the team's webhook endpoints. |
| `webhookEndpoints.get` | `logodev.api.webhookEndpoints.get` | `read` | Get one webhook endpoint. |
| `webhookEndpoints.create` | `logodev.api.webhookEndpoints.create` | `write` | Register a URL for brand events. |
| `webhookEndpoints.update` | `logodev.api.webhookEndpoints.update` | `write` | Change a webhook endpoint. |
| `webhookEndpoints.delete` | `logodev.api.webhookEndpoints.delete` | `destructive` | Delete a webhook endpoint. |

## Auth

Auth: API key. Use the Logo.dev secret key (`sk_…`); the publishable key only works on the image CDN. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/logodev

## License

Apache-2.0
