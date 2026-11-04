# @corsair-dev/gumroad

Gumroad plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gumroad
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `licenses.verify` | `gumroad.api.licenses.verify` | `write` | Verify a license key against a product and read its purchase; increments the license use counter unless increment_uses_count is "false" |
| `products.get` | `gumroad.api.products.get` | `read` | Get one product by id, including description, price, tags and purchasing-power-parity prices |
| `products.list` | `gumroad.api.products.list` | `read` | List the authenticated user's Gumroad products with price, publication state and sales counts |
| `sales.get` | `gumroad.api.sales.get` | `read` | Get one sale by id with price, fees, taxes, refund and chargeback state |
| `sales.list` | `gumroad.api.sales.list` | `read` | List successful sales, filterable by date range, product, buyer email, order id, name or license key |
| `subscribers.list` | `gumroad.api.subscribers.list` | `read` | List one product's subscribers with status, recurrence and license key |

## Auth

Auth: API key (OAuth access token), sent as `Authorization: Bearer <token>`.
Create an application at https://gumroad.com/apps and generate an access token.
Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

- Gumroad API docs: https://gumroad.com/api
- Full docs, types, and examples: https://docs.corsair.dev/plugins/gumroad

## License

Apache-2.0
