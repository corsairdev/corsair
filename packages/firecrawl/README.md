# @corsair-dev/firecrawl

Firecrawl plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/firecrawl
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agent.cancel` | `firecrawl.api.agent.cancel` | `write` | Cancel an in-flight agent job |
| `agent.get` | `firecrawl.api.agent.get` | `read` | Get status for an agent job |
| `agent.start` | `firecrawl.api.agent.start` | `write` | Start an agentic extraction job |
| `crawl.cancel` | `firecrawl.api.crawl.cancel` | `write` | Cancel an in-flight crawl job |
| `crawl.get` | `firecrawl.api.crawl.get` | `read` | Get status and results for a crawl job |
| `crawl.start` | `firecrawl.api.crawl.start` | `write` | Start a recursive crawl from a base URL |
| `map.run` | `firecrawl.api.map.run` | `read` | Map all URLs discovered from a site |
| `scrape.run` | `firecrawl.api.scrape.run` | `read` | Scrape a single URL (markdown, JSON, etc.) |
| `search.run` | `firecrawl.api.search.run` | `read` | Search the web and retrieve page content |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 14 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/firecrawl

## License

Apache-2.0
