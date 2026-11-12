# @corsair-dev/scrapedo

Scrape.do plugin for Corsair: fetch pages as HTML, Markdown, JSON network reports or screenshots through a proxy pool, and run bulk URL jobs asynchronously.

## Install

```bash
pnpm add @corsair-dev/scrapedo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.asyncInfo` | `scrapedo.api.account.asyncInfo` | `read` | Read the async pool concurrency, active jobs and credits left; costs nothing |
| `account.info` | `scrapedo.api.account.info` | `read` | Read the subscription state, concurrency limit and requests left this month; costs nothing but is limited to 10 calls a minute |
| `jobs.cancel` | `scrapedo.api.jobs.cancel` | `write` | Cancel a queued or running job; a finished job cannot be cancelled |
| `jobs.get` | `scrapedo.api.jobs.get` | `read` | Read an async job with its status and one entry per target |
| `jobs.list` | `scrapedo.api.jobs.list` | `read` | List async jobs with paging |
| `jobs.result` | `scrapedo.api.jobs.result` | `read` | Read one task result with the page content, its status and when it expires |
| `jobs.start` | `scrapedo.api.jobs.start` | `write` | Start an async job for up to 100 URLs and return its job and task ids; results are held by Scrape.do until they expire |
| `scrape.html` | `scrapedo.api.scrape.html` | `read` | Fetch a page through the proxy with its status code; costs credits that vary by proxy and rendering |
| `scrape.json` | `scrapedo.api.scrape.json` | `read` | Fetch a page as a JSON report with its status, content and network requests |
| `scrape.markdown` | `scrapedo.api.scrape.markdown` | `read` | Fetch a page and return it converted to Markdown |
| `scrape.screenshot` | `scrapedo.api.scrape.screenshot` | `read` | Render a page in the headless browser and return base64 PNG screenshots |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/scrapedo

## License

Apache-2.0
