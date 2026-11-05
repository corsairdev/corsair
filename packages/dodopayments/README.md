# @corsair-dev/dodopayments

DodoPayments plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dodopayments
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.create` | `dodopayments.api.customers.create` | `write` | Create a Dodo customer |
| `customers.get` | `dodopayments.api.customers.get` | `read` | Fetch a Dodo customer by ID |
| `payments.create` | `dodopayments.api.payments.create` | `write` | Create a Dodo payment |
| `payments.get` | `dodopayments.api.payments.get` | `read` | Fetch a Dodo payment by ID |
| `payments.list` | `dodopayments.api.payments.list` | `read` | List Dodo payments |
| `refunds.create` | `dodopayments.api.refunds.create` | `write` | Create a refund for a Dodo payment |
| `subscriptions.cancel` | `dodopayments.api.subscriptions.cancel` | `write` | Cancel a Dodo subscription |
| `subscriptions.create` | `dodopayments.api.subscriptions.create` | `write` | Create a Dodo subscription |
| `subscriptions.get` | `dodopayments.api.subscriptions.get` | `read` | Fetch a Dodo subscription by ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 5 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dodopayments

## License

Apache-2.0
