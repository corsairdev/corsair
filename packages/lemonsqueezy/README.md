# @corsair-dev/lemonsqueezy

Lemon Squeezy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/lemonsqueezy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `affiliates.get` | `lemonsqueezy.api.affiliates.get` | `read` | Read one affiliate, with their status and earnings |
| `affiliates.list` | `lemonsqueezy.api.affiliates.list` | `read` | List affiliates, filtered by store or email |
| `checkouts.create` | `lemonsqueezy.api.checkouts.create` | `write` | Create a checkout link for a variant and return its URL, with optional prefilled data, custom pricing and appearance |
| `checkouts.get` | `lemonsqueezy.api.checkouts.get` | `read` | Read one checkout, with its options and prefilled data |
| `checkouts.list` | `lemonsqueezy.api.checkouts.list` | `read` | List checkouts, filtered by store or variant |
| `customers.create` | `lemonsqueezy.api.customers.create` | `write` | Create a customer record. This does not send an invitation to the customer |
| `customers.get` | `lemonsqueezy.api.customers.get` | `read` | Read one customer, with their status, country and revenue |
| `customers.list` | `lemonsqueezy.api.customers.list` | `read` | List customers, filtered by store or email |
| `customers.update` | `lemonsqueezy.api.customers.update` | `write` | Change a customer's name or email address |
| `discountRedemptions.get` | `lemonsqueezy.api.discountRedemptions.get` | `read` | Read one discount redemption, with the amount it took off |
| `discountRedemptions.list` | `lemonsqueezy.api.discountRedemptions.list` | `read` | List discount redemptions, filtered by discount or order |
| `discounts.create` | `lemonsqueezy.api.discounts.create` | `write` | Create a discount code, either a percentage or a fixed amount in cents, lasting once, a number of months or forever |
| `discounts.delete` | `lemonsqueezy.api.discounts.delete` | `destructive` | Delete a discount code. A deleted code cannot be restored |
| `discounts.get` | `lemonsqueezy.api.discounts.get` | `read` | Read one discount code, with its amount, duration and status |
| `discounts.list` | `lemonsqueezy.api.discounts.list` | `read` | List discount codes, optionally for one store |
| `files.get` | `lemonsqueezy.api.files.get` | `read` | Read one file and its download URL |
| `files.list` | `lemonsqueezy.api.files.list` | `read` | List downloadable files, optionally for one variant |
| `licenseKeyInstances.get` | `lemonsqueezy.api.licenseKeyInstances.get` | `read` | Read one license key instance, with its identifier and name |
| `licenseKeyInstances.list` | `lemonsqueezy.api.licenseKeyInstances.list` | `read` | List the instances a license key has been activated on |
| `licenseKeys.get` | `lemonsqueezy.api.licenseKeys.get` | `read` | Read one license key, including the full key string |
| `licenseKeys.list` | `lemonsqueezy.api.licenseKeys.list` | `read` | List license keys, filtered by store, order, product or status |
| `licenseKeys.update` | `lemonsqueezy.api.licenseKeys.update` | `write` | Change a license key's activation limit, expiry or disabled state |
| `orderItems.get` | `lemonsqueezy.api.orderItems.get` | `read` | Read one order line item, with its price and quantity |
| `orderItems.list` | `lemonsqueezy.api.orderItems.list` | `read` | List order line items, filtered by order, product or variant |
| `orders.generateInvoice` | `lemonsqueezy.api.orders.generateInvoice` | `write` | Generate the PDF invoice for an order and return its URL. No money moves |
| `orders.get` | `lemonsqueezy.api.orders.get` | `read` | Read one order, with its totals, tax and refund state |
| `orders.list` | `lemonsqueezy.api.orders.list` | `read` | List orders, filtered by store, email or order number |
| `orders.refund` | `lemonsqueezy.api.orders.refund` | `destructive` | Refund an order in full, or partially by amount in cents. A refund cannot be undone through the API |
| `prices.get` | `lemonsqueezy.api.prices.get` | `read` | Read one price, with its scheme, tiers and renewal interval |
| `prices.list` | `lemonsqueezy.api.prices.list` | `read` | List prices, optionally for one variant |
| `products.get` | `lemonsqueezy.api.products.get` | `read` | Read one product, with its price range and buy-now URL |
| `products.list` | `lemonsqueezy.api.products.list` | `read` | List products, optionally for one store |
| `stores.get` | `lemonsqueezy.api.stores.get` | `read` | Read one store, with its plan, currency and sales totals |
| `stores.list` | `lemonsqueezy.api.stores.list` | `read` | List the stores the key can reach, with their plan and sales totals |
| `subscriptionInvoices.generate` | `lemonsqueezy.api.subscriptionInvoices.generate` | `write` | Generate the PDF invoice for a subscription invoice and return its URL. No money moves |
| `subscriptionInvoices.get` | `lemonsqueezy.api.subscriptionInvoices.get` | `read` | Read one subscription invoice, with its totals and refund state |
| `subscriptionInvoices.list` | `lemonsqueezy.api.subscriptionInvoices.list` | `read` | List subscription invoices, filtered by store, status, refund state or subscription |
| `subscriptionInvoices.refund` | `lemonsqueezy.api.subscriptionInvoices.refund` | `destructive` | Refund a subscription invoice in full, or partially by amount in cents. A refund cannot be undone through the API |
| `subscriptionItems.get` | `lemonsqueezy.api.subscriptionItems.get` | `read` | Read one subscription item, with its price, quantity and usage flag |
| `subscriptionItems.list` | `lemonsqueezy.api.subscriptionItems.list` | `read` | List a subscription's items, filtered by subscription or price |
| `subscriptionItems.update` | `lemonsqueezy.api.subscriptionItems.update` | `write` | Change a subscription item's quantity |
| `subscriptionItems.usage` | `lemonsqueezy.api.subscriptionItems.usage` | `read` | Read a usage-based item's metered usage for the current period |
| `subscriptions.cancel` | `lemonsqueezy.api.subscriptions.cancel` | `destructive` | Cancel an active subscription. It stays readable but stops renewing |
| `subscriptions.get` | `lemonsqueezy.api.subscriptions.get` | `read` | Read one subscription, with its status, renewal date and pause state |
| `subscriptions.list` | `lemonsqueezy.api.subscriptions.list` | `read` | List subscriptions, filtered by store, order, product, variant, email or status |
| `subscriptions.update` | `lemonsqueezy.api.subscriptions.update` | `write` | Move a subscription to another variant, pause or resume it, or change its billing date. A plan change prorates the next charge |
| `usageRecords.create` | `lemonsqueezy.api.usageRecords.create` | `write` | Record metered usage against a subscription item: add to the period total, or replace it |
| `usageRecords.get` | `lemonsqueezy.api.usageRecords.get` | `read` | Read one usage record, with its quantity and action |
| `usageRecords.list` | `lemonsqueezy.api.usageRecords.list` | `read` | List metered usage records, optionally for one subscription item |
| `users.get` | `lemonsqueezy.api.users.get` | `read` | Read the account that owns the API key |
| `variants.get` | `lemonsqueezy.api.variants.get` | `read` | Read one variant, with its license settings and checkout links |
| `variants.list` | `lemonsqueezy.api.variants.list` | `read` | List variants, optionally for one product or status |
| `webhooks.create` | `lemonsqueezy.api.webhooks.create` | `write` | Register a webhook URL with its signing secret and the events to send |
| `webhooks.delete` | `lemonsqueezy.api.webhooks.delete` | `destructive` | Delete a webhook. Deliveries to it stop immediately |
| `webhooks.get` | `lemonsqueezy.api.webhooks.get` | `read` | Read one webhook, with its URL, events and last delivery time |
| `webhooks.list` | `lemonsqueezy.api.webhooks.list` | `read` | List webhooks, optionally for one store |
| `webhooks.update` | `lemonsqueezy.api.webhooks.update` | `write` | Change a webhook's URL, event list or signing secret |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lemonsqueezy

## License

Apache-2.0
