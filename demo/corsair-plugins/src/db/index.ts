import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

// Load env as early as possible (import order matters with ESM).
config({ path: '.env' });

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	// pgbouncer transaction mode (port 6543) doesn't support prepared statements
	// Keep max connections reasonable since pgbouncer manages the actual pool
	max: 10,
	// Connection timeout for production environments
	connectionTimeoutMillis: 10000,
	// Idle timeout to prevent stale connections
	idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
