import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

// Load env as early as possible (import order matters with ESM).
config({ path: '.env' });

// ─────────────────────────────────────────────────────────────────────────────
// Connection (shared with Corsair)
// ─────────────────────────────────────────────────────────────────────────────

const connectionString =
	process.env.DATABASE_URL ??
	'postgres://postgres:secret@localhost:5433/corsair';

export const pool: Pool = new Pool({
	connectionString,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;

// Re-export schema for convenience
export * from './schema';
