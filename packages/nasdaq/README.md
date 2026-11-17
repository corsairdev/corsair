# @corsair-dev/nasdaq

Nasdaq Data Link plugin for Corsair: read table metadata, query rows with filters and cursor paging, and queue bulk exports.

## Install

```bash
pnpm add @corsair-dev/nasdaq
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tables.export` | `nasdaq.api.tables.export` | `read` | Queue a bulk export of a table and return the signed zip link, valid for 30 minutes; the first call usually reports the file as still being built |
| `tables.metadata` | `nasdaq.api.tables.metadata` | `read` | Read a table definition: its columns and types, the columns that can filter a query, its primary key and when it last refreshed |
| `tables.rows` | `nasdaq.api.tables.rows` | `read` | Read one page of rows from a Nasdaq Data Link table, filtered by the columns that table marks filterable; page with the returned cursor |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nasdaq

## License

Apache-2.0
