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

/**
 * postgres.js unsafe() skips type inference and expects pre-serialized values.
 * This wraps the Sql instance so that Date and plain objects are serialized to
 * strings before they reach the wire protocol.
 */
function serializeParam(value: unknown): string | number | boolean | null | undefined {
	if (value === null || value === undefined) return value;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
	if (value instanceof Date) return value.toISOString();
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function bindIfFunction(val: unknown, thisArg: object): unknown {
	return typeof val === 'function'
		? (val as (...args: unknown[]) => unknown).bind(thisArg)
		: val;
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
