# @corsair-dev/ecologi

Ecologi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ecologi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `carbonOffsets.get` | `ecologi.api.carbonOffsets.get` | `read` | Read the CO2e avoided by an Ecologi username. |
| `carbonRemovals.get` | `ecologi.api.carbonRemovals.get` | `read` | Read the CO2e removed by an Ecologi username. |
| `habitats.get` | `ecologi.api.habitats.get` | `read` | Read the habitat restored by an Ecologi username. |
| `impacts.get` | `ecologi.api.impacts.get` | `read` | Read the combined impact for an Ecologi username. |
| `trees.get` | `ecologi.api.trees.get` | `read` | Read the trees funded by an Ecologi username. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ecologi

## License

Apache-2.0
