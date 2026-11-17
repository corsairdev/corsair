# @corsair-dev/currencyscoop

CurrencyScoop plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/currencyscoop
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `currencies.list` | `currencyscoop.api.currencies.list` | `read` | List supported CurrencyBeacon currency codes. |
| `quotes.convert` | `currencyscoop.api.quotes.convert` | `read` | Convert an amount between two currencies. |
| `quotes.historical` | `currencyscoop.api.quotes.historical` | `read` | Read mid-market rates for one date. |
| `quotes.latest` | `currencyscoop.api.quotes.latest` | `read` | Read the latest mid-market rates. |
| `quotes.timeseries` | `currencyscoop.api.quotes.timeseries` | `read` | Read daily rates between two dates. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/currencyscoop

## License

Apache-2.0
