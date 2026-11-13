# @corsair-dev/thanksio

Thanks.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/thanksio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `creatives.get` | `thanksio.api.creatives.get` | `read` | Get a saved creative. |
| `creatives.list` | `thanksio.api.creatives.list` | `read` | List saved creatives. |
| `estimate.giftcard` | `thanksio.api.estimate.giftcard` | `read` | Estimate gift-card costs without sending. |
| `estimate.magnacard` | `thanksio.api.estimate.magnacard` | `read` | Estimate magnacard costs without sending. |
| `estimate.notecard` | `thanksio.api.estimate.notecard` | `read` | Estimate notecard costs without sending. |
| `estimate.postcard` | `thanksio.api.estimate.postcard` | `read` | Estimate postcard costs without sending. |
| `estimate.windowedLetter` | `thanksio.api.estimate.windowedLetter` | `read` | Estimate windowed-letter costs without sending. |
| `estimate.windowlessLetter` | `thanksio.api.estimate.windowlessLetter` | `read` | Estimate windowless-letter costs without sending. |
| `giftcardBrands.list` | `thanksio.api.giftcardBrands.list` | `read` | List gift-card brands by group. |
| `giftcardBrands.listFlat` | `thanksio.api.giftcardBrands.listFlat` | `read` | List gift-card brands with their groups. |
| `handwritingStyles.list` | `thanksio.api.handwritingStyles.list` | `read` | List handwriting styles. |
| `imageBuilder.create` | `thanksio.api.imageBuilder.create` | `read` | Build and return a PNG image without placing an order. |
| `imageTemplates.list` | `thanksio.api.imageTemplates.list` | `read` | List image templates. |
| `mailingLists.buyRadiusSearch` | `thanksio.api.mailingLists.buyRadiusSearch` | `write` | Purchase radius-search records; charges may apply. |
| `mailingLists.countRadiusSearch` | `thanksio.api.mailingLists.countRadiusSearch` | `read` | Count available radius-search records. |
| `mailingLists.create` | `thanksio.api.mailingLists.create` | `write` | Create a mailing list. |
| `mailingLists.delete` | `thanksio.api.mailingLists.delete` | `destructive` | Delete a mailing list. |
| `mailingLists.get` | `thanksio.api.mailingLists.get` | `read` | Get a mailing list. |
| `mailingLists.list` | `thanksio.api.mailingLists.list` | `read` | List mailing lists. |
| `mailingLists.listRecipients` | `thanksio.api.mailingLists.listRecipients` | `read` | List recipients in a mailing list. |
| `messageTemplates.create` | `thanksio.api.messageTemplates.create` | `write` | Create a message template. |
| `messageTemplates.delete` | `thanksio.api.messageTemplates.delete` | `destructive` | Delete a message template. |
| `messageTemplates.get` | `thanksio.api.messageTemplates.get` | `read` | Get a message template. |
| `messageTemplates.list` | `thanksio.api.messageTemplates.list` | `read` | List message templates. |
| `messageTemplates.update` | `thanksio.api.messageTemplates.update` | `write` | Update a message template. |
| `orderItems.invalidateGiftcard` | `thanksio.api.orderItems.invalidateGiftcard` | `destructive` | Permanently invalidate an unredeemed gift card. |
| `orders.cancel` | `thanksio.api.orders.cancel` | `destructive` | Cancel a reviewing order. |
| `orders.list` | `thanksio.api.orders.list` | `read` | List recent orders. |
| `orders.listItems` | `thanksio.api.orders.listItems` | `read` | List individual order items. |
| `orders.replay` | `thanksio.api.orders.replay` | `write` | Place a new copy of a settled order; this charges and mails again. |
| `orders.track` | `thanksio.api.orders.track` | `read` | Track an order and its delivery statistics. |
| `recipients.create` | `thanksio.api.recipients.create` | `write` | Create a recipient; email-only address lookup may incur a fee. |
| `recipients.createMultiple` | `thanksio.api.recipients.createMultiple` | `write` | Create recipients; email-only address lookup may incur a fee. |
| `recipients.delete` | `thanksio.api.recipients.delete` | `destructive` | Delete a recipient by ID. |
| `recipients.deleteByAddress` | `thanksio.api.recipients.deleteByAddress` | `destructive` | Delete a recipient by address or email. |
| `recipients.get` | `thanksio.api.recipients.get` | `read` | Get a recipient by ID. |
| `recipients.update` | `thanksio.api.recipients.update` | `write` | Update a recipient by ID. |
| `send.giftcard` | `thanksio.api.send.giftcard` | `write` | Send a gift card; charges may apply. |
| `send.magnacard` | `thanksio.api.send.magnacard` | `write` | Send a magnacard; charges may apply. |
| `send.notecard` | `thanksio.api.send.notecard` | `write` | Send a notecard; charges may apply. |
| `send.postcard` | `thanksio.api.send.postcard` | `write` | Send a postcard; charges may apply. |
| `send.windowedLetter` | `thanksio.api.send.windowedLetter` | `write` | Send a windowed letter; charges may apply. |
| `send.windowlessLetter` | `thanksio.api.send.windowlessLetter` | `write` | Send a windowless letter; charges may apply. |
| `subAccounts.create` | `thanksio.api.subAccounts.create` | `write` | Create a sub-account. |
| `subAccounts.delete` | `thanksio.api.subAccounts.delete` | `destructive` | Delete a sub-account and its image templates, message templates, and campaigns; orders and lists move to the main account. |
| `subAccounts.get` | `thanksio.api.subAccounts.get` | `read` | Get a sub-account. |
| `subAccounts.list` | `thanksio.api.subAccounts.list` | `read` | List sub-accounts. |
| `subAccounts.update` | `thanksio.api.subAccounts.update` | `write` | Update a sub-account. |
| `webhookDestinations.create` | `thanksio.api.webhookDestinations.create` | `write` | Create an outbound webhook destination. |
| `webhookDestinations.delete` | `thanksio.api.webhookDestinations.delete` | `destructive` | Delete an outbound webhook destination. |
| `webhookDestinations.list` | `thanksio.api.webhookDestinations.list` | `read` | List outbound webhook destinations. |
| `webhookDestinations.update` | `thanksio.api.webhookDestinations.update` | `write` | Update an outbound webhook destination. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/thanksio

## License

Apache-2.0
