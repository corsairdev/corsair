# @corsair-dev/fireberry

Fireberry CRM integration for Corsair. Standard REST and Batch calls send the
API key in the `tokenid` header; Metadata API calls use the documented
`tokenid` query parameter.

## API coverage

The official index contains 244 distinct method/path operations: 168 REST, 5
Metadata, and 71 Batch. This package exposes 24 typed Corsair operations that
dispatch those routes by resource and action. The one route not exposed is the
Date & Time custom-field update: its OpenAPI path ends in the literal
`fieldName` while separately declaring a required `fieldName` path parameter,
so the published route is internally contradictory.

| Corsair operation | Documented coverage |
| --- | --- |
| `records.list/get/create/update/delete` | Documented system-object CRUD and custom-object record CRUD; route and verb availability are resource-specific. Create schemas use each resource's official request fields and update schemas accept partial bodies (only the fields that change), with tenant-defined fields supported as JSON extensions. |
| `records.query` | Query v3 search, filtering, grouping, sorting, and pagination. |
| `records.legacyQuery` | Legacy query endpoint. |
| `records.related` | Related records for a record/object pair. |
| `records.items` | Invoice, credit-invoice, order, receipt, and invoice-receipt item routes. `itemType` chooses the exact documented route. |
| `metadata.objects/object/fields/field/picklist` | All five Metadata API reads. |
| `customFields.create/update/delete` | 13 field-create routes, 11 unambiguous field-update routes, and the delete route. Create/update schemas follow field type. |
| `customObjects.create/update/delete` | Custom object definition operations. |
| `files.create` | Multipart file attachment upload. Input base64 is sent as the `file` multipart part. |
| `batch.create/update/delete` | All 71 documented system-object and generic custom-object Batch routes. Resource-specific item schemas are applied for create/update. |

REST record list pagination is `pagesize` 1–50 and `pagenumber` 1–10. Query
v3 permits `pageSize` up to 500; legacy query permits `page_size` up to 50 and
`page_number` up to 10. Batch create, update, and delete accept up to 20
records per request. Batch availability depends on the Fireberry license.
The official reference does not specify general rate limits or retry
idempotency guidance. The client preserves `Retry-After` on 429 responses but
does not automatically retry writes.

Resource names accepted by `records.*` use the Corsair names in the input
schemas (for example `creditInvoice`, `phoneCall`, `transactionItem`). Custom
object operations accept a numeric object code as a string. Tenant-specific
fields are validated against the official system-field schema where known;
custom fields use Fireberry's JSON field-value model.

## Scope decisions

- The Date & Time custom-field **update** route is unverified and omitted due
  to the contradictory official OpenAPI path/parameter described above.
- Inbound webhooks are not exposed: the official developer index documents no
  inbound webhook contract or signature-verification route.
- OAuth is not configured; documented API routes use the `tokenid` API key.

## References

- [Official Fireberry API index](https://developers.fireberry.com/llms.txt)
- [REST API overview](https://developers.fireberry.com/reference/getting-started-with-rest-api.md)
- [Metadata API](https://developers.fireberry.com/reference/get-all-objects.md)
- [Batch API](https://developers.fireberry.com/reference/batch-create-records-overview.md)
- [Query v3 guide](https://developers.fireberry.com/docs/queries-v3.md)

## Development

`FIREBERRY_API_KEY=<key> pnpm test:live` runs read-only live smoke tests. The
default package test command excludes the environment-gated suite.
