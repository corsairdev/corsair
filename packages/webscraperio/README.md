# @corsair-dev/webscraperio

Web Scraper Cloud plugin for Corsair - list and read sitemaps with their selectors and start URLs, create a sitemap from an exported definition, and read the account's page credits.

## Install

```bash
pnpm add @corsair-dev/webscraperio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `webscraperio.api.account.get` | `read` | Read the account user and the page credits left; the cheapest way to check a token |
| `sitemaps.create` | `webscraperio.api.sitemaps.create` | `write` | Create a sitemap from the definition the browser extension exports, selectors included |
| `sitemaps.get` | `webscraperio.api.sitemaps.get` | `read` | Read one sitemap: its id, name and definition (start URLs and selectors) as a JSON string |
| `sitemaps.list` | `webscraperio.api.sitemaps.list` | `read` | List the sitemaps on the account (id and name), a page at a time, optionally filtered by tag |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/webscraperio

## License

Apache-2.0
