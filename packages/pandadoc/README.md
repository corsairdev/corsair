# @corsair-dev/pandadoc

PandaDoc document management: create and send documents from templates or PDFs, manage templates, contacts and folders, track signature status, and receive document-state webhooks. Deliveries are verified; subscription setup uses the webhook subscription operations.

## Install

```bash
pnpm add @corsair-dev/pandadoc
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.create` | `pandadoc.api.contacts.create` | `write` | Create a contact |
| `contacts.delete` | `pandadoc.api.contacts.delete` | `destructive` | Delete a contact |
| `contacts.get` | `pandadoc.api.contacts.get` | `read` | Read one contact by id |
| `contacts.list` | `pandadoc.api.contacts.list` | `read` | List contacts, optionally filtered by exact email address |
| `contacts.update` | `pandadoc.api.contacts.update` | `write` | Update a contact |
| `documents.create` | `pandadoc.api.documents.create` | `write` | Create a draft document from a template or from a public PDF URL |
| `documents.createFields` | `pandadoc.api.documents.createFields` | `write` | Place new fields on a document |
| `documents.delete` | `pandadoc.api.documents.delete` | `destructive` | Delete a document, optionally permanently (forever) |
| `documents.download` | `pandadoc.api.documents.download` | `read` | Download a document as PDF, with optional watermarking |
| `documents.downloadProtected` | `pandadoc.api.documents.downloadProtected` | `read` | Download a completed document as a protected (flattened) PDF |
| `documents.get` | `pandadoc.api.documents.get` | `read` | Read one document with its recipients, status and metadata |
| `documents.list` | `pandadoc.api.documents.list` | `read` | List documents, filtered by status, folder, contact, dates or metadata |
| `documents.listFields` | `pandadoc.api.documents.listFields` | `read` | Read the fields placed on a document with their coordinates |
| `documents.move` | `pandadoc.api.documents.move` | `write` | Move a document into a folder |
| `documents.send` | `pandadoc.api.documents.send` | `destructive` | Send a document to its recipients for signing; emails go out that cannot be recalled |
| `documents.update` | `pandadoc.api.documents.update` | `write` | Update a draft document: name, recipients, fields, tokens, metadata or tags |
| `folders.create` | `pandadoc.api.folders.create` | `write` | Create a documents folder |
| `folders.list` | `pandadoc.api.folders.list` | `read` | List document folders, optionally under one parent folder |
| `folders.rename` | `pandadoc.api.folders.rename` | `write` | Rename a documents folder |
| `templates.delete` | `pandadoc.api.templates.delete` | `destructive` | Delete a template |
| `templates.get` | `pandadoc.api.templates.get` | `read` | Read one template with its fields, tokens and roles |
| `templates.list` | `pandadoc.api.templates.list` | `read` | List templates, filtered by name, folder, tag or shared state |
| `webhooks.createSubscription` | `pandadoc.api.webhooks.createSubscription` | `write` | Create a webhook subscription for the events you choose |
| `webhooks.deleteSubscription` | `pandadoc.api.webhooks.deleteSubscription` | `destructive` | Delete a webhook subscription; deliveries stop until it is created again |
| `webhooks.getEvent` | `pandadoc.api.webhooks.getEvent` | `read` | Read one webhook event by the id a delivery carries |
| `webhooks.listSubscriptions` | `pandadoc.api.webhooks.listSubscriptions` | `read` | List the workspace webhook subscriptions, including their shared keys |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pandadoc

## License

Apache-2.0
