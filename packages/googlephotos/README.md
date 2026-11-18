# @corsair-dev/googlephotos

Google Photos plugin for Corsair: albums, media items and uploads through the Google Photos Library API.

## Install

```bash
pnpm add @corsair-dev/googlephotos
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `albums.addEnrichment` | `googlephotos.api.albums.addEnrichment` | `write` | Add a text note or a location to an app-created album, at a chosen position |
| `albums.batchAddMediaItems` | `googlephotos.api.albums.batchAddMediaItems` | `write` | Add up to 50 media items to an app-created album |
| `albums.batchRemoveMediaItems` | `googlephotos.api.albums.batchRemoveMediaItems` | `destructive` | Remove up to 50 media items from an album. The items stay in the library, so this is reversible by adding them back |
| `albums.create` | `googlephotos.api.albums.create` | `write` | Create an album with a title |
| `albums.get` | `googlephotos.api.albums.get` | `read` | Read one album |
| `albums.list` | `googlephotos.api.albums.list` | `read` | List the account's albums. Without a scope Google removed in 2025, only app-created albums are readable |
| `albums.update` | `googlephotos.api.albums.update` | `write` | Rename an album; the title is the only field the API lets an update change |
| `mediaItems.batchGet` | `googlephotos.api.mediaItems.batchGet` | `read` | Read up to one page of media items by id, with a per-id status |
| `mediaItems.create` | `googlephotos.api.mediaItems.create` | `write` | Upload bytes and create up to 50 media items, optionally in an album; uploads count toward the user's Google storage past 25MB |
| `mediaItems.get` | `googlephotos.api.mediaItems.get` | `read` | Read one media item |
| `mediaItems.list` | `googlephotos.api.mediaItems.list` | `read` | List the library in the order Google returns it, 25 by default |
| `mediaItems.search` | `googlephotos.api.mediaItems.search` | `read` | Search the library with date, content, feature and media-type filters, or list one album |
| `mediaItems.update` | `googlephotos.api.mediaItems.update` | `write` | Change a media item's description, the only editable field |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlephotos

## License

Apache-2.0
