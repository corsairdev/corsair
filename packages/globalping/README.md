# @corsair-dev/globalping

Globalping plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/globalping
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `health.get` | `globalping.api.health.get` | `read` | Read the Globalping health check. |
| `limits.get` | `globalping.api.limits.get` | `read` | Read the current measurement rate limit. |
| `measurements.create` | `globalping.api.measurements.create` | `write` | Create a network measurement. This spends credits. |
| `measurements.get` | `globalping.api.measurements.get` | `read` | Read a measurement by id. Results are not stored. |
| `probes.list` | `globalping.api.probes.list` | `read` | List online Globalping probes. Probe rows are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/globalping

## License

Apache-2.0
