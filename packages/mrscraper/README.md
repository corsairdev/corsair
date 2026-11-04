# @corsair-dev/mrscraper

MrScraper plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mrscraper
```

## Endpoints

| Operation | Risk | Description |
|-----------|------|-------------|
| `account.get` | `read` | Get the subscription account and token usage |
| `scrapers.aiInit` | `write` | Start an AI scraper chat and return starter scrape code |
| `scrapers.aiRerun` | `write` | Re-run an AI scraper against a URL |
| `scrapers.aiRerunBulk` | `write` | Re-run an AI scraper against multiple URLs |
| `scrapers.manualRerun` | `write` | Re-run a manual scraper against a URL |
| `scrapers.manualRerunBulk` | `write` | Re-run a manual scraper against multiple URLs |
| `scrapers.manualHeal` | `write` | Heal a broken manual scraper workflow |
| `scrapers.cancelBulkByScraper` | `write` | Cancel every queued bulk URL for a scraper |
| `scrapers.cancelBulkByResult` | `write` | Cancel a queued bulk run by its result id |
| `results.list` | `read` | List scrape results with pagination and filters |
| `results.get` | `read` | Get a scrape result by id |
| `analytics.statuses` | `read` | Get per-domain request status analytics |
| `analytics.proxyBandwidth` | `read` | Get proxy bandwidth usage for the account |
| `scrape.fetch` | `read` | Fetch a page and return its rendered HTML |
| `scrape.markdown` | `read` | Scrape a page and return its content as Markdown |
| `scrape.json` | `read` | Scrape a page and extract structured JSON with an agent |
| `scrape.screenshot` | `read` | Scrape a page and capture a screenshot |
| `scrape.listing` | `read` | Scrape paginated listing pages and extract their items |
| `scrape.sitemap` | `read` | Discover a site's URLs and map its sitemap |

The `account.*`, `scrapers.*`, `results.*` and `analytics.*` operations use the
Platform API (`https://api.app.mrscraper.com/api/v1`); `scrape.*` operations use
the Scraper API (`https://api.mrscraper.com`).

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use. The key
is sent as the `x-api-token` header (and as the `token` query param on Scraper
API calls).

## Webhooks

No webhooks. MrScraper can deliver results to a user-configured outbound webhook
URL, but it publishes no inbound signature or verification spec to handle.

## Reference

Full docs, types, and reference: https://docs.corsair.dev/plugins/mrscraper

## License

Apache-2.0
