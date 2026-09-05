# @corsair-dev/stripe

Stripe plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/stripe
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balance.get` | `stripe.api.balance.get` | `read` | Retrieve the current account balance |
| `charges.create` | `stripe.api.charges.create` | `write` | Create a new Stripe charge |
| `charges.get` | `stripe.api.charges.get` | `read` | Retrieve a Stripe charge by ID |
| `charges.list` | `stripe.api.charges.list` | `read` | List Stripe charges with optional filters |
| `charges.update` | `stripe.api.charges.update` | `write` | Update a Stripe charge |
| `coupons.create` | `stripe.api.coupons.create` | `write` | Create a new Stripe coupon |
| `coupons.list` | `stripe.api.coupons.list` | `read` | List Stripe coupons |
| `customers.create` | `stripe.api.customers.create` | `write` | Create a new Stripe customer |
| `customers.delete` | `stripe.api.customers.delete` | `destructive` | Delete a Stripe customer [DESTRUCTIVE] |
| `customers.get` | `stripe.api.customers.get` | `read` | Retrieve a Stripe customer by ID |
| `customers.list` | `stripe.api.customers.list` | `read` | List Stripe customers with optional filters |
| `paymentIntents.create` | `stripe.api.paymentIntents.create` | `write` | Create a new Stripe payment intent |
| `paymentIntents.get` | `stripe.api.paymentIntents.get` | `read` | Retrieve a Stripe payment intent by ID |
| `paymentIntents.list` | `stripe.api.paymentIntents.list` | `read` | List Stripe payment intents with optional filters |
| `paymentIntents.update` | `stripe.api.paymentIntents.update` | `write` | Update a Stripe payment intent |
| `prices.create` | `stripe.api.prices.create` | `write` | Create a new Stripe price |
| `prices.list` | `stripe.api.prices.list` | `read` | List Stripe prices |
| `sources.create` | `stripe.api.sources.create` | `write` | Create a new Stripe source |
| `sources.get` | `stripe.api.sources.get` | `read` | Retrieve a Stripe source by ID |
| `tokens.create` | `stripe.api.tokens.create` | `write` | Create a Stripe token |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 11 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/stripe

## License

Apache-2.0
