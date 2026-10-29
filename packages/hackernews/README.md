# @corsair-dev/hackernews

Hacker news plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hackernews
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `items.get` | `hackernews.api.items.get` | `read` | Get a HackerNews item by numeric ID |
| `items.getMaxId` | `hackernews.api.items.getMaxId` | `read` | Get the current maximum item ID |
| `items.getWithId` | `hackernews.api.items.getWithId` | `read` | Get a HackerNews item with nested comments |
| `search.getFrontpage` | `hackernews.api.search.getFrontpage` | `read` | Get current HackerNews frontpage posts |
| `search.getLatest` | `hackernews.api.search.getLatest` | `read` | Get latest HackerNews posts |
| `search.getTodays` | `hackernews.api.search.getTodays` | `read` | Get today's HackerNews posts |
| `search.posts` | `hackernews.api.search.posts` | `read` | Full-text search HackerNews posts |
| `stories.getAsk` | `hackernews.api.stories.getAsk` | `read` | Get Ask HN story IDs |
| `stories.getBest` | `hackernews.api.stories.getBest` | `read` | Get best HackerNews story IDs |
| `stories.getJobs` | `hackernews.api.stories.getJobs` | `read` | Get HackerNews job story IDs |
| `stories.getNew` | `hackernews.api.stories.getNew` | `read` | Get newest HackerNews story IDs |
| `stories.getShow` | `hackernews.api.stories.getShow` | `read` | Get Show HN story IDs |
| `stories.getTop` | `hackernews.api.stories.getTop` | `read` | Get top HackerNews story IDs |
| `updates.get` | `hackernews.api.updates.get` | `read` | Get recently changed HackerNews items and profiles |
| `users.get` | `hackernews.api.users.get` | `read` | Get a HackerNews user profile via Algolia |
| `users.getByUsername` | `hackernews.api.users.getByUsername` | `read` | Get a HackerNews user profile via Firebase |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hackernews

## License

Apache-2.0
