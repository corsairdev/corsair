# @corsair-dev/googlemaps

GoogleMaps plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googlemaps
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `aerial.lookupAerialVideo` | `googlemaps.api.aerial.lookupAerialVideo` | `read` | Tool to look up an aerial view video by address or video ID. Returns video metadata including state and URIs for playback. Use when you need to retrieve a previously rendered aerial video or check the status of a video render request. Note that receiving a video is a billable event. |
| `aerial.renderAerialVideo` | `googlemaps.api.aerial.renderAerialVideo` | `write` | Starts rendering an aerial view video for a US postal address. Returns a video ID that can be used with lookupVideo to retrieve the video once rendering completes. Rendering typically takes up to a few hours. |
| `geocoding.geocodeAddress` | `googlemaps.api.geocoding.geocodeAddress` | `read` | DEPRECATED: Legacy API to convert street addresses into geographic coordinates (latitude and longitude). This API works best with API key authentication. For OAuth connections without an API key, use geocoding.geocodeAddressWithQuery or geocoding.geocodingApi instead. Use when you need to geocode an address or location to get its precise latitude/longitude coordinates. |
| `geocoding.geocodeAddressWithQuery` | `googlemaps.api.geocoding.geocodeAddressWithQuery` | `read` | Tool to map addresses to geographic coordinates with query parameter. Use when you need to convert a textual address into latitude/longitude coordinates using the modern v4beta API. Results may match multiple places — always verify formattedAddress, region, and addressComponents in the response before using returned coordinates. |
| `geocoding.geocodeDestinations` | `googlemaps.api.geocoding.geocodeDestinations` | `read` | Tool to perform destination lookup and return detailed destination information including primary place, containing places, sub-destinations, landmarks, entrances, and navigation points. Use when you need comprehensive destination data for an address, place ID, or geographic coordinates. |
| `geocoding.geocodePlace` | `googlemaps.api.geocoding.geocodePlace` | `read` | Tool to perform geocode lookup using a place identifier to retrieve address and coordinates. Use when you need to get detailed geographic information for a specific Google Place ID. |
| `geocoding.geocodingApi` | `googlemaps.api.geocoding.geocodingApi` | `read` | Convert addresses into geographic coordinates (latitude and longitude) and vice versa (reverse geocoding), or get an address for a Place ID. Uses the Geocoding API v4 (v4beta) which supports OAuth2 authentication. Exactly one of address, latlng, or place_id must be provided per request; omitting all three or mixing incompatible combinations yields no useful results. |
| `geocoding.reverseGeocodeLocation` | `googlemaps.api.geocoding.reverseGeocodeLocation` | `read` | Tool to convert geographic coordinates (latitude and longitude) to human-readable addresses using reverse geocoding. Use when you need to find the address or place name for a given set of coordinates. A single coordinate pair may return multiple results; verify formattedAddress, region, and addressComponents before committing to a result. |
| `geolocation.geolocate` | `googlemaps.api.geolocation.geolocate` | `read` | Tool to determine location based on cell towers and WiFi access points. Use when you need to find the geographic location of a device using network infrastructure data. |
| `places.autocomplete` | `googlemaps.api.places.autocomplete` | `read` | Returns place and query predictions for text input. Use when implementing as-you-type autocomplete functionality for place searches. Returns up to five predictions ordered by relevance. |
| `places.getPlaceDetails` | `googlemaps.api.places.getPlaceDetails` | `read` | Retrieves comprehensive details for a place using its resource name (places/{place_id} format). Use when you need detailed information about a specific place. |
| `places.getPlacePhoto` | `googlemaps.api.places.getPlacePhoto` | `read` | Retrieves high quality photographic content from the Google Maps Places database. Use when you need to download a place photo using a photo_reference obtained from Place Details, Nearby Search, or Text Search requests. Images are scaled proportionally to fit within specified dimensions. |
| `places.nearbySearch` | `googlemaps.api.places.nearbySearch` | `read` | Searches for places (e.g., restaurants, parks) within a specified circular area, with options to filter by place types and customize the returned fields and number of results. |
| `places.textSearch` | `googlemaps.api.places.textSearch` | `read` | Searches for places on Google Maps using a textual query (e.g., "restaurants in London", "Eiffel Tower"). Results may include CLOSED_PERMANENTLY or TEMPORARILY_CLOSED places — filter by businessStatus=OPERATIONAL. Include city/region and business type in textQuery to avoid empty or irrelevant results. Deduplicate using id or formattedAddress, not name alone. Throttle to ~1 req/s; OVER_QUERY_LIMIT (HTTP 429) requires exponential backoff. |
| `routes.computeRouteMatrix` | `googlemaps.api.routes.computeRouteMatrix` | `read` | Calculates travel distance and duration matrix between multiple origins and destinations using the modern Routes API; supports OAuth2 authentication and various travel modes. Matrix is capped at 625 elements (e.g., 25×25); chunk larger sets to avoid RESOURCE_EXHAUSTED errors. Response elements may be returned out of input order — always use originIndex and destinationIndex to map results. Only use elements where condition='ROUTE_EXISTS'; the matrix may be incomplete. |
| `routes.distanceMatrix` | `googlemaps.api.routes.distanceMatrix` | `read` | DEPRECATED: Legacy API that calculates travel distance and time for a matrix of origins and destinations. This API only works with API keys (no OAuth2 support). Use the modern 'Compute Route Matrix' action instead, which supports OAuth2 authentication. Supports different modes of transportation and options like departure/arrival times. Capped at 100 elements per request (elements = origins × destinations count); split large sets into batches. |
| `routes.getDirection` | `googlemaps.api.routes.getDirection` | `read` | Fetches detailed directions between an origin and a destination, supporting intermediate waypoints and various travel modes. Automatically uses the modern Routes API with OAuth2 when available, falling back to legacy API with API key if provided. |
| `routes.getRoute` | `googlemaps.api.routes.getRoute` | `read` | Calculates one or more routes between two specified locations. Uses various travel modes and preferences; addresses must be resolvable by Google Maps. Response duration is a string with 's' suffix (e.g., "4557s"); parse before displaying. |
| `tiles.createTilesSession` | `googlemaps.api.tiles.createTilesSession` | `read` | Tool to create a session token required for accessing 2D Tiles and Street View imagery. Use when you need to initialize tile-based map rendering or street view display. The session token is valid for approximately two weeks and must be included in all subsequent tile requests. Each call consumes quota — cache and reuse the returned token across all tile requests within its validity window rather than creating a new session per request. |
| `tiles.embedMap` | `googlemaps.api.tiles.embedMap` | `read` | Tool to generate an embeddable Google Map URL and HTML iframe code. Use when you need to display a map (place, view, directions, street view, search) on a webpage without JavaScript. Note: This API only works with API keys (no OAuth2 support). It generates embed URLs and does not make direct API calls. Generated embed URLs are publicly accessible; avoid passing sensitive or internal location queries. |
| `tiles.get2dTile` | `googlemaps.api.tiles.get2dTile` | `read` | Tool to retrieve a 2D map tile image at specified coordinates for building custom map visualizations. Use when you need to download individual map tile images for roadmap, satellite, or terrain views. Requires a valid session token from the createSession endpoint. |
| `tiles.get3dTilesRoot` | `googlemaps.api.tiles.get3dTilesRoot` | `read` | Tool to retrieve the 3D Tiles tileset root configuration for photorealistic 3D map rendering. Use when you need to initialize a 3D renderer with Google's photorealistic tiles following the OGC 3D Tiles specification. The Map Tiles API is billable per request; cache the root response client-side and avoid repeated calls. |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlemaps

## License

Apache-2.0
