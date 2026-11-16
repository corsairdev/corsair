# @corsair-dev/superchat

Multi-channel messaging from Superchat: manage contacts and contact lists, read conversations and their messages, and send text messages on WhatsApp, SMS, Instagram, Messenger, Telegram or email.

## Install

```bash
pnpm add @corsair-dev/superchat
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `channels.get` | `superchat.api.channels.get` | `read` | Read one channel with its type, name and the inbox it belongs to |
| `channels.list` | `superchat.api.channels.list` | `read` | List the channels in the workspace, optionally only those in one inbox; a channel id is what a message is sent from |
| `contactLists.addContact` | `superchat.api.contactLists.addContact` | `write` | Add a contact to a contact list. The list is named in the body on this route, not in the path |
| `contactLists.create` | `superchat.api.contactLists.create` | `write` | Create a contact list that contacts can be added to |
| `contactLists.delete` | `superchat.api.contactLists.delete` | `destructive` | Delete a contact list. Its membership goes with it, and this cannot be undone |
| `contactLists.forContact` | `superchat.api.contactLists.forContact` | `read` | List the contact lists one contact belongs to, paged by cursor like the other lists |
| `contactLists.list` | `superchat.api.contactLists.list` | `read` | List the contact lists in the workspace |
| `contactLists.removeContact` | `superchat.api.contactLists.removeContact` | `write` | Remove a contact from a contact list; the contact itself stays |
| `contacts.create` | `superchat.api.contacts.create` | `write` | Create a contact. At least one handle is required, and a handle is the email address or phone number that identifies them on a channel |
| `contacts.delete` | `superchat.api.contacts.delete` | `destructive` | Delete a contact and their handles. Conversations that referenced them lose the link, and this cannot be undone |
| `contacts.get` | `superchat.api.contacts.get` | `read` | Read one contact with their handles, gender and custom attribute values |
| `contacts.list` | `superchat.api.contacts.list` | `read` | List contacts newest first, paging with a cursor id; set after or before, never both |
| `contacts.search` | `superchat.api.contacts.search` | `read` | Search contacts by email, phone, Instagram or WhatsApp username, or a custom attribute; every expression has to match |
| `contacts.update` | `superchat.api.contacts.update` | `write` | Change a contact's names, gender, handles or custom attributes. The route requires first name, last name and gender, so all three are sent back |
| `conversations.get` | `superchat.api.conversations.get` | `read` | Read one conversation with its labels, assignees, linked contacts and snooze state |
| `conversations.list` | `superchat.api.conversations.list` | `read` | List conversations with their status, channel, inbox and assigned users, paging with a cursor id |
| `conversations.messages` | `superchat.api.conversations.messages` | `read` | List the messages in one conversation, paging with a cursor id |
| `conversations.update` | `superchat.api.conversations.update` | `write` | Change a conversation's status, inbox, labels or assignees. Snoozing needs both a status of snoozed and a snoozed_until time |
| `inboxes.get` | `superchat.api.inboxes.get` | `read` | Read one inbox with its name and workspace url |
| `inboxes.list` | `superchat.api.inboxes.list` | `read` | List the inboxes in the workspace |
| `messages.get` | `superchat.api.messages.get` | `read` | Read one message with its content, direction and status |
| `messages.send` | `superchat.api.messages.send` | `destructive` | Send a text message on a channel to one recipient. This reaches a real person on WhatsApp, SMS or another channel, and the content has to suit that channel |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/superchat

## License

Apache-2.0
