# @corsair-dev/tripadvisorcontentapi

Tripadvisor Content API plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tripadvisorcontentapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `locations.get` | `tripadvisorcontentapi.api.locations.get` | `read` | Read one location. The address and description are not stored. |
| `locations.nearby` | `tripadvisorcontentapi.api.locations.nearby` | `read` | Search locations near a coordinate. The coordinate is not stored. |
| `locations.search` | `tripadvisorcontentapi.api.locations.search` | `read` | Search locations by name. The query is not stored. |
| `photos.list` | `tripadvisorcontentapi.api.photos.list` | `read` | List photos for a location. Image URLs and captions are not stored. |
| `reviews.list` | `tripadvisorcontentapi.api.reviews.list` | `read` | List reviews for a location. Review text and usernames are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tripadvisorcontentapi

## License

Apache-2.0
