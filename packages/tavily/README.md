# @corsair-dev/tavily

Tavily plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tavily
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `crawl.crawl` | `tavily.api.crawl.crawl` | `read` | Crawl a website starting from a root URL |
| `extract.extract` | `tavily.api.extract.extract` | `read` | Extract content from one or more URLs |
| `map.map` | `tavily.api.map.map` | `read` | Map all URLs on a website starting from a root URL |
| `search.search` | `tavily.api.search.search` | `read` | Search the web using Tavily |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tavily

## License

Apache-2.0
