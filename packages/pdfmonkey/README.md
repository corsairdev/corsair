# @corsair-dev/pdfmonkey

PDFMonkey plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pdfmonkey
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `documents.createDocument` | `pdfmonkey.api.documents.createDocument` | `write` | Create a document and queue it for PDF generation |
| `documents.createDocumentSync` | `pdfmonkey.api.documents.createDocumentSync` | `write` | Create a document and wait for generation to complete |
| `documents.deleteDocument` | `pdfmonkey.api.documents.deleteDocument` | `destructive` | Delete a document [DESTRUCTIVE · IRREVERSIBLE] |
| `documents.getDocument` | `pdfmonkey.api.documents.getDocument` | `read` | Get a full document including payload and generation logs |
| `documents.getDocumentCard` | `pdfmonkey.api.documents.getDocumentCard` | `read` | Get a document card with status and download URL |
| `documents.listDocumentCards` | `pdfmonkey.api.documents.listDocumentCards` | `read` | List document cards with pagination and filters |
| `documents.updateDocument` | `pdfmonkey.api.documents.updateDocument` | `write` | Update a document's payload, metadata, or template |
| `templates.createTemplate` | `pdfmonkey.api.templates.createTemplate` | `write` | Create a new document template |
| `templates.deleteTemplate` | `pdfmonkey.api.templates.deleteTemplate` | `destructive` | Delete a template [DESTRUCTIVE · IRREVERSIBLE] |
| `templates.getTemplate` | `pdfmonkey.api.templates.getTemplate` | `read` | Get a template by ID |
| `templates.listTemplateCards` | `pdfmonkey.api.templates.listTemplateCards` | `read` | List template cards for a workspace |
| `templates.updateTemplate` | `pdfmonkey.api.templates.updateTemplate` | `write` | Update an existing template |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pdfmonkey

## License

Apache-2.0
