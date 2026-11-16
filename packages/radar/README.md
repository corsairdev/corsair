# @corsair-dev/radar

Radar plugin for Corsair: geocodes addresses and coordinates, searches places and geofences, reads tracked users, geofences and trips, upserts a geofence, submits location updates and logs conversions through the Radar API.

## Install

```bash
pnpm add @corsair-dev/radar
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.conversion` | `radar.api.events.conversion` | `write` | Log a named conversion with optional revenue and metadata against a user, device or install id |
| `geocode.forward` | `radar.api.geocode.forward` | `read` | Turn an address into coordinates, returning every match with its layer and confidence |
| `geocode.reverse` | `radar.api.geocode.reverse` | `read` | Turn `latitude,longitude` into an address, with the admin layers that contain it |
| `geofences.delete` | `radar.api.geofences.delete` | `destructive` | Delete a geofence permanently; the API keeps no copy |
| `geofences.get` | `radar.api.geofences.get` | `read` | Fetch one geofence with its geometry, radius and metadata |
| `geofences.list` | `radar.api.geofences.list` | `read` | List geofences with tag and external-id filters, paging by update time |
| `geofences.upsert` | `radar.api.geofences.upsert` | `write` | Create or replace a geofence by tag and external id, or by Radar id: a circle, a polygon or an isochrone |
| `search.geofences` | `radar.api.search.geofences` | `read` | Search geofences near a point, filtered by tag or external id |
| `search.places` | `radar.api.search.places` | `read` | Search the places database near a point, filtered by name, chain, category or country |
| `track.update` | `radar.api.track.update` | `write` | Submit a location update, which creates the user when none matches and may generate geofence events |
| `trips.create` | `radar.api.trips.create` | `write` | Create a trip for a user with its destination geofence, travel mode and approaching threshold |
| `trips.get` | `radar.api.trips.get` | `read` | Fetch one trip with its status, destination and live ETA |
| `trips.list` | `radar.api.trips.list` | `read` | List trips by status, user, destination or time window, optionally with their location trace |
| `trips.update` | `radar.api.trips.update` | `write` | Update a trip: its status, mode, destination or approaching threshold |
| `users.get` | `radar.api.users.get` | `read` | Fetch one user by Radar id, user id or device id, including their location and metadata |
| `users.list` | `radar.api.users.list` | `read` | List tracked users with their last location and geofences, paging by update time |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/radar

## License

Apache-2.0
