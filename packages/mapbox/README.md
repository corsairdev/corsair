# @corsair-dev/mapbox

Mapbox plugin for Corsair: geocoding, directions, matrix, isochrone, tilequery and trip optimization. No webhooks.

## Install

```bash
pnpm add @corsair-dev/mapbox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `directions.route` | `mapbox.api.directions.route` | `read` | Get a route between 2 to 25 waypoints for driving, driving with traffic, walking or cycling, with optional steps, annotations and alternatives; throws when Mapbox finds no route |
| `geocoding.forward` | `mapbox.api.geocoding.forward` | `read` | Turn an address or place name into coordinates and structured address context; a query with no match returns an empty features list |
| `geocoding.reverse` | `mapbox.api.geocoding.reverse` | `read` | Turn a longitude and latitude into the address, place or other features at that point |
| `isochrone.get` | `mapbox.api.isochrone.get` | `read` | Get the area reachable from a point within up to four travel times or distances, as GeoJSON lines or polygons |
| `matrix.calculate` | `mapbox.api.matrix.calculate` | `read` | Get travel times, distances or both between up to 25 points (10 with traffic), as a sources by destinations table |
| `tilequery.query` | `mapbox.api.tilequery.query` | `read` | List the features of one or more vector tilesets at or near a point, nearest first |
| `trips.optimize` | `mapbox.api.trips.optimize` | `read` | Find the fastest order to visit 2 to 12 stops (Optimization v1, answered immediately); throws on NoSegment or an unsupported roundtrip/source/destination combination |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mapbox

## License

Apache-2.0
