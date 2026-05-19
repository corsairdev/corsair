# @corsair-dev/facebook

Facebook Messenger integration for [Corsair](https://github.com/corsairdev/corsair), built on the Facebook Graph API and Messenger Platform.

This package adds a **Facebook** provider that exposes Messenger messaging and basic Page operations through Corsair's standard endpoint and webhook model.

## Features

The integration currently includes the following capabilities:

- **sendMessage** for sending Facebook Messenger text messages
- **getPageDetails** for reading Page metadata from the Graph API
- **listConversations** for listing Page conversations
- **listMessages** for reading persisted Messenger messages from Corsair storage
- **Webhook verification** for the `hub.challenge` flow
- **Incoming message handling** for Messenger webhook events
- **Delivery and read event handling** for Messenger status updates

## Authentication

The package supports two values:

| Value | Required | Purpose |
| --- | --- | --- |
| `page_access_token` | Yes | Used for Facebook Graph API requests such as sending messages and reading Page data. |
| `app_secret` | Recommended | Used to verify Messenger webhook signatures via `x-hub-signature-256`. |

In practice, the **Page Access Token** is required for API operations, while the **App Secret** should be configured for secure webhook verification.

## Available operations

The package exposes operations through Corsair's standard endpoint registry.

| Group | Operation | Description |
| --- | --- | --- |
| `messages` | `send` | Send a Messenger text message to a recipient ID. |
| `messages` | `list` | List stored message records persisted from outbound and inbound events. |
| `pages` | `details` | Fetch Page details from the Graph API. |
| `pages` | `conversations` | List conversations for the configured Facebook Page. |

## Webhooks

The package defines webhook handlers for the following flows:

| Webhook | Purpose |
| --- | --- |
| `challenge.challenge` | Responds to Facebook's webhook verification request and returns `hub.challenge`. |
| `message.message` | Accepts inbound Messenger message events and persists normalized message data. |
| `delivery.delivery` | Accepts delivery and read events and persists status updates. |

## Setup

Create a Facebook App and connect it to a Facebook Page with Messenger enabled.

1. Create a Facebook App in the [Meta for Developers dashboard](https://developers.facebook.com/).
2. Add the **Messenger** product to the app.
3. Connect the app to a Facebook Page.
4. Generate a **Page Access Token** for that Page.
5. Copy the app's **App Secret** if you want webhook signature verification enabled.
6. Configure your Corsair runtime with the Facebook provider credentials.

## Webhook configuration

To receive incoming messages, configure a public webhook endpoint in your Corsair deployment and register it in the Meta dashboard.

The verification flow expects the standard Facebook challenge parameters:

- `hub.mode`
- `hub.verify_token`
- `hub.challenge`

When Messenger sends the verification request, the integration validates the token and returns the provided challenge value.

For production use, ensure that the webhook request body is available for HMAC validation so `x-hub-signature-256` can be verified using the app secret.

## Example usage

### Send a message

```ts
await client.facebook.endpoints.messages.send({
  recipientId: '<PSID>',
  text: 'Hello from Corsair!',
});
```

### Get Page details

```ts
await client.facebook.endpoints.pages.details({
  fields: ['id', 'name', 'link'],
});
```

### List conversations

```ts
await client.facebook.endpoints.pages.conversations({
  limit: 25,
});
```

## Notes

This package currently focuses on a clean MVP for Messenger and core Page operations. It is designed to follow existing Corsair integration conventions around:

- endpoint schema registration
- provider auth wiring
- typed webhook payloads
- persisted entity storage for messages, conversations, and pages

Future enhancements could include media sending, templates, and broader Meta messaging support.
