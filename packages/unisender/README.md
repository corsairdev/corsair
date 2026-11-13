# @corsair-dev/unisender

Unisender plugin for Corsair - manage contact lists and custom fields, subscribe, import and export contacts, send transactional email and run campaigns.

## Install

```bash
pnpm add @corsair-dev/unisender
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.create` | `unisender.api.campaigns.create` | `write` | Start or schedule a campaign from a message; omitting start_time sends it immediately |
| `campaigns.list` | `unisender.api.campaigns.list` | `read` | List campaigns whose start time falls in a window, up to 10,000 a page |
| `contacts.count` | `unisender.api.contacts.count` | `read` | Count the contacts in a list by kind (type address for email contacts, phone for SMS) or by tag; Unisender needs at least one of the two |
| `contacts.exclude` | `unisender.api.contacts.exclude` | `write` | Remove a contact from lists without marking them unsubscribed, so they can be re-added later |
| `contacts.export` | `unisender.api.contacts.export` | `write` | Request an asynchronous export of the contact data, delivered to a notify URL |
| `contacts.get` | `unisender.api.contacts.get` | `read` | Read one contact's address status, lists and custom fields by email |
| `contacts.import` | `unisender.api.contacts.import` | `destructive` | Import up to 500 contacts from columnar data, with list membership in an email_list_ids column; role addresses such as sales@ are skipped on purpose, and a `delete` column removes contacts |
| `contacts.subscribe` | `unisender.api.contacts.subscribe` | `write` | Add or update a contact in one or more lists. By default (double_optin 0) Unisender emails the contact a confirmation request; pass double_optin 3 to add them with no email. Returns only person_id; read the confirmation status with contacts.get |
| `contacts.unsubscribe` | `unisender.api.contacts.unsubscribe` | `write` | Unsubscribe a contact from lists, which only the contact can reverse through an activation link |
| `fields.create` | `unisender.api.fields.create` | `write` | Create a custom contact field |
| `fields.delete` | `unisender.api.fields.delete` | `destructive` | Delete a custom contact field by id |
| `fields.list` | `unisender.api.fields.list` | `read` | List the custom contact fields with their types |
| `lists.create` | `unisender.api.lists.create` | `write` | Create a contact list, which models a topic rather than a single send; the title must be unique |
| `lists.delete` | `unisender.api.lists.delete` | `destructive` | Delete a contact list by id |
| `lists.list` | `unisender.api.lists.list` | `read` | List the contact lists in the account, with their ids and titles |
| `messages.createEmail` | `unisender.api.messages.createEmail` | `write` | Create a campaign email without sending it, for campaigns.create to send |
| `messages.sendEmail` | `unisender.api.messages.sendEmail` | `write` | Send one transactional email to a single recipient, who is added to list_id if not already in it; capped at 60 calls a minute and with no field substitution beyond the unsubscribe URL |
| `messages.status` | `unisender.api.messages.status` | `read` | Read delivery status for up to 500 sent emails; err_ is a failure and ok_ a success or still in progress |
| `tags.list` | `unisender.api.tags.list` | `read` | List the contact tags with their ids |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/unisender

## License

Apache-2.0
