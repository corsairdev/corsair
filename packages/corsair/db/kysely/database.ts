import type { SqliteDialectConfig } from 'kysely';
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import type { Pool } from 'pg';
import type { ReservedSql, Sql, UnsafeQueryOptions } from 'postgres';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairExecution,
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
	corsair_executions: CorsairExecution;
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
		pinJsonSerializers(input);
		const db = new Kysely<CorsairKyselyDatabase>({
			dialect: new PostgresJSDialect({
				postgres: withParamSerialization(input),
			}),
		});
		return { db };
	}

	throw new Error(
		'Unsupported database input. Expected a pg Pool, postgres.js Sql, better-sqlite3 Database, or a Kysely instance.',
	);
}
