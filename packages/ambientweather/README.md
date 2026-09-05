# @corsair-dev/ambientweather

AmbientWeather plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ambientweather
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `devices.getData` | `ambientweather.api.devices.getData` | `read` | Fetch historical weather data for a specific Ambient Weather device |
| `devices.list` | `ambientweather.api.devices.list` | `read` | List all Ambient Weather devices for the connected account with their latest readings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ambientweather

## License

Apache-2.0
