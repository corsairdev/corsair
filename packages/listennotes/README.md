# @corsair-dev/listennotes

Listen Notes plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/listennotes
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `curated.get` | `listennotes.api.curated.get` | `read` | Fetch a curated list of podcasts by ID |
| `curated.list` | `listennotes.api.curated.list` | `read` | Fetch curated lists of podcasts |
| `episodes.get` | `listennotes.api.episodes.get` | `read` | Fetch detailed metadata for an episode by ID |
| `episodes.getRecommendations` | `listennotes.api.episodes.getRecommendations` | `read` | Fetch recommended episodes based on a given episode ID |
| `genres.list` | `listennotes.api.genres.list` | `read` | Fetch a list of podcast genres supported by Listen Notes |
| `playlists.get` | `listennotes.api.playlists.get` | `read` | Fetch a playlist and its items by ID |
| `playlists.list` | `listennotes.api.playlists.list` | `read` | Fetch a list of user playlists |
| `podcasts.get` | `listennotes.api.podcasts.get` | `read` | Fetch detailed metadata and episodes for a podcast by ID |
| `podcasts.getBest` | `listennotes.api.podcasts.getBest` | `read` | Fetch best podcasts by genre and region |
| `podcasts.getEpisodes` | `listennotes.api.podcasts.getEpisodes` | `read` | Fetch paginated episodes for a podcast by ID |
| `podcasts.getRecommendations` | `listennotes.api.podcasts.getRecommendations` | `read` | Fetch recommended podcasts based on a given podcast ID |
| `search.search` | `listennotes.api.search.search` | `read` | Full-text search for podcast episodes, channels, or curated lists |
| `search.typeahead` | `listennotes.api.search.typeahead` | `read` | Typeahead search for podcast titles, genres, and terms |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/listennotes

## License

Apache-2.0
