# @corsair-dev/listennotes

Listen Notes podcast search, directory, playlist, and audience-insights API for Corsair.

## Install and authenticate

```bash
pnpm add @corsair-dev/listennotes
```

The plugin authenticates with `X-ListenAPI-Key`. Store a key using `pnpm corsair setup --plugin=listennotes api_key=<your-key>`, or pass `key` to `listennotes({ key })`.

```ts
import { listennotes } from '@corsair-dev/listennotes';

const plugin = listennotes();
```

## API operations

Every documented Listen Notes API v2 REST operation is exposed below. References link to the [official OpenAPI specification](https://listen-api.listennotes.com/api/v2/openapi.json) and [API documentation](https://www.listennotes.com/api/docs/).

| Corsair operation | Method and path | Risk |
|---|---|---|
| `search.search` | `GET /search` | read |
| `search.typeahead` | `GET /typeahead` | read |
| `search.searchEpisodeTitles` | `GET /search_episode_titles` | read |
| `search.trendingSearches` | `GET /trending_searches` | read |
| `search.relatedSearches` | `GET /related_searches` | read |
| `search.spellcheck` | `GET /spellcheck` | read |
| `podcasts.getBest` | `GET /best_podcasts` | read |
| `podcasts.get` | `GET /podcasts/{id}` | read |
| `podcasts.getEpisodes` | `GET /podcasts/{id}` (episode pagination convenience) | read |
| `podcasts.delete` | `DELETE /podcasts/{id}` | destructive |
| `podcasts.getRecommendations` | `GET /podcasts/{id}/recommendations` | read |
| `podcasts.getBatch` | `POST /podcasts` | read |
| `podcasts.submit` | `POST /podcasts/submit` | write |
| `podcasts.refreshRss` | `POST /podcasts/{id}/rss` | write |
| `podcasts.getAudience` | `GET /podcasts/{id}/audience` | read |
| `podcasts.getByDomain` | `GET /podcasts/domains/{domain_name}` | read |
| `episodes.get` | `GET /episodes/{id}` | read |
| `episodes.getRecommendations` | `GET /episodes/{id}/recommendations` | read |
| `episodes.getBatch` | `POST /episodes` | read |
| `episodes.justListen` | `GET /just_listen` | read |
| `genres.list` | `GET /genres` | read |
| `regions.list` | `GET /regions` | read |
| `languages.list` | `GET /languages` | read |
| `curated.list` | `GET /curated_podcasts` | read |
| `curated.get` | `GET /curated_podcasts/{id}` | read |
| `playlists.list` | `GET /playlists` | read |
| `playlists.get` | `GET /playlists/{id}` | read |
| `playlists.create` | `POST /playlists` | write |
| `playlists.update` | `PUT /playlists/{id}` | write |
| `playlists.delete` | `DELETE /playlists/{id}` | destructive |
| `playlists.addItem` | `POST /playlists/{id}/items` | write |
| `playlists.updateItem` | `PUT /playlists/{id}/items/{item_id}` | write |
| `playlists.deleteItem` | `DELETE /playlists/{id}/items/{item_id}` | destructive |

`podcasts.getEpisodes` is a convenience operation for the documented `GET /podcasts/{id}` route; Listen Notes returns episodes and their `next_episode_pub_date` cursor from that route. It does not call an `/episodes` sub-route.

## Pagination, plan limits, and retries

- Search results use `next_offset`; best podcasts use `next_page_number`; podcast episode details and batch latest-episode reads use `next_episode_pub_date`; curated lists and `playlists.list` use page numbers; `playlists.get` uses `last_timestamp_ms`; publisher-domain results use `next_page_number`.
- Batch podcast and episode reads accept at most 10 entries. Related search, spellcheck, transcript retrieval, batch reads, and RSS refresh are limited to PRO/ENTERPRISE plans where specified by Listen Notes. `interviews_only` and `sponsored_only` search filters also require PRO/ENTERPRISE.
- Listen Notes documents `429` for both exhausted FREE-plan quota and requests that exceed the rate limit. Because the documented response does not distinguish the cases, the plugin does not automatically retry `429`s; it preserves `Retry-After` on the propagated `ApiError`.
- Playlist mutations require ownership by the API admin account. Confirm destructive playlist changes before calling them. Podcast deletion requests are reviewed by Listen Notes; its documented `reason: "testing"` safeguard can be used to exercise that route without deleting a podcast.

The live API suite is opt-in: set `LISTENNOTES_API_KEY` and run `pnpm --dir packages/listennotes test:live`. Unit tests use mocked responses and make no live API claim.

## Webhooks

No webhooks are implemented; the integration request did not ask for them.

## Documentation and license

Full generated documentation: https://docs.corsair.dev/plugins/listennotes

Apache-2.0
