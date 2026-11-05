# @corsair-dev/contextdev

ContextDev plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/contextdev
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.usage` | `contextdev.api.account.usage` | `read` | Get the credit balance, current-period usage, and next refill |
| `brand.fonts` | `contextdev.api.brand.fonts` | `read` | List the fonts a website uses and how much of the page each covers |
| `brand.naics` | `contextdev.api.brand.naics` | `read` | Classify a brand or business description into NAICS codes |
| `brand.prefetch` | `contextdev.api.brand.prefetch` | `write` | Queue brand or styleguide data so a later lookup returns sooner |
| `brand.retrieve` | `contextdev.api.brand.retrieve` | `read` | Get a brand profile (logos, colors, socials, address, industry) by domain, name, email, ticker, URL, or card transaction |
| `brand.search` | `contextdev.api.brand.search` | `read` | Find up to 10 brands by name or domain |
| `brand.sic` | `contextdev.api.brand.sic` | `read` | Classify a brand or business description into SIC codes |
| `brand.styleguide` | `contextdev.api.brand.styleguide` | `read` | Extract a website's colors, typography, spacing, shadows, and button styles |
| `news.search` | `contextdev.api.news.search` | `read` | Search company news by name, domain, ticker, or ISIN, paginated by cursor |
| `people.enrich` | `contextdev.api.people.enrich` | `read` | Find a person from an email, profile URLs, or name and return their profile with a match score |
| `web.answers` | `contextdev.api.web.answers` | `read` | Research a task on the web and return a sourced answer in a requested JSON shape |
| `web.crawl` | `contextdev.api.web.crawl` | `read` | Crawl a website (up to 500 pages) and return each page as Markdown |
| `web.extract` | `contextdev.api.web.extract` | `read` | Extract structured data from a website using a JSON Schema |
| `web.scrape` | `contextdev.api.web.scrape` | `read` | Scrape a URL as HTML, Markdown, screenshot, images, highlights, or schema-driven JSON |
| `web.search` | `contextdev.api.web.search` | `read` | Search the web, optionally with page Markdown or highlights per result |
| `web.urls` | `contextdev.api.web.urls` | `read` | Map a domain's URLs with titles and descriptions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/contextdev

## License

Apache-2.0
