# @corsair-dev/parseur

Parseur plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/parseur
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bootstrap.getBootstrap` | `parseur.api.bootstrap.getBootstrap` | `read` | Retrieve bootstrap configuration: choices, mappings, max_field_lengths, email_domain, extra_fields, and master_parser_set. |
| `documents.copyDocument` | `parseur.api.documents.copyDocument` | `write` | Copy a document to another mailbox. |
| `documents.createEmailDocument` | `parseur.api.documents.createEmailDocument` | `write` | Upload an email or text document to Parseur for parsing. Requires subject, from, and recipient. |
| `documents.deleteDocument` | `parseur.api.documents.deleteDocument` | `destructive` | Delete a document by ID [DESTRUCTIVE · IRREVERSIBLE] |
| `documents.getDocument` | `parseur.api.documents.getDocument` | `read` | Retrieve full details of a document by ID: status, processing info, parsed results, and download URLs. |
| `documents.getDocumentLogs` | `parseur.api.documents.getDocumentLogs` | `read` | Get document logs for a document. Returns a paginated list of logs with status, source, and message details. |
| `documents.listDocuments` | `parseur.api.documents.listDocuments` | `read` | List documents within a mailbox. Use when you need to paginate, search, or sort documents after obtaining the mailbox ID. |
| `documents.processDocument` | `parseur.api.documents.processDocument` | `write` | Reprocess a document with the current template configuration. |
| `documents.skipDocument` | `parseur.api.documents.skipDocument` | `write` | Skip a document. Marks the document with status SKIPPED. |
| `documents.uploadDocument` | `parseur.api.documents.uploadDocument` | `write` | Upload a binary file to a Parseur mailbox as multipart/form-data. |
| `exportConfigs.createExportConfig` | `parseur.api.exportConfigs.createExportConfig` | `write` | Create a custom download for a mailbox. Requires type and items (field names). |
| `exportConfigs.deleteExportConfig` | `parseur.api.exportConfigs.deleteExportConfig` | `destructive` | Delete a custom download from a mailbox [DESTRUCTIVE · IRREVERSIBLE] |
| `exportConfigs.listExportConfigs` | `parseur.api.exportConfigs.listExportConfigs` | `read` | List custom downloads (export configurations) for a mailbox. |
| `exportConfigs.updateExportConfig` | `parseur.api.exportConfigs.updateExportConfig` | `write` | Update a custom download field list, name, or type for an existing configuration. |
| `mailboxes.copyMailbox` | `parseur.api.mailboxes.copyMailbox` | `write` | Copy a mailbox (parser) in Parseur. Creates a duplicate of the mailbox with all its configuration. |
| `mailboxes.createMailbox` | `parseur.api.mailboxes.createMailbox` | `write` | Create a new mailbox (parser) in Parseur. Use when you need to set up a new parser for document parsing with custom configuration. |
| `mailboxes.deleteMailbox` | `parseur.api.mailboxes.deleteMailbox` | `destructive` | Delete a mailbox (parser) by ID [DESTRUCTIVE · IRREVERSIBLE] |
| `mailboxes.getMailbox` | `parseur.api.mailboxes.getMailbox` | `read` | Retrieve full mailbox (parser) configuration by ID, including fields, webhooks, and settings. |
| `mailboxes.getMailboxSchema` | `parseur.api.mailboxes.getMailboxSchema` | `read` | Retrieve the JSON schema for a mailbox's parsed fields. Use when you need the structure and types of data fields extracted by a parser. |
| `mailboxes.listMailboxes` | `parseur.api.mailboxes.listMailboxes` | `read` | List mailboxes (parsers) with full configuration details. Use when you need comprehensive mailbox information including field configurations, processing options, and webhook settings. |
| `mailboxes.updateMailbox` | `parseur.api.mailboxes.updateMailbox` | `write` | Update a mailbox (parser) configuration such as name, AI engine, processing options, or document handling rules. |
| `templates.copyTemplate` | `parseur.api.templates.copyTemplate` | `write` | Copy a template to another mailbox. |
| `templates.deleteTemplate` | `parseur.api.templates.deleteTemplate` | `destructive` | Delete a template by ID [DESTRUCTIVE · IRREVERSIBLE] |
| `templates.getTemplate` | `parseur.api.templates.getTemplate` | `read` | Get a template by ID. |
| `templates.listTemplates` | `parseur.api.templates.listTemplates` | `read` | List all templates in a mailbox. |
| `webhooks.createWebhook` | `parseur.api.webhooks.createWebhook` | `write` | Create a webhook. Official body uses target (URL), event, and category CUSTOM. |
| `webhooks.deleteWebhook` | `parseur.api.webhooks.deleteWebhook` | `destructive` | Delete a webhook by ID [DESTRUCTIVE · IRREVERSIBLE] |
| `webhooks.disableWebhook` | `parseur.api.webhooks.disableWebhook` | `write` | Disable a webhook for a mailbox. Removes the webhook from webhook_set. |
| `webhooks.enableWebhook` | `parseur.api.webhooks.enableWebhook` | `write` | Enable a paused webhook for a mailbox. Only webhooks in available_webhook_set can be enabled. |
| `webhooks.listWebhooks` | `parseur.api.webhooks.listWebhooks` | `read` | List active (webhook_set) and paused (available_webhook_set) webhooks for a mailbox via GET /parser/{id}. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parseur

## License

Apache-2.0
