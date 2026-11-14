# @corsair-dev/respondio

respond.io plugin for Corsair - manage contacts, send and read messages, assign and close conversations, and read workspace channels, templates and custom fields.

## Install

```bash
pnpm add @corsair-dev/respondio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.addTags` | `respondio.api.contacts.addTags` | `write` | Add tags to a contact |
| `contacts.channels` | `respondio.api.contacts.channels` | `read` | List the channels a contact has interacted on, whose IDs a custom-payload message needs |
| `contacts.create` | `respondio.api.contacts.create` | `write` | Create a contact at an identifier; respond.io needs processing time afterwards, so wait before acting on it |
| `contacts.delete` | `respondio.api.contacts.delete` | `destructive` | Delete a contact and its conversation history |
| `contacts.deleteTags` | `respondio.api.contacts.deleteTags` | `write` | Remove tags from a contact |
| `contacts.get` | `respondio.api.contacts.get` | `read` | Read one contact by id:, email: or phone: identifier, with its fields, tags, assignee and lifecycle |
| `contacts.lifecycle` | `respondio.api.contacts.lifecycle` | `write` | Move a contact to a lifecycle stage by name, or clear it with null |
| `contacts.list` | `respondio.api.contacts.list` | `read` | List contacts with an $and or $or filter over fields, tags and lifecycle, a free-text search, and cursor paging |
| `contacts.merge` | `respondio.api.contacts.merge` | `destructive` | Merge two contacts by their IDs, setting the merged fields; the older contact stays and the other is removed |
| `contacts.update` | `respondio.api.contacts.update` | `write` | Update a contact's fields by identifier |
| `contacts.upsert` | `respondio.api.contacts.upsert` | `write` | Create or update a contact in one call, which is the safe choice when you do not know whether it exists |
| `conversations.assign` | `respondio.api.conversations.assign` | `write` | Assign a contact to a user, or unassign it by sending a null assignee |
| `conversations.status` | `respondio.api.conversations.status` | `write` | Open or close a contact's conversation, optionally recording a closing note and summary when closing |
| `messages.comment` | `respondio.api.messages.comment` | `write` | Add an internal comment to a contact, which the customer never sees |
| `messages.get` | `respondio.api.messages.get` | `read` | Read one message by id, with its delivery status and sender |
| `messages.list` | `respondio.api.messages.list` | `read` | List a contact's messages, optionally mixing in its comments; keep paging until pagination.next is null, since a page can be empty with more to come |
| `messages.send` | `respondio.api.messages.send` | `write` | Send a message to a contact, on the last channel it used unless channelId is given; this reaches the customer |
| `space.getUser` | `respondio.api.space.getUser` | `read` | Read one workspace user by ID |
| `space.listChannels` | `respondio.api.space.listChannels` | `read` | List the messaging channels connected in the workspace |
| `space.listClosingNotes` | `respondio.api.space.listClosingNotes` | `read` | List the closing notes a conversation can be closed with, sorted by category |
| `space.listCustomFields` | `respondio.api.space.listCustomFields` | `read` | List the custom field definitions, whose types a contact write must match |
| `space.listTemplates` | `respondio.api.space.listTemplates` | `read` | List the message templates of one connected channel |
| `space.listUsers` | `respondio.api.space.listUsers` | `read` | List the workspace users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/respondio

## License

Apache-2.0
