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
| `measurements.create` | `globalping.api.measurements.create` | `write` | Start a ping, traceroute, dns, mtr or http test from Globalping probes, picked by location. Uses the hourly measurement allowance, then account credits. |
| `measurements.get` | `globalping.api.measurements.get` | `read` | Read a measurement by id with each probe's result. Poll until status is finished. Results are not stored. |
| `probes.list` | `globalping.api.probes.list` | `read` | List online Globalping probes. Probe rows are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/globalping

## License

Apache-2.0
