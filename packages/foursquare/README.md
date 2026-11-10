# @corsair-dev/foursquare

Foursquare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/foursquare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `places.autocomplete` | `foursquare.api.places.autocomplete` | `read` | Suggest places, searches or geos for a partial query |
| `places.get` | `foursquare.api.places.get` | `read` | Get one place by its fsq_place_id, with all its details |
| `places.match` | `foursquare.api.places.match` | `read` | Resolve a name and address to a Foursquare place, with a match score |
| `places.photos` | `foursquare.api.places.photos` | `read` | List the photos attached to a place |
| `places.search` | `foursquare.api.places.search` | `read` | Search the Foursquare places database by text, category or location |
| `places.tips` | `foursquare.api.places.tips` | `read` | List the user tips left on a place |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/foursquare

## License

Apache-2.0
