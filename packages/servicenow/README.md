# @corsair-dev/servicenow

Servicenow plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/servicenow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `records.create` | `servicenow.api.records.create` | `write` | Create a record in any table, which triggers its business rules and notifications |
| `records.delete` | `servicenow.api.records.delete` | `destructive` | Delete one record. ServiceNow keeps no undo, and a deleted record takes its references with it |
| `records.get` | `servicenow.api.records.get` | `read` | Read one record by its sys_id |
| `records.list` | `servicenow.api.records.list` | `read` | Query any table with an encoded query, field selection and offset paging |
| `records.update` | `servicenow.api.records.update` | `write` | Patch fields on one record, which triggers its business rules and notifications |
| `tables.list` | `servicenow.api.tables.list` | `read` | List the tables this account can read, to find a name to query |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/servicenow

## License

Apache-2.0
