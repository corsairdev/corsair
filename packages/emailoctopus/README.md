# @corsair-dev/emailoctopus

EmailOctopus plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/emailoctopus
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `automations.start` | `emailoctopus.api.automations.start` | `write` | Queue a contact into an automation |
| `campaigns.get` | `emailoctopus.api.campaigns.get` | `read` | Get one campaign, including its subject and HTML content |
| `campaigns.list` | `emailoctopus.api.campaigns.list` | `read` | List campaigns, one page at a time |
| `campaigns.reportContacts` | `emailoctopus.api.campaigns.reportContacts` | `read` | List contacts for one campaign event, such as opened or bounced |
| `campaigns.reportLinks` | `emailoctopus.api.campaigns.reportLinks` | `read` | Get click totals for each link in a campaign |
| `campaigns.reportSummary` | `emailoctopus.api.campaigns.reportSummary` | `read` | Get sent, bounce, open, click, complaint and unsubscribe totals |
| `contacts.batch` | `emailoctopus.api.contacts.batch` | `write` | Update many contacts on a list. Each entry is reported under success or errors |
| `contacts.create` | `emailoctopus.api.contacts.create` | `write` | Add a contact to a list. Fails if that email is already on it |
| `contacts.delete` | `emailoctopus.api.contacts.delete` | `destructive` | Permanently delete a contact from a list |
| `contacts.get` | `emailoctopus.api.contacts.get` | `read` | Get one contact on a list |
| `contacts.list` | `emailoctopus.api.contacts.list` | `read` | List contacts on a list, optionally filtered by status, tag or time, with cursor paging |
| `contacts.update` | `emailoctopus.api.contacts.update` | `write` | Update a contact by id |
| `contacts.upsert` | `emailoctopus.api.contacts.upsert` | `write` | Create a contact or update the existing one with the same email address |
| `fields.create` | `emailoctopus.api.fields.create` | `write` | Add a custom field to a list |
| `fields.delete` | `emailoctopus.api.fields.delete` | `destructive` | Permanently delete a custom field from a list |
| `fields.update` | `emailoctopus.api.fields.update` | `write` | Update a text, number or date field on a list |
| `lists.create` | `emailoctopus.api.lists.create` | `write` | Create a list |
| `lists.delete` | `emailoctopus.api.lists.delete` | `destructive` | Permanently delete a list and its contacts |
| `lists.get` | `emailoctopus.api.lists.get` | `read` | Get one list, including its fields, tags and contact counts |
| `lists.list` | `emailoctopus.api.lists.list` | `read` | List every list in the account, one page at a time |
| `lists.update` | `emailoctopus.api.lists.update` | `write` | Rename a list |
| `tags.create` | `emailoctopus.api.tags.create` | `write` | Create a tag on a list |
| `tags.delete` | `emailoctopus.api.tags.delete` | `destructive` | Permanently delete a tag from a list |
| `tags.list` | `emailoctopus.api.tags.list` | `read` | List the tags on a list |
| `tags.update` | `emailoctopus.api.tags.update` | `write` | Rename a tag. The current name is the URL; the new name is the body |

## Auth

API key, sent as `Authorization: Bearer`. Create the key in EmailOctopus under Developer, API keys. A key labelled legacy (created before API v2) will not work. Corsair prompts the tenant for the key on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/emailoctopus

## License

Apache-2.0
