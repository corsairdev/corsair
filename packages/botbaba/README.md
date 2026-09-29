# @corsair-dev/botbaba

Botbaba plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/botbaba
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.execute` | `botbaba.api.actions.execute` | `write` | Execute a bot action for a conversation |
| `actions.executeByUser` | `botbaba.api.actions.executeByUser` | `write` | Execute a bot action for users |
| `actions.getWidgetSettings` | `botbaba.api.actions.getWidgetSettings` | `read` | Get bot widget settings |
| `broadcasts.delete` | `botbaba.api.broadcasts.delete` | `destructive` | Delete a broadcast |
| `broadcasts.get` | `botbaba.api.broadcasts.get` | `read` | Get a broadcast |
| `broadcasts.list` | `botbaba.api.broadcasts.list` | `read` | List broadcasts |
| `contacts.delete` | `botbaba.api.contacts.delete` | `destructive` | Delete a Botbaba contact |
| `contacts.get` | `botbaba.api.contacts.get` | `read` | Fetch a Botbaba contact by ID |
| `contacts.getAnalytics` | `botbaba.api.contacts.getAnalytics` | `read` | Retrieve contact analytics over a date range |
| `contacts.update` | `botbaba.api.contacts.update` | `write` | Update an existing Botbaba contact |
| `flows.delete` | `botbaba.api.flows.delete` | `destructive` | Delete a conversation flow |
| `flows.get` | `botbaba.api.flows.get` | `read` | Get a conversation flow |
| `flows.list` | `botbaba.api.flows.list` | `read` | List conversation flows |
| `gupshup.forwardMessage` | `botbaba.api.gupshup.forwardMessage` | `write` | Forward a Gupshup WhatsApp webhook to Botbaba |
| `messages.get` | `botbaba.api.messages.get` | `read` | Get a message |
| `messages.getAnalytics` | `botbaba.api.messages.getAnalytics` | `read` | Get message analytics |
| `messages.list` | `botbaba.api.messages.list` | `read` | List messages |
| `messages.sendWhatsappTemplate` | `botbaba.api.messages.sendWhatsappTemplate` | `write` | Send a WhatsApp template via Botbaba |
| `shopify.cartCreation` | `botbaba.api.shopify.cartCreation` | `write` | Forward Shopify cart creation to Botbaba |
| `shopify.cartUpdate` | `botbaba.api.shopify.cartUpdate` | `write` | Forward Shopify cart update to Botbaba |
| `shopify.checkoutCreation` | `botbaba.api.shopify.checkoutCreation` | `write` | Forward Shopify checkout creation to Botbaba |
| `shopify.checkoutUpdate` | `botbaba.api.shopify.checkoutUpdate` | `write` | Forward Shopify checkout update to Botbaba |
| `shopify.orderCancellation` | `botbaba.api.shopify.orderCancellation` | `write` | Forward Shopify order cancellation to Botbaba |
| `shopify.orderFulfillment` | `botbaba.api.shopify.orderFulfillment` | `write` | Forward Shopify order fulfillment to Botbaba |
| `shopify.orderPayment` | `botbaba.api.shopify.orderPayment` | `write` | Forward Shopify order payment to Botbaba |
| `simulators.cartCreation` | `botbaba.api.simulators.cartCreation` | `read` | Simulate a Shopify cart creation payload |
| `simulators.checkoutCreation` | `botbaba.api.simulators.checkoutCreation` | `read` | Simulate a Shopify checkout creation payload |
| `simulators.checkoutUpdate` | `botbaba.api.simulators.checkoutUpdate` | `read` | Simulate a Shopify checkout update payload |
| `simulators.gupshup` | `botbaba.api.simulators.gupshup` | `read` | Simulate a Gupshup WhatsApp webhook payload |
| `simulators.orderFulfillment` | `botbaba.api.simulators.orderFulfillment` | `read` | Simulate a Shopify order fulfillment payload |
| `tags.delete` | `botbaba.api.tags.delete` | `destructive` | Delete a tag |
| `tags.list` | `botbaba.api.tags.list` | `read` | List all tags |
| `tags.update` | `botbaba.api.tags.update` | `write` | Rename a tag |
| `templates.delete` | `botbaba.api.templates.delete` | `destructive` | Delete a message template |
| `templates.get` | `botbaba.api.templates.get` | `read` | Get a message template |
| `templates.list` | `botbaba.api.templates.list` | `read` | List message templates |
| `templates.update` | `botbaba.api.templates.update` | `write` | Update a message template |
| `utils.getFilename` | `botbaba.api.utils.getFilename` | `read` | Extract a filename from a path |
| `webhooks.delete` | `botbaba.api.webhooks.delete` | `destructive` | Delete a webhook |
| `webhooks.get` | `botbaba.api.webhooks.get` | `read` | Get a webhook |
| `webhooks.list` | `botbaba.api.webhooks.list` | `read` | List webhooks |
| `webhooks.listEventTypes` | `botbaba.api.webhooks.listEventTypes` | `read` | List webhook event types |
| `webhooks.update` | `botbaba.api.webhooks.update` | `write` | Update a webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/botbaba

## License

Apache-2.0
