# @corsair-dev/paystack

Paystack is a payments platform for African markets. This plugin starts checkouts, verifies and lists transactions, manages customers (including risk actions), plans and subscriptions, issues refunds, and receives charge and transfer webhooks verified under either documented HMAC-SHA512 signature scheme.

## Install

```bash
pnpm add @corsair-dev/paystack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.create` | `paystack.api.customers.create` | `write` | Create a customer |
| `customers.get` | `paystack.api.customers.get` | `read` | Read one customer by email address or code |
| `customers.list` | `paystack.api.customers.list` | `read` | List customers, paged and filtered by creation date |
| `customers.setRiskAction` | `paystack.api.customers.setRiskAction` | `write` | Whitelist, blacklist or reset a customer |
| `customers.update` | `paystack.api.customers.update` | `write` | Update a customer name and contact details |
| `plans.create` | `paystack.api.plans.create` | `write` | Create a payment plan |
| `plans.get` | `paystack.api.plans.get` | `read` | Read one plan by id or code |
| `plans.list` | `paystack.api.plans.list` | `read` | List payment plans, filtered by interval and amount |
| `plans.update` | `paystack.api.plans.update` | `write` | Update a plan, optionally applying the changes to existing subscriptions |
| `refunds.create` | `paystack.api.refunds.create` | `destructive` | Refund a transaction fully or partially; money leaves the account and refunds cannot be undone |
| `refunds.get` | `paystack.api.refunds.get` | `read` | Read one refund by id |
| `refunds.list` | `paystack.api.refunds.list` | `read` | List refunds, filtered by transaction, currency and dates |
| `subscriptions.create` | `paystack.api.subscriptions.create` | `destructive` | Subscribe a customer to a plan; Paystack then debits the saved card every interval |
| `subscriptions.disable` | `paystack.api.subscriptions.disable` | `write` | Disable a subscription with its email token; debits stop until it is enabled again |
| `subscriptions.enable` | `paystack.api.subscriptions.enable` | `destructive` | Enable a subscription with its email token; card debits resume |
| `subscriptions.get` | `paystack.api.subscriptions.get` | `read` | Read one subscription by id or code |
| `subscriptions.list` | `paystack.api.subscriptions.list` | `read` | List subscriptions, filtered by customer and plan |
| `transactions.get` | `paystack.api.transactions.get` | `read` | Read one transaction by id |
| `transactions.initialize` | `paystack.api.transactions.initialize` | `write` | Start a checkout and get the authorization_url to redirect the customer to |
| `transactions.list` | `paystack.api.transactions.list` | `read` | List transactions, filtered by customer, status and dates |
| `transactions.verify` | `paystack.api.transactions.verify` | `read` | Verify a transaction by its reference and read its final status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/paystack

## License

Apache-2.0
