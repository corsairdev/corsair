# @corsair-dev/ragic

Ragic plugin for Corsair - read, filter, create, update and delete records on any Ragic sheet, post comments, lock records and read a sheet field schema.

## Install

```bash
pnpm add @corsair-dev/ragic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `records.comment` | `ragic.api.records.comment` | `write` | Post a comment on a record and return the comment that was added |
| `records.create` | `ragic.api.records.create` | `write` | Create a record from field ID to value, including subtable rows grouped by negative row id, with control over formulas, workflows, AI Agents and notifications |
| `records.delete` | `ragic.api.records.delete` | `destructive` | Permanently delete one record by id |
| `records.get` | `ragic.api.records.get` | `read` | Read one record by id, optionally with its subtable, comments, history or unmasked fields |
| `records.list` | `ragic.api.records.list` | `read` | List records from a sheet with filters, full-text search, a saved view, paging and ordering; pass a taskId to check a mass operation instead |
| `records.lock` | `ragic.api.records.lock` | `write` | Lock a record so it cannot be edited until it is unlocked; the same permission as locking in the form |
| `records.unlock` | `ragic.api.records.unlock` | `write` | Unlock a record that was locked |
| `records.update` | `ragic.api.records.update` | `write` | Update only the fields you send on one record, edit a subtable row by its row id, or delete one with _DELSUB_ |
| `schema.get` | `ragic.api.schema.get` | `read` | Read a sheet's field schema, including field IDs, types and subtables, so a write can be built without guessing. Needs an account manager's API key |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ragic

## License

Apache-2.0
