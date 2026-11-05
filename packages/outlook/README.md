# @corsair-dev/outlook

Outlook plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/outlook
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calendars.create` | `outlook.api.calendars.create` | `write` | Create a new calendar |
| `calendars.delete` | `outlook.api.calendars.delete` | `destructive` | Delete a calendar [DESTRUCTIVE] |
| `calendars.get` | `outlook.api.calendars.get` | `read` | Get a calendar by ID |
| `calendars.list` | `outlook.api.calendars.list` | `read` | List all calendars |
| `contacts.create` | `outlook.api.contacts.create` | `write` | Create a new contact |
| `contacts.delete` | `outlook.api.contacts.delete` | `destructive` | Delete a contact [DESTRUCTIVE] |
| `contacts.list` | `outlook.api.contacts.list` | `read` | List contacts |
| `contacts.update` | `outlook.api.contacts.update` | `write` | Update a contact |
| `events.cancel` | `outlook.api.events.cancel` | `write` | Cancel a calendar event and notify attendees |
| `events.create` | `outlook.api.events.create` | `write` | Create a calendar event |
| `events.decline` | `outlook.api.events.decline` | `write` | Decline a calendar event invitation |
| `events.delete` | `outlook.api.events.delete` | `destructive` | Delete a calendar event [DESTRUCTIVE] |
| `events.findMeetingTimes` | `outlook.api.events.findMeetingTimes` | `read` | Find available meeting times for attendees |
| `events.get` | `outlook.api.events.get` | `read` | Get a calendar event by ID |
| `events.getSchedule` | `outlook.api.events.getSchedule` | `read` | Get free/busy schedule for a calendar |
| `events.list` | `outlook.api.events.list` | `read` | List calendar events |
| `events.update` | `outlook.api.events.update` | `write` | Update a calendar event |
| `folders.create` | `outlook.api.folders.create` | `write` | Create a new mail folder |
| `folders.delete` | `outlook.api.folders.delete` | `destructive` | Delete a mail folder [DESTRUCTIVE] |
| `folders.get` | `outlook.api.folders.get` | `read` | Get a mail folder by ID |
| `folders.list` | `outlook.api.folders.list` | `read` | List mail folders |
| `folders.update` | `outlook.api.folders.update` | `write` | Rename a mail folder |
| `messages.addAttachment` | `outlook.api.messages.addAttachment` | `write` | Add an attachment to a message |
| `messages.batchMove` | `outlook.api.messages.batchMove` | `write` | Batch move up to 20 messages to a folder |
| `messages.batchUpdate` | `outlook.api.messages.batchUpdate` | `write` | Batch update up to 20 messages |
| `messages.createDraft` | `outlook.api.messages.createDraft` | `write` | Create an email draft |
| `messages.delete` | `outlook.api.messages.delete` | `destructive` | Delete an email message [DESTRUCTIVE] |
| `messages.forward` | `outlook.api.messages.forward` | `write` | Forward an email message |
| `messages.get` | `outlook.api.messages.get` | `read` | Get an email message by ID |
| `messages.list` | `outlook.api.messages.list` | `read` | List email messages in a folder |
| `messages.move` | `outlook.api.messages.move` | `write` | Move a message to a different folder |
| `messages.query` | `outlook.api.messages.query` | `read` | Query email messages with OData filters |
| `messages.reply` | `outlook.api.messages.reply` | `write` | Reply to an email message |
| `messages.search` | `outlook.api.messages.search` | `read` | Search email messages |
| `messages.send` | `outlook.api.messages.send` | `write` | Send an email message |
| `messages.sendDraft` | `outlook.api.messages.sendDraft` | `write` | Send a saved draft message |
| `messages.update` | `outlook.api.messages.update` | `write` | Update an email message (e.g. mark as read) |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/outlook

## License

Apache-2.0
