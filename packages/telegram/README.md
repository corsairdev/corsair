# @corsair-dev/telegram

Telegram plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/telegram
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `callback.answerCallbackQuery` | `telegram.api.callback.answerCallbackQuery` | `write` | Answer callback query |
| `callback.answerInlineQuery` | `telegram.api.callback.answerInlineQuery` | `write` | Answer inline query |
| `chat.getChat` | `telegram.api.chat.getChat` | `read` | Get chat information |
| `chat.getChatAdministrators` | `telegram.api.chat.getChatAdministrators` | `read` | Get chat administrators |
| `chat.getChatMember` | `telegram.api.chat.getChatMember` | `read` | Get chat member information |
| `file.getFile` | `telegram.api.file.getFile` | `read` | Get a file |
| `me.getMe` | `telegram.api.me.getMe` | `read` | Get bot info |
| `messages.deleteMessage` | `telegram.api.messages.deleteMessage` | `destructive` | Delete a message |
| `messages.editMessageText` | `telegram.api.messages.editMessageText` | `write` | Edit message text |
| `messages.pinChatMessage` | `telegram.api.messages.pinChatMessage` | `write` | Pin a chat message |
| `messages.sendAnimation` | `telegram.api.messages.sendAnimation` | `write` | Send animation |
| `messages.sendAudio` | `telegram.api.messages.sendAudio` | `write` | Send audio |
| `messages.sendChatAction` | `telegram.api.messages.sendChatAction` | `write` | Send a chat action |
| `messages.sendDocument` | `telegram.api.messages.sendDocument` | `write` | Send document |
| `messages.sendLocation` | `telegram.api.messages.sendLocation` | `write` | Send location |
| `messages.sendMediaGroup` | `telegram.api.messages.sendMediaGroup` | `write` | Send media group |
| `messages.sendMessage` | `telegram.api.messages.sendMessage` | `write` | Send a message |
| `messages.sendPhoto` | `telegram.api.messages.sendPhoto` | `write` | Send photo |
| `messages.sendSticker` | `telegram.api.messages.sendSticker` | `write` | Send sticker |
| `messages.sendVideo` | `telegram.api.messages.sendVideo` | `write` | Send video |
| `messages.unpinChatMessage` | `telegram.api.messages.unpinChatMessage` | `write` | Unpin a chat message |
| `updates.getUpdates` | `telegram.api.updates.getUpdates` | `read` | Get updates |
| `webhook.deleteWebhook` | `telegram.api.webhook.deleteWebhook` | `destructive` | Delete webhook |
| `webhook.setWebhook` | `telegram.api.webhook.setWebhook` | `write` | Set webhook |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 9 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/telegram

## License

Apache-2.0
