# @corsair-dev/razorpay

Razorpay plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/razorpay
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.create` | `razorpay.api.customers.create` | `write` | Create a Razorpay customer |
| `customers.get` | `razorpay.api.customers.get` | `read` | Fetch a Razorpay customer by ID |
| `customers.list` | `razorpay.api.customers.list` | `read` | List Razorpay customers |
| `customers.update` | `razorpay.api.customers.update` | `write` | Update a Razorpay customer |
| `orders.create` | `razorpay.api.orders.create` | `write` | Create a Razorpay order |
| `orders.get` | `razorpay.api.orders.get` | `read` | Fetch a Razorpay order by ID |
| `orders.list` | `razorpay.api.orders.list` | `read` | List Razorpay orders |
| `payments.capture` | `razorpay.api.payments.capture` | `write` | Capture an authorized Razorpay payment |
| `payments.get` | `razorpay.api.payments.get` | `read` | Fetch a Razorpay payment by ID |
| `payments.list` | `razorpay.api.payments.list` | `read` | List Razorpay payments |
| `payouts.create` | `razorpay.api.payouts.create` | `write` | Create a Razorpay payout |
| `payouts.get` | `razorpay.api.payouts.get` | `read` | Fetch a Razorpay payout by ID |
| `payouts.list` | `razorpay.api.payouts.list` | `read` | List Razorpay payouts |
| `refunds.create` | `razorpay.api.refunds.create` | `write` | Create a refund for a Razorpay payment |
| `refunds.get` | `razorpay.api.refunds.get` | `read` | Fetch a specific refund for a Razorpay payment |
| `refunds.list` | `razorpay.api.refunds.list` | `read` | List refunds for a Razorpay payment |
| `settlements.get` | `razorpay.api.settlements.get` | `read` | Fetch a Razorpay settlement by ID |
| `settlements.list` | `razorpay.api.settlements.list` | `read` | List Razorpay settlements |
| `subscriptions.cancel` | `razorpay.api.subscriptions.cancel` | `destructive` | Cancel a Razorpay subscription [DESTRUCTIVE] |
| `subscriptions.create` | `razorpay.api.subscriptions.create` | `write` | Create a Razorpay subscription |
| `subscriptions.get` | `razorpay.api.subscriptions.get` | `read` | Fetch a Razorpay subscription by ID |
| `subscriptions.list` | `razorpay.api.subscriptions.list` | `read` | List Razorpay subscriptions |
| `subscriptions.pause` | `razorpay.api.subscriptions.pause` | `write` | Pause a Razorpay subscription |
| `subscriptions.resume` | `razorpay.api.subscriptions.resume` | `write` | Resume a paused Razorpay subscription |
| `subscriptions.update` | `razorpay.api.subscriptions.update` | `write` | Update a Razorpay subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/razorpay

## License

Apache-2.0
