# @corsair-dev/stormglass

Stormglass plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/stormglass
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `astronomy.get` | `stormglass.api.astronomy.get` | `read` | Get sunrise, sunset, dawn, dusk, moonrise, moonset and moon phase per day for one coordinate. |
| `bio.get` | `stormglass.api.bio.get` | `read` | Get hourly bio data (water chemistry, salinity, soil moisture and temperature) for one coordinate. |
| `elevation.get` | `stormglass.api.elevation.get` | `read` | Get elevation (land) or depth (sea, negative) in meters for one coordinate. |
| `solar.get` | `stormglass.api.solar.get` | `read` | Get hourly solar values (uvIndex, radiation) for one coordinate. |
| `stations.area` | `stormglass.api.stations.area` | `read` | List tide stations inside a bounding box (lat,lng:lat,lng). |
| `stations.list` | `stormglass.api.stations.list` | `read` | List every tide station Stormglass has data for. |
| `tides.extremes` | `stormglass.api.tides.extremes` | `read` | Get high and low tide times and heights near a coordinate, up to 10 days, from the nearest tide station. |
| `tides.seaLevel` | `stormglass.api.tides.seaLevel` | `read` | Get the hourly astronomical sea level near a coordinate, up to 10 days, from the nearest tide station. |
| `weather.get` | `stormglass.api.weather.get` | `read` | Get hourly weather and marine forecast values (wind, waves, swell, temperature, ...) for one coordinate. Covers the past 14 days and up to 10 days ahead. |
| `weather.historical` | `stormglass.api.weather.historical` | `read` | Get hourly historical weather for one coordinate from 2014 to about a week ago, up to 10 days per call. Needs start or end. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/stormglass

## License

Apache-2.0
