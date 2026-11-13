# @corsair-dev/shopify

Shopify plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/shopify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collections.addProducts` | `shopify.api.collections.addProducts` | `write` | Add products to a collection; the whole call fails if any is already present |
| `collections.create` | `shopify.api.collections.create` | `write` | Create a manual or smart collection with a title and handle |
| `collections.get` | `shopify.api.collections.get` | `read` | Read one collection by GID |
| `collections.list` | `shopify.api.collections.list` | `read` | List collections with their product counts, cursor-paged |
| `customers.create` | `shopify.api.customers.create` | `write` | Create a customer with an email, name and tags |
| `customers.get` | `shopify.api.customers.get` | `read` | Read one customer by GID, including addresses and spend |
| `customers.list` | `shopify.api.customers.list` | `read` | List customers with order counts and spend, cursor-paged and filtered |
| `customers.update` | `shopify.api.customers.update` | `write` | Update a customer, overwriting tags when tags are passed |
| `inventory.adjust` | `shopify.api.inventory.adjust` | `write` | Adjust available stock by a signed delta at one location, with a reason |
| `inventory.list` | `shopify.api.inventory.list` | `read` | Read the available stock of one inventory item at every active location |
| `orders.cancel` | `shopify.api.orders.cancel` | `destructive` | Cancel an order, optionally restocking and notifying the customer; does not refund |
| `orders.close` | `shopify.api.orders.close` | `write` | Close a completed or cancelled order so it no longer counts as open |
| `orders.get` | `shopify.api.orders.get` | `read` | Read one order by GID with its customer and line items |
| `orders.list` | `shopify.api.orders.list` | `read` | List orders with totals and line items, filtered and sorted, cursor-paged |
| `orders.markAsPaid` | `shopify.api.orders.markAsPaid` | `write` | Mark an order as paid without taking a payment; recorded against a manual gateway |
| `products.create` | `shopify.api.products.create` | `write` | Create a product with its title and catalog fields; variants are added separately |
| `products.delete` | `shopify.api.products.delete` | `destructive` | Permanently delete a product with its variants, media and inventory items |
| `products.get` | `shopify.api.products.get` | `read` | Read one product by GID, including its first variants and inventory totals |
| `products.list` | `shopify.api.products.list` | `read` | List products with their first variants, cursor-paged and filtered with Shopify search syntax |
| `products.update` | `shopify.api.products.update` | `write` | Update a product, changing only the fields that are passed |
| `shop.get` | `shopify.api.shop.get` | `read` | Read the shop name, domain, currency and plan for the configured token |
| `shop.listLocations` | `shopify.api.shop.listLocations` | `read` | List the inventory locations of the shop, for use with inventory.adjust |
| `variants.list` | `shopify.api.variants.list` | `read` | List the variants of one product, cursor-paged, with price and stock |
| `variants.update` | `shopify.api.variants.update` | `write` | Update price, SKU, barcode or inventory policy on one variant |
| `webhookSubscriptions.create` | `shopify.api.webhookSubscriptions.create` | `write` | Register a JSON webhook subscription for one topic and URI |
| `webhookSubscriptions.delete` | `shopify.api.webhookSubscriptions.delete` | `destructive` | Delete a webhook subscription, stopping further deliveries for that topic |
| `webhookSubscriptions.list` | `shopify.api.webhookSubscriptions.list` | `read` | List shop-scoped webhook subscriptions, optionally filtered by topic |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/shopify

## License

Apache-2.0
