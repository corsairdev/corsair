# @corsair-dev/shippo

Shippo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/shippo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `addresses.create` | `shippo.api.addresses.create` | `write` | Create a reusable address. Only `country` is required, but buying a label needs a name and a street line |
| `addresses.get` | `shippo.api.addresses.get` | `read` | Read one saved address by `object_id` |
| `addresses.list` | `shippo.api.addresses.list` | `read` | List the account’s saved addresses, most recent first |
| `addresses.validate` | `shippo.api.addresses.validate` | `read` | Re-run validation on a saved address and read `validation_results`: whether it is valid, and what was corrected or could not be matched |
| `batches.addShipments` | `shippo.api.batches.addShipments` | `write` | Add shipments to a batch that is still validating or valid |
| `batches.create` | `shippo.api.batches.create` | `write` | Create a batch of shipments to buy labels for together. Validation runs asynchronously |
| `batches.get` | `shippo.api.batches.get` | `read` | Read a batch: its status, per-shipment results and the merged label URLs once purchased |
| `batches.purchase` | `shippo.api.batches.purchase` | `write` | Buy every label in a batch: spends money per shipment and answers 202, so the labels arrive through `batches.get` |
| `batches.removeShipments` | `shippo.api.batches.removeShipments` | `write` | Remove shipments from a batch before it is purchased |
| `carrierAccounts.create` | `shippo.api.carrierAccounts.create` | `write` | Connect the caller’s own carrier account, with that carrier’s credential set |
| `carrierAccounts.get` | `shippo.api.carrierAccounts.get` | `read` | Read one carrier account |
| `carrierAccounts.list` | `shippo.api.carrierAccounts.list` | `read` | List the carrier accounts on the account. Every call that asks for rates depends on one of these being active |
| `carrierAccounts.register` | `shippo.api.carrierAccounts.register` | `write` | Enrol a Shippo-supplied carrier account rather than the caller’s own |
| `carrierAccounts.registrationStatus` | `shippo.api.carrierAccounts.registrationStatus` | `read` | Check whether a carrier has approved the account for live rates |
| `carrierAccounts.update` | `shippo.api.carrierAccounts.update` | `write` | Change a carrier account’s credentials or switch it on or off |
| `customsDeclarations.create` | `shippo.api.customsDeclarations.create` | `write` | Create a customs declaration for an international shipment, certifying its contents and naming what to do if it cannot be delivered |
| `customsDeclarations.get` | `shippo.api.customsDeclarations.get` | `read` | Read one customs declaration |
| `customsDeclarations.list` | `shippo.api.customsDeclarations.list` | `read` | List customs declarations |
| `customsItems.create` | `shippo.api.customsItems.create` | `write` | Create a customs item: what it is, how many, its weight and declared value |
| `customsItems.get` | `shippo.api.customsItems.get` | `read` | Read one customs item |
| `customsItems.list` | `shippo.api.customsItems.list` | `read` | List customs items used in international declarations |
| `manifests.create` | `shippo.api.manifests.create` | `write` | Close out a carrier’s day with a manifest covering transactions not yet manifested |
| `manifests.get` | `shippo.api.manifests.get` | `read` | Read one manifest and its document URLs |
| `manifests.list` | `shippo.api.manifests.list` | `read` | List manifests, the end-of-day paperwork a carrier requires |
| `orders.create` | `shippo.api.orders.create` | `write` | Create an order so Shippo can group the labels bought to fulfil it |
| `orders.get` | `shippo.api.orders.get` | `read` | Read one order with its line items and buyer address |
| `orders.list` | `shippo.api.orders.list` | `read` | List orders, filterable by status, shop app or when they were placed |
| `parcels.create` | `shippo.api.parcels.create` | `write` | Create a reusable parcel with its dimensions and weight, both as decimal strings |
| `parcels.get` | `shippo.api.parcels.get` | `read` | Read one saved parcel by `object_id` |
| `parcels.list` | `shippo.api.parcels.list` | `read` | List the account’s saved parcels |
| `parcelTemplates.create` | `shippo.api.parcelTemplates.create` | `write` | Save a reusable parcel template, optionally based on a carrier template token |
| `parcelTemplates.delete` | `shippo.api.parcelTemplates.delete` | `destructive` | Delete one of the account’s parcel templates. Anything still referring to its token stops resolving |
| `parcelTemplates.get` | `shippo.api.parcelTemplates.get` | `read` | Read one of the account’s parcel templates |
| `parcelTemplates.getCarrier` | `shippo.api.parcelTemplates.getCarrier` | `read` | Read one carrier parcel template by its token |
| `parcelTemplates.list` | `shippo.api.parcelTemplates.list` | `read` | List the account’s own parcel templates |
| `parcelTemplates.listCarrier` | `shippo.api.parcelTemplates.listCarrier` | `read` | List the carrier’s predefined parcel templates, whose tokens can be reused instead of dimensions |
| `parcelTemplates.update` | `shippo.api.parcelTemplates.update` | `write` | Change one of the account’s parcel templates |
| `pickups.create` | `shippo.api.pickups.create` | `write` | Ask a carrier to collect parcels, naming the transactions it covers and a pickup window |
| `rates.get` | `shippo.api.rates.get` | `read` | Read one rate by `object_id`. Rates older than 390 days are gone |
| `refunds.create` | `shippo.api.refunds.create` | `write` | Ask the carrier to void a bought label and refund it. The carrier may refuse, so the outcome arrives as a status |
| `refunds.get` | `shippo.api.refunds.get` | `read` | Read one refund request |
| `refunds.list` | `shippo.api.refunds.list` | `read` | List refund requests and their outcomes |
| `shipments.create` | `shippo.api.shipments.create` | `write` | Create a shipment from an origin, destination and one or more parcels; Shippo starts computing carrier rates. Pass `async: false` to get them back in the response |
| `shipments.get` | `shippo.api.shipments.get` | `read` | Read one shipment, including any rates already computed |
| `shipments.list` | `shippo.api.shipments.list` | `read` | List shipments, optionally limited to a creation-date window |
| `shipments.rates` | `shippo.api.shipments.rates` | `read` | List the rates computed for a shipment. This is what you call after an async create returned no rates |
| `shipments.ratesInCurrency` | `shippo.api.shipments.ratesInCurrency` | `read` | List a shipment’s rates expressed in a chosen currency |
| `tracks.get` | `shippo.api.tracks.get` | `read` | Read a tracking status and history for a carrier and tracking number |
| `tracks.register` | `shippo.api.tracks.register` | `write` | Register a tracking number Shippo has not seen, usually from a label bought elsewhere. From then on `track_updated` webhooks fire for it |
| `transactions.create` | `shippo.api.transactions.create` | `write` | Buy a label from a rate: spends money on the account’s carrier and cannot be undone except by a refund |
| `transactions.get` | `shippo.api.transactions.get` | `read` | Read one bought label. Re-read this rather than reusing a `label_url`, which expires |
| `transactions.list` | `shippo.api.transactions.list` | `read` | List bought labels, filterable by rate, object status or tracking status |
| `webhooks.create` | `shippo.api.webhooks.create` | `write` | Subscribe one URL to tracking, transaction or batch events, or to all of them |
| `webhooks.delete` | `shippo.api.webhooks.delete` | `destructive` | Delete a webhook subscription. Shippo keeps creating tracking webhooks for labels it sells, so this only removes the one named |
| `webhooks.get` | `shippo.api.webhooks.get` | `read` | Read one webhook subscription |
| `webhooks.list` | `shippo.api.webhooks.list` | `read` | List the webhook subscriptions on the account |
| `webhooks.update` | `shippo.api.webhooks.update` | `write` | Change a subscription’s URL or event, or switch it on or off |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/shippo

## License

Apache-2.0
