# @corsair-dev/minerstat

Minerstat plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/minerstat
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `algorithms.get` | `minerstat.api.algorithms.get` | `read` | Get algorithms |
| `algorithms.list` | `minerstat.api.algorithms.list` | `read` | List algorithms |
| `coins.get` | `minerstat.api.coins.get` | `read` | Get coins |
| `coins.history` | `minerstat.api.coins.history` | `read` | History coins |
| `coins.list` | `minerstat.api.coins.list` | `read` | List coins |
| `hardware.get` | `minerstat.api.hardware.get` | `read` | Get hardware |
| `hardware.list` | `minerstat.api.hardware.list` | `read` | List hardware |
| `pools.get` | `minerstat.api.pools.get` | `read` | Get pools |
| `pools.list` | `minerstat.api.pools.list` | `read` | List pools |
| `profitability.rank` | `minerstat.api.profitability.rank` | `read` | Rank profitability |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/minerstat

## License

Apache-2.0
