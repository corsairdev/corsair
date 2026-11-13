# @corsair-dev/gigasheet

Gigasheet plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gigasheet
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `datasets.delete` | `gigasheet.api.datasets.delete` | `destructive` | Permanently delete a sheet or folder by handle, optionally deleting child files |
| `datasets.get` | `gigasheet.api.datasets.get` | `read` | Retrieve metadata, column names, types, and processing status of a dataset |
| `datasets.getColumns` | `gigasheet.api.datasets.getColumns` | `read` | Retrieve column IDs, headers, and data types for a given sheet |
| `datasets.getOperationStatus` | `gigasheet.api.datasets.getOperationStatus` | `read` | Retrieve operation status for an asynchronous dataset task (Working, Done, Error) |
| `datasets.list` | `gigasheet.api.datasets.list` | `read` | List files and directories in root library or specified folder handle |
| `exports.create` | `gigasheet.api.exports.create` | `write` | Queue an asynchronous export job with optional AgGrid filter and sort state |
| `exports.download` | `gigasheet.api.exports.download` | `read` | Retrieve a temporary presigned S3 download URL for a completed export |
| `rows.appendByName` | `gigasheet.api.rows.appendByName` | `write` | Append new records to an existing sheet matching columns by name |
| `rows.deleteRows` | `gigasheet.api.rows.deleteRows` | `destructive` | Permanently delete specified rows from a dataset by iterator number |
| `rows.insertBlankRow` | `gigasheet.api.rows.insertBlankRow` | `write` | Insert one or more blank rows with null values at a given row index |
| `upload.direct` | `gigasheet.api.upload.direct` | `write` | Upload raw file contents or byte array directly into Gigasheet |
| `upload.fromUrl` | `gigasheet.api.upload.fromUrl` | `write` | Upload a dataset into Gigasheet from a publicly accessible or presigned URL |
| `user.getDetails` | `gigasheet.api.user.getDetails` | `read` | Retrieve detailed account and profile information for the authenticated user |
| `user.getEnrichmentCredits` | `gigasheet.api.user.getEnrichmentCredits` | `read` | Retrieve enrichment credit limit and used credit balance for the authenticated user |
| `user.getSpaceUsed` | `gigasheet.api.user.getSpaceUsed` | `read` | Retrieve total storage space used by the authenticated user in bytes |
| `user.whoami` | `gigasheet.api.user.whoami` | `read` | Check authentication status and retrieve username of the current request |
| `views.get` | `gigasheet.api.views.get` | `read` | Retrieve metadata and client state identifier for a specific saved view |
| `views.list` | `gigasheet.api.views.list` | `read` | Retrieve all saved views and configurations associated with a dataset |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gigasheet

## License

Apache-2.0
