# @corsair-dev/bestbuy

Best Buy Remix API plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bestbuy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.get` | `bestbuy.api.categories.get` | `read` | Retrieve detailed information about a category by ID |
| `categories.list` | `bestbuy.api.categories.list` | `read` | List or filter Best Buy product categories |
| `products.get` | `bestbuy.api.products.get` | `read` | Retrieve detailed information about a product by SKU |
| `products.list` | `bestbuy.api.products.list` | `read` | Retrieve products with optional SKU, UPC, name, salePrice, and categoryPath.id filters |
| `reviews.get` | `bestbuy.api.reviews.get` | `read` | Retrieve a single review by ID |
| `reviews.list` | `bestbuy.api.reviews.list` | `read` | Retrieve product reviews with optional SKU, reviewer, and score filters |
| `stores.get` | `bestbuy.api.stores.get` | `read` | Retrieve detailed information about a store by store ID |
| `stores.list` | `bestbuy.api.stores.list` | `read` | List Best Buy stores with optional city, region, postalCode, or area() geo search |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bestbuy

## License

Apache-2.0
