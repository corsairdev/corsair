# @corsair-dev/openweathermap

Openweathermap plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/openweathermap
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `airPollution.current` | `openweathermap.api.airPollution.current` | `read` | Get current air pollution data for a latitude/longitude pair |
| `airPollution.forecast` | `openweathermap.api.airPollution.forecast` | `read` | Get forecasted air pollution data for a latitude/longitude pair |
| `airPollution.history` | `openweathermap.api.airPollution.history` | `read` | Get historical air pollution data for a latitude/longitude pair and time range |
| `geocoding.byZip` | `openweathermap.api.geocoding.byZip` | `read` | Convert a zip/post code into geographic coordinates |
| `geocoding.direct` | `openweathermap.api.geocoding.direct` | `read` | Convert a location name into geographic coordinates |
| `geocoding.reverse` | `openweathermap.api.geocoding.reverse` | `read` | Convert geographic coordinates into location names |
| `history.timeMachine` | `openweathermap.api.history.timeMachine` | `read` | Get historical weather data for a specific timestamp (available from 1979-01-01) |
| `maps.weatherMapTile` | `openweathermap.api.maps.weatherMapTile` | `read` | Fetch a Weather Maps 2.0 tile image for a layer and coordinates |
| `stations.create` | `openweathermap.api.stations.create` | `write` | Register a new personal weather station with OpenWeather |
| `stations.get` | `openweathermap.api.stations.get` | `read` | Get details for a registered weather station by ID |
| `stations.getMeasurements` | `openweathermap.api.stations.getMeasurements` | `read` | Get aggregated measurements from a registered station (minute/hour/day intervals) |
| `stations.list` | `openweathermap.api.stations.list` | `read` | List all weather stations registered to your OpenWeather account |
| `stations.remove` | `openweathermap.api.stations.remove` | `destructive` | Delete a registered weather station from your account [DESTRUCTIVE] |
| `stations.submitMeasurements` | `openweathermap.api.stations.submitMeasurements` | `write` | Submit weather measurements from a registered station |
| `stations.update` | `openweathermap.api.stations.update` | `write` | Update a registered weather station name, location, or external ID |
| `summary.daySummary` | `openweathermap.api.summary.daySummary` | `read` | Get aggregated weather summary for a specific date (temperature, wind, precipitation) |
| `summary.overview` | `openweathermap.api.summary.overview` | `read` | Get a human-readable weather overview text for a location and date |
| `weather.circleCity` | `openweathermap.api.weather.circleCity` | `read` | Get current weather for cities within a circle around a geographic point |
| `weather.current` | `openweathermap.api.weather.current` | `read` | Get current weather for a location by city name, city ID, zip code, or coordinates |
| `weather.forecast5Day` | `openweathermap.api.weather.forecast5Day` | `read` | Get 5-day forecast in 3-hour steps (up to 40 timestamps) for a location |
| `weather.oneCall` | `openweathermap.api.weather.oneCall` | `read` | Get current weather, minutely/hourly/daily forecasts, and weather alerts for a location |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/openweathermap

## License

Apache-2.0
