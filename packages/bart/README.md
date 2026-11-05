# @corsair-dev/bart

Bart plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bart
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `advisories.elevators` | `bart.api.advisories.elevators` | `read` | Get current elevator status and elevator outage advisories |
| `advisories.list` | `bart.api.advisories.list` | `read` | Get current BART system advisories and service delays |
| `advisories.trainCount` | `bart.api.advisories.trainCount` | `read` | Get the number of trains currently active in the BART system |
| `etd.station` | `bart.api.etd.station` | `read` | Get real-time estimated departure times for a BART station |
| `fares.calculate` | `bart.api.fares.calculate` | `read` | Calculate transit fares and ticket prices between two BART stations |
| `routes.info` | `bart.api.routes.info` | `read` | Get detailed information about a specific BART transit route |
| `routes.list` | `bart.api.routes.list` | `read` | Get the list of all current BART transit routes |
| `schedules.arrivals` | `bart.api.schedules.arrivals` | `read` | Get scheduled arrivals and trip itinerary between two BART stations |
| `schedules.departures` | `bart.api.schedules.departures` | `read` | Get scheduled departures and trip itinerary between two BART stations |
| `schedules.routes` | `bart.api.schedules.routes` | `read` | Get the full timetable and stop schedule for a specific BART route |
| `stations.access` | `bart.api.stations.access` | `read` | Get station access details including parking, lockers, and transit connections |
| `stations.info` | `bart.api.stations.info` | `read` | Get detailed station information, connections, and platforms |
| `stations.list` | `bart.api.stations.list` | `read` | Get list of all BART stations with geographic coordinates and addresses |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bart

## License

Apache-2.0
