# @corsair-dev/stormglass

Stormglass plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/stormglass
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `elevation.get` | `stormglass.api.elevation.get` | `write` | Read elevation for one coordinate. This counts against the daily quota. |
| `solar.get` | `stormglass.api.solar.get` | `write` | Read solar values for one coordinate. This counts against the daily quota. |
| `stations.area` | `stormglass.api.stations.area` | `read` | List tide stations inside a bounding box. |
| `stations.list` | `stormglass.api.stations.list` | `read` | List tide stations. Each request counts against the daily quota. |
| `tides.extremes` | `stormglass.api.tides.extremes` | `write` | Read high and low tides for one coordinate. This counts against the daily quota. |
| `weather.get` | `stormglass.api.weather.get` | `write` | Read weather values for one coordinate. This counts against the daily quota. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/stormglass

## License

Apache-2.0
