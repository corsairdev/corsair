# `@corsair-dev/telegram`

The **Telegram** package provides a Corsair plugin for the **Telegram Bot API**. The package already supports a broad set of chat, file, callback, and webhook operations, and this contribution keeps the integration aligned with the repository’s plugin conventions while clarifying setup and operational behavior.

## Features

| Capability | Status | Notes |
| --- | --- | --- |
| Send messages and media | Implemented | Supports text, photo, video, audio, document, sticker, animation, location, and media group operations. |
| Receive updates by webhook | Implemented | Supports message, edited message, channel post, callback query, inline query, poll, shipping, and checkout events. |
| Read chat and user metadata | Implemented | Includes chat lookup, administrators, members, bot identity, and file metadata operations. |
| Webhook setup helpers | Implemented | Exposes operations to register and delete Telegram webhooks. |

## Authentication

The plugin uses **bot token** authentication.

| Secret purpose | Expected value |
| --- | --- |
| Endpoint key | Telegram bot token |
| Webhook signature secret | Secret token sent in `X-Telegram-Bot-Api-Secret-Token` |

You can supply credentials through plugin options or through the Corsair key manager.

## Installation

From the repository root, install dependencies and validate the package:

```bash
pnpm install
pnpm exec tsc -p packages/telegram/tsconfig.json --noEmit
```

## Basic usage

```ts
import { telegram } from '@corsair-dev/telegram';

const plugin = telegram({
  key: process.env.TELEGRAM_BOT_TOKEN,
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
});
```

## Representative operations

| Operation | Purpose |
| --- | --- |
| `messages.sendMessage` | Send a text message to a Telegram chat. |
| `chat.getChat` | Read metadata for a Telegram chat. |
| `chat.getChatMember` | Read membership information for a specific user in a chat. |
| `webhook.setWebhook` | Register a Telegram webhook URL. |
| `updates.getUpdates` | Poll updates when webhook delivery is not being used. |
| `me.getMe` | Read bot account metadata. |

## Example: send a message

```ts
await plugin.endpoints.messages.sendMessage({
  chat_id: 123456789,
  text: 'Hello from Corsair',
});
```

## Webhook behavior

The plugin accepts standard Telegram update payloads and routes them into typed webhook handlers.

| Webhook | Description |
| --- | --- |
| `message.message` | Triggered for new incoming messages. |
| `editedMessage.editedMessage` | Triggered for edited messages. |
| `channelPost.channelPost` | Triggered for new channel posts. |
| `callbackQuery.callbackQuery` | Triggered for inline keyboard callback queries. |
| `inlineQuery.inlineQuery` | Triggered for inline queries. |
| `poll.poll` | Triggered for poll updates. |
| `shippingQuery.shippingQuery` | Triggered for shipping queries. |
| `preCheckoutQuery.preCheckoutQuery` | Triggered for pre-checkout events. |

This contribution also ensures webhook matching remains compatible with valid Telegram deployments that do not send a secret-token header, while still supporting header-based secret verification when configured.

## Required environment details

| Variable | Description |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token issued by BotFather. |
| `TELEGRAM_WEBHOOK_SECRET` | Optional secret token for webhook validation. |

## Development notes

The plugin persists Telegram entities into the package schema and exposes a broad operational surface for agent use. The contribution in this task focuses on keeping the plugin definition clean and production-safe, especially around webhook matching and documented setup expectations.
