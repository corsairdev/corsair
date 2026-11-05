import type { KyselyPlugin, SqliteDialectConfig } from 'kysely';
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
import type {
	CorsairDbTables,
	CorsairResolvedTableNames,
} from './table-names.js';
import {
	applyCorsairTableNameMap,
	createTableNameMapPlugin,
	resolveCorsairDbTables,
	tableNamesAreCustomized,
	validateCorsairDbTables,
} from './table-names.js';

export type {
	CorsairCoreTableName,
	CorsairDbTables,
	CorsairResolvedTableNames,
} from './table-names.js';
export {
	CORSAIR_CORE_TABLE_NAMES,
	resolveCorsairDbTables,
	validateCorsairDbTables,
} from './table-names.js';

export type CorsairKyselyDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
	corsair_permissions: CorsairPermission;
};

export type CorsairDatabase = {
	db: Kysely<CorsairKyselyDatabase>;
	/** True when the underlying dialect is Postgres (pg Pool or postgres.js). Omitting defaults to true. */
	isPg?: boolean;
	/** Physical table names for each Corsair logical table key. Omitting uses the defaults. */
	tableNames?: CorsairResolvedTableNames;
};

export type CreateCorsairDatabaseOptions = {
	/** Remap logical Corsair table names to physical tables in your database. */
	dbTables?: CorsairDbTables;
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
 * Pre-serializes parameters before they reach postgres.js's Bind step. We pin
 * the json/jsonb serializers to identity (pinJsonSerializers) and convert
 * values to their final wire form here, so behaviour does not depend on which
 * serializers the (possibly shared) connection currently has:
 *   - Date → ISO string. postgres.js's default path for untyped/TEXT slots
 *     (e.g. `corsair_permissions.expires_at`) is `'' + x`, which yields
 *     `Date.toString()` that Postgres rejects.
 *   - Plain object/array → JSON text literal, valid for jsonb. A raw object
 *     would otherwise hit `Buffer.byteLength(object)` and throw whenever the
 *     jsonb serializer is an identity passthrough (e.g. when the connection is
 *     shared with Drizzle, which overwrites it).
 * Every other value passes through untouched.
 */
// postgres.js JSON/JSONB type OIDs.
const JSON_OID = 114;
const JSONB_OID = 3802;

function isJsonbCandidate(value: unknown): value is object {
	if (typeof value !== 'object' || value === null) return false;
	if (Buffer.isBuffer(value)) return false;
	if (Array.isArray(value)) return true;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

function serializeParam(value: unknown): unknown {
	if (value instanceof Date) return value.toISOString();
	// postgres.js serializes jsonb params with its registered serializer. When
	// the connection is shared with another ORM (e.g. Drizzle), that serializer
	// is overwritten with an identity passthrough, so a raw object reaches the
	// byte writer and throws on Buffer.byteLength. We pin the json/jsonb
	// serializers to identity (see pinJsonSerializers) and pre-serialize plain
	// objects/arrays to a JSON text literal ourselves — valid for jsonb and
	// independent of whichever serializer the connection currently has.
	if (isJsonbCandidate(value)) return JSON.stringify(value);
	return value;
}

/**
 * Forces postgres.js's json/jsonb serializers to an identity passthrough so
 * Corsair's own pre-serialization (serializeParam) is authoritative and never
 * double-encoded. This mirrors what Drizzle's postgres-js driver does, making
 * behaviour deterministic whether or not the connection is shared with Drizzle.
 */
function pinJsonSerializers(sql: Sql): void {
	const serializers = (
		sql as unknown as {
			options?: { serializers?: Record<number, (val: unknown) => unknown> };
		}
	).options?.serializers;
	if (!serializers) return;
	const identity = (val: unknown): unknown => val;
	serializers[JSON_OID] = identity;
	serializers[JSONB_OID] = identity;
}

function withParamSerialization(sql: Sql): Sql {
	return new Proxy(sql, {
		get(target, prop, receiver) {
			if (prop !== 'reserve') {
				return bindIfFunction(
					Reflect.get(target, prop, receiver) as unknown,
					target,
				);
			}
			return async function () {
				const reserved: ReservedSql = await target.reserve();
				return new Proxy(reserved, {
					get(resTarget, resProp, resReceiver) {
						if (resProp !== 'unsafe') {
							return bindIfFunction(
								Reflect.get(resTarget, resProp, resReceiver) as unknown,
								resTarget,
							);
						}
						return function (
							queryStr: string,
							params?: unknown[],
							options?: UnsafeQueryOptions,
						) {
							return resTarget.unsafe(
								queryStr,
								params?.map(serializeParam) as Parameters<
									typeof resTarget.unsafe
								>[1],
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

function buildKyselyPlugins(
	tableNames: CorsairResolvedTableNames,
	sqlite: boolean,
): KyselyPlugin[] {
	const plugins: KyselyPlugin[] = [];
	if (sqlite) plugins.push(new SqliteDatePlugin());
	if (tableNamesAreCustomized(tableNames)) {
		plugins.push(createTableNameMapPlugin(tableNames));
	}
	return plugins;
}

// The factory always resolves the names; only a hand-built literal may omit them.
export function createCorsairDatabase(
	input: CorsairDatabaseInput,
	options?: CreateCorsairDatabaseOptions,
): CorsairDatabase & { tableNames: CorsairResolvedTableNames } {
	validateCorsairDbTables(options?.dbTables);
	const tableNames = resolveCorsairDbTables(options?.dbTables);

	if (isKysely(input)) {
		// Caller supplies a Kysely instance directly; we cannot inspect the
		// underlying dialect, so assume Postgres (the only prod target).
		return {
			db: applyCorsairTableNameMap(input, tableNames),
			isPg: true,
			tableNames,
		};
	}

	if (isBetterSqlite3(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new SqliteDialect({ database: input }),
			plugins: buildKyselyPlugins(tableNames, true),
		});
		return { db, isPg: false, tableNames };
	}

	if (isPgPool(input)) {
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresDialect({ pool: input }),
			plugins: buildKyselyPlugins(tableNames, false),
		});
		return { db, isPg: true, tableNames };
	}

	if (isPostgresJs(input)) {
		pinJsonSerializers(input);
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresJSDialect({
				postgres: withParamSerialization(input),
			}),
			plugins: buildKyselyPlugins(tableNames, false),
		});
		return { db, isPg: true, tableNames };
	}

	throw new Error(
		'Unsupported database input. Expected a pg Pool, postgres.js Sql, better-sqlite3 Database, or a Kysely instance.',
	);
}
