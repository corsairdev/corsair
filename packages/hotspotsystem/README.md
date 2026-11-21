# @corsair-dev/hotspotsystem

HotspotSystem plugin for Corsair: locations, customers, subscribers, vouchers and transactions from the v2 API.

## Install

```bash
pnpm add @corsair-dev/hotspotsystem
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.list` | `hotspotsystem.api.customers.list` | `read` | List the account customers, with field selection, sorting and paging |
| `locations.customers` | `hotspotsystem.api.locations.customers` | `read` | List the customers seen at one location, with their contact details and social profiles |
| `locations.list` | `hotspotsystem.api.locations.list` | `read` | List the account locations, with field selection, sorting and paging |
| `locations.macTransactions` | `hotspotsystem.api.locations.macTransactions` | `read` | List the device MAC transactions at one location, with the device answers collected |
| `locations.options` | `hotspotsystem.api.locations.options` | `read` | List the account locations as `id` and `name` pairs for a picker; no paging |
| `locations.paidTransactions` | `hotspotsystem.api.locations.paidTransactions` | `read` | List the paid transactions at one location, with amounts and currencies |
| `locations.socialTransactions` | `hotspotsystem.api.locations.socialTransactions` | `read` | List social-login transactions at one location |
| `locations.subscribers` | `hotspotsystem.api.locations.subscribers` | `read` | List the subscribers seen at one location, with their contact details and social profiles |
| `locations.vouchers` | `hotspotsystem.api.locations.vouchers` | `read` | List the vouchers issued at one location, with their validity and traffic limits |
| `locations.voucherTransactions` | `hotspotsystem.api.locations.voucherTransactions` | `read` | List the voucher transactions at one location, with the voucher used and the amount |
| `me.get` | `hotspotsystem.api.me.get` | `read` | Read the resource owner behind the key: a user ID and an operator name |
| `ping.check` | `hotspotsystem.api.ping.check` | `read` | Confirm the API answers: returns `pong`. Needs a key, because Corsair resolves one before every call |
| `subscribers.list` | `hotspotsystem.api.subscribers.list` | `read` | List the account subscribers, with field selection, sorting and paging |
| `transactions.mac` | `hotspotsystem.api.transactions.mac` | `read` | List device MAC transactions across the account, with the device answers collected |
| `transactions.paid` | `hotspotsystem.api.transactions.paid` | `read` | List paid transactions across the account, with amounts and currencies |
| `transactions.social` | `hotspotsystem.api.transactions.social` | `read` | List social-login transactions across the account, with the network used |
| `transactions.voucher` | `hotspotsystem.api.transactions.voucher` | `read` | List voucher transactions across the account, with the voucher used and the amount |
| `vouchers.list` | `hotspotsystem.api.vouchers.list` | `read` | List the account vouchers with their traffic limits, validity and price |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hotspotsystem

## License

Apache-2.0
