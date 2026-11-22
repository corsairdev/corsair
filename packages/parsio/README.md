# @corsair-dev/parsio

Parsio is an AI email and document parser: this plugin manages mailboxes, parses HTML, text and uploaded files synchronously or asynchronously, reads parsed documents and collected data, and manages the webhooks that deliver parsed documents (HMAC-verified).

## Install

```bash
pnpm add @corsair-dev/parsio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `data.getParsed` | `parsio.api.data.getParsed` | `read` | Read the parsed data records of a mailbox, paged by date |
| `data.listEmails` | `parsio.api.data.listEmails` | `read` | List the email addresses the mailbox collected |
| `documents.createAsync` | `parsio.api.documents.createAsync` | `write` | Parse HTML or text content asynchronously; poll documents.get for the result |
| `documents.createSync` | `parsio.api.documents.createSync` | `write` | Parse HTML or text content and wait for the result; template and GPT parsers only, each parse consumes credits |
| `documents.get` | `parsio.api.documents.get` | `read` | Read one parsed document; this is the payload Parsio webhooks deliver |
| `documents.list` | `parsio.api.documents.list` | `read` | List the documents of a mailbox, filtered by date, name or status |
| `documents.reparse` | `parsio.api.documents.reparse` | `write` | Queue a document for reprocessing; each reparse consumes credits |
| `documents.skipMany` | `parsio.api.documents.skipMany` | `write` | Skip parsing for the given documents |
| `documents.uploadAsync` | `parsio.api.documents.uploadAsync` | `write` | Upload one file (max 50MB, ZIP supported) and parse it asynchronously |
| `documents.uploadSync` | `parsio.api.documents.uploadSync` | `write` | Upload one file (max 20MB, no ZIP) and wait for the parsed result |
| `mailboxes.create` | `parsio.api.mailboxes.create` | `write` | Create a mailbox with a parser preset |
| `mailboxes.delete` | `parsio.api.mailboxes.delete` | `destructive` | Delete a mailbox |
| `mailboxes.get` | `parsio.api.mailboxes.get` | `read` | Read one mailbox with its settings and configuration |
| `mailboxes.list` | `parsio.api.mailboxes.list` | `read` | List all mailboxes available to the authenticated user |
| `mailboxes.tableFields` | `parsio.api.mailboxes.tableFields` | `read` | List the table fields configured in a mailbox |
| `mailboxes.update` | `parsio.api.mailboxes.update` | `write` | Update mailbox settings: name, email prefix, attachments, alerts |
| `webhooks.create` | `parsio.api.webhooks.create` | `write` | Create a webhook subscription for doc.parsed, doc.fail, doc.received or table.parsed events |
| `webhooks.delete` | `parsio.api.webhooks.delete` | `destructive` | Delete webhook subscriptions; deliveries stop until they are created again |
| `webhooks.get` | `parsio.api.webhooks.get` | `read` | Read one webhook subscription |
| `webhooks.listForMailbox` | `parsio.api.webhooks.listForMailbox` | `read` | List the webhook subscriptions of a mailbox |
| `webhooks.update` | `parsio.api.webhooks.update` | `write` | Update a webhook subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parsio

## License

Apache-2.0
