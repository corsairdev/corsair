# @corsair-dev/piggy

Piggy (Leat) is a loyalty platform for contacts, credits, rewards, vouchers and giftcards. This plugin manages contacts and their balances, records points and reward redemptions, issues and redeems vouchers and giftcards, reads loyalty programs and business profiles, and manages webhook subscriptions with signature-verified deliveries.

## Install

```bash
pnpm add @corsair-dev/piggy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `businesses.getProfile` | `piggy.api.businesses.getProfile` | `read` | Read one business profile by UUID |
| `businesses.listProfiles` | `piggy.api.businesses.listProfiles` | `read` | List the account business profiles |
| `contacts.claim` | `piggy.api.contacts.claim` | `write` | Claim an anonymous contact with a real email, merging on match |
| `contacts.create` | `piggy.api.contacts.create` | `write` | Create a contact from an email address |
| `contacts.createAnonymous` | `piggy.api.contacts.createAnonymous` | `write` | Create an anonymous contact with a fictional email |
| `contacts.delete` | `piggy.api.contacts.delete` | `destructive` | Delete a contact (DEFAULT or GDPR); cannot be undone |
| `contacts.findOneByEmail` | `piggy.api.contacts.findOneByEmail` | `read` | Read one contact by email address |
| `contacts.findOrCreate` | `piggy.api.contacts.findOrCreate` | `write` | Read a contact by email, creating one when missing |
| `contacts.get` | `piggy.api.contacts.get` | `read` | Read one contact by UUID with balances and subscriptions |
| `contacts.getCreditBalance` | `piggy.api.contacts.getCreditBalance` | `read` | Read a contact credit balance |
| `contacts.getPrepaidBalance` | `piggy.api.contacts.getPrepaidBalance` | `read` | Read a contact prepaid balance |
| `contacts.getTier` | `piggy.api.contacts.getTier` | `read` | Read the contact current loyalty tier |
| `contacts.list` | `piggy.api.contacts.list` | `read` | List contacts with paging, date and attribute filters |
| `contacts.merge` | `piggy.api.contacts.merge` | `destructive` | Merge a source contact into a destination contact; cannot be undone |
| `contacts.update` | `piggy.api.contacts.update` | `write` | Update contact attributes keyed by attribute name |
| `giftcards.create` | `piggy.api.giftcards.create` | `destructive` | Issue a digital giftcard with a balance; it carries real value and uses Leat tokens |
| `giftcards.findOneByHash` | `piggy.api.giftcards.findOneByHash` | `read` | Read one giftcard by hash or QR value |
| `giftcards.get` | `piggy.api.giftcards.get` | `read` | Read one giftcard by UUID |
| `giftcards.list` | `piggy.api.giftcards.list` | `read` | List giftcards with program and paging filters |
| `giftcards.listPrograms` | `piggy.api.giftcards.listPrograms` | `read` | List the giftcard programs |
| `giftcards.sendByEmail` | `piggy.api.giftcards.sendByEmail` | `destructive` | Email a giftcard to a contact; the email cannot be recalled |
| `loyalty.getProgram` | `piggy.api.loyalty.getProgram` | `read` | Read the account loyalty program settings |
| `loyalty.listTransactions` | `piggy.api.loyalty.listTransactions` | `read` | List loyalty transactions with type, shop and date filters |
| `points.create` | `piggy.api.points.create` | `write` | Add or subtract points on a contact balance directly |
| `points.get` | `piggy.api.points.get` | `read` | Read one direct points transaction |
| `points.reverse` | `piggy.api.points.reverse` | `write` | Reverse a direct points transaction (once per transaction) |
| `promotions.get` | `piggy.api.promotions.get` | `read` | Read one promotion by UUID |
| `promotions.list` | `piggy.api.promotions.list` | `read` | List the account promotions |
| `rewards.get` | `piggy.api.rewards.get` | `read` | Read one reward by UUID |
| `rewards.list` | `piggy.api.rewards.list` | `read` | List rewards, optionally claimable by a contact |
| `rewards.redeem` | `piggy.api.rewards.redeem` | `write` | Create a reward reception: claim a reward for a contact |
| `rewards.reverseRedemption` | `piggy.api.rewards.reverseRedemption` | `write` | Reverse a reward redemption, reissuing the credits |
| `rewards.update` | `piggy.api.rewards.update` | `write` | Update a reward title, description or required credits |
| `vouchers.create` | `piggy.api.vouchers.create` | `write` | Create a voucher for a promotion |
| `vouchers.find` | `piggy.api.vouchers.find` | `read` | Read one voucher by code |
| `vouchers.list` | `piggy.api.vouchers.list` | `read` | List vouchers with promotion, contact and status filters |
| `vouchers.lock` | `piggy.api.vouchers.lock` | `write` | Lock a voucher and receive a release key |
| `vouchers.redeem` | `piggy.api.vouchers.redeem` | `write` | Redeem a voucher by code at a business profile |
| `vouchers.release` | `piggy.api.vouchers.release` | `write` | Release a locked voucher with its release key |
| `vouchers.reverseRedemption` | `piggy.api.vouchers.reverseRedemption` | `write` | Reverse a voucher redemption |
| `vouchers.update` | `piggy.api.vouchers.update` | `write` | Update voucher status, attributes or expiration |
| `vouchers.validate` | `piggy.api.vouchers.validate` | `read` | Check whether a voucher is redeemable at a business profile |
| `webhooks.create` | `piggy.api.webhooks.create` | `write` | Create a webhook subscription for one event type |
| `webhooks.delete` | `piggy.api.webhooks.delete` | `destructive` | Delete a webhook subscription; it cannot be restored |
| `webhooks.get` | `piggy.api.webhooks.get` | `read` | Read one webhook subscription by UUID |
| `webhooks.list` | `piggy.api.webhooks.list` | `read` | List webhook subscriptions with event type and status filters |
| `webhooks.update` | `piggy.api.webhooks.update` | `write` | Update a subscription name, URL or status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/piggy

## License

Apache-2.0
