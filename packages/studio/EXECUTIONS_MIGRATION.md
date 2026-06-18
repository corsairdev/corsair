# Execution History Migration Guide

The execution history feature requires a new database table: `corsair_executions`.

## Database Schema

### SQLite

```sql
CREATE TABLE IF NOT EXISTS corsair_executions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    plugin TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    input TEXT NOT NULL DEFAULT '{}',
    output TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    duration_ms INTEGER NULL,
    error TEXT NULL,
    permission_id TEXT NULL,
    FOREIGN KEY (permission_id) REFERENCES corsair_permissions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_executions_tenant ON corsair_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_executions_plugin ON corsair_executions(plugin);
CREATE INDEX IF NOT EXISTS idx_executions_status ON corsair_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_created ON corsair_executions(created_at);
```

### PostgreSQL

```sql
CREATE TABLE IF NOT EXISTS corsair_executions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tenant_id TEXT NOT NULL,
    plugin TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    duration_ms INTEGER NULL,
    error TEXT NULL,
    permission_id TEXT NULL,
    FOREIGN KEY (permission_id) REFERENCES corsair_permissions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_executions_tenant ON corsair_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_executions_plugin ON corsair_executions(plugin);
CREATE INDEX IF NOT EXISTS idx_executions_status ON corsair_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_created ON corsair_executions(created_at DESC);
```

## Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT/UUID | Primary key (UUID) |
| `created_at` | TEXT/TIMESTAMPTZ | Timestamp when execution started |
| `updated_at` | TEXT/TIMESTAMPTZ | Timestamp when execution finished/updated |
| `tenant_id` | TEXT | Tenant identifier for multi-tenant instances |
| `plugin` | TEXT | Plugin identifier (e.g., 'slack', 'github') |
| `endpoint` | TEXT | Dot-notation endpoint path (e.g., 'messages.post') |
| `input` | TEXT/JSONB | JSON-encoded input arguments (sensitive data obfuscated) |
| `output` | TEXT/JSONB | JSON-encoded output/response (sensitive data obfuscated) |
| `status` | TEXT | Execution status: 'pending', 'completed', or 'failed' |
| `duration_ms` | INTEGER | Execution duration in milliseconds (nullable) |
| `error` | TEXT | Error message if status is 'failed' (nullable) |
| `permission_id` | TEXT | Foreign key to corsair_permissions if approval was required (nullable) |

## Applying the Migration

Run the appropriate SQL for your database before using the execution history feature.

### For Development (SQLite)

```bash
sqlite3 corsair.db < migration.sql
```

### For Production (PostgreSQL)

```bash
psql $DATABASE_URL -f migration.sql
```

## Verification

After applying the migration, verify the table exists:

**SQLite:**
```sql
.tables corsair_executions
```

**PostgreSQL:**
```sql
\dt corsair_executions
```

## Notes

- The table will be automatically detected by the Studio UI
- If the table doesn't exist, a helpful message will be displayed
- Sensitive data in `input` and `output` fields is automatically obfuscated before display
- Indexes are optimized for common query patterns (tenant, plugin, status, time-based)
