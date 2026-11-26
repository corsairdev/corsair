# @corsair-dev/bravesearch

Brave Search plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bravesearch
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `admin.listAdminKeys` | `bravesearch.api.admin.listAdminKeys` | `read` | List the organization's admin keys (no secrets) |
| `admin.listApiKeys` | `bravesearch.api.admin.listApiKeys` | `read` | List the organization's search API keys (no secrets) |
| `admin.me` | `bravesearch.api.admin.me` | `read` | Check the admin key and its organization |
| `admin.usage` | `bravesearch.api.admin.usage` | `read` | Get API usage in time buckets by key, endpoint or plan |
| `answers.create` | `bravesearch.api.answers.create` | `read` | Answer a question from one web search, with optional inline citations (Answers plan) |
| `answers.research` | `bravesearch.api.answers.research` | `destructive` | Answer a question with multi-search deep research; can run minutes and bills per search and token (Answers plan) |
| `images.search` | `bravesearch.api.images.search` | `read` | Search images |
| `llm.context` | `bravesearch.api.llm.context` | `read` | Search the web and get extracted page text, token-budgeted, for grounding an LLM |
| `local.descriptions` | `bravesearch.api.local.descriptions` | `read` | Get AI-written descriptions for location ids from a search |
| `local.placeSearch` | `bravesearch.api.local.placeSearch` | `read` | Search businesses, landmarks and other places in an area by text or coordinates |
| `local.pois` | `bravesearch.api.local.pois` | `read` | Get details (address, hours, rating, contact) for location ids from a search |
| `news.search` | `bravesearch.api.news.search` | `read` | Search news articles |
| `spellcheck.search` | `bravesearch.api.spellcheck.search` | `read` | Get the spell-corrected form of a query |
| `suggest.search` | `bravesearch.api.suggest.search` | `read` | Get query autocomplete suggestions |
| `videos.search` | `bravesearch.api.videos.search` | `read` | Search videos |
| `web.rich` | `bravesearch.api.web.rich` | `read` | Get live rich data (weather, stocks, sports, currency ...) for a web.search callback key |
| `web.search` | `bravesearch.api.web.search` | `read` | Search the web: ranked pages with snippets, plus news, videos, discussions, FAQ, infobox and local sections |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bravesearch

## License

Apache-2.0
