# @corsair-dev/moonclerk

MoonClerk plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/moonclerk
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.get` | `moonclerk.api.customers.get` | `read` | Get a customer and subscription |
| `customers.list` | `moonclerk.api.customers.list` | `read` | List customers and subscriptions |
| `forms.get` | `moonclerk.api.forms.get` | `read` | Get a payment form |
| `forms.list` | `moonclerk.api.forms.list` | `read` | List payment forms |
| `payments.get` | `moonclerk.api.payments.get` | `read` | Get a payment |
| `payments.list` | `moonclerk.api.payments.list` | `read` | List payments |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moonclerk

## License

Apache-2.0
