# @corsair-dev/ninox

Ninox plugin for Corsair: read a workspace and its modules, create and delete tables and fields, read, create, update, upsert and delete records with a change feed, list views, and run Ninox script.

## Install

```bash
pnpm add @corsair-dev/ninox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `fields.create` | `ninox.api.fields.create` | `write` | Add a field to a table: text, number, choice, date, reference and the other Ninox types |
| `fields.delete` | `ninox.api.fields.delete` | `destructive` | Delete a field and the value every record held in it |
| `fields.list` | `ninox.api.fields.list` | `read` | List a table’s field names and types, which decide what a record write may set |
| `modules.get` | `ninox.api.modules.get` | `read` | Read one module (app) by its internal name |
| `modules.list` | `ninox.api.modules.list` | `read` | List the workspace’s modules, paged by limit and offset |
| `records.changes` | `ninox.api.records.changes` | `read` | Poll a table’s row-level change feed since a timestamp, which needs history tracking enabled on that table |
| `records.create` | `ninox.api.records.create` | `write` | Create rows in one transaction, so a single bad record rolls the whole batch back |
| `records.delete` | `ninox.api.records.delete` | `destructive` | Delete rows in one transaction, rolling the whole set back if any id is wrong; there is no restore call |
| `records.get` | `ninox.api.records.get` | `read` | Read one row by id, which is the only way to fetch a known record because the id is not filterable |
| `records.list` | `ninox.api.records.list` | `read` | Read rows from a table with a field filter, sort order and offset paging; only columns the table marks filterable are accepted |
| `records.update` | `ninox.api.records.update` | `write` | Update rows in one transaction, optionally rejecting a write when a field no longer holds the value the caller read |
| `records.upsert` | `ninox.api.records.upsert` | `write` | Create or update rows matched by one unique field, refusing an ambiguous match rather than picking a row |
| `scripts.execute` | `ninox.api.scripts.execute` | `destructive` | Run Ninox script in a module and return its result; a script can change or delete records |
| `tables.create` | `ninox.api.tables.create` | `write` | Create a table in a module; add its fields with fields.create |
| `tables.delete` | `ninox.api.tables.delete` | `destructive` | Delete a table and every record in it |
| `tables.get` | `ninox.api.tables.get` | `read` | Read one table with all of its field definitions |
| `tables.list` | `ninox.api.tables.list` | `read` | List the tables inside one module |
| `views.list` | `ninox.api.views.list` | `read` | List a table's saved views |
| `workspace.get` | `ninox.api.workspace.get` | `read` | Read the workspace and the modules in it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ninox

## License

Apache-2.0
