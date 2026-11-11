# @corsair-dev/webscraperio

Web Scraper Cloud plugin for Corsair - list and read sitemaps with their selectors and start URLs, create a sitemap from an exported definition, and read the account plan and page allowance.

## Install

```bash
pnpm add @corsair-dev/webscraperio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `webscraperio.api.account.get` | `read` | Read the account plan and how much of the page and job allowance is used; the cheapest way to check a token |
| `sitemaps.create` | `webscraperio.api.sitemaps.create` | `write` | Create a sitemap from the definition the browser extension exports, selectors included |
| `sitemaps.get` | `webscraperio.api.sitemaps.get` | `read` | Read one sitemap with its selectors, start URLs and status |
| `sitemaps.list` | `webscraperio.api.sitemaps.list` | `read` | List the sitemaps on the account |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/webscraperio

## License

Apache-2.0
