# Documenso plugin for Corsair

Use the official Documenso v2 REST API through Corsair to manage envelopes, legacy documents and templates, recipients, fields, folders, attachments, downloads, and embed tokens.

## Install and configure

```bash
pnpm add @corsair-dev/documenso
```

Create a team-scoped API token under Documenso Team Settings → API Tokens and store the raw token as Corsair `api_key`. Documenso expects that token verbatim in `Authorization`; do not add `Bearer`. The official v2 OpenAPI defines only the `apiKey` header security scheme for every operation. OAuth2 is not documented for the REST API and is not supported by this plugin.

The production base is `https://app.documenso.com/api/v2`. Configure `baseUrl` to use the documented staging host or a self-hosted instance, including its `/api/v2` prefix. HTTPS is required except for localhost loopback development URLs.

## Supported REST operations

All entries below are v2 routes, require the API key header, and are validated with strict input and output Zod schemas. The [official OpenAPI document](https://openapi.documenso.com/reference/openapi.json) is the source for every route, field, enum, and response. Rows marked deprecated remain in the v2 OpenAPI and are retained for migration; Documenso schedules them for removal on 1 March 2027.

| Corsair operation | Method and route | Status | Official source |
| --- | --- | --- | --- |
| `envelopes.attachments.find.get` | `GET /envelope/attachment` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.attachments.create.post` | `POST /envelope/attachment/create` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.attachments.update.post` | `POST /envelope/attachment/update` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.attachments.delete.post` | `POST /envelope/attachment/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.items.createMany.post` | `POST /envelope/item/create-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.items.updateMany.post` | `POST /envelope/item/update-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.items.delete.post` | `POST /envelope/item/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.items.download.get` | `GET /envelope/item/{envelopeItemId}/download` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.recipients.get.get` | `GET /envelope/recipient/{recipientId}` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.recipients.createMany.post` | `POST /envelope/recipient/create-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.recipients.updateMany.post` | `POST /envelope/recipient/update-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.recipients.delete.post` | `POST /envelope/recipient/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.recipients.recipientRejectOnBehalfOf.post` | `POST /envelope/recipient/{recipientId}/reject` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.fields.get.get` | `GET /envelope/field/{fieldId}` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.fields.createMany.post` | `POST /envelope/field/create-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.fields.updateMany.post` | `POST /envelope/field/update-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.fields.delete.post` | `POST /envelope/field/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.find.get` | `GET /envelope` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.auditLogFind.get` | `GET /envelope/{envelopeId}/audit-log` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.auditLogDownloadPdf.get` | `GET /envelope/{envelopeId}/audit-log/download` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.certificateDownloadPdf.get` | `GET /envelope/{envelopeId}/certificate/download` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.get.get` | `GET /envelope/{envelopeId}` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.getMany.post` | `POST /envelope/get-many` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.create.post` | `POST /envelope/create` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.use.post` | `POST /envelope/use` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.update.post` | `POST /envelope/update` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.delete.post` | `POST /envelope/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.cancel.post` | `POST /envelope/cancel` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.duplicate.post` | `POST /envelope/duplicate` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.distribute.post` | `POST /envelope/distribute` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `envelopes.redistribute.post` | `POST /envelope/redistribute` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.get.get` | `GET /document/{documentId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.getMany.post` | `POST /document/get-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.find.get` | `GET /document` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.create.post` | `POST /document/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.update.post` | `POST /document/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.delete.post` | `POST /document/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.duplicate.post` | `POST /document/duplicate` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.distribute.post` | `POST /document/distribute` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.redistribute.post` | `POST /document/redistribute` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.download.get` | `GET /document/{documentId}/download` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.documentDownload.get` | `GET /document/{documentId}/download-beta` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.createV0.post` | `POST /document/create/beta` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.attachments.create.post` | `POST /document/attachment/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.attachments.update.post` | `POST /document/attachment/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.attachments.delete.post` | `POST /document/attachment/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.attachments.find.get` | `GET /document/attachment` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.get.get` | `GET /document/field/{fieldId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.create.post` | `POST /document/field/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.createMany.post` | `POST /document/field/create-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.update.post` | `POST /document/field/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.updateMany.post` | `POST /document/field/update-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.fields.delete.post` | `POST /document/field/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.create.post` | `POST /template/field/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.get.get` | `GET /template/field/{fieldId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.createMany.post` | `POST /template/field/create-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.update.post` | `POST /template/field/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.updateMany.post` | `POST /template/field/update-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.fields.delete.post` | `POST /template/field/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `folders.find.get` | `GET /folder` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `folders.create.post` | `POST /folder/create` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `folders.update.post` | `POST /folder/update` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `folders.delete.post` | `POST /folder/delete` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.get.get` | `GET /document/recipient/{recipientId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.create.post` | `POST /document/recipient/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.createMany.post` | `POST /document/recipient/create-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.update.post` | `POST /document/recipient/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.updateMany.post` | `POST /document/recipient/update-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `documents.recipients.delete.post` | `POST /document/recipient/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.get.get` | `GET /template/recipient/{recipientId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.create.post` | `POST /template/recipient/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.createMany.post` | `POST /template/recipient/create-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.update.post` | `POST /template/recipient/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.updateMany.post` | `POST /template/recipient/update-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.recipients.delete.post` | `POST /template/recipient/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.find.get` | `GET /template` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.get.get` | `GET /template/{templateId}` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.getMany.post` | `POST /template/get-many` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.create.post` | `POST /template/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.createTemplateTemporary.post` | `POST /template/create/beta` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.update.post` | `POST /template/update` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.duplicate.post` | `POST /template/duplicate` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.delete.post` | `POST /template/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.use.post` | `POST /template/use` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.directLinks.create.post` | `POST /template/direct/create` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.directLinks.delete.post` | `POST /template/direct/delete` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `templates.directLinks.toggle.post` | `POST /template/direct/toggle` | Deprecated | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `embedding.presignCreateEmbeddingPresignToken.post` | `POST /embedding/create-presign-token` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |
| `embedding.presignVerifyEmbeddingPresignToken.post` | `POST /embedding/verify-presign-token` | Current | [OpenAPI](https://openapi.documenso.com/reference/openapi.json) |

## Pagination, errors, and binary data

List operations forward the documented `page` and `perPage` query fields; envelope, document, and template filtering is forwarded without automatic page aggregation. Documenso documents a global 1,000-request-per-minute-per-IP ceiling and may return lower organization limits. The client preserves `Retry-After` in milliseconds and never automatically replays writes or quota-consuming operations.

PDF downloads return `{ kind: "binary", contentType, base64, size }`. Downloads are capped at 20 MiB; uploads are capped at 16 MiB per file and 32 MiB total per request by this plugin to bound buffering. Standard requests time out after 20 seconds, while multipart/PDF transfers time out after 120 seconds. These are plugin transport limits, not provider limits. Envelope multipart inputs accept `files: [{ filename, contentType, contentBase64 }]`; deprecated document/template create routes accept one `file` object with the same fields.

## Scope

Inbound webhooks are not included. API v1 and `/api/v2-beta` routes are excluded: the official docs direct new integrations to v2 and identify those versions as deprecated. Legacy v2 `/document/*`, `/template/*`, and associated recipient/field routes are included with deprecated metadata; prefer `/envelope/*` operations for new work. Team, token, and account administration stay in the Documenso web application because the v2 guide documents no REST routes for them.

## References

- [Documenso v2 OpenAPI](https://openapi.documenso.com/reference/openapi.json)
- [Authentication](https://docs.documenso.com/docs/developers/getting-started/authentication)
- [Migrating to envelopes](https://docs.documenso.com/docs/developers/api/migrate-to-envelopes)
- [Rate limits](https://docs.documenso.com/docs/developers/api/rate-limits)
