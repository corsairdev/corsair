# @corsair-dev/fireberry

Fireberry CRM integration for Corsair. The provider API key is sent as the
`tokenid` header for REST and Batch calls. Metadata API calls use the
documented `tokenid` query parameter.

## Current API coverage

This Draft implementation currently exposes 14 generic operations:

| Corsair operation | Provider route | Official reference |
| --- | --- | --- |
| `records.list` | `GET /api/record/{object}` | [Get all Accounts](https://developers.fireberry.com/reference/get-all-accounts.md) |
| `records.get` | `GET /api/record/{object}/{id}` | [Get an Account](https://developers.fireberry.com/reference/get-an-account.md) |
| `records.create` | `POST /api/record/{object}` | [Create an Account](https://developers.fireberry.com/reference/create-an-account.md) |
| `records.update` | `PUT /api/record/{object}/{id}` | [Update an Account](https://developers.fireberry.com/reference/update-an-account.md) |
| `records.delete` | `DELETE /api/record/{object}/{id}` | [Delete an Account](https://developers.fireberry.com/reference/delete-an-account.md) |
| `records.query` | `POST /api/v3/query` | [Query v3](https://developers.fireberry.com/reference/query-request-v3.md) |
| `metadata.objects` | `GET /metadata/records` | [Get all Objects](https://developers.fireberry.com/reference/get-all-objects.md) |
| `metadata.object` | `GET /metadata/records/{id}` | [Get an Object](https://developers.fireberry.com/reference/get-an-object.md) |
| `metadata.fields` | `GET /metadata/records/{id}/fields` | [Get Object Fields](https://developers.fireberry.com/reference/get-an-object-fields.md) |
| `metadata.field` | `GET /metadata/records/{id}/fields/{fieldname}` | [Get Field Details](https://developers.fireberry.com/reference/get-a-field-details.md) |
| `metadata.picklist` | `GET /metadata/records/{id}/fields/{fieldname}/values` | [Get Picklist Values](https://developers.fireberry.com/reference/get-a-picklist-field-values.md) |
| `batch.create` | `POST /api/v3/record/{objectcode}/batch/create` | [Batch Create](https://developers.fireberry.com/reference/batch-create-records.md) |
| `batch.update` | `POST /api/v3/record/{objectcode}/batch/update` | [Batch Update](https://developers.fireberry.com/reference/batch-update-records.md) |
| `batch.delete` | `POST /api/v3/record/{objectcode}/batch/delete` | [Batch Delete](https://developers.fireberry.com/reference/batch-delete-account-records.md) |

List pagination uses `pageSize` (1–50) and `pageNumber` (1–10); Fireberry's
query v3 uses `pageSize` up to 500. Batch deletion accepts at most 20 record
IDs. For batch operations, pass the Fireberry object name/code required by the
corresponding provider route. Tenant-defined fields are represented as
extensible field maps.

## Coverage status and exclusions

This is **partial coverage**, not a claim that the full Fireberry API has been
implemented. Remaining documented routes include the per-object route
variants and specialized record-item routes, custom object and custom field
management operations, related records, file upload, legacy query, and the
object-specific Batch create/update/delete route catalog. Their parameter and
response schemas still need per-reference verification and implementation.
Inbound webhooks are intentionally absent; no verifiable inbound webhook
contract is described in the API reference index.

REST record list calls use Fireberry's documented `pagesize`/`pagenumber`
parameters. Metadata is tenant-specific, so discover object and field names
before using record operations. Runtime errors retain status and `Retry-After`
but omit CRM request/response payloads from propagated exceptions.

## References

- [Fireberry API documentation](https://developers.fireberry.com/llms.txt)
- [REST API overview](https://developers.fireberry.com/reference/getting-started-with-rest-api.md)
- [Query v3 guide](https://developers.fireberry.com/docs/queries-v3.md)

## Development

`FIREBERRY_API_KEY=<key> pnpm test:live` runs read-only live smoke tests. The
default package test command excludes this environment-gated file.
