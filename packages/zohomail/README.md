# @corsair-dev/zohomail

Zoho Mail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zohomail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `folders.create` | `zohomail.api.folders.create` | `write` | Create a new folder |
| `folders.delete` | `zohomail.api.folders.delete` | `destructive` | Delete a folder along with its emails and sub-folders [DESTRUCTIVE · IRREVERSIBLE] |
| `folders.get` | `zohomail.api.folders.get` | `read` | Get a specific folder |
| `folders.list` | `zohomail.api.folders.list` | `read` | List all mail folders |
| `folders.update` | `zohomail.api.folders.update` | `write` | Rename, mark all emails read, or empty a folder |
| `messages.delete` | `zohomail.api.messages.delete` | `destructive` | Permanently delete an email [DESTRUCTIVE · IRREVERSIBLE] |
| `messages.get` | `zohomail.api.messages.get` | `read` | Get a specific email with its content |
| `messages.list` | `zohomail.api.messages.list` | `read` | List emails in a folder |
| `messages.markRead` | `zohomail.api.messages.markRead` | `write` | Mark emails as read |
| `messages.markUnread` | `zohomail.api.messages.markUnread` | `write` | Mark emails as unread |
| `messages.move` | `zohomail.api.messages.move` | `write` | Move emails to another folder |
| `messages.send` | `zohomail.api.messages.send` | `write` | Send an email to one or more recipients |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zohomail

## License

Apache-2.0
