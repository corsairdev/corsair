# @corsair-dev/waboxapp

Waboxapp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/waboxapp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `messages.sendChat` | `waboxapp.api.messages.sendChat` | `write` | Send a WhatsApp text message |
| `messages.sendImage` | `waboxapp.api.messages.sendImage` | `write` | Send a WhatsApp image by URL |
| `messages.sendLink` | `waboxapp.api.messages.sendLink` | `write` | Send a WhatsApp link preview |
| `messages.sendMedia` | `waboxapp.api.messages.sendMedia` | `write` | Send a WhatsApp media file by URL |
| `accounts.getStatus` | `waboxapp.api.accounts.getStatus` | `read` | Get WhatsApp session status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/waboxapp

## License

Apache-2.0
