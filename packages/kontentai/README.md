# @corsair-dev/kontentai

Kontent.ai plugin for Corsair: read published content items by type, language or filter, plus their content types, taxonomy terms and languages, from the Delivery API.

## Install

```bash
pnpm add @corsair-dev/kontentai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `items.get` | `kontentai.api.items.get` | `read` | One content item by codename, with its elements and, on request, its linked items |
| `items.list` | `kontentai.api.items.list` | `read` | Published content items by type, language, collection or filter, with `depth` deciding how far linked items resolve; `next_skip` gives the next page |
| `languages.list` | `kontentai.api.languages.list` | `read` | The environment’s languages, each with the codename to read content in |
| `taxonomies.list` | `kontentai.api.taxonomies.list` | `read` | The taxonomy groups with their nested terms, which an item’s taxonomy element points at |
| `types.get` | `kontentai.api.types.get` | `read` | One content type by codename, with its element definitions |
| `types.list` | `kontentai.api.types.list` | `read` | The content types, each with the element definitions an item of that type carries |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kontentai

## License

Apache-2.0
