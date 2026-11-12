# @corsair-dev/remoteretrieval

Remote Retrieval plugin for Corsair - create equipment-return orders, track pending, new and in-progress shipments, and read company details and live device prices.

## Install

```bash
pnpm add @corsair-dev/remoteretrieval
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.get` | `remoteretrieval.api.company.get` | `read` | Read the company record the key belongs to: name, address and creation date |
| `orders.create` | `remoteretrieval.api.orders.create` | `write` | Create one or more equipment-return orders. Each order is a real, paid shipment: Remote Retrieval mails a box to the named employee's home address and bills the account the per-device fee shown by prices |
| `orders.get` | `remoteretrieval.api.orders.get` | `read` | Read one order by ID, taking it as the oid query parameter |
| `orders.inprogress` | `remoteretrieval.api.orders.inprogress` | `read` | List orders whose return has started but whose device has not arrived yet, with both shipment legs |
| `orders.list` | `remoteretrieval.api.orders.list` | `read` | List every order with its payment status and shipping status, paged by the response's own next link |
| `orders.new` | `remoteretrieval.api.orders.new` | `read` | List orders whose payment completed and which are ready to process |
| `orders.pending` | `remoteretrieval.api.orders.pending` | `read` | List orders whose payment has not completed; they are on hold until it does |
| `prices` | `remoteretrieval.api.prices` | `read` | Read the live per-device prices, including the Monitor_27 band for 24-to-27-inch displays |
| `validate` | `remoteretrieval.api.validate` | `read` | Check that the API key works and read the account email it belongs to |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/remoteretrieval

## License

Apache-2.0
