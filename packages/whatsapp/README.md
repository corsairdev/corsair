# @corsair-dev/whatsapp

WhatsApp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/whatsapp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `businessProfiles.get` | `whatsapp.api.businessProfiles.get` | `read` | Retrieve WhatsApp Business Profile information |
| `media.getInfo` | `whatsapp.api.media.getInfo` | `read` | Get information about uploaded media |
| `media.upload` | `whatsapp.api.media.upload` | `write` | Upload media to WhatsApp servers |
| `messages.markRead` | `whatsapp.api.messages.markRead` | `write` | Mark an incoming WhatsApp message as read |
| `messages.send` | `whatsapp.api.messages.send` | `write` | Send a text, media, template, or interactive WhatsApp message |
| `messageTemplates.create` | `whatsapp.api.messageTemplates.create` | `write` | Create a new message template |
| `messageTemplates.delete` | `whatsapp.api.messageTemplates.delete` | `write` | Delete a message template by name |
| `messageTemplates.getStatus` | `whatsapp.api.messageTemplates.getStatus` | `read` | Get the status of a message template |
| `messageTemplates.list` | `whatsapp.api.messageTemplates.list` | `read` | List all message templates |
| `phoneNumbers.get` | `whatsapp.api.phoneNumbers.get` | `read` | Validate credentials and retrieve phone number health |
| `phoneNumbers.list` | `whatsapp.api.phoneNumbers.list` | `read` | List all phone numbers for the WhatsApp Business Account |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/whatsapp

## License

Apache-2.0
