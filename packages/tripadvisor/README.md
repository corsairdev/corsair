# @corsair-dev/tripadvisor

Tripadvisor Terra plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tripadvisor
```

## Endpoint

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `catalog.locationsNearby` | `tripadvisor.api.catalog.locationsNearby` | `read` | Search nearby Tripadvisor catalog locations by coordinates or location ID |

## Auth

Auth: API key sent in the `X-API-Key` header.

## Search modes

Use `location_id` or `lat` and `lon` as the search reference. Provide either a positive `radius` or all four bounding-box coordinates. Results support category, rating, locale, pagination, and sorting filters.

## Webhooks

No webhooks. The issue requests the Tripadvisor Terra catalog read endpoint, and the Terra API reference does not define a webhook contract for it.

## Reference

Full API reference: https://docs.terra.tripadvisor.com/reference/cataloglocationsnearbyget

## License

Apache-2.0
