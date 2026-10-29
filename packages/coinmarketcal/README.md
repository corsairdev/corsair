# @corsair-dev/coinmarketcal

CoinMarketCal plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/coinmarketcal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `coins.list` | `coinmarketcal.api.coins.list` | `read` | List available cryptocurrencies from CoinMarketCal |
| `coins.get` | `coinmarketcal.api.coins.get` | `read` | Get a cryptocurrency by slug from CoinMarketCal |
| `events.list` | `coinmarketcal.api.events.list` | `read` | List cryptocurrency events from CoinMarketCal |
| `events.get` | `coinmarketcal.api.events.get` | `read` | Get a cryptocurrency event by id from CoinMarketCal |
| `categories.list` | `coinmarketcal.api.categories.list` | `read` | List event categories from CoinMarketCal |

## Auth

Auth: API key (`x-api-key`). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/coinmarketcal

## License

Apache-2.0
