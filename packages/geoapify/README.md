# @corsair-dev/geoapify

Geoapify plugin for Corsair: geocode addresses both ways, autocomplete them, search places by category, calculate routes, isolines and route matrices, and read time zones, boundaries, postcodes and elevation.

## Install

```bash
pnpm add @corsair-dev/geoapify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `geo.boundaries` | `geoapify.api.geo.boundaries` | `destructive` | Read the administrative boundaries a place belongs to, such as its city, county and country |
| `geo.elevation` | `geoapify.api.geo.elevation` | `destructive` | Sample the terrain elevation at one or more points, in metres or feet |
| `geo.ip` | `geoapify.api.geo.ip` | `destructive` | Locate an IP address, or the caller when none is given, returning its country, city and coordinates |
| `geo.postcodeList` | `geoapify.api.geo.postcodeList` | `destructive` | Search postcodes by a prefix or a spatial filter, which is what a postcode autocomplete needs |
| `geo.postcodeSearch` | `geoapify.api.geo.postcodeSearch` | `destructive` | Look up a postcode, returning its coordinates and the places it covers |
| `geo.timezone` | `geoapify.api.geo.timezone` | `destructive` | Read the time zone at a point, including whether daylight saving applies at a given moment |
| `geocode.autocomplete` | `geoapify.api.geocode.autocomplete` | `destructive` | Suggest addresses from a partial one as a user types, which is what a search box needs |
| `geocode.forward` | `geoapify.api.geocode.forward` | `destructive` | Turn an address or place name into coordinates, a formatted address and its components, with a confidence for the match |
| `geocode.reverse` | `geoapify.api.geocode.reverse` | `destructive` | Turn a latitude and longitude into the address at that point, with its full set of components |
| `places.details` | `geoapify.api.places.details` | `destructive` | Read one place by its ID, with its address, categories, contact details and opening hours |
| `places.search` | `geoapify.api.places.search` | `destructive` | Find places by category within an area, such as restaurants inside a circle, with the details each place carries |
| `routing.isoline` | `geoapify.api.routing.isoline` | `destructive` | Calculate the area reachable from a point within a time or distance, one polygon per range. A slow calculation returns only an id to read it with later |
| `routing.matrix` | `geoapify.api.routing.matrix` | `destructive` | Calculate the time and distance between every source and target, one row per source. A pair with no route has null distance and time |
| `routing.route` | `geoapify.api.routing.route` | `destructive` | Calculate a route between waypoints, with distance, time and optional turn-by-turn steps and geometry |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/geoapify

## License

Apache-2.0
