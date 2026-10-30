# @corsair-dev/tokenmetrics

Token Metrics plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tokenmetrics
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `market.getPrice` | `tokenmetrics.api.market.getPrice` | `read` | Retrieve token price, volume, and market-cap data |
| `market.getTopMarketCap` | `tokenmetrics.api.market.getTopMarketCap` | `read` | List tokens ranked by market capitalization |
| `technical.getIndicators` | `tokenmetrics.api.technical.getIndicators` | `read` | Retrieve a technical indicator for a token and interval |
| `tokens.list` | `tokenmetrics.api.tokens.list` | `read` | List supported tokens and their identifiers |
| `trading.getSignals` | `tokenmetrics.api.trading.getSignals` | `read` | Retrieve AI-generated token entry and exit signals |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tokenmetrics

## License

Apache-2.0
