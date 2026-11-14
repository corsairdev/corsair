# @corsair-dev/prerender

Prerender service API for recaching pages, searching the cache, submitting sitemaps and tuning the render queue.

## Install

```bash
pnpm add @corsair-dev/prerender
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cacheClear` | `prerender.api.cacheClear` | `destructive` | Delete cached URLs matching a pattern. The clear runs as a job, and only one runs at a time |
| `cacheClearStatus` | `prerender.api.cacheClearStatus` | `read` | Read whether a cache clear job is still running. A 403 means one is in progress |
| `changeSpeed` | `prerender.api.changeSpeed` | `write` | Set how many URLs the render queue processes per hour, or restore the automatic delay. A faster rate can overload the origin |
| `recache` | `prerender.api.recache` | `write` | Cache one URL, or up to 1000 in one call, so crawlers see current content. Recaching an already cached page is idempotent |
| `search` | `prerender.api.search` | `read` | Search the cache by substring or exact URL, 200 results per page, optionally filtered by device |
| `sitemap` | `prerender.api.sitemap` | `write` | Add every URL in a sitemap that is not cached yet. URLs already cached are left as they are |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/prerender

## License

Apache-2.0
