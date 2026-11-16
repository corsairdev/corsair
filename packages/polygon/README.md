# @corsair-dev/polygon

Payments API for moving money between crypto and fiat, exposed by Corsair.

## Install

```bash
pnpm add @corsair-dev/polygon
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cashLocations.list` | `polygon.api.cashLocations.list` | `read` | List the retail cash locations in range, nearest first, with cursor paging |
| `customers.create` | `polygon.api.customers.create` | `write` | Create a customer. Individuals need a first and last name; businesses need a legal name and email. Identity verification follows the project policy |
| `customers.delete` | `polygon.api.customers.delete` | `destructive` | Delete a customer. OMS returns the record in its offboarded state |
| `customers.get` | `polygon.api.customers.get` | `read` | Read one customer with its onboarding status |
| `customers.list` | `polygon.api.customers.list` | `read` | List customers, filtered by status, email, external id or creation window, with cursor paging |
| `customers.update` | `polygon.api.customers.update` | `write` | Update a customer's details, or request additional endorsements. Personal data fields are write-only |
| `networks.list` | `polygon.api.networks.list` | `read` | List the networks, rails and assets this project can route, with cursor paging |
| `quotes.create` | `polygon.api.quotes.create` | `write` | Price a transfer: set the amount on one side and OMS calculates the other. Nothing moves until a transaction accepts the quote |
| `quotes.get` | `polygon.api.quotes.get` | `read` | Read one quote with its status and pricing |
| `transactions.create` | `polygon.api.transactions.create` | `destructive` | Accept a quote and move the money. This is the irreversible step: pricing is locked at the quote and the transfer starts as soon as OMS accepts it |
| `transactions.get` | `polygon.api.transactions.get` | `read` | Read one transaction with its status, pricing and transfers |
| `transactions.list` | `polygon.api.transactions.list` | `read` | List transactions filtered by status, customer, wallet, precursor or creation window, with cursor paging |
| `wallets.balance` | `polygon.api.wallets.balance` | `read` | Read one wallet balance in its asset, with an estimated value. The balance can be negative after a clawback |
| `wallets.create` | `polygon.api.wallets.create` | `write` | Create a wallet for an asset on a chain |
| `wallets.get` | `polygon.api.wallets.get` | `read` | Read one wallet by id |
| `wallets.list` | `polygon.api.wallets.list` | `read` | List wallets, scoped to a customer or type, with balance ordering and cursor paging |
| `webhooks.create` | `polygon.api.webhooks.create` | `write` | Register a webhook endpoint. The HMAC signing key is returned only here, so store it when the call returns |
| `webhooks.delete` | `polygon.api.webhooks.delete` | `destructive` | Delete a webhook endpoint. Deliveries stop immediately and the signing key is discarded |
| `webhooks.get` | `polygon.api.webhooks.get` | `read` | Read one webhook endpoint |
| `webhooks.list` | `polygon.api.webhooks.list` | `read` | List webhook endpoints with their delivery counts and cursor paging |
| `webhooks.update` | `polygon.api.webhooks.update` | `write` | Change a webhook's URL, subscriptions or delivery settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/polygon

## License

Apache-2.0
