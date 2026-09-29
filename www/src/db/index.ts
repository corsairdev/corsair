import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as authSchema from './auth-schema';
import * as catalogSchema from './catalog-schema';
import * as corsairSchema from './corsair-schema';
import * as schema from './schema';

const fullSchema = {
	...schema,
	...authSchema,
	...corsairSchema,
	...catalogSchema,
};

const globalForDb = globalThis as unknown as {
	pool: pg.Pool | undefined;
	db: NodePgDatabase<typeof fullSchema> | undefined;
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
			const dummyPool = new pg.Pool();

			dummyPool.query = async () => {
				throw new Error('DATABASE_URL environment variable is not set');
			};

			dummyPool.connect = async () => {
				throw new Error('DATABASE_URL environment variable is not set');
			};

			globalForDb.pool = dummyPool;
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
		globalForDb.db = drizzle(getPool(), { schema: fullSchema });
	}

	return globalForDb.db;
}

export const db = new Proxy({} as NodePgDatabase<typeof fullSchema>, {
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
