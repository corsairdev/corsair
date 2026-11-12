# @corsair-dev/wati

WATI plugin for Corsair - manage WhatsApp contacts, read conversations and their messages, send text, template and file messages, and read templates, channels, campaigns, segments and webhook subscriptions.

## Install

```bash
pnpm add @corsair-dev/wati
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.credits` | `wati.api.account.credits` | `read` | Read the workspace messaging credit balance |
| `broadcasts.get` | `wati.api.broadcasts.get` | `read` | Read one campaign |
| `broadcasts.list` | `wati.api.broadcasts.list` | `read` | List campaigns with their delivery counts |
| `broadcasts.recipients` | `wati.api.broadcasts.recipients` | `read` | Read per-recipient delivery outcomes for a campaign |
| `channels.list` | `wati.api.channels.list` | `read` | List the channels connected to the workspace |
| `contacts.count` | `wati.api.contacts.count` | `read` | Count the contacts on the workspace |
| `contacts.create` | `wati.api.contacts.create` | `write` | Add a contact by WhatsApp number, with a name and custom attributes as name/value pairs |
| `contacts.delete` | `wati.api.contacts.delete` | `destructive` | Remove a contact from the workspace (WATI documents this as a soft delete, not a physical erasure) |
| `contacts.get` | `wati.api.contacts.get` | `read` | Read one contact by wa_id or phone number, including custom attributes and opt-in state |
| `contacts.list` | `wati.api.contacts.list` | `read` | Page through contacts, 100 per page at most |
| `conversations.list` | `wati.api.conversations.list` | `read` | List conversations newest first, filtered by channel type or channel |
| `conversations.messages` | `wati.api.conversations.messages` | `read` | Read the messages in one conversation; the target is a wa_id, phone number or conversation ID, not a bare contact ID |
| `messages.sendFile` | `wati.api.messages.sendFile` | `write` | Send a file from a public URL, with an optional caption |
| `messages.sendTemplate` | `wati.api.messages.sendTemplate` | `write` | Send an approved template with bound placeholders, optionally as a named campaign; the only route outside the service window |
| `messages.sendText` | `wati.api.messages.sendText` | `write` | Send a free-text message, which only works inside the 24-hour service window |
| `segments.evaluate` | `wati.api.segments.evaluate` | `read` | Evaluate a segment to see how many contacts match, without saving anything |
| `segments.get` | `wati.api.segments.get` | `read` | Read one saved segment |
| `segments.list` | `wati.api.segments.list` | `read` | List saved segments |
| `templates.get` | `wati.api.templates.get` | `read` | Read one message template and its components |
| `templates.list` | `wati.api.templates.list` | `read` | List the message templates with their approval status |
| `webhooks.delete` | `wati.api.webhooks.delete` | `destructive` | Delete a webhook subscription, which stops delivery to that URL |
| `webhooks.get` | `wati.api.webhooks.get` | `read` | Read one webhook subscription and its event list |
| `webhooks.list` | `wati.api.webhooks.list` | `read` | List webhook subscriptions; creating one still needs the V2 route, which this plugin does not wrap |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/wati

## License

Apache-2.0
