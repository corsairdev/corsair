# @corsair-dev/tomtom

TomTom plugin for Corsair: search places and addresses, geocode both ways, calculate routes, and read live traffic incidents and flow.

## Install

```bash
pnpm add @corsair-dev/tomtom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `routing.calculate` | `tomtom.api.routing.calculate` | `read` | Calculate a route between waypoints with travel mode, traffic and avoidance options; makes no booking |
| `search.fuzzy` | `tomtom.api.search.fuzzy` | `read` | Search for places, addresses, streets and geography, with optional geo bias and country filters |
| `search.geocode` | `tomtom.api.search.geocode` | `read` | Turn an address into coordinates |
| `search.reverseGeocode` | `tomtom.api.search.reverseGeocode` | `read` | Turn coordinates into the nearest address |
| `traffic.flow` | `tomtom.api.traffic.flow` | `read` | Read the current speed and free-flow speed on the road at a point |
| `traffic.incidents` | `tomtom.api.traffic.incidents` | `read` | List live traffic incidents in a bounding box, with their delay and road numbers |
| `traffic.tile` | `tomtom.api.traffic.tile` | `read` | Fetch one traffic flow or incident map tile |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tomtom

## License

Apache-2.0
