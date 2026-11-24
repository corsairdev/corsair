# @corsair-dev/gmail

Gmail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gmail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `drafts.create` | `gmail.api.drafts.create` | `write` | Create a new draft |
| `drafts.delete` | `gmail.api.drafts.delete` | `destructive` | Delete a draft [DESTRUCTIVE] |
| `drafts.get` | `gmail.api.drafts.get` | `read` | Get a specific draft |
| `drafts.list` | `gmail.api.drafts.list` | `read` | Returns draft id and message id only. Use drafts.get to read subject and body. |
| `drafts.send` | `gmail.api.drafts.send` | `write` | Send a draft as an email |
| `drafts.update` | `gmail.api.drafts.update` | `write` | Update an existing draft |
| `labels.create` | `gmail.api.labels.create` | `write` | Create a new label |
| `labels.delete` | `gmail.api.labels.delete` | `destructive` | Delete a label [DESTRUCTIVE] |
| `labels.get` | `gmail.api.labels.get` | `read` | Get a specific label |
| `labels.list` | `gmail.api.labels.list` | `read` | List all labels in the mailbox |
| `labels.update` | `gmail.api.labels.update` | `write` | Update an existing label |
| `messages.batchModify` | `gmail.api.messages.batchModify` | `write` | Add or remove labels from multiple messages in bulk |
| `messages.get` | `gmail.api.messages.get` | `read` | Read one message. Default format is full, with body text base64url-encoded in payload.body.data, or for multipart messages in payload.parts[].body.data (parts nest); use format metadata for headers only. |
| `messages.getAttachment` | `gmail.api.messages.getAttachment` | `read` | Fetch an attachment of a message by partId (from messages.get, format full) or attachmentId. Returns the file like Drive files.download: inline when small, otherwise saved by the host and returned as fileId. |
| `messages.list` | `gmail.api.messages.list` | `read` | Returns only id and threadId per message, no subject or body. Use messages.get to read one. |
| `messages.modify` | `gmail.api.messages.modify` | `write` | Add or remove labels from a message |
| `messages.send` | `gmail.api.messages.send` | `write` | Send an email to one or more recipients |
| `messages.trash` | `gmail.api.messages.trash` | `write` | Move a message to the trash |
| `messages.untrash` | `gmail.api.messages.untrash` | `write` | Restore a message from the trash |
| `threads.get` | `gmail.api.threads.get` | `read` | Get every message in a thread. format works as in messages.get. |
| `threads.list` | `gmail.api.threads.list` | `read` | Returns thread id and snippet only, no messages. Use threads.get for the messages. |
| `threads.modify` | `gmail.api.threads.modify` | `write` | Add or remove labels from a thread |
| `threads.trash` | `gmail.api.threads.trash` | `write` | Move a thread to the trash |
| `threads.untrash` | `gmail.api.threads.untrash` | `write` | Restore a thread from the trash |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gmail

## License

Apache-2.0
