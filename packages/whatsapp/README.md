# `@corsair-dev/whatsapp`

The **WhatsApp** package adds a Corsair plugin for the **WhatsApp Cloud API**. It follows the same package structure used by the other first-party integrations and focuses on the core operational flow required by agent workflows: sending messages, receiving incoming webhook events, and listing persisted conversations and messages.

## Features

| Capability | Status | Notes |
| --- | --- | --- |
| Send outbound message | Implemented | Sends text messages through the WhatsApp Cloud API. |
| Receive inbound message webhook | Implemented | Accepts and verifies WhatsApp webhook payloads for inbound messages. |
| Receive delivery status webhook | Implemented | Persists delivery and conversation status updates from Meta webhook events. |
| List stored messages | Implemented | Reads persisted message records from the plugin schema. |
| List stored conversations | Implemented | Reads persisted conversation records derived from webhook status events. |

## Authentication

The plugin uses **API key style authentication** in Corsair, where the stored endpoint secret is the **WhatsApp access token** used for the Graph API.

| Secret purpose | Expected value |
| --- | --- |
| Endpoint key | WhatsApp Cloud API access token |
| Webhook signature secret | Meta app secret used for `X-Hub-Signature-256` verification |

You can provide credentials either directly in plugin options or through the Corsair key manager.

## Installation

From the repository root, install dependencies and typecheck the package:

```bash
pnpm install
pnpm exec tsc -p packages/whatsapp/tsconfig.json --noEmit
```

## Basic usage

```ts
import { whatsapp } from '@corsair-dev/whatsapp';

const plugin = whatsapp({
  key: process.env.WHATSAPP_ACCESS_TOKEN,
  webhookSecret: process.env.WHATSAPP_APP_SECRET,
});
```

## Available operations

| Operation | Purpose |
| --- | --- |
| `messages.sendMessage` | Send a text message to a WhatsApp recipient. |
| `messages.getMessages` | List persisted message records, optionally filtered by phone number. |
| `messages.listConversations` | List persisted conversation records captured from status webhooks. |

## Example: send a message

```ts
await plugin.endpoints.messages.sendMessage({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  to: '15551234567',
  text: 'Hello from Corsair',
});
```

## Webhook behavior

The plugin expects Meta webhook payloads for the **messages** field and supports two webhook event groups.

| Webhook | Description |
| --- | --- |
| `message.message` | Triggered when an inbound user message is received. |
| `status.status` | Triggered when Meta sends message delivery or conversation status updates. |

The webhook matcher only accepts WhatsApp Business Account payloads and the verifier validates the `X-Hub-Signature-256` header when a webhook secret is configured.

## Required environment details

| Variable | Description |
| --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Access token for the WhatsApp Cloud API. |
| `WHATSAPP_APP_SECRET` | Meta app secret for webhook signature validation. |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID used for outbound messages. |

## Development notes

This implementation intentionally keeps the surface area focused and production-safe. It persists webhook-backed message and conversation records into the package schema so agent-facing tooling can inspect prior activity without re-fetching raw webhook payloads.
