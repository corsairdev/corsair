# @corsair-dev/retailed

Retailed plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/retailed
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `goat.prices` | `retailed.api.goat.prices` | `read` | Get GOAT product prices |
| `products.search` | `retailed.api.products.search` | `read` | Search products |
| `stockx.product` | `retailed.api.stockx.product` | `read` | Get StockX product details |
| `stockx.search` | `retailed.api.stockx.search` | `read` | Search StockX products |
| `stockx.trends` | `retailed.api.stockx.trends` | `read` | Get StockX trends |
| `usage.get` | `retailed.api.usage.get` | `read` | Get API usage information |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/retailed

## License

Apache-2.0
