# @corsair-dev/tavilymcp

TavilyMcp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tavilymcp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tavily.crawl` | `tavilymcp.api.tavily.crawl` | `read` | Crawl a site from a start URL with configurable depth and breadth |
| `tavily.extract` | `tavilymcp.api.tavily.extract` | `read` | Extract page content from one or more URLs as markdown or plain text |
| `tavily.map` | `tavilymcp.api.tavily.map` | `read` | Map a site's structure from a start URL and return its URLs |
| `tavily.research` | `tavilymcp.api.tavily.research` | `read` | Run comprehensive multi-source research on a topic and return a cited report |
| `tavily.search` | `tavilymcp.api.tavily.search` | `read` | Search the web with Tavily and return ranked snippets with source URLs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tavilymcp

## License

Apache-2.0
