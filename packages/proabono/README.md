# @corsair-dev/proabono

Subscription billing API for managing customers, subscriptions, usages and invoices.

## Install

```bash
pnpm add @corsair-dev/proabono
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balanceLines.create` | `proabono.api.balanceLines.create` | `destructive` | Add a balance line, such as a one-off charge or credit in cents, to a customer's next invoice |
| `balanceLines.list` | `proabono.api.balanceLines.list` | `read` | List balance lines by customer, segment, feature or subscription, with their totals |
| `customers.anonymize` | `proabono.api.customers.anonymize` | `destructive` | Erase a customer's personal data. This cannot be undone, and ProAbono keeps the billing record only as it must |
| `customers.create` | `proabono.api.customers.create` | `write` | Create a customer with your own reference, which subscriptions and usages then identify it by |
| `customers.get` | `proabono.api.customers.get` | `read` | Read one customer by your reference, with whether it is billable |
| `customers.invalidate` | `proabono.api.customers.invalidate` | `destructive` | Invalidate a customer: ProAbono replaces their reference so it can be reused and revokes their portal links. Subscriptions, invoices and payment methods stay |
| `customers.list` | `proabono.api.customers.list` | `read` | List the customers in a segment, one page at a time |
| `customers.suspend` | `proabono.api.customers.suspend` | `write` | Suspend a customer without deleting anything, so they can be reactivated |
| `customers.update` | `proabono.api.customers.update` | `write` | Change a customer's name, email, language, affiliation or metadata. ProAbono creates and updates on the same route, so an unknown reference creates a customer |
| `features.get` | `proabono.api.features.get` | `read` | Read one feature by its reference |
| `features.list` | `proabono.api.features.list` | `read` | List the features your offers carry |
| `invoices.get` | `proabono.api.invoices.get` | `read` | Read one invoice with its totals and links |
| `invoices.list` | `proabono.api.invoices.list` | `read` | List invoices by customer or subscription, one page at a time |
| `offers.get` | `proabono.api.offers.get` | `read` | Read one offer by its reference |
| `offers.list` | `proabono.api.offers.list` | `read` | List the offers in a segment, optionally in a customer language and with their upgrade links |
| `subscriptions.create` | `proabono.api.subscriptions.create` | `destructive` | Subscribe a customer to an offer, which starts billing when the offer is paid and the customer is billable. `TryStart: false` creates it without starting so it can be customised first |
| `subscriptions.get` | `proabono.api.subscriptions.get` | `read` | Read one subscription with its state, period, next billing date and features. The docs warn against using this to check whether a user is a subscriber |
| `subscriptions.list` | `proabono.api.subscriptions.list` | `read` | List subscriptions filtered by customer, offer or segment, one page at a time |
| `subscriptions.start` | `proabono.api.subscriptions.start` | `destructive` | Start a subscription that was created without starting, which begins billing |
| `subscriptions.suspend` | `proabono.api.subscriptions.suspend` | `write` | Suspend a subscription without terminating it |
| `subscriptions.terminate` | `proabono.api.subscriptions.terminate` | `destructive` | Terminate a subscription, ending it for good; by default at the end of the current period. A later start cannot revive it |
| `subscriptions.updateTerm` | `proabono.api.subscriptions.updateTerm` | `write` | Change a subscription's end date |
| `subscriptions.upgrade` | `proabono.api.subscriptions.upgrade` | `destructive` | Move a subscription to another offer, which changes what it bills from the next period |
| `usages.get` | `proabono.api.usages.get` | `read` | Read one customer's usage of one feature: on/off, or the included and current quantities |
| `usages.increment` | `proabono.api.usages.increment` | `destructive` | Add to a feature’s usage for a customer, which ProAbono bills when it exceeds the included quantity. A negative increment subtracts, which is how a reversed action is recorded |
| `usages.list` | `proabono.api.usages.list` | `read` | List feature usages by customer, feature or subscription, one page at a time |
| `usages.update` | `proabono.api.usages.update` | `destructive` | Update up to 50 usages in one call, each by increment, current quantity or on/off |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/proabono

## License

Apache-2.0
