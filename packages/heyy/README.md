# @corsair-dev/heyy

Heyy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/heyy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiWebhooks.create` | `heyy.api.apiWebhooks.create` | `write` | Register an HTTPS endpoint for message events on the channels named in each event; Heyy then POSTs every matching message, with its content and sender, to that URL |
| `apiWebhooks.remove` | `heyy.api.apiWebhooks.remove` | `destructive` | Delete a webhook endpoint by id; Heyy stops delivering to it immediately |
| `apiWebhooks.search` | `heyy.api.apiWebhooks.search` | `read` | List the registered webhook endpoints with their URL, status and subscribed events |
| `apiWebhooks.update` | `heyy.api.apiWebhooks.update` | `write` | Change a webhook's URL or events, or pause deliveries by setting it inactive |
| `attributes.create` | `heyy.api.attributes.create` | `write` | Define a custom contact attribute: text, number, select or date, with the options a select needs and where it appears |
| `attributes.remove` | `heyy.api.attributes.remove` | `destructive` | Delete a custom contact attribute by id; the values contacts had for it are gone and cannot be restored |
| `attributes.search` | `heyy.api.attributes.search` | `read` | Search the custom contact attributes defined on the workspace, with their type, options and where they appear in Heyy |
| `automations.search` | `heyy.api.automations.search` | `read` | List the automation workflows on the workspace with their status: draft, active or paused |
| `channels.search` | `heyy.api.channels.search` | `read` | List the connected channels (WhatsApp, Instagram, Messenger, SMS or live chat) with their type and connection status |
| `contacts.create` | `heyy.api.contacts.create` | `write` | Create a contact with a name, phone number or email, attach labels by id and set custom attribute values |
| `contacts.search` | `heyy.api.contacts.search` | `read` | Search contacts with a structured filter, free-text search, sorting and paging; returns the matched contacts with their labels and attribute values |
| `labels.create` | `heyy.api.labels.create` | `write` | Create a label with a name and a hex colour |
| `labels.remove` | `heyy.api.labels.remove` | `destructive` | Delete a label by id; it is detached from every contact that carried it |
| `labels.search` | `heyy.api.labels.search` | `read` | Search the labels used to group contacts, with their colours |
| `messageTemplates.search` | `heyy.api.messageTemplates.search` | `read` | List the message templates available for a channel, with their status, content and variables |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/heyy

## License

Apache-2.0
