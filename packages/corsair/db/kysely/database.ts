import type { SqliteDialectConfig } from 'kysely';
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import type { Pool } from 'pg';
import type { ReservedSql, Sql, UnsafeQueryOptions } from 'postgres';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
	CorsairPermission,
} from '../index';
import { SqliteDatePlugin } from './sqlite-date-plugin.js';

export type CorsairKyselyDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
	corsair_permissions: CorsairPermission;
};

export type CorsairDatabase = {
	db: Kysely<CorsairKyselyDatabase>;
};

/**
 * better-sqlite3 Database instance.
 * Uses Kysely's expected SqliteDatabase type from SqliteDialectConfig.
 */
export type BetterSqlite3Database = NonNullable<
	SqliteDialectConfig['database']
>;

export type CorsairDatabaseInput =
	| Pool
	| BetterSqlite3Database
	| Sql
	| Kysely<CorsairKyselyDatabase>;

function isPgPool(input: CorsairDatabaseInput): input is Pool {
	return (
		typeof (input as Pool).query === 'function' &&
		typeof (input as Pool).connect === 'function'
	);
}

function isBetterSqlite3(
	input: CorsairDatabaseInput,
): input is BetterSqlite3Database {
	const db = input as { prepare?: unknown; exec?: unknown; close?: unknown };
	return (
		typeof db.prepare === 'function' &&
		typeof db.exec === 'function' &&
		typeof db.close === 'function' &&
		!('query' in input)
	);
}

function isPostgresJs(input: CorsairDatabaseInput): input is Sql {
	return (
		typeof input === 'function' &&
		typeof (input as Sql).begin === 'function' &&
		typeof (input as Sql).end === 'function'
	);
}

function bindIfFunction(val: unknown, thisArg: object): unknown {
	return typeof val === 'function'
		? (val as (...args: unknown[]) => unknown).bind(thisArg)
		: val;
}

/**
 * postgres.js's `unsafe()` runs through Postgres' Bind step and applies
 * type-aware serializers for inferred parameter types (Date → ISO,
 * object/array → JSON for jsonb, etc.). For Kysely-compiled INSERT/UPDATE/SELECT
 * the parameter types are inferred from the column types, so we pass values
 * through without pre-serialization. Pre-stringifying objects here would cause
 * postgres.js to JSON.stringify a second time, producing a JSON string instead
 * of a JSONB object on the wire.
 *
 * The one place we must intervene is `Date` parameters in WHERE/INSERT slots
 * whose Postgres type is reported as TEXT/UNKNOWN (e.g., `corsair_permissions.expires_at`
 * is TEXT). For those, postgres.js's default "type not in serializers" path
 * (`'' + x`) yields `Date.toString()` which Postgres rejects. We coerce Date
 * to ISO string only — every other value passes through untouched.
 */
function serializeParam(value: unknown): unknown {
	if (value instanceof Date) return value.toISOString();
	return value;
}

function withParamSerialization(sql: Sql): Sql {
	return new Proxy(sql, {
		get(target, prop, receiver) {
			if (prop !== 'reserve') {
				return bindIfFunction(Reflect.get(target, prop, receiver) as unknown, target);
			}
			return async function () {
				const reserved: ReservedSql = await target.reserve();
				return new Proxy(reserved, {
					get(resTarget, resProp, resReceiver) {
						if (resProp !== 'unsafe') {
							return bindIfFunction(Reflect.get(resTarget, resProp, resReceiver) as unknown, resTarget);
						}
						return function (queryStr: string, params?: unknown[], options?: UnsafeQueryOptions) {
							return resTarget.unsafe(
								queryStr,
								params?.map(serializeParam) as Parameters<typeof resTarget.unsafe>[1],
								options,
							);
						};
					},
				});
			};
		},
	});
}

function isKysely(
	input: CorsairDatabaseInput,
): input is Kysely<CorsairKyselyDatabase> {
	return (
		typeof (input as Kysely<CorsairKyselyDatabase>).selectFrom === 'function'
	);
}

export function createCorsairDatabase(
	input: CorsairDatabaseInput,
): CorsairDatabase {
	if (isKysely(input)) {
		return { db: input };
	}

	if (isBetterSqlite3(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new SqliteDialect({ database: input }),
			plugins: [new SqliteDatePlugin()],
		});
		return { db };
	}

	if (isPgPool(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresDialect({ pool: input }),
		});
		return { db };
	}

	if (isPostgresJs(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresJSDialect({ postgres: withParamSerialization(input) }),
		});
		return { db };
	}

	throw new Error(
		'Unsupported database input. Expected a pg Pool, postgres.js Sql, better-sqlite3 Database, or a Kysely instance.',
	);
}
