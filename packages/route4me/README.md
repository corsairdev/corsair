# @corsair-dev/route4me

Route4Me plugin for Corsair: reads routes, orders, vehicles, address book contacts, team members and optimization problems, adds orders, vehicles and contacts, and submits addresses for route optimization across the v4 and v5 APIs.

## Install

```bash
pnpm add @corsair-dev/route4me
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `addresses.create` | `route4me.api.addresses.create` | `write` | Add a contact to the address book; the coordinates are required alongside the street address |
| `addresses.list` | `route4me.api.addresses.list` | `read` | List address book contacts with a display filter, a search phrase and limit/offset paging |
| `optimizations.create` | `route4me.api.optimizations.create` | `write` | Submit addresses for optimization; the solver runs in the background and returns a problem id and state |
| `optimizations.get` | `route4me.api.optimizations.get` | `read` | Fetch one optimization problem with its state, parameters and its solved routes |
| `optimizations.list` | `route4me.api.optimizations.list` | `read` | List optimization problems by state and date range, or read exactly one when an id is given |
| `orders.create` | `route4me.api.orders.create` | `write` | Create a delivery order from an address, with its contact, time window, load and facility details |
| `orders.list` | `route4me.api.orders.list` | `read` | List delivery orders with search, scheduled-day, status and group filters plus page paging |
| `routes.get` | `route4me.api.routes.get` | `read` | Fetch one route by its 32-character id, including its sequenced stops and directions |
| `routes.list` | `route4me.api.routes.list` | `read` | List routes with search, facility and id filters plus page paging, from the v5 API |
| `team.list` | `route4me.api.team.list` | `read` | List the team members on the account, optionally limited to drivers or to one optimization |
| `team.me` | `route4me.api.team.me` | `read` | Read the account the key belongs to: owner, timezone and optimization profile |
| `vehicles.create` | `route4me.api.vehicles.create` | `write` | Add a vehicle to the fleet with its plate, dimensions, capacity profile and skills |
| `vehicles.list` | `route4me.api.vehicles.list` | `read` | List the fleet with filters for operational state, profile and telematics connection |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/route4me

## License

Apache-2.0
