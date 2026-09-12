# @corsair-dev/here

HERE Technologies plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/here
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `maps.coordinatesToTileIndices` | `here.api.maps.coordinatesToTileIndices` | `read` | Convert lat,lng to Web Mercator XYZ tile indices at a zoom level. |
| `maps.getMapImage` | `here.api.maps.getMapImage` | `read` | Retrieve a static Map Image API v3 PNG or JPEG. |
| `routing.computeMatrix` | `here.api.routing.computeMatrix` | `read` | Compute a travel-time and distance matrix between origins and destinations. |
| `routing.decodeRouteHandle` | `here.api.routing.decodeRouteHandle` | `read` | Decode a previously calculated Routing v8 route handle. |
| `routing.findWaypointSequence` | `here.api.routing.findWaypointSequence` | `read` | Optimize waypoint visit order between a fixed start and destination. |
| `routing.getIsolines` | `here.api.routing.getIsolines` | `read` | Calculate reachable-area isolines by time, distance, or consumption. |
| `routing.getMatrixProfile` | `here.api.routing.getMatrixProfile` | `read` | Retrieve one matrix routing profile by id. |
| `routing.getMatrixResult` | `here.api.routing.getMatrixResult` | `read` | Fetch a completed matrix calculation by matrixId. |
| `routing.getRoutes` | `here.api.routing.getRoutes` | `read` | Calculate routes between waypoints for car, truck, pedestrian, bicycle, scooter, taxi, or bus. |
| `routing.listMatrixProfiles` | `here.api.routing.listMatrixProfiles` | `read` | List predefined matrix routing profiles. |
| `routing.postRoutes` | `here.api.routing.postRoutes` | `read` | Calculate routes via POST when avoid areas, EV options, or large bodies are required. |
| `search.autocomplete` | `here.api.search.autocomplete` | `read` | Get address-focused completions for a partial address query. |
| `search.autosuggest` | `here.api.search.autosuggest` | `read` | Fetch typeahead completions for a partial search term near a location. |
| `search.browse` | `here.api.search.browse` | `read` | Search nearby places with optional category, food type, or name filters. |
| `search.discover` | `here.api.search.discover` | `read` | Discover places and addresses from free-form text near a location. |
| `search.geocode` | `here.api.search.geocode` | `read` | Convert a free-text or qualified address into coordinates. |
| `search.lookup` | `here.api.search.lookup` | `read` | Load full place or address details by HERE id. |
| `search.reverseGeocode` | `here.api.search.reverseGeocode` | `read` | Convert lat,lng coordinates into a structured address. |
| `traffic.getIncidentById` | `here.api.traffic.getIncidentById` | `read` | Get one traffic incident by id. |
| `traffic.getTrafficFlow` | `here.api.traffic.getTrafficFlow` | `read` | Get real-time traffic flow for a geospatial area. |
| `traffic.getTrafficIncidents` | `here.api.traffic.getTrafficIncidents` | `read` | Get real-time traffic incidents for a geospatial area. |
| `transit.getDepartures` | `here.api.transit.getDepartures` | `read` | Get upcoming departures by station id or location. |
| `transit.getStations` | `here.api.transit.getStations` | `read` | Search public transit stations around a location. |
| `weather.getAstronomyForecast` | `here.api.weather.getAstronomyForecast` | `read` | Get sunrise, sunset, and moon event times. |
| `weather.getWeatherAlerts` | `here.api.weather.getWeatherAlerts` | `read` | Get severe weather alerts for a location. |
| `weather.getWeatherForecastDaily` | `here.api.weather.getWeatherForecastDaily` | `read` | Get a 7-day weather forecast (detailed or simple). |
| `weather.getWeatherForecastHourly` | `here.api.weather.getWeatherForecastHourly` | `read` | Get hourly weather forecasts for a location. |
| `weather.getWeatherObservation` | `here.api.weather.getWeatherObservation` | `read` | Get current weather observations for a location. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/here

## License

Apache-2.0
