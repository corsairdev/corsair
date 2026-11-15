# @corsair-dev/prerender

Prerender service API for recaching pages, searching the cache, submitting sitemaps and tuning the render queue.

## Install

```bash
pnpm add @corsair-dev/prerender
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cache.clear` | `prerender.api.cache.clear` | `destructive` | Delete cached URLs matching a pattern. The clear runs as a job, and only one runs at a time |
| `cache.clearStatus` | `prerender.api.cache.clearStatus` | `read` | Read whether a cache clear job is still running: inProgress is true while one runs |
| `cache.recache` | `prerender.api.cache.recache` | `destructive` | Render and cache one URL, or up to 1000 in one call, so crawlers see current content. Each URL spends one render from the plan, billed past the included amount |
| `cache.search` | `prerender.api.cache.search` | `read` | Search the cache by substring or exact URL, or list all of it, 200 results per page, optionally filtered by device |
| `cache.sitemap` | `prerender.api.cache.sitemap` | `destructive` | Render and cache every URL in a sitemap that is not cached yet, spending one render per new URL. URLs already cached are left as they are |
| `queue.changeSpeed` | `prerender.api.queue.changeSpeed` | `write` | Set how many URLs the render queue processes per hour, or restore the automatic delay. A faster rate can overload the origin |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/prerender

## License

Apache-2.0
