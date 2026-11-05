# @corsair-dev/loyverse

Loyverse plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/loyverse
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.delete` | `loyverse.api.categories.delete` | `destructive` | Delete a category |
| `categories.get` | `loyverse.api.categories.get` | `read` | Get a single category |
| `categories.list` | `loyverse.api.categories.list` | `read` | List categories |
| `categories.upsert` | `loyverse.api.categories.upsert` | `write` | Create or update a category |
| `customers.delete` | `loyverse.api.customers.delete` | `destructive` | Delete a customer permanently |
| `customers.get` | `loyverse.api.customers.get` | `read` | Get a single customer |
| `customers.list` | `loyverse.api.customers.list` | `read` | List customers |
| `customers.upsert` | `loyverse.api.customers.upsert` | `write` | Create or update a customer |
| `discounts.delete` | `loyverse.api.discounts.delete` | `destructive` | Delete a discount |
| `discounts.get` | `loyverse.api.discounts.get` | `read` | Get a single discount |
| `discounts.list` | `loyverse.api.discounts.list` | `read` | List discounts |
| `discounts.listFiltered` | `loyverse.api.discounts.listFiltered` | `read` | List discounts filtered by id, timestamp range or deleted status |
| `discounts.upsert` | `loyverse.api.discounts.upsert` | `write` | Create or update a discount |
| `employees.get` | `loyverse.api.employees.get` | `read` | Get a single employee |
| `employees.list` | `loyverse.api.employees.list` | `read` | List employees |
| `inventory.list` | `loyverse.api.inventory.list` | `read` | List inventory levels |
| `inventory.update` | `loyverse.api.inventory.update` | `write` | Set inventory levels for item variants |
| `items.delete` | `loyverse.api.items.delete` | `destructive` | Delete an item |
| `items.deleteImage` | `loyverse.api.items.deleteImage` | `destructive` | Delete an item's image |
| `items.get` | `loyverse.api.items.get` | `read` | Get a single item |
| `items.list` | `loyverse.api.items.list` | `read` | List items |
| `items.uploadImage` | `loyverse.api.items.uploadImage` | `write` | Upload an item's image |
| `items.upsert` | `loyverse.api.items.upsert` | `write` | Create or update an item |
| `merchant.get` | `loyverse.api.merchant.get` | `read` | Get merchant information |
| `modifiers.delete` | `loyverse.api.modifiers.delete` | `destructive` | Delete a modifier |
| `modifiers.get` | `loyverse.api.modifiers.get` | `read` | Get a single modifier |
| `modifiers.list` | `loyverse.api.modifiers.list` | `read` | List modifiers |
| `modifiers.upsert` | `loyverse.api.modifiers.upsert` | `write` | Create or update a modifier |
| `oidc.discovery` | `loyverse.api.oidc.discovery` | `read` | Get the OpenID Connect discovery document |
| `oidc.jwks` | `loyverse.api.oidc.jwks` | `read` | Get the JSON Web Key Set |
| `paymentTypes.get` | `loyverse.api.paymentTypes.get` | `read` | Get a single payment type |
| `paymentTypes.list` | `loyverse.api.paymentTypes.list` | `read` | List payment types |
| `posDevices.delete` | `loyverse.api.posDevices.delete` | `destructive` | Delete a POS device |
| `posDevices.get` | `loyverse.api.posDevices.get` | `read` | Get a single POS device |
| `posDevices.list` | `loyverse.api.posDevices.list` | `read` | List POS devices |
| `posDevices.upsert` | `loyverse.api.posDevices.upsert` | `write` | Create or update a POS device |
| `receipts.create` | `loyverse.api.receipts.create` | `destructive` | Record a sale, which cannot be withdrawn once created |
| `receipts.get` | `loyverse.api.receipts.get` | `read` | Get a single receipt |
| `receipts.list` | `loyverse.api.receipts.list` | `read` | List receipts |
| `receipts.refund` | `loyverse.api.receipts.refund` | `destructive` | Refund a receipt, which returns money to the customer |
| `shifts.list` | `loyverse.api.shifts.list` | `read` | List shifts |
| `stores.get` | `loyverse.api.stores.get` | `read` | Get a single store |
| `stores.list` | `loyverse.api.stores.list` | `read` | List stores |
| `suppliers.delete` | `loyverse.api.suppliers.delete` | `destructive` | Delete a supplier |
| `suppliers.get` | `loyverse.api.suppliers.get` | `read` | Get a single supplier |
| `suppliers.list` | `loyverse.api.suppliers.list` | `read` | List suppliers |
| `suppliers.upsert` | `loyverse.api.suppliers.upsert` | `write` | Create or update a supplier |
| `taxes.delete` | `loyverse.api.taxes.delete` | `destructive` | Delete a tax |
| `taxes.get` | `loyverse.api.taxes.get` | `read` | Get a single tax |
| `taxes.list` | `loyverse.api.taxes.list` | `read` | List taxes |
| `taxes.upsert` | `loyverse.api.taxes.upsert` | `write` | Create or update a tax |
| `variants.delete` | `loyverse.api.variants.delete` | `destructive` | Delete an item variant |
| `variants.get` | `loyverse.api.variants.get` | `read` | Get a single variant |
| `variants.list` | `loyverse.api.variants.list` | `read` | List item variants |
| `variants.upsert` | `loyverse.api.variants.upsert` | `write` | Create or update an item variant |
| `webhooks.delete` | `loyverse.api.webhooks.delete` | `destructive` | Delete a webhook subscription |
| `webhooks.get` | `loyverse.api.webhooks.get` | `read` | Get a single webhook subscription |
| `webhooks.list` | `loyverse.api.webhooks.list` | `read` | List webhook subscriptions |
| `webhooks.upsert` | `loyverse.api.webhooks.upsert` | `write` | Create or update a webhook subscription |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/loyverse

## License

Apache-2.0
