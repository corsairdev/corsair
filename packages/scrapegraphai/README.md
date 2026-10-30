# @corsair-dev/scrapegraphai

ScrapeGraphAI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/scrapegraphai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.credits` | `scrapegraphai.api.account.credits` | `read` | Get remaining and used credit balance |
| `account.usageTimeline` | `scrapegraphai.api.account.usageTimeline` | `read` | Get a timeline of past request usage |
| `account.validateApiKey` | `scrapegraphai.api.account.validateApiKey` | `read` | Validate that the configured API key is active |
| `agenticScraper.getLiveSessionUrl` | `scrapegraphai.api.agenticScraper.getLiveSessionUrl` | `write` | Open a live, remotely-controllable browser session for a URL |
| `agenticScraper.history` | `scrapegraphai.api.agenticScraper.history` | `read` | List past agentic (browser-driven) scraper requests |
| `endpoint.getSuggestions` | `scrapegraphai.api.endpoint.getSuggestions` | `write` | Analyze a webpage and suggest reusable scraping endpoint configs (spends credits) |
| `endpoint.save` | `scrapegraphai.api.endpoint.save` | `write` | Save custom scraping endpoint configurations |
| `feedback.submit` | `scrapegraphai.api.feedback.submit` | `write` | Submit a rating/feedback for a completed request |
| `feedback.submitProduct` | `scrapegraphai.api.feedback.submitProduct` | `write` | Submit general product feedback |
| `markdownify.history` | `scrapegraphai.api.markdownify.history` | `read` | List past Markdownify requests |
| `markdownify.start` | `scrapegraphai.api.markdownify.start` | `write` | Start converting a webpage to clean Markdown (async, spends credits) |
| `markdownify.status` | `scrapegraphai.api.markdownify.status` | `read` | Get status and results for a Markdownify job |
| `scheduledJobs.list` | `scrapegraphai.api.scheduledJobs.list` | `read` | List scheduled recurring scraping jobs |
| `schema.generate` | `scrapegraphai.api.schema.generate` | `write` | Generate or refine a JSON schema from a natural-language prompt (spends credits) |
| `scrape.history` | `scrapegraphai.api.scrape.history` | `read` | List past single-page Scrape requests |
| `searchScraper.history` | `scrapegraphai.api.searchScraper.history` | `read` | List past SearchScraper requests |
| `searchScraper.start` | `scrapegraphai.api.searchScraper.start` | `write` | Start an AI-powered web search job (async, spends credits) |
| `searchScraper.status` | `scrapegraphai.api.searchScraper.status` | `read` | Get status and results for a SearchScraper job |
| `sitemap.history` | `scrapegraphai.api.sitemap.history` | `read` | List past sitemap generation requests |
| `smartCrawler.history` | `scrapegraphai.api.smartCrawler.history` | `read` | List past SmartCrawler requests |
| `smartCrawler.start` | `scrapegraphai.api.smartCrawler.start` | `write` | Start a multi-page crawl of a site with optional AI extraction (async, spends credits) |
| `smartCrawler.status` | `scrapegraphai.api.smartCrawler.status` | `read` | Get status and results for a SmartCrawler job |
| `smartCrawler.webhookLogs` | `scrapegraphai.api.smartCrawler.webhookLogs` | `read` | Get webhook delivery logs for a SmartCrawler job |
| `smartScraper.history` | `scrapegraphai.api.smartScraper.history` | `read` | List past SmartScraper requests |
| `smartScraper.start` | `scrapegraphai.api.smartScraper.start` | `write` | Start an AI-powered structured extraction job for a webpage (async, spends credits) |
| `smartScraper.status` | `scrapegraphai.api.smartScraper.status` | `read` | Get status and results for a SmartScraper job |
| `utilities.toonify` | `scrapegraphai.api.utilities.toonify` | `read` | Convert JSON to TOON (Token-Oriented Object Notation) to reduce LLM token usage |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/scrapegraphai

## License

Apache-2.0
