import type { SQL } from 'drizzle-orm';
import { and, asc, count, desc, eq, ilike, inArray, sql } from 'drizzle-orm';

import type {
	CorsairDbAdapter,
	CorsairSortBy,
	CorsairTableName,
	CorsairTransactionAdapter,
	CorsairWhere,
	CorsairWhereOperator,
} from '../types';

/**
 * Minimal structural typing for a Drizzle DB instance, without depending on the user's
 * schema generics. Drizzle's actual types are heavily generic; Corsair doesn't know them.
 */
type DrizzleSelectBuilder = PromiseLike<unknown[]> & {
	from: (table: unknown) => DrizzleSelectBuilder;
	where: (expr: unknown) => DrizzleSelectBuilder;
	limit: (n: number) => DrizzleSelectBuilder;
	offset: (n: number) => DrizzleSelectBuilder;
	orderBy: (expr: unknown) => DrizzleSelectBuilder;
};

type DrizzleInsertBuilder = {
	values: (data: unknown) => DrizzleInsertBuilder;
	returning: (projection?: unknown) => Promise<unknown[]>;
};

type DrizzleUpdateBuilder = {
	set: (data: unknown) => DrizzleUpdateBuilder;
	where: (expr: unknown) => DrizzleUpdateBuilder;
	returning: (projection?: unknown) => Promise<unknown[]>;
};

type DrizzleDeleteBuilder = {
	where: (expr: unknown) => DrizzleDeleteBuilder;
	returning: (projection?: unknown) => Promise<unknown[]>;
};

type DrizzleDBLike = {
	_: { fullSchema?: Record<string, unknown> } | undefined;
	select: (projection?: unknown) => DrizzleSelectBuilder;
	insert: (table: unknown) => DrizzleInsertBuilder;
	update: (table: unknown) => DrizzleUpdateBuilder;
	delete: (table: unknown) => DrizzleDeleteBuilder;
	transaction?: <R>(fn: (tx: DrizzleDBLike) => Promise<R>) => Promise<R>;
};

type DrizzleTableLike = Record<string, unknown>;

export type DrizzleAdapterConfig = {
	/**
	 * Corsair currently supports Postgres only.
	 */
	provider: 'pg';
	/**
	 * Optional Drizzle schema object. If omitted, we try `db._.fullSchema`.
	 */
	schema?: Record<string, unknown> | undefined;
	/**
	 * If your table objects are keyed differently in the schema.
	 */
	tableNames?:
		| {
				integrations?: string | undefined;
				accounts?: string | undefined;
				entities?: string | undefined;
				events?: string | undefined;
		  }
		| undefined;
	adapterId?: string | undefined;
};

function normalizeOperator(
	op: CorsairWhereOperator | undefined,
): CorsairWhereOperator {
	return op ?? '=';
}

function toArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [value];
}

function getColumn(table: DrizzleTableLike, field: string): unknown {
	const col = table[field];
	if (!col) {
		throw new Error(
			`Drizzle adapter: column "${field}" was not found on the provided table.`,
		);
	}
	return col;
}

function buildWhereExpr(
	tableObj: DrizzleTableLike,
	where: CorsairWhere[] | undefined,
): SQL | undefined {
	if (!where?.length) return undefined;
	const parts: SQL[] = [];
	for (const w of where) {
		const operator = normalizeOperator(w.operator);

		// Check if field is a JSONB path query (e.g., "data->>'name'")
		if (w.field.includes('->>')) {
			// Handle JSONB path queries
			const parts_split = w.field.split('->>');
			const jsonbColumn = parts_split[0];
			const jsonbPath = parts_split[1];

			if (!jsonbColumn || !jsonbPath) {
				throw new Error(
					`Invalid JSONB path format: "${w.field}". Expected format: "column->>'path'"`,
				);
			}

			const col = getColumn(tableObj, jsonbColumn.trim());
			// Remove surrounding quotes if present (e.g., "'name'" -> "name")
			const cleanPath = jsonbPath.trim().replace(/^'|'$/g, '');
			// Escape single quotes in path for SQL safety
			const escapedPath = cleanPath.replace(/'/g, "''");

			if (operator === 'like') {
				// Use ILIKE for case-insensitive search on JSONB text
				// Path is raw SQL (identifier), value is parameterized
				parts.push(
					sql`${col as any}->>'${sql.raw(escapedPath)}' ILIKE ${String(w.value)}` as any,
				);
			} else if (operator === 'in') {
				// For 'in' operator with JSONB, check if value matches any in the array
				const values = toArray(w.value);
				const conditions = values.map(
					(v) =>
						sql`${col as any}->>'${sql.raw(escapedPath)}' = ${String(v)}` as any,
				);
				parts.push(and(...conditions) as any);
			} else {
				// Use equality for JSONB text
				// Path is raw SQL (identifier), value is parameterized
				parts.push(
					sql`${col as any}->>'${sql.raw(escapedPath)}' = ${String(w.value)}` as any,
				);
			}
		} else {
			// Regular column query
			const col = getColumn(tableObj, w.field);
			if (operator === 'in') {
				parts.push(inArray(col as any, toArray(w.value) as any) as any);
			} else if (operator === 'like') {
				// Postgres-only: use ILIKE for case-insensitive search.
				parts.push(ilike(col as any, String(w.value)) as any);
			} else {
				parts.push(eq(col as any, w.value as any) as any);
			}
		}
	}
	return parts.length === 1 ? parts[0] : (and(...(parts as any)) as any);
}

function buildSelect(
	tableObj: DrizzleTableLike,
	select?: string[] | undefined,
) {
	if (!select?.length) return undefined;
	const projection: Record<string, unknown> = {};
	for (const field of select) {
		projection[field] = getColumn(tableObj, field);
	}
	return projection;
}

function applySort<T extends { orderBy: (expr: unknown) => T }>(
	q: T,
	tableObj: DrizzleTableLike,
	sortBy: CorsairSortBy | undefined,
) {
	if (!sortBy) return q;
	const col = getColumn(tableObj, sortBy.field);
	return q.orderBy(
		sortBy.direction === 'asc' ? asc(col as any) : desc(col as any),
	);
}

function asDrizzleDBLike(db: unknown): DrizzleDBLike {
	// We intentionally use structural typing to accept any Drizzle db instance.
	// Runtime failures will be clearer than over-constraining types we don't own.
	return db as DrizzleDBLike;
}

function getSchema(
	db: DrizzleDBLike,
	config: DrizzleAdapterConfig,
): Record<string, unknown> {
	const schema = config.schema ?? db._?.fullSchema;
	if (!schema) {
		throw new Error(
			'Drizzle adapter failed to initialize. Schema not found. Provide `schema` or use a Drizzle db that exposes `db._.fullSchema`.',
		);
	}
	return schema;
}

function getTableFromSchema(
	schema: Record<string, unknown>,
	key: string,
): DrizzleTableLike {
	const table = schema[key];
	if (!table || typeof table !== 'object') {
		throw new Error(
			`Drizzle adapter failed to initialize. Table "${key}" was not found in schema.`,
		);
	}
	return table as DrizzleTableLike;
}

function getCorsairTable(
	schema: Record<string, unknown>,
	table: CorsairTableName,
	tableNames: DrizzleAdapterConfig['tableNames'] | undefined,
): DrizzleTableLike {
	switch (table) {
		case 'corsair_integrations':
			return getTableFromSchema(
				schema,
				tableNames?.integrations ?? 'corsair_integrations',
			);
		case 'corsair_accounts':
			return getTableFromSchema(
				schema,
				tableNames?.accounts ?? 'corsair_accounts',
			);
		case 'corsair_entities':
			return getTableFromSchema(
				schema,
				tableNames?.entities ?? 'corsair_entities',
			);
		case 'corsair_events':
			return getTableFromSchema(schema, tableNames?.events ?? 'corsair_events');
		default:
			// Allow custom tables by looking them up directly in the schema
			return getTableFromSchema(schema, table);
	}
}

/**
 * `drizzleAdapter(db, { provider: "pg" })`.
 *
 * Corsair currently supports Postgres only.
 *
 * Note on typing:
 * - Drizzle's column/table types are schema-generic. Corsair does not own the user's schema types,
 *   so we accept `unknown` and do runtime validation.
 * - We cast the schema columns into Drizzle expression helpers (`eq`, `inArray`, `ilike`) because
 *   those helpers require Drizzle's column types, which we cannot represent without the user's generics.
 */
export function drizzleAdapter(
	db: unknown,
	config: DrizzleAdapterConfig,
): CorsairDbAdapter {
	if (config.provider !== 'pg') {
		throw new Error(
			`Corsair Drizzle adapter only supports provider "pg" (got "${String(
				config.provider,
			)}").`,
		);
	}

	const drizzle = asDrizzleDBLike(db);
	const schema = getSchema(drizzle, config);
	const adapterId = config.adapterId ?? 'drizzle';

	return {
		id: adapterId,

		async findOne<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			select?: string[] | undefined;
		}) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const whereExpr = buildWhereExpr(tableObj, args.where);
			const projection = buildSelect(tableObj, args.select);
			const q = projection
				? drizzle.select(projection).from(tableObj)
				: drizzle.select().from(tableObj);
			const res = whereExpr
				? await q.where(whereExpr).limit(1)
				: await q.limit(1);
			return (res?.[0] ?? null) as T | null;
		},

		async findMany<T>(args: {
			table: CorsairTableName;
			where?: CorsairWhere[] | undefined;
			limit?: number | undefined;
			offset?: number | undefined;
			sortBy?: CorsairSortBy | undefined;
			select?: string[] | undefined;
		}) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const whereExpr = buildWhereExpr(tableObj, args.where);
			const projection = buildSelect(tableObj, args.select);
			let q: DrizzleSelectBuilder = projection
				? drizzle.select(projection).from(tableObj)
				: drizzle.select().from(tableObj);
			if (whereExpr) q = q.where(whereExpr);
			q = applySort(q, tableObj, args.sortBy);
			if (typeof args.limit === 'number') q = q.limit(args.limit);
			if (typeof args.offset === 'number') q = q.offset(args.offset);
			return (await q) as T[];
		},

		async insert<T extends Record<string, any>, R = T>(args: {
			table: CorsairTableName;
			data: T;
			select?: string[] | undefined;
		}) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const projection = buildSelect(tableObj, args.select);
			const q = drizzle.insert(tableObj).values(args.data);
			const rows = projection
				? await q.returning(projection)
				: await q.returning();
			return (rows?.[0] ?? args.data) as R;
		},

		async update<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			data: Record<string, any>;
			select?: string[] | undefined;
		}) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const whereExpr = buildWhereExpr(tableObj, args.where);
			if (!whereExpr) {
				throw new Error(
					'Drizzle adapter: update requires a non-empty where clause.',
				);
			}
			const projection = buildSelect(tableObj, args.select);
			const q = drizzle.update(tableObj).set(args.data).where(whereExpr);
			const rows = projection
				? await q.returning(projection)
				: await q.returning();
			return (rows?.[0] ?? null) as T | null;
		},

		async deleteMany(args: { table: CorsairTableName; where: CorsairWhere[] }) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const whereExpr = buildWhereExpr(tableObj, args.where);
			if (!whereExpr) return 0;
			// Postgres-only: use returning to count deletes deterministically.
			const rows = await drizzle
				.delete(tableObj)
				.where(whereExpr)
				.returning({
					id: getColumn(tableObj, 'id'),
				});
			return rows.length;
		},

		async count(args: {
			table: CorsairTableName;
			where?: CorsairWhere[] | undefined;
		}) {
			const tableObj = getCorsairTable(schema, args.table, config.tableNames);
			const whereExpr = buildWhereExpr(tableObj, args.where);
			const q = drizzle.select({ count: count() }).from(tableObj);
			const rows = whereExpr ? await q.where(whereExpr) : await q;
			const c = (rows?.[0] as any)?.count;
			if (typeof c === 'number') return c;
			if (typeof c === 'bigint') return Number(c);
			return Number.parseInt(String(c ?? 0), 10);
		},

		async transaction<R>(fn: (trx: CorsairTransactionAdapter) => Promise<R>) {
			if (!drizzle.transaction) return fn(this);
			return drizzle.transaction(async (tx) => {
				// Keep the exact same config/schema; only swap the db instance.
				const trxAdapter = drizzleAdapter(tx, {
					...config,
					adapterId: adapterId + ':trx',
				});
				return fn(trxAdapter);
			});
		},
	};
}
