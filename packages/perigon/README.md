# @corsair-dev/perigon

Perigon is a news intelligence API. This plugin searches the article index (one result per published URL), lists story clusters, journalists and resolved people and company entities, and reads the account's usage and limits.

## Install

```bash
pnpm add @corsair-dev/perigon
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `articles.list` | `perigon.api.articles.list` | `read` | Search news articles: one result per published URL, filterable by query, topic, category, source, country, language and dates |
| `companies.list` | `perigon.api.companies.list` | `read` | Search resolved company entities |
| `journalists.list` | `perigon.api.journalists.list` | `read` | Search the journalist directory by name or publisher |
| `limits.get` | `perigon.api.limits.get` | `read` | Read account usage and limits; free to poll and not rate-limited |
| `people.list` | `perigon.api.people.list` | `read` | Search resolved person entities |
| `stories.list` | `perigon.api.stories.list` | `read` | List story clusters: one narrative across many articles |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/perigon

## License

Apache-2.0
