# @corsair-dev/serply

Serply plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/serply
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `articles.search` | `serply.api.articles.search` | `write` | Search Google Scholar. An uncached success spends one Serply credit. |
| `images.search` | `serply.api.images.search` | `write` | Search Google images. An uncached success spends one Serply credit. |
| `places.search` | `serply.api.places.search` | `write` | Search Google maps. An uncached success spends one Serply credit. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/serply

## License

Apache-2.0
