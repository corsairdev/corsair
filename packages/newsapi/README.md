# @corsair-dev/newsapi

NewsAPI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/newsapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `articles.everything` | `newsapi.api.articles.everything` | `read` | Search articles across NewsAPI sources. |
| `articles.headlines` | `newsapi.api.articles.headlines` | `read` | Read current top headlines. |
| `articles.legacy` | `newsapi.api.articles.legacy` | `read` | Read articles from the legacy v1 source endpoint. |
| `sources.list` | `newsapi.api.sources.list` | `read` | List NewsAPI publishers. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/newsapi

## License

Apache-2.0
