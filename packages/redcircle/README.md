# @corsair-dev/redcircle

RedCircle API plugin for Corsair: reads Target products, search results, customer reviews and category listings, and reads the account's credit usage, through Traject Data's RedCircle API.

## Install

```bash
pnpm add @corsair-dev/redcircle
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `redcircle.api.account.get` | `read` | Read the account plan, credits used and remaining, and its per-resource limits |
| `categories.list` | `redcircle.api.categories.list` | `read` | List Target categories, their children by parent id, or the matches for a search term |
| `products.get` | `redcircle.api.products.get` | `read` | Fetch one Target product by TCIN, DPCI, GTIN or URL, with its price, images and specifications |
| `reviews.list` | `redcircle.api.reviews.list` | `read` | List a Target product’s customer reviews with their ratings and sort order |
| `search.products` | `redcircle.api.search.products` | `read` | Search Target products, filtered by category and delivery type and sorted, with page paging |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/redcircle

## License

Apache-2.0
