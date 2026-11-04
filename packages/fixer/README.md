# @corsair-dev/fixer

Fixer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fixer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `currencies.getAll` | `fixer.api.currencies.getAll` | `read` | Retrieve list of supported currency symbols and names |
| `rates.convert` | `fixer.api.rates.convert` | `read` | Convert amounts between two currencies using real-time or historical rates |
| `rates.historical` | `fixer.api.rates.historical` | `read` | Retrieve historical exchange rates for a specific date (YYYY-MM-DD) |
| `rates.latest` | `fixer.api.rates.latest` | `read` | Retrieve real-time exchange rates for all or specified currencies |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fixer

## License

Apache-2.0
