import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Creates tables the control server owns directly.
// The corsair SDK tables (corsair_permissions, corsair_integrations, etc.)
// are created by the runtime on its first startup via the SDK's own init.
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mcp_api_keys (
      id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name         VARCHAR(100) NOT NULL,
      client_id    TEXT NOT NULL UNIQUE,
      key_hash     TEXT NOT NULL UNIQUE,
      key_prefix   TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_used_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS corsair_integrations (
      id         TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name       TEXT NOT NULL,
      config     JSONB NOT NULL DEFAULT '{}',
      dek        TEXT
    );

    CREATE TABLE IF NOT EXISTS corsair_accounts (
      id             TEXT PRIMARY KEY,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      tenant_id      TEXT NOT NULL,
      integration_id TEXT NOT NULL,
      config         JSONB NOT NULL DEFAULT '{}',
      dek            TEXT
    );

    CREATE TABLE IF NOT EXISTS corsair_entities (
      id          TEXT PRIMARY KEY,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      account_id  TEXT NOT NULL,
      entity_id   TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      version     TEXT NOT NULL,
      data        JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS corsair_events (
      id         TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      account_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload    JSONB NOT NULL,
      status     TEXT
    );

    CREATE TABLE IF NOT EXISTS corsair_permissions (
      id         TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      tenant_id  TEXT NOT NULL DEFAULT 'default',
      plugin     TEXT NOT NULL,
      endpoint   TEXT NOT NULL,
      args       JSONB,
      status     TEXT NOT NULL DEFAULT 'pending',
      token      TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      error      TEXT
    );
  `);
}
