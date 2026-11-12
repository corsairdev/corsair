# @corsair-dev/knack

Knack plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/knack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `applications.get` | `knack.api.applications.get` | `read` | Read the app metadata: its objects, each object's fields, and per-object record counts |
| `objects.get` | `knack.api.objects.get` | `read` | Read one table's definition and field keys |
| `objects.list` | `knack.api.objects.list` | `read` | List the tables in this app with their object keys |
| `records.create` | `knack.api.records.create` | `write` | Create a record in a table |
| `records.delete` | `knack.api.records.delete` | `destructive` | Delete a record permanently |
| `records.get` | `knack.api.records.get` | `read` | Read one record by id |
| `records.list` | `knack.api.records.list` | `read` | List records in a table, with paging, sorting and filters |
| `records.update` | `knack.api.records.update` | `write` | Update fields on an existing record |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/knack

## License

Apache-2.0
