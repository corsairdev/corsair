# @corsair-dev/tripadvisor

Tripadvisor Terra plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tripadvisor
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `catalog.locationsNearby` | `tripadvisor.api.catalog.locationsNearby` | `read` | Search nearby Tripadvisor catalog locations by coordinates or location ID |
| `location.details` | `tripadvisor.api.location.details` | `read` | Get full details, ratings, rankings and awards for a Tripadvisor location |
| `location.photos` | `tripadvisor.api.location.photos` | `read` | Get photos for a Tripadvisor location |
| `location.reviews` | `tripadvisor.api.location.reviews` | `read` | Get traveler reviews for a Tripadvisor location |
| `locations.nearby` | `tripadvisor.api.locations.nearby` | `read` | Find full location representations near an area; filter category HOTEL to list nearby hotels |
| `geo.details` | `tripadvisor.api.geo.details` | `read` | Get factual and hierarchy details for a Tripadvisor geo |

## Auth

Auth: API key sent in the `X-API-Key` header.

## Search modes

Use `location_id` or `lat` and `lon` as the search reference. Provide either a positive `radius` or all four bounding-box coordinates. Results support category, rating, locale, pagination, and sorting filters.

## Notes

- Awards are embedded in `location.details` (`awards[]`); Terra exposes no standalone awards endpoint.
- Geo hierarchy ancestors come from `geo.details` (`hierarchy.ancestors`); Terra exposes no children-listing endpoint.
- Nearby hotels: call `locations.nearby` with `category: 'HOTEL'` and a small `size` (e.g. 10).
- Terra exposes no bookable-activities endpoint, so it is intentionally absent.

## Webhooks

No webhooks. The Tripadvisor Terra API reference does not define a webhook contract for these read endpoints.

## Reference

Full API reference: https://docs.terra.tripadvisor.com/reference/cataloglocationsnearbyget

## License

Apache-2.0
