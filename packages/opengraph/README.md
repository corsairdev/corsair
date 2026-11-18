# @corsair-dev/opengraph

OpenGraph.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/opengraph
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brand.analyze` | `opengraph.api.brand.analyze` | `read` | Analyze the brand behind a website: identity, products, audiences, positioning, messaging, voice, visual style and links |
| `extract.run` | `opengraph.api.extract.run` | `read` | Extract chosen HTML elements as structured data plus concatenated clean text from a URL, ready for LLM pipelines |
| `markdown.get` | `opengraph.api.markdown.get` | `read` | Convert a URL to clean Markdown with optional heading-aware chunking, keyword passage search and structure extraction |
| `oembed.get` | `opengraph.api.oembed.get` | `read` | Resolve embeddable HTML for a URL: a native provider embed, an oEmbed discovery link, or a hosted fallback card |
| `query.run` | `opengraph.api.query.run` | `read` | Ask an AI question about a URL and get an answer shaped by a requested structure, from a nano or mini model |
| `scrape.fetch` | `opengraph.api.scrape.fetch` | `read` | Fetch the raw HTML of a URL, with optional JavaScript rendering and proxy tiers for protected sites |
| `screenshot.capture` | `opengraph.api.screenshot.capture` | `read` | Capture a screenshot of a URL and get a CDN link that expires after 24 hours, with viewport, format and selector controls |
| `site.get` | `opengraph.api.site.get` | `read` | Extract OpenGraph, Twitter Card and HTML meta tags from a URL as a merged hybrid graph for link previews |

## Auth

Auth: API key (an App ID from [dashboard.opengraph.io](https://dashboard.opengraph.io)), sent as the `app_id` query parameter. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/opengraph

## License

Apache-2.0
