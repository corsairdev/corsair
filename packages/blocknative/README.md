# @corsair-dev/blocknative

Blocknative plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/blocknative
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `gas.getBaseFeeEstimates` | `blocknative.api.gas.getBaseFeeEstimates` | `read` | Get real-time base fee, blob base fee, and priority fee predictions for the next 5 Ethereum blocks |
| `gas.getDistribution` | `blocknative.api.gas.getDistribution` | `read` | Retrieve the current mempool gas price distribution breakdown |
| `gas.getOracles` | `blocknative.api.gas.getOracles` | `read` | Retrieve metadata on supported gas oracles per chain |
| `gas.getPrices` | `blocknative.api.gas.getPrices` | `read` | Fetch gas price estimates for specific inclusion probabilities (next block or ~10 seconds) |
| `gas.getSupportedChains` | `blocknative.api.gas.getSupportedChains` | `read` | Retrieve supported chains metadata for Blocknative gas services |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/blocknative

## License

Apache-2.0
