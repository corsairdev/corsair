import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as schema from './schema';

const globalForDb = globalThis as unknown as {
	pool: pg.Pool | undefined;
	db: NodePgDatabase<typeof schema> | undefined;
};

/** pg v8+ warns when sslmode is prefer/require/verify-ca; use verify-full explicitly. */
function normalizeConnectionString(connectionString: string) {
	return connectionString.replace(
		/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/,
		'$1verify-full',
	);
}

function getPool() {
	if (!globalForDb.pool) {
		const connectionString = process.env.DATABASE_URL;
		if (!connectionString) {
			console.warn('DATABASE_URL environment variable is not set');
			globalForDb.pool = new pg.Pool();
			return globalForDb.pool;
		}

		globalForDb.pool = new pg.Pool({
			connectionString: normalizeConnectionString(connectionString),
		});
	}

	return globalForDb.pool;
}

function getDb() {
	if (!globalForDb.db) {
		globalForDb.db = drizzle(getPool(), { schema });
	}

	return globalForDb.db;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
	get(_target, prop, receiver) {
		return Reflect.get(getDb() as object, prop, receiver);
	},
});

export const pool = new Proxy({} as pg.Pool, {
	get(_target, prop, receiver) {
		return Reflect.get(getPool() as object, prop, receiver);
	},
});

export type DB = typeof db;
