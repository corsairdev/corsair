# @corsair-dev/helpwise

Helpwise plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/helpwise
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.create` | `helpwise.api.contacts.create` | `write` | Create a new contact |
| `contacts.get` | `helpwise.api.contacts.get` | `read` | Get a contact by ID |
| `contacts.list` | `helpwise.api.contacts.list` | `read` | List contacts with pagination |
| `contacts.search` | `helpwise.api.contacts.search` | `read` | Search contacts by term |
| `contacts.update` | `helpwise.api.contacts.update` | `write` | Update an existing contact by ID |
| `conversations.assign` | `helpwise.api.conversations.assign` | `write` | Assign conversation to a user |
| `conversations.close` | `helpwise.api.conversations.close` | `write` | Close conversations by ID |
| `conversations.delete` | `helpwise.api.conversations.delete` | `destructive` | Permanently delete conversations |
| `conversations.get` | `helpwise.api.conversations.get` | `read` | Get a conversation by inbox and conversation ID |
| `conversations.list` | `helpwise.api.conversations.list` | `read` | List conversations with filters and pagination |
| `conversations.moveToInbox` | `helpwise.api.conversations.moveToInbox` | `write` | Move conversations back to inbox |
| `conversations.spam` | `helpwise.api.conversations.spam` | `write` | Mark conversations as spam |
| `conversations.trash` | `helpwise.api.conversations.trash` | `write` | Move conversations to trash |
| `customFields.create` | `helpwise.api.customFields.create` | `write` | Create a new custom field |
| `customFields.delete` | `helpwise.api.customFields.delete` | `destructive` | Delete a custom field by ID |
| `customFields.get` | `helpwise.api.customFields.get` | `read` | Get custom field details by ID |
| `customFields.list` | `helpwise.api.customFields.list` | `read` | List all custom fields |
| `customFields.listByInbox` | `helpwise.api.customFields.listByInbox` | `read` | List custom fields enabled for an inbox |
| `customFields.update` | `helpwise.api.customFields.update` | `write` | Update a custom field by ID |
| `customFields.updateByInbox` | `helpwise.api.customFields.updateByInbox` | `write` | Update inbox custom field visibility |
| `inboxes.get` | `helpwise.api.inboxes.get` | `read` | Get mailbox details by ID |
| `inboxes.list` | `helpwise.api.inboxes.list` | `read` | List shared mailboxes and inboxes |
| `messages.listEmails` | `helpwise.api.messages.listEmails` | `read` | List emails in a conversation thread |
| `messages.sendChat` | `helpwise.api.messages.sendChat` | `destructive` | Send a live chat message in a thread |
| `messages.sendEmail` | `helpwise.api.messages.sendEmail` | `destructive` | Send an email message through a Helpwise mailbox |
| `messages.sendSms` | `helpwise.api.messages.sendSms` | `destructive` | Send an SMS message |
| `messages.sendWhatsApp` | `helpwise.api.messages.sendWhatsApp` | `destructive` | Send a WhatsApp message |
| `notes.create` | `helpwise.api.notes.create` | `write` | Add an internal note to a conversation thread |
| `reports.getOverall` | `helpwise.api.reports.getOverall` | `read` | Get overall account analytics report |
| `reports.getTags` | `helpwise.api.reports.getTags` | `read` | Get tag analytics report for an inbox |
| `tags.apply` | `helpwise.api.tags.apply` | `write` | Apply tags to conversations |
| `tags.get` | `helpwise.api.tags.get` | `read` | Get tag details by ID |
| `tags.list` | `helpwise.api.tags.list` | `read` | List all tags |
| `tags.remove` | `helpwise.api.tags.remove` | `write` | Remove tags from conversations |
| `users.getMe` | `helpwise.api.users.getMe` | `read` | Get current authenticated user profile |
| `users.list` | `helpwise.api.users.list` | `read` | List users in account or mailbox |
| `whatsapp.listTemplates` | `helpwise.api.whatsapp.listTemplates` | `read` | List WhatsApp message templates |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/helpwise

## License

Apache-2.0
