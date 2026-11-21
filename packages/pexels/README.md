# @corsair-dev/pexels

Pexels is a free stock photo and video library. This plugin searches photos and videos, reads their renditions and metadata, lists curated and popular feeds, and browses media collections.

## Install

```bash
pnpm add @corsair-dev/pexels
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collections.list` | `pexels.api.collections.list` | `read` | List the collections of the API key |
| `collections.listFeatured` | `pexels.api.collections.listFeatured` | `read` | List the featured collections |
| `collections.listMedia` | `pexels.api.collections.listMedia` | `read` | List the photos and videos of a collection, filtered by type |
| `photos.curated` | `pexels.api.photos.curated` | `read` | List the curated photo feed |
| `photos.get` | `pexels.api.photos.get` | `read` | Read one photo by id with its rendition URLs |
| `photos.search` | `pexels.api.photos.search` | `read` | Search photos by query, orientation, size and color |
| `videos.get` | `pexels.api.videos.get` | `read` | Read one video by id with its downloadable renditions |
| `videos.popular` | `pexels.api.videos.popular` | `read` | List the popular videos, filtered by size and duration |
| `videos.search` | `pexels.api.videos.search` | `read` | Search videos by query and orientation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pexels

## License

Apache-2.0
