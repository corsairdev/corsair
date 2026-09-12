# @corsair-dev/clickhouse

Clickhouse plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/clickhouse
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `play.get` | `clickhouse.api.play.get` | `read` | Fetch the ClickHouse Play web UI HTML (Monaco editor + query UI). |
| `query.execute` | `clickhouse.api.query.execute` | `destructive` | Execute a SQL query against the tenant ClickHouse instance and return the result rows. Arbitrary SQL is accepted — destructive statements require explicit permission. |
| `query.listDatabases` | `clickhouse.api.query.listDatabases` | `read` | List all databases on the tenant ClickHouse instance. |
| `query.listTables` | `clickhouse.api.query.listTables` | `read` | List tables in a ClickHouse database with their engine and approximate size. |
| `schema.getDatabase` | `clickhouse.api.schema.getDatabase` | `read` | Get schema overview for a ClickHouse database; optionally include column definitions for each table. |
| `schema.getTable` | `clickhouse.api.schema.getTable` | `read` | Get column-level schema for a ClickHouse table, optionally with sample rows. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/clickhouse

## License

Apache-2.0
