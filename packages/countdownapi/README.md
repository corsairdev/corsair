# @corsair-dev/countdownapi

CountdownApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/countdownapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `autocomplete.get` | `countdownapi.api.autocomplete.get` | `read` | Get eBay search autocomplete suggestions |
| `product.get` | `countdownapi.api.product.get` | `read` | Get eBay product data using Countdown API |
| `search.get` | `countdownapi.api.search.get` | `read` | Search eBay products using Countdown API |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/countdownapi

## License

Apache-2.0
