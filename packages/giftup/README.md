# @corsair-dev/giftup

Gift Up! plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/giftup
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.get` | `giftup.api.company.get` | `read` | Retrieve current company account profile and settings |
| `giftCards.get` | `giftup.api.giftCards.get` | `read` | Retrieve details and remaining balance of a gift card by code |
| `giftCards.list` | `giftup.api.giftCards.list` | `read` | List gift cards with optional date filters and pagination |
| `giftCards.reactivate` | `giftup.api.giftCards.reactivate` | `write` | Reactivate a previously voided gift card |
| `giftCards.redeem` | `giftup.api.giftCards.redeem` | `destructive` | Redeem an amount or units against a gift card balance |
| `giftCards.redeemInFull` | `giftup.api.giftCards.redeemInFull` | `destructive` | Redeem the entire remaining balance of a gift card |
| `giftCards.topUp` | `giftup.api.giftCards.topUp` | `write` | Top up remaining credit or units on a gift card |
| `giftCards.transferBalances` | `giftup.api.giftCards.transferBalances` | `destructive` | Transfer remaining balances from source gift cards to a destination gift card |
| `giftCards.undoRedemption` | `giftup.api.giftCards.undoRedemption` | `write` | Refund or reverse a previously executed gift card redemption |
| `giftCards.update` | `giftup.api.giftCards.update` | `write` | Update gift card properties using JSON Patch |
| `giftCards.void` | `giftup.api.giftCards.void` | `destructive` | Void a gift card to prevent further redemptions |
| `groups.create` | `giftup.api.groups.create` | `write` | Create a new item group |
| `groups.delete` | `giftup.api.groups.delete` | `destructive` | Delete an item group |
| `groups.get` | `giftup.api.groups.get` | `read` | Retrieve details of an item group by ID |
| `groups.list` | `giftup.api.groups.list` | `read` | List all item groups |
| `groups.update` | `giftup.api.groups.update` | `write` | Update an item group using JSON Patch |
| `integrations.getStripeConnection` | `giftup.api.integrations.getStripeConnection` | `read` | Get Stripe integration connection status and enabled payment methods |
| `integrations.updateStripeConnection` | `giftup.api.integrations.updateStripeConnection` | `write` | Update Stripe payment method settings |
| `items.create` | `giftup.api.items.create` | `write` | Create a new gift card item product |
| `items.delete` | `giftup.api.items.delete` | `destructive` | Delete a gift card item product |
| `items.get` | `giftup.api.items.get` | `read` | Retrieve details of an item by ID |
| `items.list` | `giftup.api.items.list` | `read` | List gift card items with optional group filter |
| `items.update` | `giftup.api.items.update` | `write` | Update item properties using JSON Patch |
| `locations.list` | `giftup.api.locations.list` | `read` | List all company store locations |
| `orders.addNote` | `giftup.api.orders.addNote` | `write` | Add an internal note to an order |
| `orders.create` | `giftup.api.orders.create` | `write` | Create an order and issue associated gift cards |
| `orders.get` | `giftup.api.orders.get` | `read` | Retrieve details of a specific order by ID |
| `orders.list` | `giftup.api.orders.list` | `read` | List orders with optional date filters and pagination |
| `orders.markAsPosted` | `giftup.api.orders.markAsPosted` | `write` | Mark a postal order as posted and update gift card codes |
| `orders.update` | `giftup.api.orders.update` | `write` | Update order properties using JSON Patch |
| `partners.createAccount` | `giftup.api.partners.createAccount` | `write` | Provision a new Gift Up! merchant account via Partner API |
| `ping.get` | `giftup.api.ping.get` | `read` | Test connectivity and authorization with the Gift Up! API |
| `ping.post` | `giftup.api.ping.post` | `write` | Echo test with the Gift Up! API returning the posted payload |
| `promotions.list` | `giftup.api.promotions.list` | `read` | List all active and scheduled checkout promotions |
| `reports.getTransaction` | `giftup.api.reports.getTransaction` | `read` | Retrieve a specific ledger report transaction by ID |
| `reports.listTransactions` | `giftup.api.reports.listTransactions` | `read` | List ledger report transactions with optional date range and pagination |
| `settings.deleteArtwork` | `giftup.api.settings.deleteArtwork` | `destructive` | Delete uploaded gift card design artwork by ID |
| `settings.getCheckout` | `giftup.api.settings.getCheckout` | `read` | Get company checkout styling, tips, and service fee settings |
| `settings.getEmail` | `giftup.api.settings.getEmail` | `read` | Get email branding, sender, and template settings |
| `settings.getGiftCard` | `giftup.api.settings.getGiftCard` | `read` | Get gift card barcode, expiry, and terms defaults |
| `settings.getShipping` | `giftup.api.settings.getShipping` | `read` | Get physical shipping and postal delivery options |
| `settings.listArtwork` | `giftup.api.settings.listArtwork` | `read` | List uploaded gift card design artwork |
| `settings.updateCheckout` | `giftup.api.settings.updateCheckout` | `write` | Update checkout settings using JSON Patch |
| `settings.updateEmail` | `giftup.api.settings.updateEmail` | `write` | Update email settings using JSON Patch |
| `settings.updateGiftCard` | `giftup.api.settings.updateGiftCard` | `write` | Update gift card settings using JSON Patch |
| `settings.uploadArtwork` | `giftup.api.settings.uploadArtwork` | `write` | Upload or set new gift card design artwork |
| `users.delete` | `giftup.api.users.delete` | `destructive` | Delete a staff user account |
| `users.get` | `giftup.api.users.get` | `read` | Retrieve user details by ID |
| `users.invite` | `giftup.api.users.invite` | `write` | Invite a staff user or administrator |
| `users.list` | `giftup.api.users.list` | `read` | List staff users and administrators |
| `users.update` | `giftup.api.users.update` | `write` | Update staff user details using JSON Patch |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/giftup

## License

Apache-2.0
