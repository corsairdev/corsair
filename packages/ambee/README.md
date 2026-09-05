# @corsair-dev/ambee

Ambee plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ambee
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `airQuality.getForecastByLatLng` | `ambee.api.airQuality.getForecastByLatLng` | `read` | Get the hourly air quality forecast for a latitude/longitude (next 48 hours) |
| `airQuality.getHistoryByLatLng` | `ambee.api.airQuality.getHistoryByLatLng` | `read` | Get hourly historical air quality for a latitude/longitude over a time range |
| `airQuality.getHistoryByPostalCode` | `ambee.api.airQuality.getHistoryByPostalCode` | `read` | Get hourly historical air quality for a postal code over a time range |
| `airQuality.getLatestByCity` | `ambee.api.airQuality.getLatestByCity` | `read` | Get the latest air quality for the stations in a city |
| `airQuality.getLatestByCountryCode` | `ambee.api.airQuality.getLatestByCountryCode` | `read` | Get the latest air quality for the monitoring stations across a country |
| `airQuality.getLatestByLatLng` | `ambee.api.airQuality.getLatestByLatLng` | `read` | Get the latest air quality (AQI and pollutant concentrations) for a latitude/longitude |
| `airQuality.getLatestByPostalCode` | `ambee.api.airQuality.getLatestByPostalCode` | `read` | Get the latest air quality for a postal code and country |
| `disasters.getHistoryByContinent` | `ambee.api.disasters.getHistoryByContinent` | `read` | Get historical natural disasters on a continent over a date range (paginated) |
| `disasters.getHistoryByCountryCode` | `ambee.api.disasters.getHistoryByCountryCode` | `read` | Get historical natural disasters in a country over a date range (paginated) |
| `disasters.getHistoryByDateRange` | `ambee.api.disasters.getHistoryByDateRange` | `read` | Get historical natural disasters worldwide over a date range (paginated) |
| `disasters.getHistoryByLatLng` | `ambee.api.disasters.getHistoryByLatLng` | `read` | Get historical natural disasters near a latitude/longitude over a date range (paginated) |
| `disasters.getLatestByContinent` | `ambee.api.disasters.getLatestByContinent` | `read` | Get the latest natural disasters on a continent (paginated) |
| `disasters.getLatestByCountryCode` | `ambee.api.disasters.getLatestByCountryCode` | `read` | Get the latest natural disasters in a country (paginated) |
| `disasters.getLatestByLatLng` | `ambee.api.disasters.getLatestByLatLng` | `read` | Get the latest natural disasters near a latitude/longitude (paginated) |
| `elevation.getByLatLng` | `ambee.api.elevation.getByLatLng` | `read` | Get the ground elevation at a latitude/longitude |
| `elevation.getByPlace` | `ambee.api.elevation.getByPlace` | `read` | Get the ground elevation for a named place |
| `fire.getLatestByLatLng` | `ambee.api.fire.getLatestByLatLng` | `read` | Get wildfires detected or reported near a latitude/longitude in the last 7 days |
| `fire.getLatestByPlace` | `ambee.api.fire.getLatestByPlace` | `read` | Get wildfires detected or reported near a named place in the last 7 days |
| `fire.getRiskByLatLng` | `ambee.api.fire.getRiskByLatLng` | `read` | Get the wildfire risk forecast for a latitude/longitude (up to 4 weeks ahead) |
| `fire.getRiskByPlace` | `ambee.api.fire.getRiskByPlace` | `read` | Get the wildfire risk forecast for a named place (up to 4 weeks ahead) |
| `geocode.byPlace` | `ambee.api.geocode.byPlace` | `read` | Geocode a place name or address into coordinates |
| `geocode.reverseByLatLng` | `ambee.api.geocode.reverseByLatLng` | `read` | Reverse-geocode a latitude/longitude into a human-readable address |
| `ili.getForecastByLatLng` | `ambee.api.ili.getForecastByLatLng` | `read` | Get the daily influenza-like-illness risk forecast for a latitude/longitude |
| `pollen.getForecast` | `ambee.api.pollen.getForecast` | `read` | Get the pollen forecast for a location (48 hours hourly or 120 hours 3-hourly) |
| `pollen.getHistory` | `ambee.api.pollen.getHistory` | `read` | Get historical pollen counts for a location over a time range |
| `pollen.getLatest` | `ambee.api.pollen.getLatest` | `read` | Get the latest grass, tree and weed pollen counts and risk levels for a location |
| `weather.getForecast` | `ambee.api.weather.getForecast` | `read` | Get the hourly weather forecast for a latitude/longitude (next 72 hours) |
| `weather.getHistory` | `ambee.api.weather.getHistory` | `read` | Get hourly historical weather for a latitude/longitude over a time range |
| `weather.getLatest` | `ambee.api.weather.getLatest` | `read` | Get current weather conditions (temperature, humidity, wind, UV) for a latitude/longitude |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ambee

## License

Apache-2.0
