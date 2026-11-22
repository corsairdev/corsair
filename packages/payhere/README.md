# @corsair-dev/payhere

Payhere is a Stripe-backed payment links platform. This plugin reads the account user, company and stats, lists customers, payments, plans and subscriptions, reads a customer with their payment history, issues full or partial refunds, and receives HMAC-verified payment and subscription webhooks.

## Install

```bash
pnpm add @corsair-dev/payhere
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.get` | `payhere.api.company.get` | `read` | Read the company of the authenticated user |
| `company.stats` | `payhere.api.company.stats` | `read` | Read the payment stats of the last 30 days with comparisons |
| `customers.get` | `payhere.api.customers.get` | `read` | Read one customer with their subscriptions and payment history |
| `customers.list` | `payhere.api.customers.list` | `read` | List customers, most recent first, paged |
| `payments.list` | `payhere.api.payments.list` | `read` | List payments, most recent first, paged |
| `plans.list` | `payhere.api.plans.list` | `read` | List the payment plans, paged |
| `refunds.create` | `payhere.api.refunds.create` | `destructive` | Refund a payment fully or partially; money leaves the account and the refund cannot be undone |
| `subscriptions.list` | `payhere.api.subscriptions.list` | `read` | List subscriptions, most recent payment first, paged |
| `user.get` | `payhere.api.user.get` | `read` | Read the authenticated Payhere user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/payhere

## License

Apache-2.0
